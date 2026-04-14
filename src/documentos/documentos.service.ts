import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HojaVida } from './entities/hoja-vida.entity';
import { Habilidad } from './entities/habilidad.entity';
import { Bitacora } from './entities/bitacora.entity';
import { InformeFinal } from './entities/informe-final.entity';
import { Estudiante } from '../usuarios/entities/estudiante.entity';
import { Inscripcion } from '../pasantias/entities/inscripcion.entity';
import { Actividad } from '../pasantias/entities/actividad.entity';
import { JefePasantes } from '../usuarios/entities/jefe-pasantes.entity';
import { HojaVidaDto } from './dto/hoja-vida.dto';
import { CreateHabilidadDto } from './dto/create-habilidad.dto';
import { CreateBitacoraDto } from './dto/create-bitacora.dto';
import { EvaluarBitacoraDto } from './dto/evaluar-bitacora.dto';
import { CreateInformeFinalDto } from './dto/create-informe-final.dto';
import { CalificarInformeDto } from './dto/calificar-informe.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectRepository(HojaVida)
    private readonly hojaVidaRepository: Repository<HojaVida>,
    @InjectRepository(Habilidad)
    private readonly habilidadRepository: Repository<Habilidad>,
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
    @InjectRepository(InformeFinal)
    private readonly informeRepository: Repository<InformeFinal>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(JefePasantes)
    private readonly jefeRepository: Repository<JefePasantes>,
  ) {}

  // --- Hoja de Vida ---

  async getMiHojaVida(estudianteId: number): Promise<HojaVida> {
    const hv = await this.hojaVidaRepository.findOne({
      where: { estudiante: { id_estudiante: estudianteId } },
      relations: ['habilidades', 'estudiante'],
    });
    if (!hv) throw new NotFoundException(`Hoja de vida del estudiante ${estudianteId} no encontrada`);
    return hv;
  }

  async upsertHojaVida(dto: HojaVidaDto): Promise<HojaVida> {
    const estudiante = await this.estudianteRepository.findOne({ where: { id_estudiante: dto.id_estudiante } });
    if (!estudiante) throw new NotFoundException(`Estudiante con ID ${dto.id_estudiante} no encontrado`);
    let hv = await this.hojaVidaRepository.findOne({
      where: { estudiante: { id_estudiante: dto.id_estudiante } },
    });
    if (hv) {
      hv.resumen = dto.resumen;
      hv.fecha_actualizacion = new Date();
    } else {
      hv = this.hojaVidaRepository.create({
        resumen: dto.resumen,
        fecha_actualizacion: new Date(),
        estudiante,
      });
    }
    return this.hojaVidaRepository.save(hv);
  }

  // --- Habilidades ---

  async createHabilidad(dto: CreateHabilidadDto): Promise<Habilidad> {
    const hv = await this.hojaVidaRepository.findOne({ where: { id_hoja_vida: dto.id_hoja_vida } });
    if (!hv) throw new NotFoundException(`Hoja de vida con ID ${dto.id_hoja_vida} no encontrada`);
    const habilidad = this.habilidadRepository.create({
      nombre: dto.nombre,
      nivel: dto.nivel,
      hoja_vida: hv,
    });
    return this.habilidadRepository.save(habilidad);
  }

  async deleteHabilidad(id: number): Promise<{ message: string }> {
    const habilidad = await this.habilidadRepository.findOne({ where: { id_habilidad: id } });
    if (!habilidad) throw new NotFoundException(`Habilidad con ID ${id} no encontrada`);
    await this.habilidadRepository.remove(habilidad);
    return { message: `Habilidad con ID ${id} eliminada` };
  }

  // --- Bitácoras ---

  findBitacorasByInscripcion(inscripcionId: number): Promise<Bitacora[]> {
    return this.bitacoraRepository.find({
      where: { inscripcion: { id_inscripcion: inscripcionId } },
      relations: ['actividad'],
      order: { fecha: 'DESC' },
    });
  }

  async createBitacora(dto: CreateBitacoraDto): Promise<Bitacora> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: dto.id_inscripcion } });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${dto.id_inscripcion} no encontrada`);
    const actividad = await this.actividadRepository.findOne({ where: { id_actividad: dto.id_actividad } });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${dto.id_actividad} no encontrada`);
    const bitacora = this.bitacoraRepository.create({
      contenido: dto.contenido,
      fecha: new Date(dto.fecha),
      porcentaje: 0,
      inscripcion,
      actividad,
    });
    return this.bitacoraRepository.save(bitacora);
  }

  async evaluarBitacora(id: number, dto: EvaluarBitacoraDto): Promise<Bitacora> {
    const bitacora = await this.bitacoraRepository.findOne({ where: { id_bitacora: id } });
    if (!bitacora) throw new NotFoundException(`Bitácora con ID ${id} no encontrada`);
    if (dto.porcentaje < 0 || dto.porcentaje > 100) {
      throw new BadRequestException('El porcentaje debe estar entre 0 y 100');
    }
    bitacora.porcentaje = dto.porcentaje;
    if (dto.observaciones !== undefined) bitacora.observaciones = dto.observaciones;
    return this.bitacoraRepository.save(bitacora);
  }

  // --- Informes Finales ---

  async findInformeByInscripcion(inscripcionId: number): Promise<InformeFinal> {
    const informe = await this.informeRepository.findOne({
      where: { inscripcion: { id_inscripcion: inscripcionId } },
      relations: ['inscripcion', 'jefe'],
    });
    if (!informe) throw new NotFoundException(`Informe de la inscripción ${inscripcionId} no encontrado`);
    return informe;
  }

  async createInforme(dto: CreateInformeFinalDto): Promise<InformeFinal> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id_inscripcion: dto.id_inscripcion } });
    if (!inscripcion) throw new NotFoundException(`Inscripción con ID ${dto.id_inscripcion} no encontrada`);
    const jefe = await this.jefeRepository.findOne({ where: { id_jefe: dto.id_jefe } });
    if (!jefe) throw new NotFoundException(`Jefe de pasantes con ID ${dto.id_jefe} no encontrado`);
    const informe = this.informeRepository.create({
      contenido: dto.contenido,
      fecha_entrega: new Date(),
      inscripcion,
      jefe,
    });
    return this.informeRepository.save(informe);
  }

  async calificarInforme(id: number, dto: CalificarInformeDto): Promise<InformeFinal> {
    const informe = await this.informeRepository.findOne({ where: { id_informe: id } });
    if (!informe) throw new NotFoundException(`Informe con ID ${id} no encontrado`);
    if (dto.nota_final < 0 || dto.nota_final > 20) {
      throw new BadRequestException('La nota final debe estar entre 0.00 y 20.00');
    }
    informe.nota_final = dto.nota_final;
    return this.informeRepository.save(informe);
  }
}
