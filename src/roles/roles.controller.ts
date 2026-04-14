import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateJefeDto } from './dto/create-jefe.dto';
import { CreateGerenteDto } from './dto/create-gerente.dto';
import { CreateTutorDto } from './dto/create-tutor.dto';

@ApiTags('Roles')
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('jefes-pasantes')
  @ApiOperation({ summary: 'Registrar un Jefe de Pasantes asociado a una empresa' })
  @ApiResponse({ status: 201, description: 'Jefe de pasantes creado' })
  @ApiResponse({ status: 404, description: 'Usuario o empresa no encontrada' })
  createJefe(@Body() dto: CreateJefeDto) {
    return this.rolesService.createJefe(dto);
  }

  @Post('gerentes')
  @ApiOperation({ summary: 'Registrar un Gerente asociado a una empresa' })
  @ApiResponse({ status: 201, description: 'Gerente creado' })
  @ApiResponse({ status: 404, description: 'Usuario o empresa no encontrada' })
  createGerente(@Body() dto: CreateGerenteDto) {
    return this.rolesService.createGerente(dto);
  }

  @Get('tutores')
  @ApiOperation({ summary: 'Listar todos los tutores académicos' })
  @ApiResponse({ status: 200, description: 'Lista de tutores' })
  findAllTutores() {
    return this.rolesService.findAllTutores();
  }

  @Post('tutores')
  @ApiOperation({ summary: 'Registrar un Tutor académico' })
  @ApiResponse({ status: 201, description: 'Tutor creado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  createTutor(@Body() dto: CreateTutorDto) {
    return this.rolesService.createTutor(dto);
  }
}
