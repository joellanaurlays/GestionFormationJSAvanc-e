import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Examen } from '../../examens/entities/examen.entity';
import { Reponse } from '../../reponses/entities/reponse.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ default: false })
  estCorrecte: boolean;

  @ManyToOne(() => Examen, examen => examen.questions)
  examen: Examen;

  @Column()
  examenId: string;

  @OneToMany(() => Reponse, reponse => reponse.question)
  reponses: Reponse[];
}