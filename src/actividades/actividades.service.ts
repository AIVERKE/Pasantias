import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad, EstadoActividad } from '../pasantias/entities/actividad.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
  ) {}

  findByPasantia(pasantiaId: number): Promise<Actividad[]> {
    return this.actividadRepository.find({
      where: { pasantia: { id_pasantia: pasantiaId } },
      relations: ['pasantia'],
    });
  }

  async create(dto: CreateActividadDto): Promise<Actividad> {
    const pasantia = await this.pasantiaRepository.findOne({ where: { id_pasantia: dto.id_pasantia } });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${dto.id_pasantia} no encontrada`);
    const actividad = this.actividadRepository.create({
      descripcion: dto.descripcion,
      fecha: new Date(dto.fecha),
      estado: EstadoActividad.CON_CUPOS,
      pasantia,
    });
    return this.actividadRepository.save(actividad);
  }

  async update(id: number, dto: UpdateActividadDto): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { id_actividad: id } });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    if (dto.descripcion !== undefined) actividad.descripcion = dto.descripcion;
    if (dto.fecha !== undefined) actividad.fecha = new Date(dto.fecha);
    if (dto.estado !== undefined) actividad.estado = dto.estado;
    return this.actividadRepository.save(actividad);
  }
}
