import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActividadDto {
  @ApiProperty({ example: 'Reunión de seguimiento semanal' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_pasantia: number;
}
