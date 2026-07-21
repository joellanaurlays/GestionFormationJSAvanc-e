import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  utilisateurId: string;

  @IsNotEmpty()
  @IsUUID()
  formationId: string;
}
