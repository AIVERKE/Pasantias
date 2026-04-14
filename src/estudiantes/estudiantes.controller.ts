import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@ApiTags('Estudiantes')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los estudiantes con filtros opcionales' })
  @ApiQuery({ name: 'carrera', required: false, description: 'Filtrar por carrera' })
  @ApiQuery({ name: 'semestre', required: false, type: Number, description: 'Filtrar por semestre' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes' })
  findAll(
    @Query('carrera') carrera?: string,
    @Query('semestre') semestre?: number,
  ) {
    return this.estudiantesService.findAll(carrera, semestre ? +semestre : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil completo de un estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Perfil del estudiante' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear perfil de estudiante para un usuario existente' })
  @ApiResponse({ status: 201, description: 'Perfil de estudiante creado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrera y/o semestre del estudiante' })
  @ApiParam({ name: 'id', description: 'ID del estudiante' })
  @ApiResponse({ status: 200, description: 'Estudiante actualizado' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstudianteDto) {
    return this.estudiantesService.update(id, dto);
  }
}
