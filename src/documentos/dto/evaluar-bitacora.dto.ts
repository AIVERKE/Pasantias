import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluarBitacoraDto {
  @ApiProperty({ example: 85, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  porcentaje: number;

  @ApiPropertyOptional({ example: 'Buen avance, mejorar documentación.' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
