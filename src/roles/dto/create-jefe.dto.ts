import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJefeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @ApiProperty({ example: 'Recursos Humanos' })
  @IsString()
  @IsNotEmpty()
  departamento: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_empresa: number;
}
