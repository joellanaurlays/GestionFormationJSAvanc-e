import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Examen } from '../../examens/entities/examen.entity';

@Entity('resultats')
export class Resultat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  note: number;

  @Column({ length: 100 })
  mention: string;

  @ManyToOne(() => User, user => user.resultats)
  utilisateur: User;

  @Column()
  utilisateurId: string;

  @ManyToOne(() => Examen, examen => examen.resultats)
  examen: Examen;

  @Column()
  examenId: string;
}
