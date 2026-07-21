import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Formation } from '../../formations/entities/formation.entity';
import { Question } from '../../questions/entities/question.entity';
import { Resultat } from '../../resultats/entities/resultat.entity';

@Entity('examens')
export class Examen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  titreExamen: string;

  @Column({ type: 'text', nullable: true })
  descExamen: string;

  @Column({ length: 100 })
  type: string;

  @Column({ type: 'date' })
  dateExamen: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Formation, formation => formation.examens)
  formation: Formation;

  @Column()
  formationId: string;

  @OneToMany(() => Question, question => question.examen)
  questions: Question[];

  @OneToMany(() => Resultat, resultat => resultat.examen)
  resultats: Resultat[];
}