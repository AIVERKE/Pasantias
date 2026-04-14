import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoPasantia } from '../entities/pasantia.entity';

export class UpdateEstadoPasantiaDto {
  @ApiProperty({ enum: EstadoPasantia, example: EstadoPasantia.EN_CURSO })
  @IsEnum(EstadoPasantia)
  estado: EstadoPasantia;
}
