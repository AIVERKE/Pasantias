import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  findAll(carrera?: string, semestre?: number): Promise<Estudiante[]> {
    const where: any = {};
    if (carrera) where.carrera = carrera;
    if (semestre) where.semestre = semestre;
    return this.estudianteRepository.find({ where, relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: id },
      relations: ['usuario'],
    });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.id_usuario} no encontrado`);
    const estudiante = this.estudianteRepository.create({
      id_estudiante: dto.id_usuario,
      carrera: dto.carrera,
      semestre: dto.semestre,
      registro_universitario: dto.registro_universitario,
    });
    return this.estudianteRepository.save(estudiante);
  }

  async update(id: number, dto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.findOne(id);
    if (dto.carrera !== undefined) estudiante.carrera = dto.carrera;
    if (dto.semestre !== undefined) estudiante.semestre = dto.semestre;
    return this.estudianteRepository.save(estudiante);
  }
}
