import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mencion } from '../../catalogos/entities/mencion.entity';
import { Habilidad } from '../../catalogos/entities/habilidad.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn()
  id_estudiante: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_estudiante' })
  usuario: Usuario;

  @ManyToOne(() => Mencion, (mencion) => mencion.estudiantes, { nullable: true })
  @JoinColumn({ name: 'id_mencion' })
  mencion: Mencion;

  @Column({ type: 'varchar', length: 150 })
  carrera: string;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  registro_universitario: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_foto_perfil: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_ci_anverso: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_ci_reverso: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url_matricula: string;

  @ManyToMany(() => Habilidad)
  @JoinTable({
    name: 'estudiante_habilidad',
    joinColumn: { name: 'id_estudiante', referencedColumnName: 'id_estudiante' },
    inverseJoinColumn: { name: 'id_habilidad', referencedColumnName: 'id_habilidad' },
  })
  habilidades: Habilidad[];
}
