import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Formation } from './entities/formation.entity';

@Injectable()
export class FormationsService {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
  ) {}

  async create(createFormationDto: any): Promise<Formation> {
    const formation = this.formationRepository.create(
      createFormationDto as DeepPartial<Formation>,
    );
    return await this.formationRepository.save(formation);
  }

  async findAll(): Promise<Formation[]> {
    return await this.formationRepository.find({
      relations: {
        formateur: true,
      },
    });
  }

  async findOne(id: string): Promise<Formation> {
    const formation = await this.formationRepository.findOne({
      where: { id },
      relations: {
        formateur: true,
        inscriptions: true,
      },
    });
    if (!formation) {
      throw new NotFoundException(`Formation avec ID ${id} non trouvée`);
    }
    return formation;
  }

  async update(id: string, updateFormationDto: any): Promise<Formation> {
    const formation = await this.findOne(id);
    Object.assign(formation, updateFormationDto);
    return await this.formationRepository.save(formation);
  }

  async remove(id: string): Promise<void> {
    const formation = await this.findOne(id);
    await this.formationRepository.remove(formation);
  }
}
