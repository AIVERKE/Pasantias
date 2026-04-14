import * as fc from 'fast-check';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { NivelHabilidad } from './entities/habilidad.entity';

function buildDocumentosRepos(overrides: Record<string, any> = {}) {
  return {
    hojaVidaRepo: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_hoja_vida: 1 })),
      ...overrides.hojaVidaRepo,
    },
    habilidadRepo: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_habilidad: 1 })),
      remove: jest.fn().mockResolvedValue(undefined),
      ...overrides.habilidadRepo,
    },
    bitacoraRepo: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_bitacora: 1 })),
      ...overrides.bitacoraRepo,
    },
    informeRepo: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_informe: 1 })),
      ...overrides.informeRepo,
    },
    estudianteRepo: { findOne: jest.fn().mockResolvedValue({ id_estudiante: 1 }), ...overrides.estudianteRepo },
    inscripcionRepo: { findOne: jest.fn().mockResolvedValue({ id_inscripcion: 1 }), ...overrides.inscripcionRepo },
    actividadRepo: { findOne: jest.fn().mockResolvedValue({ id_actividad: 1 }), ...overrides.actividadRepo },
    jefeRepo: { findOne: jest.fn().mockResolvedValue({ id_jefe: 1 }), ...overrides.jefeRepo },
  };
}

function buildService(repos: ReturnType<typeof buildDocumentosRepos>) {
  return new DocumentosService(
    repos.hojaVidaRepo as any,
    repos.habilidadRepo as any,
    repos.bitacoraRepo as any,
    repos.informeRepo as any,
    repos.estudianteRepo as any,
    repos.inscripcionRepo as any,
    repos.actividadRepo as any,
    repos.jefeRepo as any,
  );
}

describe('DocumentosService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 21: HojaVida upsert idempotence
  it('Property 21: upsertHojaVida() should update existing record, not create a new one', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        async (resumen1, resumen2) => {
          const existingHv = { id_hoja_vida: 1, resumen: resumen1, fecha_actualizacion: new Date(), estudiante: { id_estudiante: 1 } };
          let saveCallCount = 0;
          const repos = buildDocumentosRepos({
            hojaVidaRepo: {
              findOne: jest.fn().mockResolvedValue({ ...existingHv }),
              save: jest.fn().mockImplementation((d) => { saveCallCount++; return Promise.resolve(d); }),
            },
          });
          const service = buildService(repos);
          const result = await service.upsertHojaVida({ id_estudiante: 1, resumen: resumen2 });
          // Should update resumen, not create new
          expect(result.resumen).toBe(resumen2);
          expect(result.id_hoja_vida).toBe(1); // same ID, not new
          expect(saveCallCount).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 21b: upsertHojaVida() should set fecha_actualizacion to current date', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 200 }),
        async (resumen) => {
          const before = new Date();
          const repos = buildDocumentosRepos({
            hojaVidaRepo: {
              findOne: jest.fn().mockResolvedValue(null), // no existing
              create: jest.fn().mockImplementation((d) => d),
              save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_hoja_vida: 1 })),
            },
          });
          const service = buildService(repos);
          const result = await service.upsertHojaVida({ id_estudiante: 1, resumen });
          const after = new Date();
          const fecha = new Date(result.fecha_actualizacion);
          expect(fecha.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
          expect(fecha.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 22: Habilidad add and remove round trip
  it('Property 22: createHabilidad() should persist nombre and nivel', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          nombre: fc.string({ minLength: 1, maxLength: 50 }),
          nivel: fc.constantFrom(...Object.values(NivelHabilidad)),
        }),
        async ({ nombre, nivel }) => {
          const repos = buildDocumentosRepos({
            hojaVidaRepo: { findOne: jest.fn().mockResolvedValue({ id_hoja_vida: 1 }) },
          });
          const service = buildService(repos);
          const result = await service.createHabilidad({ nombre, nivel, id_hoja_vida: 1 });
          expect(result.nombre).toBe(nombre);
          expect(result.nivel).toBe(nivel);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 22b: deleteHabilidad() should throw NotFoundException for non-existent habilidad', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 99999 }),
        async (id) => {
          const repos = buildDocumentosRepos({
            habilidadRepo: { findOne: jest.fn().mockResolvedValue(null) },
          });
          const service = buildService(repos);
          await expect(service.deleteHabilidad(id)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 23: Bitacora list ordering and default porcentaje
  it('Property 23: createBitacora() should always set porcentaje = 0', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          contenido: fc.string({ minLength: 1, maxLength: 200 }),
          fecha: fc.integer({ min: 2025, max: 2030 }).map((y) => `${y}-06-15`),
        }),
        async ({ contenido, fecha }) => {
          const repos = buildDocumentosRepos();
          const service = buildService(repos);
          const result = await service.createBitacora({ id_inscripcion: 1, id_actividad: 1, contenido, fecha });
          expect(result.porcentaje).toBe(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 24: Bitacora evaluacion range validation
  it('Property 24: evaluarBitacora() should throw BadRequestException for porcentaje outside 0-100', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.integer({ min: -9999, max: -1 }),
          fc.integer({ min: 101, max: 9999 }),
        ),
        async (porcentaje) => {
          const repos = buildDocumentosRepos({
            bitacoraRepo: { findOne: jest.fn().mockResolvedValue({ id_bitacora: 1, porcentaje: 0 }) },
          });
          const service = buildService(repos);
          await expect(service.evaluarBitacora(1, { porcentaje })).rejects.toThrow(BadRequestException);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 24b: evaluarBitacora() should accept valid porcentaje 0-100', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        async (porcentaje) => {
          const repos = buildDocumentosRepos({
            bitacoraRepo: {
              findOne: jest.fn().mockResolvedValue({ id_bitacora: 1, porcentaje: 0, observaciones: null }),
              save: jest.fn().mockImplementation((d) => Promise.resolve(d)),
            },
          });
          const service = buildService(repos);
          const result = await service.evaluarBitacora(1, { porcentaje });
          expect(result.porcentaje).toBe(porcentaje);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 25: Informe final nota precision and range validation
  it('Property 25: calificarInforme() should throw BadRequestException for nota outside 0-20', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.integer({ min: -999, max: -1 }).map((n) => n - 0.5),
          fc.integer({ min: 21, max: 999 }).map((n) => n + 0.5),
        ),
        async (nota_final) => {
          const repos = buildDocumentosRepos({
            informeRepo: { findOne: jest.fn().mockResolvedValue({ id_informe: 1 }) },
          });
          const service = buildService(repos);
          await expect(service.calificarInforme(1, { nota_final })).rejects.toThrow(BadRequestException);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 25b: calificarInforme() should accept valid nota 0.00-20.00', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 2000 }).map((n) => n / 100), // 0.00 to 20.00
        async (nota_final) => {
          const repos = buildDocumentosRepos({
            informeRepo: {
              findOne: jest.fn().mockResolvedValue({ id_informe: 1, nota_final: null }),
              save: jest.fn().mockImplementation((d) => Promise.resolve(d)),
            },
          });
          const service = buildService(repos);
          const result = await service.calificarInforme(1, { nota_final });
          expect(result.nota_final).toBe(nota_final);
        },
      ),
      { numRuns: 100 },
    );
  });
});
