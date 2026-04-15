import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { InformacionEmpresa } from './entities/informacion-empresa.entity';
import { CreateInformacionEmpresaDto } from './dto/create-informacion-empresa.dto';
import { UpdateInformacionEmpresaDto } from './dto/update-informacion-empresa.dto';

@Injectable()
export class InformacionEmpresaService {
  constructor(
    @InjectRepository(InformacionEmpresa)
    private readonly repository: Repository<InformacionEmpresa>,
  ) {}

  findAll(): Promise<InformacionEmpresa[]> {
    return this.repository.find({ where: { deleted_at: IsNull() } });
  }

  async findOne(id: number): Promise<InformacionEmpresa> {
    const data = await this.repository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!data) throw new NotFoundException(`InformacionInstitucional con ID ${id} no encontrada`);
    return data;
  }

  create(dto: CreateInformacionEmpresaDto): Promise<InformacionEmpresa> {
    const data = this.repository.create(dto);
    return this.repository.save(data);
  }

  async update(id: number, dto: UpdateInformacionEmpresaDto): Promise<InformacionEmpresa> {
    const data = await this.findOne(id);
    Object.assign(data, dto);
    return this.repository.save(data);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.repository.softDelete(id);
    return { message: `InformacionInstitucional con ID ${id} eliminada lógicamente` };
  }
}
