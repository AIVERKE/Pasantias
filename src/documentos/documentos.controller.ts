import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';
import { HojaVidaDto } from './dto/hoja-vida.dto';
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { EvaluarBitacoraDto } from './dto/evaluar-bitacora.dto';
import { CreateInformeFinalDto } from './dto/create-informe-final.dto';
import { CalificarInformeDto } from './dto/calificar-informe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Documentos')
@Controller()
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  // --- Hoja de Vida ---

  @UseGuards(JwtAuthGuard)
  @Get('hoja-vida/mis-datos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener hoja de vida del estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Hoja de vida con habilidades' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Hoja de vida no encontrada' })
  getMiHojaVida(@Request() req: any) {
    return this.documentosService.getMiHojaVida(req.user.userId);
  }

  @Post('hoja-vida')
  @ApiOperation({ summary: 'Crear o actualizar hoja de vida de un estudiante' })
  @ApiResponse({ status: 201, description: 'Hoja de vida guardada' })
  @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
  upsertHojaVida(@Body() dto: HojaVidaDto) {
    return this.documentosService.upsertHojaVida(dto);
  }

  // --- Habilidades ---

  @Post('habilidades')
  @ApiOperation({ summary: 'Añadir una habilidad al CV' })
  @ApiResponse({ status: 201, description: 'Habilidad añadida' })
  @ApiResponse({ status: 404, description: 'Hoja de vida no encontrada' })
  createHabilidad(@Body() dto: CreateHabilidadDto) {
    return this.documentosService.createHabilidad(dto);
  }

  @Delete('habilidades/:id')
  @ApiOperation({ summary: 'Eliminar una habilidad del CV' })
  @ApiParam({ name: 'id', description: 'ID de la habilidad' })
  @ApiResponse({ status: 200, description: 'Habilidad eliminada' })
  @ApiResponse({ status: 404, description: 'Habilidad no encontrada' })
  deleteHabilidad(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.deleteHabilidad(id);
  }

  // --- Bitácoras ---

  @Get('bitacoras/inscripcion/:id')
  @ApiOperation({ summary: 'Listar bitácoras de una inscripción' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ status: 200, description: 'Lista de bitácoras ordenadas por fecha' })
  findBitacorasByInscripcion(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findBitacorasByInscripcion(id);
  }

  @Post('bitacoras')
  @ApiOperation({ summary: 'Registrar avance en bitácora (porcentaje inicial: 0)' })
  @ApiResponse({ status: 201, description: 'Bitácora creada' })
  @ApiResponse({ status: 404, description: 'Inscripción o actividad no encontrada' })
  createBitacora(@Body() dto: CreateBitacoraDto) {
    return this.documentosService.createBitacora(dto);
  }

  @Patch('bitacoras/:id/evaluacion')
  @ApiOperation({ summary: 'Evaluar una bitácora (porcentaje y observaciones)' })
  @ApiParam({ name: 'id', description: 'ID de la bitácora' })
  @ApiResponse({ status: 200, description: 'Bitácora evaluada' })
  @ApiResponse({ status: 400, description: 'Porcentaje fuera de rango 0-100' })
  @ApiResponse({ status: 404, description: 'Bitácora no encontrada' })
  evaluarBitacora(@Param('id', ParseIntPipe) id: number, @Body() dto: EvaluarBitacoraDto) {
    return this.documentosService.evaluarBitacora(id, dto);
  }

  // --- Informes Finales ---

  @Get('informes/inscripcion/:id')
  @ApiOperation({ summary: 'Obtener informe final de una inscripción' })
  @ApiParam({ name: 'id', description: 'ID de la inscripción' })
  @ApiResponse({ status: 200, description: 'Informe final' })
  @ApiResponse({ status: 404, description: 'Informe no encontrado' })
  findInformeByInscripcion(@Param('id', ParseIntPipe) id: number) {
    return this.documentosService.findInformeByInscripcion(id);
  }

  @Post('informes')
  @ApiOperation({ summary: 'Subir informe final de pasantía' })
  @ApiResponse({ status: 201, description: 'Informe creado con fecha de entrega actual' })
  @ApiResponse({ status: 404, description: 'Inscripción o jefe no encontrado' })
  createInforme(@Body() dto: CreateInformeFinalDto) {
    return this.documentosService.createInforme(dto);
  }

  @Patch('informes/:id/calificacion')
  @ApiOperation({ summary: 'Calificar informe final (nota 0.00 - 20.00)' })
  @ApiParam({ name: 'id', description: 'ID del informe' })
  @ApiResponse({ status: 200, description: 'Nota final asignada' })
  @ApiResponse({ status: 400, description: 'Nota fuera de rango 0-20' })
  @ApiResponse({ status: 404, description: 'Informe no encontrado' })
  calificarInforme(@Param('id', ParseIntPipe) id: number, @Body() dto: CalificarInformeDto) {
    return this.documentosService.calificarInforme(id, dto);
  }
}
