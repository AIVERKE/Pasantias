import { Controller, Post, Get, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario con su perfil específico' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario con datos de rol' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }
}
