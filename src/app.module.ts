import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './config/data-source';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { EmpresasModule } from './empresas/empresas.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { RolesModule } from './roles/roles.module';
import { PasantiasModule } from './pasantias/pasantias.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { ActividadesModule } from './actividades/actividades.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { DocumentosModule } from './documentos/documentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsuariosModule,
    AuthModule,
    EmpresasModule,
    EstudiantesModule,
    RolesModule,
    PasantiasModule,
    InscripcionesModule,
    ActividadesModule,
    ComentariosModule,
    DocumentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
