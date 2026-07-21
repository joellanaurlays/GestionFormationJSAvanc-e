import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AttestationsService } from './attestations.service';
import { CreateAttestationDto } from './dto/create-attestation.dto';
import { UpdateAttestationDto } from './dto/update-attestation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('attestations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttestationsController {
  constructor(private readonly attestationsService: AttestationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  create(@Body() createAttestationDto: CreateAttestationDto) {
    return this.attestationsService.create(createAttestationDto);
  }

  @Post('generate')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  generateAttestation(
    @Query('utilisateurId') utilisateurId: string,
    @Query('formationId') formationId: string,
  ) {
    return this.attestationsService.generateAttestation(utilisateurId, formationId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  findAll() {
    return this.attestationsService.findAll();
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.attestationsService.findByUtilisateur(utilisateurId);
  }

  @Get('formation/:formationId')
  findByFormation(@Param('formationId') formationId: string) {
    return this.attestationsService.findByFormation(formationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attestationsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAttestationDto: UpdateAttestationDto) {
    return this.attestationsService.update(id, updateAttestationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.attestationsService.remove(id);
  }
}