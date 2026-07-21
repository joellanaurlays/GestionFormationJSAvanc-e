import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateResultatDto {
  @IsNotEmpty()
  @IsNumber()
  note: number;

  @IsNotEmpty()
  @IsString()
  mention: string;

  @IsNotEmpty()
  @IsUUID()
  utilisateurId: string;

  @IsNotEmpty()
  @IsUUID()
  examenId: string;
}