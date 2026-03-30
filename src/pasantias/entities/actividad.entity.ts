import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pasantia } from './pasantia.entity';

export enum EstadoActividad {
  CON_CUPOS = 'con_cupos',
  EN_DESARROLLO = 'en_desarrollo',
  CERRADA = 'cerrada',
}

@Entity('actividad')
export class Actividad {
  @PrimaryGeneratedColumn()
  id_actividad: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: EstadoActividad,
    default: EstadoActividad.CON_CUPOS,
  })
  estado: EstadoActividad;

  @ManyToOne(() => Pasantia)
  @JoinColumn({ name: 'id_pasantia' })
  pasantia: Pasantia;
}
