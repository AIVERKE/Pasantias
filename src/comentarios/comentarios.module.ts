import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Comentario } from '../pasantias/entities/comentario.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario, Pasantia, Usuario])],
  providers: [ComentariosService],
  controllers: [ComentariosController],
  exports: [ComentariosService],
})
export class ComentariosModule {}
