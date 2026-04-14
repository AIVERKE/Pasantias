import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@ApiTags('Comentarios')
@Controller()
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get('pasantias/:id/comentarios')
  @ApiOperation({ summary: 'Listar comentarios y valoraciones de una pasantía' })
  @ApiParam({ name: 'id', description: 'ID de la pasantía' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios' })
  findByPasantia(@Param('id', ParseIntPipe) id: number) {
    return this.comentariosService.findByPasantia(id);
  }

  @Post('comentarios')
  @ApiOperation({ summary: 'Publicar valoración sobre una pasantía finalizada' })
  @ApiResponse({ status: 201, description: 'Comentario creado' })
  @ApiResponse({ status: 400, description: 'Valoración fuera de rango 1-5' })
  @ApiResponse({ status: 404, description: 'Pasantía o usuario no encontrado' })
  create(@Body() dto: CreateComentarioDto) {
    return this.comentariosService.create(dto);
  }
}
