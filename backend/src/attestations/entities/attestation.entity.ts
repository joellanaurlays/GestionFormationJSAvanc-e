import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Formation } from '../../formations/entities/formation.entity';

@Entity('attestations')
export class Attestation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  dateDelivrance: Date;

  @Column({ length: 100 })
  typeAttestation: string;

  @ManyToOne(() => User, user => user.attestations)
  utilisateur: User;

  @Column()
  utilisateurId: string;

  @ManyToOne(() => Formation, formation => formation.attestations)
  formation: Formation;

  @Column()
  formationId: string;
}