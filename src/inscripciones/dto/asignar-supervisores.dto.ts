import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AsignarSupervisoresDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_tutor: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id_jefe: number;
}
