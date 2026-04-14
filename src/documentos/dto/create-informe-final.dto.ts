import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInformeFinalDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_inscripcion: number;

  @ApiProperty({ example: 'Durante la pasantía desarrollé competencias en NestJS y TypeORM...' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_jefe: number;
}
