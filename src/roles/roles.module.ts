import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { Gerente } from '../usuarios/entities/gerente.entity';
import { Tutor } from '../usuarios/entities/tutor.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JefePasantes, Gerente, Tutor, Usuario, Empresa])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
