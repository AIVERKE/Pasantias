import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Pasantia } from '../../pasantias/entities/pasantia.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  rubro: string;

  @Column({ type: 'text' })
  direccion: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @OneToMany(() => Pasantia, (pasantia) => pasantia.empresa)
  pasantias: Pasantia[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
