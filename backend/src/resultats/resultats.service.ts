import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resultat } from './entities/resultat.entity';
import { CreateResultatDto } from './dto/create-resultat.dto';
import { UpdateResultatDto } from './dto/update-resultat.dto';

@Injectable()
export class ResultatsService {
  constructor(
    @InjectRepository(Resultat)
    private resultatRepository: Repository<Resultat>,
  ) {}

  async create(createResultatDto: CreateResultatDto): Promise<Resultat> {
    // Vérifier si le résultat existe déjà
    const existing = await this.resultatRepository.findOne({
      where: {
        utilisateurId: createResultatDto.utilisateurId,
        examenId: createResultatDto.examenId,
      },
    });

    if (existing) {
      throw new ConflictException('Un résultat existe déjà pour cet examen');
    }

    const resultat = this.resultatRepository.create(createResultatDto);
    return await this.resultatRepository.save(resultat);
  }

  async findAll(): Promise<Resultat[]> {
    return await this.resultatRepository.find({
      relations: {
        utilisateur: true,
        examen: true,
      },
    });
  }

  async findOne(id: string): Promise<Resultat> {
    const resultat = await this.resultatRepository.findOne({
      where: { id },
      relations: {
        utilisateur: true,
        examen: true,
      },
    });
    if (!resultat) {
      throw new NotFoundException(`Résultat avec ID ${id} non trouvé`);
    }
    return resultat;
  }

  async findByUtilisateur(utilisateurId: string): Promise<Resultat[]> {
    return await this.resultatRepository.find({
      where: { utilisateurId },
      relations: {
        examen: {
          formation: true,
        },
      },
    });
  }

  async findByExamen(examenId: string): Promise<Resultat[]> {
    return await this.resultatRepository.find({
      where: { examenId },
      relations: {
        utilisateur: true,
      },
    });
  }

  async update(id: string, updateResultatDto: UpdateResultatDto): Promise<Resultat> {
    const resultat = await this.findOne(id);
    Object.assign(resultat, updateResultatDto);
    return await this.resultatRepository.save(resultat);
  }

  async remove(id: string): Promise<void> {
    const resultat = await this.findOne(id);
    await this.resultatRepository.remove(resultat);
  }

  async getAverageByExamen(examenId: string): Promise<number> {
    const resultats = await this.resultatRepository.find({
      where: { examenId },
      select: ['note'],
    });
    
    if (resultats.length === 0) return 0;
    
    const sum = resultats.reduce((acc, curr) => acc + curr.note, 0);
    return sum / resultats.length;
  }
}
