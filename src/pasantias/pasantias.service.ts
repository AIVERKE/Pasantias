import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pasantia, EstadoPasantia } from './entities/pasantia.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdateEstadoPasantiaDto } from './dto/update-estado-pasantia.dto';

@Injectable()
export class PasantiasService {
  constructor(
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  findAll(estado?: EstadoPasantia, empresaId?: number): Promise<Pasantia[]> {
    const where: any = {};
    if (estado) where.estado = estado;
    if (empresaId) where.empresa = { id_empresa: empresaId };
    return this.pasantiaRepository.find({
      where,
      relations: ['empresa'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Pasantia> {
    const pasantia = await this.pasantiaRepository.findOne({
      where: { id_pasantia: id },
      relations: ['empresa'],
    });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${id} no encontrada`);
    return pasantia;
  }

  async create(dto: CreatePasantiaDto): Promise<Pasantia> {
    const empresa = await this.empresaRepository.findOne({ where: { id_empresa: dto.id_empresa } });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${dto.id_empresa} no encontrada`);
    const pasantia = this.pasantiaRepository.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      fecha_inicio: new Date(dto.fecha_inicio),
      estado: EstadoPasantia.PENDIENTE,
      empresa,
    });
    return this.pasantiaRepository.save(pasantia);
  }

  async updateEstado(id: number, dto: UpdateEstadoPasantiaDto): Promise<Pasantia> {
    const pasantia = await this.findOne(id);
    pasantia.estado = dto.estado;
    if (dto.estado === EstadoPasantia.FINALIZADA || dto.estado === EstadoPasantia.CANCELADA) {
      pasantia.fecha_fin = new Date();
    }
    return this.pasantiaRepository.save(pasantia);
  }
}
