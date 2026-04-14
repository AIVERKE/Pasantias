import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HojaVidaDto {
  @ApiProperty({ example: 'Estudiante de Ingeniería con experiencia en desarrollo web.' })
  @IsString()
  @IsNotEmpty()
  resumen: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_estudiante: number;
}
