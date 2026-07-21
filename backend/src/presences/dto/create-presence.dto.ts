import { IsNotEmpty, IsDateString, IsString, IsUUID } from 'class-validator';

export class CreatePresenceDto {
  @IsNotEmpty()
  @IsDateString()
  datePresence: string;

  @IsNotEmpty()
  @IsString()
  statut: string;

  @IsNotEmpty()
  @IsUUID()
  utilisateurId: string;

  @IsNotEmpty()
  @IsUUID()
  formationId: string;
}
