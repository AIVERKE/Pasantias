import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEstudianteDto {
  @ApiPropertyOptional({ example: 'Ingeniería en Informática' })
  @IsOptional()
  @IsString()
  carrera?: string;

  @ApiPropertyOptional({ example: 6, minimum: 1, maximum: 15 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(15)
  semestre?: number;
}
