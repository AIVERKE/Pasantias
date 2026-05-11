import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';

export enum EstadoSemaforo {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en_curso',
  COMPLETADA = 'completada',
  NO_COMPLETADA = 'no_completada',
}

@Entity('actividad_bitacora')
export class Actividad {
  @PrimaryGeneratedColumn()
  id_actividad: number;

  @Column({ type: 'varchar', length: 255 })
  titulo_actividad: string;

  @Column({ type: 'text' })
  descripcion_actividad: string;

  @Column({ type: 'timestamp' })
  fecha_asignacion: Date;

  @Column({
    type: 'enum',
    enum: EstadoSemaforo,
    default: EstadoSemaforo.PENDIENTE,
  })
  estado_semaforo: EstadoSemaforo;

  @Column({ type: 'int', nullable: true })
  nota_actividad: number;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;

  @ManyToOne(() => JefePasantes)
  @JoinColumn({ name: 'id_jefe_asignador' })
  jefe_asignador: JefePasantes;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
