import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  findAll(): Promise<Empresa[]> {
    return this.empresaRepository.find({ where: { deleted_at: IsNull() } });
  }

  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id, deleted_at: IsNull() },
    });
    if (!empresa) throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    return empresa;
  }

  create(dto: CreateEmpresaDto): Promise<Empresa> {
    const empresa = this.empresaRepository.create(dto);
    return this.empresaRepository.save(empresa);
  }

  async update(id: number, dto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.findOne(id);
    Object.assign(empresa, dto);
    return this.empresaRepository.save(empresa);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.empresaRepository.softDelete(id);
    return { message: `Empresa con ID ${id} eliminada lógicamente` };
  }
}
