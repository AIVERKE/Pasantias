import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';
import { Habilidad } from './habilidad.entity';

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

  @OneToMany(() => Habilidad, (habilidad) => habilidad.hoja_vida)
  habilidades: Habilidad[];
}
