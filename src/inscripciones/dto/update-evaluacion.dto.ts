import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoInscripcion } from '../entities/inscripcion.entity';

export class UpdateEvaluacionDto {
  @ApiProperty({ enum: EstadoInscripcion, example: EstadoInscripcion.APROBADA })
  @IsEnum(EstadoInscripcion)
  estado: EstadoInscripcion;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  fecha_inicio_periodo?: string;

  @ApiPropertyOptional({ example: '2026-12-01' })
  @IsOptional()
  @IsDateString()
  fecha_fin_periodo?: string;
}
