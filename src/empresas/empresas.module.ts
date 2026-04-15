import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { Empresa } from './entities/empresa.entity';
import { InformacionEmpresa } from './entities/informacion-empresa.entity';
import { InformacionEmpresaService } from './informacion-empresa.service';
import { InformacionEmpresaController } from './informacion-empresa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, InformacionEmpresa])],
  providers: [EmpresasService, InformacionEmpresaService],
  controllers: [EmpresasController, InformacionEmpresaController],
  exports: [EmpresasService, InformacionEmpresaService],
})
export class EmpresasModule {}
