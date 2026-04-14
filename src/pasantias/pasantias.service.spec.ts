import * as fc from 'fast-check';
import { NotFoundException } from '@nestjs/common';
import { PasantiasService } from './pasantias.service';
import { EstadoPasantia } from './entities/pasantia.entity';

function buildPasantiaRepos(overrides: Record<string, any> = {}) {
  return {
    pasantiaRepo: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_pasantia: 1 })),
      ...overrides.pasantiaRepo,
    },
    empresaRepo: {
      findOne: jest.fn().mockResolvedValue({ id_empresa: 1 }),
      ...overrides.empresaRepo,
    },
  };
}

describe('PasantiasService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 14: Pasantia list ordering and filtering
  it('Property 14: findAll(estado) should only return pasantias matching that estado', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...Object.values(EstadoPasantia)),
        fc.array(
          fc.record({
            id_pasantia: fc.integer({ min: 1, max: 9999 }),
            titulo: fc.string({ minLength: 1, maxLength: 50 }),
            estado: fc.constantFrom(...Object.values(EstadoPasantia)),
          }),
          { minLength: 1, maxLength: 20 },
        ),
        async (filterEstado, allPasantias) => {
          const filtered = allPasantias.filter((p) => p.estado === filterEstado);
          const repos = buildPasantiaRepos({
            pasantiaRepo: {
              find: jest.fn().mockImplementation(({ where }) => {
                if (where?.estado) return Promise.resolve(allPasantias.filter((p) => p.estado === where.estado));
                return Promise.resolve(allPasantias);
              }),
            },
          });
          const service = new PasantiasService(repos.pasantiaRepo as any, repos.empresaRepo as any);
          const result = await service.findAll(filterEstado);
          expect(result.every((p: any) => p.estado === filterEstado)).toBe(true);
          expect(result.length).toBe(filtered.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 15: New pasantia defaults to PENDIENTE
  it('Property 15: create() should always set estado = PENDIENTE regardless of input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          titulo: fc.string({ minLength: 1, maxLength: 100 }),
          descripcion: fc.string({ minLength: 1, maxLength: 200 }),
          fecha_inicio: fc.integer({ min: 2025, max: 2030 }).map((y) => `${y}-06-01`),
          id_empresa: fc.integer({ min: 1, max: 9999 }),
        }),
        async (dto) => {
          let savedEntity: any;
          const repos = buildPasantiaRepos({
            pasantiaRepo: {
              create: jest.fn().mockImplementation((d) => d),
              save: jest.fn().mockImplementation((d) => {
                savedEntity = d;
                return Promise.resolve({ ...d, id_pasantia: 1 });
              }),
            },
          });
          const service = new PasantiasService(repos.pasantiaRepo as any, repos.empresaRepo as any);
          const result = await service.create(dto);
          expect(result.estado).toBe(EstadoPasantia.PENDIENTE);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 16: State transition sets fecha_fin conditionally
  it('Property 16: updateEstado() should set fecha_fin when FINALIZADA or CANCELADA', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(EstadoPasantia.FINALIZADA, EstadoPasantia.CANCELADA),
        async (estado) => {
          const existing = { id_pasantia: 1, estado: EstadoPasantia.EN_CURSO, fecha_fin: null };
          let saved: any;
          const repos = buildPasantiaRepos({
            pasantiaRepo: {
              findOne: jest.fn().mockResolvedValue({ ...existing }),
              save: jest.fn().mockImplementation((d) => { saved = d; return Promise.resolve(d); }),
            },
          });
          const service = new PasantiasService(repos.pasantiaRepo as any, repos.empresaRepo as any);
          await service.updateEstado(1, { estado });
          expect(saved.fecha_fin).not.toBeNull();
          expect(saved.fecha_fin).toBeInstanceOf(Date);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 16b: updateEstado() should NOT set fecha_fin for non-terminal states', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(EstadoPasantia.EN_CURSO, EstadoPasantia.PENDIENTE),
        async (estado) => {
          const existing = { id_pasantia: 1, estado: EstadoPasantia.PENDIENTE, fecha_fin: null };
          let saved: any;
          const repos = buildPasantiaRepos({
            pasantiaRepo: {
              findOne: jest.fn().mockResolvedValue({ ...existing }),
              save: jest.fn().mockImplementation((d) => { saved = d; return Promise.resolve(d); }),
            },
          });
          const service = new PasantiasService(repos.pasantiaRepo as any, repos.empresaRepo as any);
          await service.updateEstado(1, { estado });
          expect(saved.fecha_fin).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});
