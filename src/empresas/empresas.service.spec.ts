import * as fc from 'fast-check';
import { IsNull } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmpresasService } from './empresas.service';

function buildEmpresaRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((data) => data),
    save: jest.fn().mockImplementation((e) => Promise.resolve({ ...e, id_empresa: 1 })),
    softDelete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('EmpresasService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 11: Not-found returns 404
  it('Property 11: findOne() should throw NotFoundException for non-existent empresa', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 99999 }),
        async (id) => {
          const repo = buildEmpresaRepo({ findOne: jest.fn().mockResolvedValue(null) });
          const service = new EmpresasService(repo as any);
          await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 13: Soft delete excludes records from list
  it('Property 13: findAll() should only return empresas where deleted_at is null', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id_empresa: fc.integer({ min: 1, max: 9999 }),
            nombre: fc.string({ minLength: 1, maxLength: 50 }),
            deleted_at: fc.constantFrom(null, null, null, new Date()), // 75% null
          }),
          { minLength: 1, maxLength: 20 },
        ),
        async (empresas) => {
          const activeEmpresas = empresas.filter((e) => e.deleted_at === null);
          const repo = buildEmpresaRepo({
            find: jest.fn().mockImplementation(({ where }) => {
              // Simulate TypeORM IsNull() filtering
              if (where?.deleted_at !== undefined) {
                return Promise.resolve(activeEmpresas);
              }
              return Promise.resolve(empresas);
            }),
          });
          const service = new EmpresasService(repo as any);
          const result = await service.findAll();
          // All returned records must have deleted_at === null
          expect(result.every((e: any) => e.deleted_at === null)).toBe(true);
          expect(result.length).toBe(activeEmpresas.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 13 (remove): softDelete sets deleted_at
  it('Property 13b: remove() should call softDelete and not throw for existing empresa', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 9999 }),
        async (id) => {
          const repo = buildEmpresaRepo({
            findOne: jest.fn().mockResolvedValue({ id_empresa: id, deleted_at: null }),
            softDelete: jest.fn().mockResolvedValue(undefined),
          });
          const service = new EmpresasService(repo as any);
          const result = await service.remove(id);
          expect(repo.softDelete).toHaveBeenCalledWith(id);
          expect(result).toHaveProperty('message');
        },
      ),
      { numRuns: 100 },
    );
  });
});
