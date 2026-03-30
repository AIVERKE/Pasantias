import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pasantia } from './pasantia.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('comentario')
export class Comentario {
  @PrimaryGeneratedColumn()
  id_comentario: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'int', default: 5 }) // valoracion 1-5
  valoracion: number;

  @ManyToOne(() => Pasantia)
  @JoinColumn({ name: 'id_pasantia' })
  pasantia: Pasantia;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
