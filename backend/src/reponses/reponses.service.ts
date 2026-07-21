import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reponse } from './entities/reponse.entity';
import { CreateReponseDto } from './dto/create-reponse.dto';
import { UpdateReponseDto } from './dto/update-reponse.dto';

@Injectable()
export class ReponsesService {
  constructor(
    @InjectRepository(Reponse)
    private reponseRepository: Repository<Reponse>,
  ) {}

  async create(createReponseDto: CreateReponseDto): Promise<Reponse> {
    const reponse = this.reponseRepository.create(createReponseDto);
    return await this.reponseRepository.save(reponse);
  }

  async findAll(): Promise<Reponse[]> {
    return await this.reponseRepository.find({
      relations: {
        question: true,
      },
    });
  }

  async findOne(id: string): Promise<Reponse> {
    const reponse = await this.reponseRepository.findOne({
      where: { id },
      relations: {
        question: true,
      },
    });
    if (!reponse) {
      throw new NotFoundException(`Réponse avec ID ${id} non trouvée`);
    }
    return reponse;
  }

  async findByQuestion(questionId: string): Promise<Reponse[]> {
    return await this.reponseRepository.find({
      where: { questionId },
    });
  }

  async update(id: string, updateReponseDto: UpdateReponseDto): Promise<Reponse> {
    const reponse = await this.findOne(id);
    Object.assign(reponse, updateReponseDto);
    return await this.reponseRepository.save(reponse);
  }

  async remove(id: string): Promise<void> {
    const reponse = await this.findOne(id);
    await this.reponseRepository.remove(reponse);
  }
}