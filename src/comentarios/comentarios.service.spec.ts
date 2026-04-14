import * as fc from 'fast-check';
import { ComentariosService } from './comentarios.service';

function buildComentarioRepos(overrides: Record<string, any> = {}) {
  return {
    comentarioRepo: {
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ ...d, id_comentario: 1 })),
      ...overrides.comentarioRepo,
    },
    pasantiaRepo: { findOne: jest.fn().mockResolvedValue({ id_pasantia: 1 }), ...overrides.pasantiaRepo },
    usuarioRepo: { findOne: jest.fn().mockResolvedValue({ id_usuario: 1 }), ...overrides.usuarioRepo },
  };
}

describe('ComentariosService — Property Tests', () => {
  // Feature: backend-endpoints-implementation, Property 20: Comentario valoracion range validation
  it('Property 20: create() should persist valoracion within 1-5 range', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        async (valoracion, texto) => {
          const repos = buildComentarioRepos();
          const service = new ComentariosService(
            repos.comentarioRepo as any, repos.pasantiaRepo as any, repos.usuarioRepo as any,
          );
          const result = await service.create({ id_pasantia: 1, id_usuario: 1, texto, valoracion });
          expect(result.valoracion).toBe(valoracion);
          expect(result.valoracion).toBeGreaterThanOrEqual(1);
          expect(result.valoracion).toBeLessThanOrEqual(5);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('Property 20b: create() should set fecha to current date', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (valoracion) => {
          const before = new Date();
          const repos = buildComentarioRepos();
          const service = new ComentariosService(
            repos.comentarioRepo as any, repos.pasantiaRepo as any, repos.usuarioRepo as any,
          );
          const result = await service.create({ id_pasantia: 1, id_usuario: 1, texto: 'test', valoracion });
          const after = new Date();
          const fecha = new Date(result.fecha);
          expect(fecha.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
          expect(fecha.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
        },
      ),
      { numRuns: 100 },
    );
  });
});
