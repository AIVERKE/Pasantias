import * as fc from 'fast-check';
import { ActividadesService } from './actividades.service';
import { EstadoActividad } from '../pasantias/entities/actividad.entity';

function buildActividadRepos(overrides: Record<string, any> = {}) {
  return {
    actividadRepo: {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_actividad: 1 })),
      ...overrides.actividadRepo,
    },
    pasantiaRepo: {
      findOne: jest.fn().mockResolvedValue({ id_pasantia: 1 }),
      ...overrides.pasantiaRepo,
    },
  };
}

describe('ActividadesService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 19: New actividad defaults to CON_CUPOS
  it('Property 19: create() should always set estado = CON_CUPOS', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          descripcion: fc.string({ minLength: 1, maxLength: 200 }),
          fecha: fc.integer({ min: 2025, max: 2030 }).map((y) => `${y}-06-15`),
          id_pasantia: fc.integer({ min: 1, max: 9999 }),
        }),
        async (dto) => {
          const repos = buildActividadRepos();
          const service = new ActividadesService(repos.actividadRepo as any, repos.pasantiaRepo as any);
          const result = await service.create(dto);
          expect(result.estado).toBe(EstadoActividad.CON_CUPOS);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 19b: update() should only modify provided fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          descripcion: fc.string({ minLength: 1, maxLength: 100 }),
          fecha: fc.date({ min: new Date('2025-01-01'), max: new Date('2030-12-31') }),
          estado: fc.constantFrom(...Object.values(EstadoActividad)),
        }),
        fc.record({
          descripcion: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
          estado: fc.option(fc.constantFrom(...Object.values(EstadoActividad)), { nil: undefined }),
        }),
        async (original, updateDto) => {
          const stored = { ...original, id_actividad: 1 };
          const repos = buildActividadRepos({
            actividadRepo: {
              findOne: jest.fn().mockResolvedValue({ ...stored }),
              save: jest.fn().mockImplementation((d) => Promise.resolve(d)),
            },
          });
          const service = new ActividadesService(repos.actividadRepo as any, repos.pasantiaRepo as any);
          const result = await service.update(1, updateDto);
          if (updateDto.descripcion !== undefined) expect(result.descripcion).toBe(updateDto.descripcion);
          if (updateDto.estado !== undefined) expect(result.estado).toBe(updateDto.estado);
        },
      ),
      { numRuns: 100 },
    );
  });
});
