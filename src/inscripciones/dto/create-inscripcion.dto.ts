import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInscripcionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_estudiante: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_pasantia: number;
}
