import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { Gerente } from '../usuarios/entities/gerente.entity';
import { Tutor } from '../usuarios/entities/tutor.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CreateJefeDto } from './dto/create-jefe.dto';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(JefePasantes)
    private readonly jefeRepository: Repository<JefePasantes>,
    @InjectRepository(Gerente)
    private readonly gerenteRepository: Repository<Gerente>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  private async verifyUsuario(id: number): Promise<void> {
    const u = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
    if (!u) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }

  private async verifyEmpresa(id: number): Promise<void> {
    const e = await this.empresaRepository.findOne({ where: { id_empresa: id } });
    if (!e) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
  }

  async createJefe(dto: CreateJefeDto): Promise<JefePasantes> {
    await this.verifyUsuario(dto.id_usuario);
    await this.verifyEmpresa(dto.id_empresa);
    const jefe = this.jefeRepository.create({
      id_jefe: dto.id_usuario,
      departamento: dto.departamento,
      empresa: { id_empresa: dto.id_empresa } as any,
    });
    return this.jefeRepository.save(jefe);
  }

  async createGerente(dto: CreateGerenteDto): Promise<Gerente> {
    await this.verifyUsuario(dto.id_usuario);
    await this.verifyEmpresa(dto.id_empresa);
    const gerente = this.gerenteRepository.create({
      id_gerente: dto.id_usuario,
      cargo: dto.cargo,
      carrera: dto.carrera,
      empresa: { id_empresa: dto.id_empresa } as any,
    });
    return this.gerenteRepository.save(gerente);
  }

  findAllTutores(): Promise<Tutor[]> {
    return this.tutorRepository.find({ relations: ['usuario'] });
  }

  async createTutor(dto: CreateTutorDto): Promise<Tutor> {
    await this.verifyUsuario(dto.id_usuario);
    const tutor = this.tutorRepository.create({
      id_tutor: dto.id_usuario,
      especialidad: dto.especialidad,
      institucion: dto.institucion,
    });
    return this.tutorRepository.save(tutor);
  }
}
