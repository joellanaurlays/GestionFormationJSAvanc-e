import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ResultatsService } from './resultats.service';
import { CreateResultatDto } from './dto/create-resultat.dto';
import { UpdateResultatDto } from './dto/update-resultat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('resultats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultatsController {
  constructor(private readonly resultatsService: ResultatsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  create(@Body() createResultatDto: CreateResultatDto) {
    return this.resultatsService.create(createResultatDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  findAll() {
    return this.resultatsService.findAll();
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.resultatsService.findByUtilisateur(utilisateurId);
  }

  @Get('examen/:examenId')
  findByExamen(@Param('examenId') examenId: string) {
    return this.resultatsService.findByExamen(examenId);
  }

  @Get('examen/:examenId/moyenne')
  getAverage(@Param('examenId') examenId: string) {
    return this.resultatsService.getAverageByExamen(examenId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultatsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  update(@Param('id') id: string, @Body() updateResultatDto: UpdateResultatDto) {
    return this.resultatsService.update(id, updateResultatDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.resultatsService.remove(id);
  }
}