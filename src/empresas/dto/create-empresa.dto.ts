import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ example: 'Tech Corp S.A.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 'Tecnología' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  rubro: string;

  @ApiProperty({ example: 'Av. Principal 123, Ciudad' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: '+58-212-5551234' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  telefono: string;
}
