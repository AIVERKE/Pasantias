import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @ApiProperty({ example: 'Desarrollo de Software' })
  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @ApiProperty({ example: 'Universidad Central' })
  @IsString()
  @IsNotEmpty()
  institucion: string;
}
