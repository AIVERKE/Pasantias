import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';
import { Inscripcion } from '../../pasantias/entities/inscripcion.entity';
import { Actividad } from '../../pasantias/entities/actividad.entity';

@Entity('bitacora')
export class Bitacora {
  @PrimaryGeneratedColumn()
  id_bitacora: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'int', default: 0 }) // porcentaje 0-100
  porcentaje: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => JefePasantes)
  @JoinColumn({ name: 'id_jefe' })
  jefe: JefePasantes;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;

  @ManyToOne(() => Actividad)
  @JoinColumn({ name: 'id_actividad' })
  actividad: Actividad;
}
