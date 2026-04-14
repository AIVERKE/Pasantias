import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas activas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  findAll() {
    return this.empresasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una empresa' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ status: 200, description: 'Detalle de la empresa' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateEmpresaDto) {
    return this.empresasService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una empresa' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmpresaDto) {
    return this.empresasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lógicamente una empresa (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada lógicamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.empresasService.remove(id);
  }
}
