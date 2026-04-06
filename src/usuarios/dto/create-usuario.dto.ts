import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña en texto plano' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  contrasena: string;

  @ApiProperty({ enum: TipoUsuario, description: 'Tipo de usuario que desea registrar' })
  @IsEnum(TipoUsuario)
  @IsNotEmpty()
  tipo_usuario: TipoUsuario;

  // --- Campos específicos de ESTUDIANTE ---
  @ApiPropertyOptional({ description: 'Carrera (Obligatorio para estudiante/gerente)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.ESTUDIANTE || o.tipo_usuario === TipoUsuario.GERENTE)
  @IsString()
  @IsNotEmpty()
  carrera?: string;

  @ApiPropertyOptional({ description: 'Semestre (Obligatorio para estudiante)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.ESTUDIANTE)
  @IsInt()
  @IsNotEmpty()
  semestre?: number;

  @ApiPropertyOptional({ description: 'Registro Universitario (Obligatorio para estudiante)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.ESTUDIANTE)
  @IsString()
  @IsNotEmpty()
  registro_universitario?: string;


  // --- Campos específicos de GERENTE ---
  @ApiPropertyOptional({ description: 'Cargo (Obligatorio para gerente)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.GERENTE)
  @IsString()
  @IsNotEmpty()
  cargo?: string;

  @ApiPropertyOptional({ description: 'ID de la Empresa (Obligatorio para Gerente o Jefe de Pasantes)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.GERENTE || o.tipo_usuario === TipoUsuario.JEFE_PASANTES)
  @IsInt()
  @IsNotEmpty()
  id_empresa?: number;


  // --- Campos específicos de TUTOR ---
  @ApiPropertyOptional({ description: 'Especialidad (Obligatorio para tutor)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.TUTOR)
  @IsString()
  @IsNotEmpty()
  especialidad?: string;

  @ApiPropertyOptional({ description: 'Institucion (Obligatorio para tutor)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.TUTOR)
  @IsString()
  @IsNotEmpty()
  institucion?: string;


  // --- Campos específicos de JEFE_PASANTES ---
  @ApiPropertyOptional({ description: 'Departamento (Obligatorio para Jefe de Pasantes)' })
  @ValidateIf(o => o.tipo_usuario === TipoUsuario.JEFE_PASANTES)
  @IsString()
  @IsNotEmpty()
  departamento?: string;

}
