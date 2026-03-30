import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn()
  id_estudiante: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_estudiante' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 150 })
  carrera: string;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  registro_universitario: string;
}
