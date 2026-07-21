import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Inscription } from '../../inscriptions/entities/inscription.entity';
import { Examen } from '../../examens/entities/examen.entity';
import { Presence } from '../../presences/entities/presence.entity';
import { Attestation } from '../../attestations/entities/attestation.entity';

@Entity('formations')
export class Formation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ length: 255, nullable: true })
  lieu: string;

  @Column({ default: 'planifiée' })
  statut: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.formations, { eager: true })
  formateur: User;

  @Column({ nullable: true })
  formateurId: string;

  @OneToMany(() => Inscription, inscription => inscription.formation)
  inscriptions: Inscription[];

  @OneToMany(() => Examen, examen => examen.formation)
  examens: Examen[];

  @OneToMany(() => Presence, presence => presence.formation)
  presences: Presence[];

  @OneToMany(() => Attestation, attestation => attestation.formation)
  attestations: Attestation[];
}