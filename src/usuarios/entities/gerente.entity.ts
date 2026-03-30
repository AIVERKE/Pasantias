import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('gerente')
export class Gerente {
  @PrimaryColumn()
  id_gerente: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_gerente' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 100 })
  cargo: string;

  @Column({ type: 'varchar', length: 150 })
  carrera: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
