import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Empresa } from '../empresas/entities/empresa.entity';
import { InformacionEmpresa } from '../empresas/entities/informacion-empresa.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../usuarios/entities/usuario.entity';
import { Inscripcion, EstadoInscripcion } from '../pasantias/entities/inscripcion.entity';
import { Pasantia, EstadoPasantia } from '../pasantias/entities/pasantia.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(InformacionEmpresa)
    private readonly infoEmpresaRepository: Repository<InformacionEmpresa>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.contrasena)) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: number) {
    return this.usuariosService.findOne(userId);
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id_usuario, 
      tipo: user.tipo_usuario, 
      nivel: user.nivel_acceso 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        tipo: user.tipo_usuario,
        nivel: user.nivel_acceso
      }
    };
  }

  async getGerenteDashboard(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener empresa con pasantías y relaciones completas
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: empresaId },
      relations: ['pasantias', 'pasantias.inscripciones', 'pasantias.inscripciones.estudiante', 'pasantias.inscripciones.estudiante.usuario'],
    });

    // 3. Contar métricas
    let pasantesActivos = 0;
    let pasantiasPublicadas = 0;
    const pasantiasList: any[] = [];

    const pasantias = empresa?.pasantias || [];
    for (const p of pasantias) {
      // Solo contar pasantías publicadas o en curso
      if (p.estado === EstadoPasantia.EN_CURSO || p.estado === EstadoPasantia.PENDIENTE) {
        pasantiasPublicadas++;
      }
      
      // Contar pasantes aprobados por pasantía
      const inscripciones = p.inscripciones || [];
      const pasantesEnThisPasantia = inscripciones.filter((i: Inscripcion) => i.estado === EstadoInscripcion.APROBADA).length || 0;
      const postulantes = inscripciones.filter((i: Inscripcion) => i.estado === EstadoInscripcion.PENDIENTE).length || 0;
      
      pasantesActivos += pasantesEnThisPasantia;

      // Obtener nombre del jefe (buscar en inscripciones con jefe asignado)
      const inscripcionConJefe = inscripciones.find((i: Inscripcion) => i.jefe);
      let jefeNombre = 'Sin asignar';
      if (inscripcionConJefe?.jefe) {
        const jefe = await this.usuarioRepository.findOne({
          where: { id_usuario: inscripcionConJefe.jefe.id_jefe },
        });
        if (jefe) {
          jefeNombre = `${jefe.nombre} ${jefe.apellido}`;
        }
      }

      pasantiasList.push({
        id: p.id_pasantia,
        titulo: p.titulo,
        descripcion: p.descripcion,
        estado: p.estado,
        pasantes: pasantesEnThisPasantia,
        postulantes: postulantes,
        jefe: jefeNombre,
      });
    }

    // 4. Contar equipo (jefes de pasantes) de la empresa específica
    const equipo = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.jefe_pasantes', 'jefe')
      .where('usuario.tipo_usuario = :tipo', { tipo: TipoUsuario.JEFE_PASANTES })
      .andWhere('jefe.id_empresa = :empresaId', { empresaId })
      .getCount();

    return {
      pasantesActivos,
      pasantiasPublicadas,
      equipo,
      pasantiasRecientes: pasantiasList.slice(0, 5),
    };
  }

  async getGerenteEmpresa(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener empresa completa
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: empresaId },
    });

    // 3. Obtener información extendida (misión, visión, objetivos, quiénes_somos)
    const	infoEmpresa = await this.infoEmpresaRepository.findOne({
      where: { id: empresaId },
    });

    // 4. Combinar datos
    return {
      ...empresa,
      mision: infoEmpresa?.mision || '',
      vision: infoEmpresa?.vision || '',
      objetivos: infoEmpresa?.objetivos || '',
      quienes_somos: infoEmpresa?.quienes_somos || '',
    };
  }

  async updateGerenteEmpresa(gerenteUserId: number, updateData: any) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Separar datos de empresa vs información extendida
    const { mision, vision, objetivos, quienes_somos, ...empresaData } = updateData;

    // 3. Actualizar empresa base si hay datos
    if (Object.keys(empresaData).length > 0) {
      await this.empresaRepository.update(empresaId, empresaData);
    }

    // 4. Actualizar o crear información extendida
    const existingInfo = await this.infoEmpresaRepository.findOne({
      where: { id: empresaId },
    });

    if (existingInfo) {
      await this.infoEmpresaRepository.update(empresaId, {
        mision: mision || existingInfo.mision,
        vision: vision || existingInfo.vision,
        objetivos: objetivos || existingInfo.objetivos,
        quienes_somos: quienes_somos || existingInfo.quienes_somos,
      });
    } else if (mision || vision || objetivos || quienes_somos) {
      await this.infoEmpresaRepository.insert({
        id: empresaId,
        mision: mision || '',
        vision: vision || '',
        objetivos: objetivos || '',
        quienes_somos: quienes_somos || '',
      });
    }

    // 5. Devolver empresa actualizada
    return this.getGerenteEmpresa(gerenteUserId);
  }

  async getGerenteEquipo(gerenteUserId: number) {
    // 1. Obtener el perfil del gerente para saber su empresa
    const gerentePerfil = await this.usuariosService.findOne(gerenteUserId);
    
    if (!gerentePerfil.gerente?.empresa) {
      throw new NotFoundException('El gerente no tiene una empresa asignada');
    }

    const empresaId = gerentePerfil.gerente.empresa.id_empresa;

    // 2. Obtener usuarios con rol JEFE_PASANTES de esa empresa
    const Jefes = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.jefe_pasantes', 'jefe')
      .addSelect(['jefe.departamento'])
      .where('usuario.tipo_usuario = :tipo', { tipo: TipoUsuario.JEFE_PASANTES })
      .andWhere('jefe.id_empresa = :empresaId', { empresaId })
      .getMany();

    // 3. Transformar para el frontend
    return Jefes.map(jefe => ({
      id: jefe.id_usuario,
      nombre: `${jefe.nombre} ${jefe.apellido}`,
      iniciales: `${jefe.nombre[0]}${jefe.apellido[0]}`.toUpperCase(),
      area: (jefe as any).jefe_pasantes?.departamento || 'Sin área',
      email: jefe.email,
    }));
  }
}

