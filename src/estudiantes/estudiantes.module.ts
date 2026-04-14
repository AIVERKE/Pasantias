import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Usuario])],
  providers: [EstudiantesService],
  controllers: [EstudiantesController],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
