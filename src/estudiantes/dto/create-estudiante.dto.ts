import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstudianteDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @ApiProperty({ example: 'Ingeniería en Sistemas' })
  @IsString()
  @IsNotEmpty()
  carrera: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 15 })
  @IsInt()
  @Min(1)
  @Max(15)
  semestre: number;

  @ApiProperty({ example: '2021-12345' })
  @IsString()
  @IsNotEmpty()
  registro_universitario: string;
}
