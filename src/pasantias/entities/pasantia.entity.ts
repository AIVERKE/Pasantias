import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Inscripcion } from '../../inscripciones/entities/inscripcion.entity';
import { Habilidad } from '../../catalogos/entities/habilidad.entity';

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

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.pasantia)
  inscripciones: Inscripcion[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  area: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  horario_laboral: string;

  @Column({ type: 'int', default: 0 })
  cupos_totales: number;

  @ManyToMany(() => Habilidad)
  @JoinTable({
    name: 'pasantia_habilidad',
    joinColumn: { name: 'id_pasantia', referencedColumnName: 'id_pasantia' },
    inverseJoinColumn: { name: 'id_habilidad', referencedColumnName: 'id_habilidad' },
  })
  habilidades: Habilidad[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
