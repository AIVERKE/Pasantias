import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PasantiasService } from './pasantias.service';
import { CreatePasantiaDto } from './dto/create-pasantia.dto';
import { UpdateEstadoPasantiaDto } from './dto/update-estado-pasantia.dto';
import { EstadoPasantia } from './entities/pasantia.entity';

@ApiTags('Pasantías')
@Controller('pasantias')
export class PasantiasController {
  constructor(private readonly pasantiasService: PasantiasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pasantías con filtros opcionales' })
  @ApiQuery({ name: 'estado', enum: EstadoPasantia, required: false })
  @ApiQuery({ name: 'empresa_id', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de pasantías' })
  findAll(
    @Query('estado') estado?: EstadoPasantia,
    @Query('empresa_id') empresaId?: number,
  ) {
    return this.pasantiasService.findAll(estado, empresaId ? +empresaId : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Detalle de la pasantía' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pasantiasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva pasantía (estado inicial: PENDIENTE)' })
  @ApiResponse({ status: 201, description: 'Pasantía creada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  create(@Body() dto: CreatePasantiaDto) {
    return this.pasantiasService.create(dto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  updateEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstadoPasantiaDto) {
    return this.pasantiasService.updateEstado(id, dto);
  }
}
