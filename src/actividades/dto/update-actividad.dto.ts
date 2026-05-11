import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoSemaforo } from '../entities/actividad.entity';

export class UpdateActividadDto {
  @ApiPropertyOptional({ example: 'Reunión de cierre' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ enum: EstadoSemaforo, example: EstadoSemaforo.COMPLETADA })
  @IsOptional()
  @IsEnum(EstadoSemaforo)
  estado?: EstadoSemaforo;
}
