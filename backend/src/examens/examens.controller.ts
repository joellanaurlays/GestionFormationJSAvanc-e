import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ExamensService } from './examens.service';
import { CreateExamenDto } from './dto/create-examen.dto';
import { UpdateExamenDto } from './dto/update-examen.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('examens')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamensController {
  constructor(private readonly examensService: ExamensService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  create(@Body() createExamenDto: CreateExamenDto) {
    return this.examensService.create(createExamenDto);
  }

  @Get()
  findAll() {
    return this.examensService.findAll();
  }

  @Get('formation/:formationId')
  findByFormation(@Param('formationId') formationId: string) {
    return this.examensService.findByFormation(formationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examensService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  update(@Param('id') id: string, @Body() updateExamenDto: UpdateExamenDto) {
    return this.examensService.update(id, updateExamenDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.examensService.remove(id);
  }
}
