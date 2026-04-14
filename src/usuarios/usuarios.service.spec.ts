import * as fc from 'fast-check';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TipoUsuario } from './entities/usuario.entity';

// Shared mock factory
function buildMocks(overrides: Record<string, any> = {}) {
  const queryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      create: jest.fn().mockImplementation((_, data) => data),
    },
  };

  const usuarioRepo = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((data) => ({ ...data, id_usuario: 1 })),
    find: jest.fn(),
    softDelete: jest.fn(),
  };

  const empresaRepo = {
    findOne: jest.fn(),
  };

  const dataSource = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunner),
  };

  return { usuarioRepo, empresaRepo, dataSource, queryRunner, ...overrides };
}

describe('UsuariosService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 5: Duplicate email registration is rejected
  it('Property 5: create() should throw ConflictException when email already exists', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          nombre: fc.string({ minLength: 1, maxLength: 50 }),
          apellido: fc.string({ minLength: 1, maxLength: 50 }),
          contrasena: fc.string({ minLength: 6, maxLength: 30 }),
        }),
        async ({ email, nombre, apellido, contrasena }) => {
          const { usuarioRepo, empresaRepo, dataSource } = buildMocks();
          // Simulate existing user
          usuarioRepo.findOne.mockResolvedValue({ email, id_usuario: 99, deleted_at: null });

          const service = new UsuariosService(
            usuarioRepo as any,
            empresaRepo as any,
            dataSource as any,
          );

          await expect(
            service.create({ email, nombre, apellido, contrasena, tipo_usuario: TipoUsuario.ESTUDIANTE }),
          ).rejects.toThrow(ConflictException);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 6: Company validation for role-dependent profiles
  it('Property 6: create() should throw NotFoundException when id_empresa does not exist for gerente/jefe', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          nombre: fc.string({ minLength: 1, maxLength: 50 }),
          apellido: fc.string({ minLength: 1, maxLength: 50 }),
          contrasena: fc.string({ minLength: 6, maxLength: 30 }),
          tipo_usuario: fc.constantFrom(TipoUsuario.GERENTE, TipoUsuario.JEFE_PASANTES),
          id_empresa: fc.integer({ min: 1, max: 9999 }),
        }),
        async ({ email, nombre, apellido, contrasena, tipo_usuario, id_empresa }) => {
          const { usuarioRepo, empresaRepo, dataSource } = buildMocks();
          // No existing user
          usuarioRepo.findOne.mockResolvedValue(null);
          // Empresa does NOT exist
          empresaRepo.findOne.mockResolvedValue(null);

          const service = new UsuariosService(
            usuarioRepo as any,
            empresaRepo as any,
            dataSource as any,
          );

          await expect(
            service.create({ email, nombre, apellido, contrasena, tipo_usuario, id_empresa }),
          ).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 7: Profile endpoint returns correct user with role data
  it('Property 7: findOne() should throw NotFoundException for non-existent user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 99999 }),
        async (userId) => {
          const { usuarioRepo, empresaRepo, dataSource } = buildMocks();
          usuarioRepo.findOne.mockResolvedValue(null);

          const service = new UsuariosService(
            usuarioRepo as any,
            empresaRepo as any,
            dataSource as any,
          );

          await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });
});
