import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';

@Entity('hoja_vida')
export class HojaVida {
  @PrimaryGeneratedColumn()
  id_hoja_vida: number;

  @Column({ type: 'text' })
  resumen: string;

  @Column({ type: 'date' })
  fecha_actualizacion: Date;

  @OneToOne(() => Estudiante)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
