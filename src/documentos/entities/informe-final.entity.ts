import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inscripcion } from '../../pasantias/entities/inscripcion.entity';
import { JefePasantes } from '../../usuarios/entities/jefe-pasantes.entity';

@Entity('informe_final')
export class InformeFinal {
  @PrimaryGeneratedColumn()
  id_informe: number;

  @Column({ type: 'date' })
  fecha_entrega: Date;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nota_final: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Inscripcion)
  @JoinColumn({ name: 'id_inscripcion' })
  inscripcion: Inscripcion;

  @ManyToOne(() => JefePasantes)
  @JoinColumn({ name: 'id_jefe' })
  jefe: JefePasantes;
}
