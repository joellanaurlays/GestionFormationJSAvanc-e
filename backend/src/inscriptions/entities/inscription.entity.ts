import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Formation } from '../../formations/entities/formation.entity';

@Entity('inscriptions')
export class Inscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateInscription: Date;

  @Column({ default: 'en_attente' })
  statut: string;

  @ManyToOne(() => User, user => user.inscriptions)
  utilisateur: User;

  @Column()
  utilisateurId: string;

  @ManyToOne(() => Formation, formation => formation.inscriptions)
  formation: Formation;

  @Column()
  formationId: string;
}