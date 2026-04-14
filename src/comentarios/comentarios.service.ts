import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from '../pasantias/entities/comentario.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    @InjectRepository(Pasantia)
    private readonly pasantiaRepository: Repository<Pasantia>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  findByPasantia(pasantiaId: number): Promise<Comentario[]> {
    return this.comentarioRepository.find({
      where: { pasantia: { id_pasantia: pasantiaId } },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async create(dto: CreateComentarioDto): Promise<Comentario> {
    const pasantia = await this.pasantiaRepository.findOne({ where: { id_pasantia: dto.id_pasantia } });
    if (!pasantia) throw new NotFoundException(`Pasantía con ID ${dto.id_pasantia} no encontrada`);
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.id_usuario} no encontrado`);
    const comentario = this.comentarioRepository.create({
      texto: dto.texto,
      valoracion: dto.valoracion,
      fecha: new Date(),
      pasantia,
      usuario,
    });
    return this.comentarioRepository.save(comentario);
  }
}
