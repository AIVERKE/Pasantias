import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HojaVida } from './hoja-vida.entity';

export enum NivelHabilidad {
  BASICO = 'basico',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  EXPERTO = 'experto',
}

@Entity('habilidad')
export class Habilidad {
  @PrimaryGeneratedColumn()
  id_habilidad: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: NivelHabilidad,
    default: NivelHabilidad.BASICO,
  })
  nivel: NivelHabilidad;

  @ManyToOne(() => HojaVida)
  @JoinColumn({ name: 'id_hoja_vida' })
  hoja_vida: HojaVida;
}
