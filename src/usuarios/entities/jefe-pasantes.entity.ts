import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';

@Entity('jefe_pasantes')
export class JefePasantes {
  @PrimaryColumn()
  id_jefe: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_jefe' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 150 })
  departamento: string;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
