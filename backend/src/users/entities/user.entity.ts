import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Formation } from '../../formations/entities/formation.entity';
import { Inscription } from '../../inscriptions/entities/inscription.entity';
import { Presence } from '../../presences/entities/presence.entity';
import { Resultat } from '../../resultats/entities/resultat.entity';
import { Attestation } from '../../attestations/entities/attestation.entity';

export enum UserRole {
  ADMIN = 'administrateur',
  FORMATEUR = 'formateur',
  ENSEIGNANT = 'enseignant',
}

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100 })
  prenom: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  motDePass: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ENSEIGNANT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Formation, formation => formation.formateur)
  formations: Formation[];

  @OneToMany(() => Inscription, inscription => inscription.utilisateur)
  inscriptions: Inscription[];

  @OneToMany(() => Presence, presence => presence.utilisateur)
  presences: Presence[];

  @OneToMany(() => Resultat, resultat => resultat.utilisateur)
  resultats: Resultat[];

  @OneToMany(() => Attestation, attestation => attestation.utilisateur)
  attestations: Attestation[];
}