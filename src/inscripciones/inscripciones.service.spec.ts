import * as fc from 'fast-check';
import { InscripcionesService } from './inscripciones.service';
import { EstadoInscripcion } from '../pasantias/entities/inscripcion.entity';

function buildInscripcionRepos(overrides: Record<string, any> = {}) {
  return {
    inscripcionRepo: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_inscripcion: 1 })),
      ...overrides.inscripcionRepo,
    },
    estudianteRepo: { findOne: jest.fn().mockResolvedValue({ id_estudiante: 1 }), ...overrides.estudianteRepo },
    pasantiaRepo: { findOne: jest.fn().mockResolvedValue({ id_pasantia: 1 }), ...overrides.pasantiaRepo },
    tutorRepo: { findOne: jest.fn().mockResolvedValue({ id_tutor: 1 }), ...overrides.tutorRepo },
    jefeRepo: { findOne: jest.fn().mockResolvedValue({ id_jefe: 1 }), ...overrides.jefeRepo },
  };
}

describe('InscripcionesService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 17: New inscripcion defaults to PENDIENTE with today's date
  it('Property 17: create() should always set estado=PENDIENTE and fecha_inscripcion=today', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_estudiante: fc.integer({ min: 1, max: 9999 }),
          id_pasantia: fc.integer({ min: 1, max: 9999 }),
        }),
        async (dto) => {
          const before = new Date();
          let saved: any;
          const repos = buildInscripcionRepos({
            inscripcionRepo: {
              create: jest.fn().mockImplementation((d) => d),
              save: jest.fn().mockImplementation((d) => { saved = d; return Promise.resolve({ ...d, id_inscripcion: 1 }); }),
            },
          });
          const service = new InscripcionesService(
            repos.inscripcionRepo as any, repos.estudianteRepo as any,
            repos.pasantiaRepo as any, repos.tutorRepo as any, repos.jefeRepo as any,
          );
          const result = await service.create(dto);
          const after = new Date();
          expect(result.estado).toBe(EstadoInscripcion.PENDIENTE);
          expect(new Date(result.fecha_inscripcion).getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
          expect(new Date(result.fecha_inscripcion).getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 18: Evaluacion sets periodo dates when APROBADA
  it('Property 18: updateEvaluacion() should set period dates only when estado=APROBADA', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          fecha_inicio_periodo: fc.integer({ min: 2025, max: 2030 }).map((y) => `${y}-06-01`),
          fecha_fin_periodo: fc.integer({ min: 2025, max: 2030 }).map((y) => `${y}-12-01`),
        }),
        async ({ fecha_inicio_periodo, fecha_fin_periodo }) => {
          const existing = { id_inscripcion: 1, estado: EstadoInscripcion.PENDIENTE, fecha_inicio_periodo: null, fecha_fin_periodo: null };
          let saved: any;
          const repos = buildInscripcionRepos({
            inscripcionRepo: {
              findOne: jest.fn().mockResolvedValue({ ...existing }),
              save: jest.fn().mockImplementation((d) => { saved = d; return Promise.resolve(d); }),
            },
          });
          const service = new InscripcionesService(
            repos.inscripcionRepo as any, repos.estudianteRepo as any,
            repos.pasantiaRepo as any, repos.tutorRepo as any, repos.jefeRepo as any,
          );
          await service.updateEvaluacion(1, {
            estado: EstadoInscripcion.APROBADA,
            fecha_inicio_periodo,
            fecha_fin_periodo,
          });
          expect(saved.estado).toBe(EstadoInscripcion.APROBADA);
          expect(saved.fecha_inicio_periodo).not.toBeNull();
          expect(saved.fecha_fin_periodo).not.toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 18b: updateEvaluacion() should NOT set period dates for non-APROBADA states', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(EstadoInscripcion.RECHAZADA, EstadoInscripcion.COMPLETADA),
        async (estado) => {
          const existing = { id_inscripcion: 1, estado: EstadoInscripcion.PENDIENTE, fecha_inicio_periodo: null, fecha_fin_periodo: null };
          let saved: any;
          const repos = buildInscripcionRepos({
            inscripcionRepo: {
              findOne: jest.fn().mockResolvedValue({ ...existing }),
              save: jest.fn().mockImplementation((d) => { saved = d; return Promise.resolve(d); }),
            },
          });
          const service = new InscripcionesService(
            repos.inscripcionRepo as any, repos.estudianteRepo as any,
            repos.pasantiaRepo as any, repos.tutorRepo as any, repos.jefeRepo as any,
          );
          await service.updateEvaluacion(1, { estado });
          expect(saved.fecha_inicio_periodo).toBeNull();
          expect(saved.fecha_fin_periodo).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});
