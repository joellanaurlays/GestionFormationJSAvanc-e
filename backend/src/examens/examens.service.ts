import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examen } from './entities/examen.entity';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';

@Injectable()
export class ExamensService {
  constructor(
    @InjectRepository(Examen)
    private examenRepository: Repository<Examen>,
  ) {}

  async create(createExamenDto: CreateExamenDto): Promise<Examen> {
    const examen = this.examenRepository.create(createExamenDto);
    return await this.examenRepository.save(examen);
  }

  async findAll(): Promise<Examen[]> {
    return await this.examenRepository.find({
      relations: {
        formation: true,
        questions: true,
        resultats: true,
      },
    });
  }

  async findOne(id: string): Promise<Examen> {
    const examen = await this.examenRepository.findOne({
      where: { id },
      relations: {
        formation: true,
        questions: {
          reponses: true,
        },
        resultats: true,
      },
    });
    if (!examen) {
      throw new NotFoundException(`Examen avec ID ${id} non trouvé`);
    }
    return examen;
  }

  async findByFormation(formationId: string): Promise<Examen[]> {
    return await this.examenRepository.find({
      where: { formationId },
      relations: {
        questions: true,
        resultats: true,
      },
    });
  }

  async update(id: string, updateExamenDto: UpdateExamenDto): Promise<Examen> {
    const examen = await this.findOne(id);
    Object.assign(examen, updateExamenDto);
    return await this.examenRepository.save(examen);
  }

  async remove(id: string): Promise<void> {
    const examen = await this.findOne(id);
    await this.examenRepository.remove(examen);
  }
}
