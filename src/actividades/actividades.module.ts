import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from '../pasantias/entities/actividad.entity';
import { Pasantia } from '../pasantias/entities/pasantia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, Pasantia])],
  providers: [ActividadesService],
  controllers: [ActividadesController],
  exports: [ActividadesService],
})
export class ActividadesModule {}
