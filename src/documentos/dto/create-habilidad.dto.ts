import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NivelHabilidad } from '../entities/habilidad.entity';

export class CreateHabilidadDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ enum: NivelHabilidad, example: NivelHabilidad.AVANZADO })
  @IsEnum(NivelHabilidad)
  nivel: NivelHabilidad;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_hoja_vida: number;
}
