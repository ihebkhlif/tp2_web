
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCvDto } from './create-cv.dto.js';

export class UpdateCvDto extends PartialType(
  OmitType(CreateCvDto, ['userId'] as const),
) {}
