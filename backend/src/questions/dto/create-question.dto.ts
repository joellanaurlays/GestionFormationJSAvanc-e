import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  contenu: string;

  @IsOptional()
  @IsBoolean()
  estCorrecte?: boolean;

  @IsNotEmpty()
  @IsUUID()
  examenId: string;
}