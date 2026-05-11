import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad, EstadoSemaforo } from '../pasantias/entities/actividad.entity';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  findByPasantia(pasantiaId: number): Promise<Actividad[]> {
    return this.actividadRepository.find({
      where: { inscripcion: { pasantia: { id_pasantia: pasantiaId } } } as any,
    });
  }

  async findByInscripcion(inscripcionId: number) {
    const actividades = await this.actividadRepository.find({
      where: { inscripcion: { id_inscripcion: inscripcionId } } as any,
      order: { fecha_asignacion: 'ASC' }
    });
    
    // Cálculo de promedio
    const conNota = actividades.filter(a => a.nota_actividad !== null && a.nota_actividad !== undefined);
    const promedioGlobal = conNota.length > 0 
      ? conNota.reduce((acc, curr) => acc + curr.nota_actividad, 0) / conNota.length
      : null;

    return { actividades, promedioGlobal };
  }

  async create(dto: CreateActividadDto): Promise<Actividad> {
    const actividad = new Actividad();
    actividad.titulo_actividad = 'Actividad de Pasantía';
    actividad.descripcion_actividad = dto.descripcion;
    actividad.fecha_asignacion = new Date(dto.fecha);
    actividad.estado_semaforo = EstadoSemaforo.PENDIENTE;
    return this.actividadRepository.save(actividad);
  }

  async update(id: number, dto: UpdateActividadDto): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({ where: { id_actividad: id } });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    if (dto.descripcion !== undefined) actividad.descripcion_actividad = dto.descripcion;
    if (dto.fecha !== undefined) actividad.fecha_asignacion = new Date(dto.fecha);
    if (dto.estado !== undefined) actividad.estado_semaforo = dto.estado;
    return this.actividadRepository.save(actividad);
  }
}
