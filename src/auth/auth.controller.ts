import { Controller, Post, Get, Patch, UseGuards, Request, Body } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async logout(@Request() req: any) {
    return { message: 'Sesión cerrada correctamente', userId: req.user.userId };
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener dashboard del gerente con métricas de su empresa' })
  @ApiResponse({ status: 200, description: 'Dashboard del gerente' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  @ApiResponse({ status: 403, description: 'Acceso restringido a gerentes' })
  async getGerenteDashboard(@Request() req: any) {
    // Verificar que es un gerente
    if (req.user.tipo !== 'gerente' && req.user.tipo !== 'GERENTE') {
      return { message: 'Acceso restringido a gerentes' };
    }
    return this.authService.getGerenteDashboard(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/empresa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Datos de la empresa' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getGerenteEmpresa(@Request() req: any) {
    return this.authService.getGerenteEmpresa(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('gerente/empresa')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async updateGerenteEmpresa(@Request() req: any, @Body() body: any) {
    return this.authService.updateGerenteEmpresa(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gerente/equipo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener equipo de la empresa del gerente' })
  @ApiResponse({ status: 200, description: 'Lista de jefes de pasantes' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getGerenteEquipo(@Request() req: any) {
    return this.authService.getGerenteEquipo(req.user.userId);
  }
}
