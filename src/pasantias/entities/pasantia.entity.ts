import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';

export enum EstadoPasantia {
  PENDIENTE = 'pendiente',
  EN_CURSO = 'en_curso',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
}

@Entity('pasantia')
export class Pasantia {
  @PrimaryGeneratedColumn()
  id_pasantia: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @Column({
    type: 'enum',
    enum: EstadoPasantia,
    default: EstadoPasantia.PENDIENTE,
  })
  estado: EstadoPasantia;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
