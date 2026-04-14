import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoActividad } from '../entities/actividad.entity';

export class UpdateActividadDto {
  @ApiPropertyOptional({ example: 'Reunión de cierre' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ enum: EstadoActividad, example: EstadoActividad.CERRADA })
  @IsOptional()
  @IsEnum(EstadoActividad)
  estado?: EstadoActividad;
}
