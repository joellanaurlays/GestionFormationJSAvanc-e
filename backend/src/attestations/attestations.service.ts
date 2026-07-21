import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attestation } from './entities/attestation.entity';
import { CreateAttestationDto } from './dto/create-attestation.dto';
import { UpdateAttestationDto } from './dto/update-attestation.dto';

@Injectable()
export class AttestationsService {
  constructor(
    @InjectRepository(Attestation)
    private attestationRepository: Repository<Attestation>,
  ) {}

  async create(createAttestationDto: CreateAttestationDto): Promise<Attestation> {
    // Vérifier si l'attestation existe déjà
    const existing = await this.attestationRepository.findOne({
      where: {
        utilisateurId: createAttestationDto.utilisateurId,
        formationId: createAttestationDto.formationId,
      },
    });

    if (existing) {
      throw new ConflictException('Une attestation existe déjà pour cette formation');
    }

    const attestation = this.attestationRepository.create(createAttestationDto);
    return await this.attestationRepository.save(attestation);
  }

  async findAll(): Promise<Attestation[]> {
    return await this.attestationRepository.find({
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
  }

  async findOne(id: string): Promise<Attestation> {
    const attestation = await this.attestationRepository.findOne({
      where: { id },
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
    if (!attestation) {
      throw new NotFoundException(`Attestation avec ID ${id} non trouvée`);
    }
    return attestation;
  }

  async findByUtilisateur(utilisateurId: string): Promise<Attestation[]> {
    return await this.attestationRepository.find({
      where: { utilisateurId },
      relations: {
        formation: true,
      },
    });
  }

  async findByFormation(formationId: string): Promise<Attestation[]> {
    return await this.attestationRepository.find({
      where: { formationId },
      relations: {
        utilisateur: true,
      },
    });
  }

  async update(id: string, updateAttestationDto: UpdateAttestationDto): Promise<Attestation> {
    const attestation = await this.findOne(id);
    Object.assign(attestation, updateAttestationDto);
    return await this.attestationRepository.save(attestation);
  }

  async remove(id: string): Promise<void> {
    const attestation = await this.findOne(id);
    await this.attestationRepository.remove(attestation);
  }

  async generateAttestation(utilisateurId: string, formationId: string): Promise<Attestation> {
    const createAttestationDto: CreateAttestationDto = {
      utilisateurId,
      formationId,
      dateDelivrance: new Date().toISOString(),
      typeAttestation: 'Attestation de formation',
    };
    return this.create(createAttestationDto);
  }
}