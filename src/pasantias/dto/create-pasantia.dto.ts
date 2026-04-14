import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePasantiaDto {
  @ApiProperty({ example: 'Pasantía en Desarrollo Web' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Desarrollo de aplicaciones web con React y Node.js' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_empresa: number;
}
