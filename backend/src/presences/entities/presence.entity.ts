import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Formation } from '../../formations/entities/formation.entity';

@Entity('presences')
export class Presence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  datePresence: Date;

  @Column({ length: 100 })
  statut: string;

  @ManyToOne(() => User, user => user.presences)
  utilisateur: User;

  @Column()
  utilisateurId: string;

  @ManyToOne(() => Formation, formation => formation.presences)
  formation: Formation;

  @Column()
  formationId: string;
}