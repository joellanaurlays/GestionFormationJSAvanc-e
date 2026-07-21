import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ReponsesService } from './reponses.service';
import { CreateReponseDto } from './dto/create-reponse.dto';
import { UpdateReponseDto } from './dto/update-reponse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reponses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReponsesController {
  constructor(private readonly reponsesService: ReponsesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  create(@Body() createReponseDto: CreateReponseDto) {
    return this.reponsesService.create(createReponseDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  findAll() {
    return this.reponsesService.findAll();
  }

  @Get('question/:questionId')
  findByQuestion(@Param('questionId') questionId: string) {
    return this.reponsesService.findByQuestion(questionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reponsesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.FORMATEUR)
  update(@Param('id') id: string, @Body() updateReponseDto: UpdateReponseDto) {
    return this.reponsesService.update(id, updateReponseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.reponsesService.remove(id);
  }
}