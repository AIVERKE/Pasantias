import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Gerente } from './entities/gerente.entity';
import { Tutor } from './entities/tutor.entity';
import { JefePasantes } from './entities/jefe-pasantes.entity';
import { SuperUsuario } from './entities/super-usuario.entity';
import { Empresa } from '../empresas/entities/empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Estudiante,
      Gerente,
      Tutor,
      JefePasantes,
      SuperUsuario,
      Empresa,
    ]),
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}
