import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@ApiTags('Actividades')
@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Get('pasantia/:id')
  @ApiOperation({ summary: 'Listar actividades de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Lista de actividades' })
  findByPasantia(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findByPasantia(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una actividad para una pasantía (estado inicial: CON_CUPOS)' })
  @ApiResponse({ status: 201, description: 'Actividad creada' })
  @ApiResponse({ status: 404, description: 'Pasantía no encontrada' })
  create(@Body() dto: CreateActividadDto) {
    return this.actividadesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  @ApiParam({ name: 'id', description: 'ID de la actividad' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActividadDto) {
    return this.actividadesService.update(id, dto);
  }
}
