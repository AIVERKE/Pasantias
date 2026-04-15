import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { InformacionEmpresaService } from './informacion-empresa.service';
import { CreateInformacionEmpresaDto } from './dto/create-informacion-empresa.dto';
import { UpdateInformacionEmpresaDto } from './dto/update-informacion-empresa.dto';

@ApiTags('Información Institucional')
@Controller('informacion-empresa')
export class InformacionEmpresaController {
  constructor(private readonly service: InformacionEmpresaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener la información institucional de la empresa' })
  @ApiOkResponse({ description: 'Lista de los datos de información empresa recuperada exitosamente' })
  @ApiInternalServerErrorResponse({ description: 'Error interno o de base de datos' })
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear el registro inicial de información institucional' })
  @ApiResponse({ status: 201, description: 'Información creada exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos (validación)' })
  @ApiInternalServerErrorResponse({ description: 'Error interno o de base de datos' })
  create(@Body() dto: CreateInformacionEmpresaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar campos específicos de forma parcial' })
  @ApiParam({ name: 'id', description: 'ID de la información' })
  @ApiOkResponse({ description: 'Información actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'ID de información no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos (validación)' })
  @ApiInternalServerErrorResponse({ description: 'Error interno o de base de datos' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInformacionEmpresaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Implementar eliminación lógica (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'ID de la información' })
  @ApiOkResponse({ description: 'Información eliminada lógicamente' })
  @ApiResponse({ status: 404, description: 'ID de información no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno o de base de datos' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
