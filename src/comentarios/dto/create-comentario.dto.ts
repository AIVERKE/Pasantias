import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComentarioDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_pasantia: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @ApiProperty({ example: 'Excelente experiencia, aprendí mucho.' })
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  valoracion: number;
}
