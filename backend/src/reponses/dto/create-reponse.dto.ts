import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateReponseDto {
  @IsNotEmpty()
  @IsString()
  contenuRep: string;

  @IsOptional()
  @IsBoolean()
  estCorrecteRep?: boolean;

  @IsNotEmpty()
  @IsUUID()
  questionId: string;
}