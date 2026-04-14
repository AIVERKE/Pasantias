import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateEvaluacionDto } from './dto/update-evaluacion.dto';
import { AsignarSupervisoresDto } from './dto/asignar-supervisores.dto';

@ApiTags('Inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Get('pasantia/:id')
  @ApiOperation({ summary: 'Listar inscripciones de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones' })
  findByPasantia(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionesService.findByPasantia(id);
  }

  @Post()
  @ApiOperation({ summary: 'Aplicar a una pasantía (crear inscripción)' })
  @ApiResponse({ status: 201, description: 'Inscripción creada en estado PENDIENTE' })
  @ApiResponse({ status: 404, description: 'Estudiante o pasantía no encontrada' })
  create(@Body() dto: CreateInscripcionDto) {
    return this.inscripcionesService.create(dto);
  }

  @Patch(':id/evaluacion')
  @ApiOperation({ summary: 'Evaluar una inscripción (aprobar/rechazar)' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ status: 200, description: 'Estado de inscripción actualizado' })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  updateEvaluacion(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluacionDto) {
    return this.inscripcionesService.updateEvaluacion(id, dto);
  }

  @Patch(':id/tutor')
  @ApiOperation({ summary: 'Asignar tutor y jefe de pasantes a una inscripción' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ status: 200, description: 'Supervisores asignados' })
  @ApiResponse({ status: 404, description: 'Inscripción, tutor o jefe no encontrado' })
  asignarSupervisores(@Param('id', ParseIntPipe) id: number, @Body() dto: AsignarSupervisoresDto) {
    return this.inscripcionesService.asignarSupervisores(id, dto);
  }
}
