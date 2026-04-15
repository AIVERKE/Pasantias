import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInformacionEmpresaDto {
  @ApiProperty({ example: 'Nuestra misión es...', description: 'Misión de la empresa' })
  @IsString()
  @IsNotEmpty()
  mision: string;

  @ApiProperty({ example: 'Nuestra visión es...', description: 'Visión de la empresa' })
  @IsString()
  @IsNotEmpty()
  vision: string;

  @ApiProperty({ example: 'Alcanzar el 100% de...', description: 'Objetivos de la empresa' })
  @IsString()
  @IsNotEmpty()
  objetivos: string;

  @ApiProperty({ example: 'Somos una empresa dedicada a...', description: 'Quiénes somos' })
  @IsString()
  @IsNotEmpty()
  quienes_somos: string;
}
