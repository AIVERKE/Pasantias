import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';
import { Tutor } from '../usuarios/entities/tutor.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Estudiante, Pasantia, Tutor, JefePasantes])],
  providers: [InscripcionesService],
  controllers: [InscripcionesController],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
