import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence } from './entities/presence.entity';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';

@Injectable()
export class PresencesService {
  constructor(
    @InjectRepository(Presence)
    private presenceRepository: Repository<Presence>,
  ) {}

  async create(createPresenceDto: CreatePresenceDto): Promise<Presence> {
    // Vérifier si la présence existe déjà pour ce jour
    const existing = await this.presenceRepository.findOne({
      where: {
        utilisateurId: createPresenceDto.utilisateurId,
        formationId: createPresenceDto.formationId,
        datePresence: new Date(createPresenceDto.datePresence),
      },
    });

    if (existing) {
      throw new ConflictException('La présence existe déjà pour ce jour');
    }

    const presence = this.presenceRepository.create(createPresenceDto);
    return await this.presenceRepository.save(presence);
  }

  async findAll(): Promise<Presence[]> {
    return await this.presenceRepository.find({
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
  }

  async findOne(id: string): Promise<Presence> {
    const presence = await this.presenceRepository.findOne({
      where: { id },
      relations: {
        utilisateur: true,
        formation: true,
      },
    });
    if (!presence) {
      throw new NotFoundException(`Présence avec ID ${id} non trouvée`);
    }
    return presence;
  }

  async findByUtilisateur(utilisateurId: string): Promise<Presence[]> {
    return await this.presenceRepository.find({
      where: { utilisateurId },
      relations: {
        formation: true,
      },
    });
  }

  async findByFormation(formationId: string): Promise<Presence[]> {
    return await this.presenceRepository.find({
      where: { formationId },
      relations: {
        utilisateur: true,
      },
    });
  }

  async update(id: string, updatePresenceDto: UpdatePresenceDto): Promise<Presence> {
    const presence = await this.findOne(id);
    Object.assign(presence, updatePresenceDto);
    return await this.presenceRepository.save(presence);
  }

  async remove(id: string): Promise<void> {
    const presence = await this.findOne(id);
    await this.presenceRepository.remove(presence);
  }
}
