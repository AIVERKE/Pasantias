import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { HojaVida } from './entities/hoja-vida.entity';
import { Habilidad } from './entities/habilidad.entity';
import { Bitacora } from './entities/bitacora.entity';
import { InformeFinal } from './entities/informe-final.entity';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { Actividad } from '../pasantias/entities/actividad.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HojaVida,
      Habilidad,
      Bitacora,
      InformeFinal,
      Estudiante,
      Inscripcion,
      Actividad,
      JefePasantes,
    ]),
  ],
  providers: [DocumentosService],
  controllers: [DocumentosController],
  exports: [DocumentosService],
})
export class DocumentosModule {}
