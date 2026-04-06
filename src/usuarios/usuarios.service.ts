import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario, TipoUsuario } from './entities/usuario.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Gerente } from './entities/gerente.entity';
import { Tutor } from './entities/tutor.entity';
import { JefePasantes } from './entities/jefe-pasantes.entity';
import { SuperUsuario } from './entities/super-usuario.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { email, contrasena, tipo_usuario, ...perfilData } = createUsuarioDto;

    // 1. Verificar si el email ya existe (incluyendo eliminados lógicamente para evitar conflictos de llave única)
    const usuarioExistente = await this.usuarioRepository.findOne({ 
      where: { email },
      withDeleted: true 
    });
    
    if (usuarioExistente) {
      if (usuarioExistente.deleted_at) {
        throw new ConflictException(`El correo '${email}' ya estuvo registrado pero fue eliminado. Contacte al administrador.`);
      }
      throw new ConflictException(`El correo electrónico '${email}' ya está registrado`);
    }

    // 2. Validación preventiva de Empresa (si aplica)
    if (tipo_usuario === TipoUsuario.GERENTE || tipo_usuario === TipoUsuario.JEFE_PASANTES) {
      if (!perfilData.id_empresa) {
        throw new BadRequestException(`El campo 'id_empresa' es obligatorio para el rol de ${tipo_usuario}`);
      }
      
      const empresa = await this.empresaRepository.findOne({ where: { id_empresa: perfilData.id_empresa } });
      if (!empresa) {
        throw new NotFoundException(`La empresa con ID ${perfilData.id_empresa} no existe en el sistema`);
      }
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt();
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    // Determinar nivel de acceso
    let nivel_acceso = 1;
    if (tipo_usuario === TipoUsuario.GERENTE || tipo_usuario === TipoUsuario.SUPER_USUARIO) {
      nivel_acceso = 0;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear base de Usuario
      const nuevoUsuario = this.usuarioRepository.create({
        ...createUsuarioDto,
        contrasena: contrasenaHasheada,
        nivel_acceso,
      });

      const usuarioGuardado = await queryRunner.manager.save(nuevoUsuario);

      // Crear Perfil Específico
      switch (tipo_usuario) {
        case TipoUsuario.ESTUDIANTE:
          const estudiante = queryRunner.manager.create(Estudiante, {
            id_estudiante: usuarioGuardado.id_usuario,
            carrera: perfilData.carrera,
            semestre: perfilData.semestre,
            registro_universitario: perfilData.registro_universitario,
          });
          await queryRunner.manager.save(estudiante);
          break;

        case TipoUsuario.GERENTE:
            const gerente = queryRunner.manager.create(Gerente, {
              id_gerente: usuarioGuardado.id_usuario,
              cargo: perfilData.cargo,
              carrera: perfilData.carrera,
              empresa: { id_empresa: perfilData.id_empresa } as any,
            });
            await queryRunner.manager.save(gerente);
            break;
  
          case TipoUsuario.TUTOR:
            const tutor = queryRunner.manager.create(Tutor, {
              id_tutor: usuarioGuardado.id_usuario,
              especialidad: perfilData.especialidad,
              institucion: perfilData.institucion,
            });
            await queryRunner.manager.save(tutor);
            break;
  
          case TipoUsuario.JEFE_PASANTES:
            const jefe = queryRunner.manager.create(JefePasantes, {
              id_jefe: usuarioGuardado.id_usuario,
              departamento: perfilData.departamento,
              empresa: { id_empresa: perfilData.id_empresa } as any,
            });
            await queryRunner.manager.save(jefe);
            break;
  
          case TipoUsuario.SUPER_USUARIO:
            const superUsuario = queryRunner.manager.create(SuperUsuario, {
              id_superusuario: usuarioGuardado.id_usuario,
            });
            await queryRunner.manager.save(superUsuario);
            break;
      }

      await queryRunner.commitTransaction();
      
      const { contrasena: _, ...result } = usuarioGuardado;
      return result;

    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23505') {
        throw new ConflictException(`Ya existe un registro con este identificador único (Email o Matrícula duplicada)`);
      }
      
      if (error.code === '23503') {
        throw new BadRequestException(`No se pudo completar el registro debido a una referencia inválida`);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(tipo?: TipoUsuario) {
    const where = tipo ? { tipo_usuario: tipo } : {};
    return this.usuarioRepository.find({
      where,
      select: ['id_usuario', 'nombre', 'apellido', 'email', 'tipo_usuario', 'nivel_acceso', 'created_at']
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ 
      where: { id_usuario: id } 
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Cargar perfil específico según el tipo
    const relations = [];
    switch (usuario.tipo_usuario) {
      case TipoUsuario.ESTUDIANTE: relations.push('estudiante'); break;
      case TipoUsuario.GERENTE: relations.push('gerente', 'gerente.empresa'); break;
      case TipoUsuario.TUTOR: relations.push('tutor'); break;
      case TipoUsuario.JEFE_PASANTES: relations.push('jefe_pasantes', 'jefe_pasantes.empresa'); break;
      case TipoUsuario.SUPER_USUARIO: relations.push('super_usuario'); break;
    }

    const usuarioConRelaciones = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations
    });

    if (!usuarioConRelaciones) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado tras cargar relaciones`);
    }

    return usuarioConRelaciones;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id); // Esto asegura que exista y carga su perfil
    const { email, contrasena, ...perfilData } = updateUsuarioDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Actualizar datos base del Usuario
      if (contrasena) {
        const salt = await bcrypt.genSalt();
        usuario.contrasena = await bcrypt.hash(contrasena, salt);
      }
      
      if (email) usuario.email = email;
      if (updateUsuarioDto.nombre) usuario.nombre = updateUsuarioDto.nombre;
      if (updateUsuarioDto.apellido) usuario.apellido = updateUsuarioDto.apellido;

      await queryRunner.manager.save(usuario);

      // 2. Actualizar perfil específico
      switch (usuario.tipo_usuario) {
        case TipoUsuario.ESTUDIANTE:
          if (perfilData.carrera || perfilData.semestre || perfilData.registro_universitario) {
            await queryRunner.manager.update(Estudiante, id, {
              carrera: perfilData.carrera,
              semestre: perfilData.semestre,
              registro_universitario: perfilData.registro_universitario,
            });
          }
          break;

        case TipoUsuario.GERENTE:
          if (perfilData.cargo || perfilData.carrera || perfilData.id_empresa) {
            await queryRunner.manager.update(Gerente, id, {
              cargo: perfilData.cargo,
              carrera: perfilData.carrera,
              empresa: perfilData.id_empresa ? ({ id_empresa: perfilData.id_empresa } as any) : undefined,
            });
          }
          break;

        case TipoUsuario.TUTOR:
          if (perfilData.especialidad || perfilData.institucion) {
            await queryRunner.manager.update(Tutor, id, {
              especialidad: perfilData.especialidad,
              institucion: perfilData.institucion,
            });
          }
          break;

        case TipoUsuario.JEFE_PASANTES:
          if (perfilData.departamento || perfilData.id_empresa) {
            await queryRunner.manager.update(JefePasantes, id, {
              departamento: perfilData.departamento,
              empresa: perfilData.id_empresa ? ({ id_empresa: perfilData.id_empresa } as any) : undefined,
            });
          }
          break;
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new ConflictException(`Ya existe un registro con estos datos únicos`);
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.softDelete(id);
    return { message: `Usuario ${usuario.email} eliminado lógicamente con éxito` };
  }
}
