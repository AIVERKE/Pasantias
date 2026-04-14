import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBitacoraDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_inscripcion: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_actividad: number;

  @ApiProperty({ example: 'Completé la integración del módulo de autenticación.' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsDateString()
  fecha: string;
}
