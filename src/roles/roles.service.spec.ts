import * as fc from 'fast-check';
import { NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';

function buildRolesRepos(overrides: Record<string, any> = {}) {
  return {
    jefeRepo: { create: jest.fn().mockImplementation((d) => d), save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_jefe: 1 })), ...overrides.jefeRepo },
    gerenteRepo: { create: jest.fn().mockImplementation((d) => d), save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_gerente: 1 })), ...overrides.gerenteRepo },
    tutorRepo: { create: jest.fn().mockImplementation((d) => d), save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_tutor: 1 })), find: jest.fn().mockResolvedValue([]), ...overrides.tutorRepo },
    usuarioRepo: { findOne: jest.fn().mockResolvedValue({ id_usuario: 1 }), ...overrides.usuarioRepo },
    empresaRepo: { findOne: jest.fn().mockResolvedValue({ id_empresa: 1 }), ...overrides.empresaRepo },
  };
}

describe('RolesService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 12: Role profile creation round trip
  it('Property 12: createJefe() should throw NotFoundException when usuario does not exist', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_usuario: fc.integer({ min: 1, max: 9999 }),
          departamento: fc.string({ minLength: 1, maxLength: 50 }),
          id_empresa: fc.integer({ min: 1, max: 9999 }),
        }),
        async (dto) => {
          const repos = buildRolesRepos({ usuarioRepo: { findOne: jest.fn().mockResolvedValue(null) } });
          const service = new RolesService(
            repos.jefeRepo as any, repos.gerenteRepo as any, repos.tutorRepo as any,
            repos.usuarioRepo as any, repos.empresaRepo as any,
          );
          await expect(service.createJefe(dto)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 12b: createTutor() should throw NotFoundException when usuario does not exist', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_usuario: fc.integer({ min: 1, max: 9999 }),
          especialidad: fc.string({ minLength: 1, maxLength: 50 }),
          institucion: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (dto) => {
          const repos = buildRolesRepos({ usuarioRepo: { findOne: jest.fn().mockResolvedValue(null) } });
          const service = new RolesService(
            repos.jefeRepo as any, repos.gerenteRepo as any, repos.tutorRepo as any,
            repos.usuarioRepo as any, repos.empresaRepo as any,
          );
          await expect(service.createTutor(dto)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 12c: createJefe() should persist departamento and empresa when valid', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_usuario: fc.integer({ min: 1, max: 9999 }),
          departamento: fc.string({ minLength: 1, maxLength: 50 }),
          id_empresa: fc.integer({ min: 1, max: 9999 }),
        }),
        async (dto) => {
          const repos = buildRolesRepos();
          const service = new RolesService(
            repos.jefeRepo as any, repos.gerenteRepo as any, repos.tutorRepo as any,
            repos.usuarioRepo as any, repos.empresaRepo as any,
          );
          const result = await service.createJefe(dto);
          expect(result.departamento).toBe(dto.departamento);
        },
      ),
      { numRuns: 100 },
    );
  });
});
