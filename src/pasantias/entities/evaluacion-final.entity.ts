import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Entity('evaluacion_final')
export class EvaluacionFinal {
  @PrimaryGeneratedColumn()
  id_evaluacion: number;

  @Column({ type: 'int' })
  crit_conocimiento_tecnico: number;

  @Column({ type: 'int' })
  crit_responsabilidad: number;

  @Column({ type: 'int' })
  crit_trabajo_equipo: number;

  @Column({ type: 'int' })
  crit_iniciativa: number;

  @Column({ type: 'text' })
  evaluacion_cualitativa: string;

  @Column({ type: 'text', nullable: true })
  comentario_estudiante: string;

  @Column({ type: 'int', nullable: true })
  valoracion_estrellas: number;

  @OneToOne(() => Inscripcion)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
