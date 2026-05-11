import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';

@Entity('historial_academico')
export class HistorialAcademico {
  @PrimaryGeneratedColumn()
  id_historial: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 150 })
  institucion: string;

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_certificado: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
