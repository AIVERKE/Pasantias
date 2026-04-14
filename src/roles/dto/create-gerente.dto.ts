import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGerenteDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  id_usuario: number;

  @ApiProperty({ example: 'Gerente General' })
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({ example: 'Administración de Empresas' })
  @IsString()
  @IsNotEmpty()
  carrera: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_empresa: number;
}
