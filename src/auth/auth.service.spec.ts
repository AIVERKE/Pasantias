import * as fc from 'fast-check';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';

describe('AuthService — Property Tests', () => {
  let authService: AuthService;
  let mockUsuariosService: Partial<UsuariosService>;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test_secret', signOptions: { expiresIn: '1h' } });
    mockUsuariosService = {
      findByEmail: jest.fn(),
    };
    authService = new AuthService(mockUsuariosService as UsuariosService, jwtService);
  });

  // Feature: backend-endpoints-implementation, Property 1: JWT payload correctness
  it('Property 1: JWT payload should contain id_usuario, tipo_usuario and nivel_acceso', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id_usuario: fc.integer({ min: 1, max: 9999 }),
          nombre: fc.string({ minLength: 1, maxLength: 50 }),
          apellido: fc.string({ minLength: 1, maxLength: 50 }),
          email: fc.emailAddress(),
          tipo_usuario: fc.constantFrom('estudiante', 'tutor', 'gerente', 'jefe_pasantes', 'super_usuario'),
          nivel_acceso: fc.integer({ min: 0, max: 2 }),
        }),
        async (user) => {
          const result = await authService.login(user);
          const decoded = jwtService.verify(result.access_token);
          expect(decoded.sub).toBe(user.id_usuario);
          expect(decoded.tipo).toBe(user.tipo_usuario);
          expect(decoded.nivel).toBe(user.nivel_acceso);
        },
      ),
      { numRuns: 100 },
    );
  });

  // Feature: backend-endpoints-implementation, Property 2: Auth rejects invalid credentials
  it('Property 2: validateUser should return null for wrong password', async () => {
    // Use bcrypt rounds=1 for speed; pre-hash outside fc.assert to avoid timeout
    const correctPassword = 'correctPass123';
    const wrongPassword = 'wrongPass456';
    const hash = await bcrypt.hash(correctPassword, 1);

    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          (mockUsuariosService.findByEmail as jest.Mock).mockResolvedValue({
            email,
            contrasena: hash,
            id_usuario: 1,
            tipo_usuario: 'estudiante',
            nivel_acceso: 1,
          });
          const result = await authService.validateUser(email, wrongPassword);
          expect(result).toBeNull();
        },
      ),
      { numRuns: 50 },
    );
  }, 30000);

  // Feature: backend-endpoints-implementation, Property 3: Password hash invariant
  it('Property 3: validateUser should succeed with correct password and never expose hash', async () => {
    // Pre-hash a fixed password to avoid bcrypt timeout across 50 runs
    const password = 'testPassword99';
    const hash = await bcrypt.hash(password, 1);
    expect(hash).not.toBe(password);

    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          (mockUsuariosService.findByEmail as jest.Mock).mockResolvedValue({
            email,
            contrasena: hash,
            id_usuario: 1,
            tipo_usuario: 'estudiante',
            nivel_acceso: 1,
          });
          const result = await authService.validateUser(email, password);
          expect(result).not.toBeNull();
          expect(result).not.toHaveProperty('contrasena');
        },
      ),
      { numRuns: 50 },
    );
  }, 30000);
});
