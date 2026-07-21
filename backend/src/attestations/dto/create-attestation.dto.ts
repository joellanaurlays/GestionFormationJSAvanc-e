import { IsNotEmpty, IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateAttestationDto {
  @IsNotEmpty()
  @IsDateString()
  dateDelivrance: string;

  @IsNotEmpty()
  @IsString()
  typeAttestation: string;

  @IsNotEmpty()
  @IsUUID()
  utilisateurId: string;

  @IsNotEmpty()
  @IsUUID()
  formationId: string;
}