import { IsNotEmpty, IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateExamenDto {
  @IsNotEmpty()
  @IsString()
  titreExamen: string;

  @IsOptional()
  @IsString()
  descExamen?: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsDateString()
  dateExamen: string;

  @IsNotEmpty()
  @IsUUID()
  formationId: string;
}