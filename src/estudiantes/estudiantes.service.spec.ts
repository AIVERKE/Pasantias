import * as fc from 'fast-check';
import { NotFoundException } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';

function buildRepos(estudianteOverrides = {}, usuarioOverrides = {}) {
  return {
    estudianteRepo: {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((data) => data),
      save: jest.fn().mockImplementation((e) => Promise.resolve({ ...e, id_estudiante: e.id_estudiante ?? 1 })),
      ...estudianteOverrides,
    },
    usuarioRepo: {
      findOne: jest.fn(),
      ...usuarioOverrides,
    },
  };
}

describe('EstudiantesService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 8: Student list reflects all active students
  it('Property 8: findAll() should return all students from repository', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id_estudiante: fc.integer({ min: 1, max: 9999 }),
            carrera: fc.string({ minLength: 1, maxLength: 50 }),
            semestre: fc.integer({ min: 1, max: 15 }),
          }),
          { minLength: 0, maxLength: 30 },
        ),
        async (students) => {
          const { estudianteRepo, usuarioRepo } = buildRepos({
            find: jest.fn().mockResolvedValue(students),
          });
          const service = new EstudiantesService(estudianteRepo as any, usuarioRepo as any);
          const result = await service.findAll();
          expect(result.length).toBe(students.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 9: Student filter correctness
  it('Property 9: findAll(carrera) should only return students matching that carrera', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.array(
          fc.record({
            id_estudiante: fc.integer({ min: 1, max: 9999 }),
            carrera: fc.string({ minLength: 1, maxLength: 30 }),
            semestre: fc.integer({ min: 1, max: 15 }),
          }),
          { minLength: 1, maxLength: 20 },
        ),
        async (filterCarrera, allStudents) => {
          const filtered = allStudents.filter((s) => s.carrera === filterCarrera);
          const { estudianteRepo, usuarioRepo } = buildRepos({
            find: jest.fn().mockImplementation(({ where }) => {
              if (where?.carrera) {
                return Promise.resolve(allStudents.filter((s) => s.carrera === where.carrera));
              }
              return Promise.resolve(allStudents);
            }),
          });
          const service = new EstudiantesService(estudianteRepo as any, usuarioRepo as any);
          const result = await service.findAll(filterCarrera);
          expect(result.every((s: any) => s.carrera === filterCarrera)).toBe(true);
          expect(result.length).toBe(filtered.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 10: Student CRUD round trip
  it('Property 10: update() should only modify carrera and semestre, not other fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_estudiante: fc.integer({ min: 1, max: 9999 }),
          carrera: fc.string({ minLength: 1, maxLength: 50 }),
          semestre: fc.integer({ min: 1, max: 15 }),
          registro_universitario: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        fc.record({
          carrera: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
          semestre: fc.option(fc.integer({ min: 1, max: 15 }), { nil: undefined }),
        }),
        async (original, updateDto) => {
          const stored = { ...original };
          const { estudianteRepo, usuarioRepo } = buildRepos({
            findOne: jest.fn().mockResolvedValue({ ...stored }),
            save: jest.fn().mockImplementation((e) => Promise.resolve(e)),
          });
          const service = new EstudiantesService(estudianteRepo as any, usuarioRepo as any);
          const result = await service.update(original.id_estudiante, updateDto);
          // registro_universitario must remain unchanged
          expect(result.registro_universitario).toBe(original.registro_universitario);
          // carrera updated if provided
          if (updateDto.carrera !== undefined) expect(result.carrera).toBe(updateDto.carrera);
          // semestre updated if provided
          if (updateDto.semestre !== undefined) expect(result.semestre).toBe(updateDto.semestre);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 11: Not-found returns 404 (estudiantes)
  it('Property 11: findOne() should throw NotFoundException for non-existent estudiante', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 99999 }),
        async (id) => {
          const { estudianteRepo, usuarioRepo } = buildRepos({
            findOne: jest.fn().mockResolvedValue(null),
          });
          const service = new EstudiantesService(estudianteRepo as any, usuarioRepo as any);
          await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        },
      ),
      { numRuns: 100 },
    );
  });
});
