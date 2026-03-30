import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('tutor')
export class Tutor {
  @PrimaryColumn()
  id_tutor: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_tutor' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 150 })
  especialidad: string;

  @Column({ type: 'varchar', length: 200 })
  institucion: string;
}
