import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
