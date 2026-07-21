import { PartialType } from '@nestjs/mapped-types';
import { CreateAttestationDto } from './create-attestation.dto';

export class UpdateAttestationDto extends PartialType(CreateAttestationDto) {}