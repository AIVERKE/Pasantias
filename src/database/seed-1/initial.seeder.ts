import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, TipoUsuario } from '../../usuarios/entities/usuario.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';
import { Tutor } from '../../usuarios/entities/tutor.entity';
import { Gerente } from '../../usuarios/entities/gerente.entity';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';
import { SuperUsuario } from '../../usuarios/entities/super-usuario.entity';

export default class InitialSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const SALT_ROUNDS = 10;

    // ─── Repositorios ────────────────────────────────────────────────────────
    const usuarioRepo = dataSource.getRepository(Usuario);
    const empresaRepo = dataSource.getRepository(Empresa);
    const estudianteRepo = dataSource.getRepository(Estudiante);
    const tutorRepo = dataSource.getRepository(Tutor);
    const gerenteRepo = dataSource.getRepository(Gerente);
    const jefeRepo = dataSource.getRepository(JefePasantes);
    const superUsuarioRepo = dataSource.getRepository(SuperUsuario);

    // ─── 1. Empresas ─────────────────────────────────────────────────────────
    console.log('🏢 Insertando empresas...');

    const empresas = await empresaRepo.save([
      empresaRepo.create({
        nombre: 'TechBolivia S.R.L.',
        rubro: 'Tecnología de la Información',
        direccion: 'Av. Arce 2631, La Paz',
        telefono: '+591-2-2441200',
      }),
      empresaRepo.create({
        nombre: 'Grupo Empresarial Norte S.A.',
        rubro: 'Consultoría y Servicios',
        direccion: 'Calle Sucre 345, Cochabamba',
        telefono: '+591-4-4523100',
      }),
    ]);

    const [techBolivia, grupoNorte] = empresas;

    // ─── 2. Super Usuario ────────────────────────────────────────────────────
    console.log('👑 Insertando super usuario...');

    const superUsuarioBase = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@pasantias.edu.bo',
        contrasena: await bcrypt.hash('Admin@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.SUPER_USUARIO,
        nivel_acceso: 5,
      }),
    );

    await superUsuarioRepo.save(
      superUsuarioRepo.create({ id_superusuario: superUsuarioBase.id_usuario }),
    );

    // ─── 3. Gerentes ────────────────────────────────────────────────────────
    console.log('👔 Insertando gerentes...');

    const gerenteBase1 = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'Carlos',
        apellido: 'Mendoza Ríos',
        email: 'carlos.mendoza@techbolivia.com',
        contrasena: await bcrypt.hash('Gerente@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.GERENTE,
        nivel_acceso: 4,
      }),
    );

    await gerenteRepo.save(
      gerenteRepo.create({
        id_gerente: gerenteBase1.id_usuario,
        cargo: 'Gerente de Sistemas',
        carrera: 'Ingeniería en Sistemas',
        empresa: techBolivia,
      }),
    );

    const gerenteBase2 = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'Patricia',
        apellido: 'Vargas Soliz',
        email: 'patricia.vargas@gruponorte.com',
        contrasena: await bcrypt.hash('Gerente@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.GERENTE,
        nivel_acceso: 4,
      }),
    );

    await gerenteRepo.save(
      gerenteRepo.create({
        id_gerente: gerenteBase2.id_usuario,
        cargo: 'Gerente de RRHH',
        carrera: 'Administración de Empresas',
        empresa: grupoNorte,
      }),
    );

    // ─── 4. Jefes de Pasantes ────────────────────────────────────────────────
    console.log('🧑‍💼 Insertando jefes de pasantes...');

    const jefeBase1 = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'Roberto',
        apellido: 'Flores Chávez',
        email: 'roberto.flores@techbolivia.com',
        contrasena: await bcrypt.hash('Jefe@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.JEFE_PASANTES,
        nivel_acceso: 3,
      }),
    );

    await jefeRepo.save(
      jefeRepo.create({
        id_jefe: jefeBase1.id_usuario,
        departamento: 'Desarrollo de Software',
        empresa: techBolivia,
      }),
    );

    // ─── 5. Tutores ──────────────────────────────────────────────────────────
    console.log('👨‍🏫 Insertando tutores...');

    const tutorBase1 = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'María Elena',
        apellido: 'Quiroga Perez',
        email: 'mquiroga@umsa.edu.bo',
        contrasena: await bcrypt.hash('Tutor@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.TUTOR,
        nivel_acceso: 2,
      }),
    );

    await tutorRepo.save(
      tutorRepo.create({
        id_tutor: tutorBase1.id_usuario,
        especialidad: 'Ingeniería de Software',
        institucion: 'Universidad Mayor de San Andrés',
      }),
    );

    const tutorBase2 = await usuarioRepo.save(
      usuarioRepo.create({
        nombre: 'Juan Pablo',
        apellido: 'Condori Mamani',
        email: 'jpcondori@ucb.edu.bo',
        contrasena: await bcrypt.hash('Tutor@2024!', SALT_ROUNDS),
        tipo_usuario: TipoUsuario.TUTOR,
        nivel_acceso: 2,
      }),
    );

    await tutorRepo.save(
      tutorRepo.create({
        id_tutor: tutorBase2.id_usuario,
        especialidad: 'Redes y Telecomunicaciones',
        institucion: 'Universidad Católica Boliviana',
      }),
    );

    // ─── 6. Estudiantes ──────────────────────────────────────────────────────
    console.log('🎓 Insertando estudiantes...');

    const estudiantesData = [
      {
        nombre: 'Lucía',
        apellido: 'Mamani Quispe',
        email: 'lucia.mamani@est.umsa.edu.bo',
        password: 'Estudiante@2024!',
        carrera: 'Ingeniería en Sistemas',
        semestre: 8,
        registro_universitario: 'UMSA-2020-001',
      },
      {
        nombre: 'Diego',
        apellido: 'Huanca Torrez',
        email: 'diego.huanca@est.umsa.edu.bo',
        password: 'Estudiante@2024!',
        carrera: 'Ingeniería Informática',
        semestre: 9,
        registro_universitario: 'UMSA-2019-045',
      },
      {
        nombre: 'Valeria',
        apellido: 'Soria Apaza',
        email: 'valeria.soria@est.ucb.edu.bo',
        password: 'Estudiante@2024!',
        carrera: 'Sistemas de Información',
        semestre: 7,
        registro_universitario: 'UCB-2021-012',
      },
    ];

    for (const data of estudiantesData) {
      const usuarioBase = await usuarioRepo.save(
        usuarioRepo.create({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          contrasena: await bcrypt.hash(data.password, SALT_ROUNDS),
          tipo_usuario: TipoUsuario.ESTUDIANTE,
          nivel_acceso: 1,
        }),
      );

      await estudianteRepo.save(
        estudianteRepo.create({
          id_estudiante: usuarioBase.id_usuario,
          carrera: data.carrera,
          semestre: data.semestre,
          registro_universitario: data.registro_universitario,
        }),
      );
    }

    console.log('✅ Seed completado exitosamente.');
    console.log('');
    console.log('📋 Credenciales de prueba:');
    console.log('  👑 Admin:      admin@pasantias.edu.bo      / Admin@2024!');
    console.log('  👔 Gerente:    carlos.mendoza@techbolivia.com / Gerente@2024!');
    console.log('  👔 Gerente:    patricia.vargas@gruponorte.com / Gerente@2024!');
    console.log('  🧑‍💼 Jefe:       roberto.flores@techbolivia.com / Jefe@2024!');
    console.log('  👨‍🏫 Tutor:      mquiroga@umsa.edu.bo          / Tutor@2024!');
    console.log('  👨‍🏫 Tutor:      jpcondori@ucb.edu.bo           / Tutor@2024!');
    console.log('  🎓 Estudiante: lucia.mamani@est.umsa.edu.bo  / Estudiante@2024!');
    console.log('  🎓 Estudiante: diego.huanca@est.umsa.edu.bo  / Estudiante@2024!');
    console.log('  🎓 Estudiante: valeria.soria@est.ucb.edu.bo  / Estudiante@2024!');
  }
}
