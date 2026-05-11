import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(carrera?: string, semestre?: number): Promise<Estudiante[]> {
    const where: any = {};
    if (carrera) where.carrera = carrera;
    if (semestre) where.semestre = semestre;
    return this.estudianteRepository.find({ where, relations: ['usuario'] });
  }

  async findOne(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: id },
      relations: ['usuario'],
    });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    return estudiante;
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.id_usuario} no encontrado`);
    const estudiante = this.estudianteRepository.create({
      id_estudiante: dto.id_usuario,
      carrera: dto.carrera,
      semestre: dto.semestre,
      registro_universitario: dto.registro_universitario,
    });
    return this.estudianteRepository.save(estudiante);
  }

  async update(id: number, dto: UpdateEstudianteDto): Promise<Estudiante> {
    const estudiante = await this.findOne(id);
    if (dto.carrera !== undefined) estudiante.carrera = dto.carrera;
    if (dto.semestre !== undefined) estudiante.semestre = dto.semestre;
    return this.estudianteRepository.save(estudiante);
  }

  async getDashboardResumen(id_estudiante: number) {
    // 1. Obtener la inscripcion más reciente del estudiante
    const inscripcion = await this.dataSource.query(
      `SELECT i.id_inscripcion, i.estado, i.estado_ejecucion, p.titulo as pasantia_titulo, e.nombre as empresa_nombre
       FROM inscripcion i
       JOIN pasantia p ON p.id_pasantia = i.id_pasantia
       JOIN empresa e ON e.id_empresa = p.id_empresa
       WHERE i.id_estudiante = $1
       ORDER BY i.created_at DESC LIMIT 1`,
       [id_estudiante]
    );
  
    let resumen: any = {
      pasantia: null,
      tareas: { completadas: 0, totales: 0 },
      evaluacion: null
    };
  
    if (inscripcion.length > 0) {
      const insc = inscripcion[0];
      
      resumen.pasantia = {
        estado: insc.estado_ejecucion || insc.estado, 
        titulo: insc.pasantia_titulo,
        empresa: insc.empresa_nombre
      };
  
      // Tareas
      const tareas = await this.dataSource.query(
        `SELECT COUNT(*) as totales, 
                SUM(CASE WHEN estado_semaforo = 'completada' THEN 1 ELSE 0 END) as completadas
         FROM actividad_bitacora
         WHERE id_inscripcion = $1`,
        [insc.id_inscripcion]
      );
      if (tareas.length > 0) {
        resumen.tareas.totales = parseInt(tareas[0].totales) || 0;
        resumen.tareas.completadas = parseInt(tareas[0].completadas) || 0;
      }
  
      // Evaluación (Promedio simple de 4 criterios)
      const evaluacion = await this.dataSource.query(
        `SELECT (crit_conocimiento_tecnico + crit_responsabilidad + crit_trabajo_equipo + crit_iniciativa) / 4.0 as promedio
         FROM evaluacion_final
         WHERE id_inscripcion = $1`,
        [insc.id_inscripcion]
      );
      if (evaluacion.length > 0 && evaluacion[0].promedio !== null) {
        resumen.evaluacion = parseFloat(evaluacion[0].promedio).toFixed(1);
      }
    }
  
    return resumen;
  }
}
