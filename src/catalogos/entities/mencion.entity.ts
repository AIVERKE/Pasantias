import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from '../../usuarios/entities/estudiante.entity';

@Entity('mencion')
export class Mencion {
  @PrimaryGeneratedColumn()
  id_mencion: number;

  @Column({ type: 'varchar', length: 150 })
  nombre_mencion: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.mencion)
  estudiantes: Estudiante[];
}
