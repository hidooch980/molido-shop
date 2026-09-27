import { IsEnum } from 'class-validator';
import { LeadStage } from '../entities/lead.entity';

export class UpdateLeadStageDto {
  @IsEnum(LeadStage)
  stage: LeadStage;
}
