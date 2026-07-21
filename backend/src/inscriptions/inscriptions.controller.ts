import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { UpdateInscriptionDto } from './dto/update-inscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('inscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ENSEIGNANT)
  create(@Body() createInscriptionDto: CreateInscriptionDto) {
    return this.inscriptionsService.create(createInscriptionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  findAll() {
    return this.inscriptionsService.findAll();
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.inscriptionsService.findByUtilisateur(utilisateurId);
  }

  @Get('formation/:formationId')
  findByFormation(@Param('formationId') formationId: string) {
    return this.inscriptionsService.findByFormation(formationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscriptionsService.findOne(id);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  updateStatus(@Param('id') id: string, @Body('statut') statut: string) {
    return this.inscriptionsService.updateStatus(id, statut);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.inscriptionsService.remove(id);
  }
}
