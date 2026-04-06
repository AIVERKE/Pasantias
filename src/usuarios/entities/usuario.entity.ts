import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Tutor } from './tutor.entity';
import { Gerente } from './gerente.entity';
import { JefePasantes } from './jefe-pasantes.entity';
import { SuperUsuario } from './super-usuario.entity';

export enum TipoUsuario {
  ESTUDIANTE = 'estudiante',
  TUTOR = 'tutor',
  GERENTE = 'gerente',
  JEFE_PASANTES = 'jefe_pasantes',
  SUPER_USUARIO = 'super_usuario',
}

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.ESTUDIANTE,
  })
  tipo_usuario: TipoUsuario;

  @Column({ type: 'int', default: 1 })
  nivel_acceso: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;

  // Relaciones inversas para perfiles
  @OneToOne(() => Estudiante, (estudiante) => estudiante.usuario)
  estudiante: Estudiante;

  @OneToOne(() => Tutor, (tutor) => tutor.usuario)
  tutor: Tutor;

  @OneToOne(() => Gerente, (gerente) => gerente.usuario)
  gerente: Gerente;

  @OneToOne(() => JefePasantes, (jefe) => jefe.usuario)
  jefe_pasantes: JefePasantes;

  @OneToOne(() => SuperUsuario, (super_usuario) => super_usuario.usuario)
  super_usuario: SuperUsuario;
}
