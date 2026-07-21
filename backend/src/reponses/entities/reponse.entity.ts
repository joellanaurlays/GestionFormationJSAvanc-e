import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity('reponses')
export class Reponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  contenuRep: string;

  @Column({ default: false })
  estCorrecteRep: boolean;

  @ManyToOne(() => Question, question => question.reponses)
  question: Question;

  @Column()
  questionId: string;
}