import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { PresencesService } from './presences.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('presences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresencesController {
  constructor(private readonly presencesService: PresencesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  create(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presencesService.create(createPresenceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  findAll() {
    return this.presencesService.findAll();
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.presencesService.findByUtilisateur(utilisateurId);
  }

  @Get('formation/:formationId')
  findByFormation(@Param('formationId') formationId: string) {
    return this.presencesService.findByFormation(formationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presencesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  update(@Param('id') id: string, @Body() updatePresenceDto: UpdatePresenceDto) {
    return this.presencesService.update(id, updatePresenceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.presencesService.remove(id);
  }
}