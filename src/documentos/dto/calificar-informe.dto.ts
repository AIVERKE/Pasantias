import { IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalificarInformeDto {
  @ApiProperty({ example: 18.5, minimum: 0, maximum: 20 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(20)
  nota_final: number;
}
