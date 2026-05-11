import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('habilidad')
export class Habilidad {
  @PrimaryGeneratedColumn()
  id_habilidad: number;

  @Column({ type: 'varchar', length: 100 })
  categoria_habilidad: string;

  @Column({ type: 'varchar', length: 150 })
  nombre_habilidad: string;
}
