import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico registrado', example: 'lucia.mamani@est.umsa.edu.bo' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña en texto plano', example: 'Estudiante@2024!' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

