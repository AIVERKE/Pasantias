import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('super_usuario')
export class SuperUsuario {
  @PrimaryColumn()
  id_superusuario: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_superusuario' })
  usuario: Usuario;
}
