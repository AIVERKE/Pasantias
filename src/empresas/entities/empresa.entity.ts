import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
