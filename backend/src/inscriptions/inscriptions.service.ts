import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscription } from './entities/inscription.entity';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { UpdateInscriptionDto } from './dto/update-inscription.dto';

@Injectable()
export class InscriptionsService {
  constructor(
    @InjectRepository(Inscription)
    private inscriptionRepository: Repository<Inscription>,
  ) {}

  async create(createInscriptionDto: CreateInscriptionDto): Promise<Inscription> {
    // Vérifier si l'inscription existe déjà
    const existing = await this.inscriptionRepository.findOne({
      where: {
        utilisateurId: createInscriptionDto.utilisateurId,
        formationId: createInscriptionDto.formationId,
      },
    });

    if (existing) {
      throw new ConflictException('Cet utilisateur est déjà inscrit à cette formation');
    }

    const inscription = this.inscriptionRepository.create(createInscriptionDto);
    return await this.inscriptionRepository.save(inscription);
  }

  async findAll(): Promise<Inscription[]> {
    return await this.inscriptionRepository.find({
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
  }

  async findOne(id: string): Promise<Inscription> {
    const inscription = await this.inscriptionRepository.findOne({
      where: { id },
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
    if (!inscription) {
      throw new NotFoundException(`Inscription avec ID ${id} non trouvée`);
    }
    return inscription;
  }

  async findByUtilisateur(utilisateurId: string): Promise<Inscription[]> {
    return await this.inscriptionRepository.find({
      where: { utilisateurId },
      relations: {
        formation: true,
      },
    });
  }

  async findByFormation(formationId: string): Promise<Inscription[]> {
    return await this.inscriptionRepository.find({
      where: { formationId },
      relations: {
        utilisateur: true,
      },
    });
  }

  async updateStatus(id: string, statut: string): Promise<Inscription> {
    const inscription = await this.findOne(id);
    inscription.statut = statut;
    return await this.inscriptionRepository.save(inscription);
  }

  async remove(id: string): Promise<void> {
    const inscription = await this.findOne(id);
    await this.inscriptionRepository.remove(inscription);
  }
}
