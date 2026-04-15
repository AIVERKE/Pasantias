import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('informacion_empresa')
export class InformacionEmpresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  mision: string;

  @Column({ type: 'varchar' })
  vision: string;

  @Column({ type: 'varchar' })
  objetivos: string;

  @Column({ name: 'quienes_somos', type: 'varchar' })
  quienes_somos: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date;
}
