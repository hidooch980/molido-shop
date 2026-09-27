import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateLeadDto {
  @IsUUID()
  customerId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;
}
