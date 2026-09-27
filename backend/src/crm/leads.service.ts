import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStage } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { CustomersService } from './customers.service';

const TERMINAL_STAGES = [LeadStage.WON, LeadStage.LOST];

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leads: Repository<Lead>,
    private readonly customersService: CustomersService,
  ) {}

  async create(dto: CreateLeadDto): Promise<Lead> {
    const customer = await this.customersService.findOne(dto.customerId);
    const lead = this.leads.create({
      customer,
      title: dto.title,
      value: dto.value ?? 0,
    });
    return this.leads.save(lead);
  }

  findAll(): Promise<Lead[]> {
    return this.leads.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leads.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }
    return lead;
  }

  async updateStage(id: string, stage: LeadStage): Promise<Lead> {
    const lead = await this.findOne(id);
    if (TERMINAL_STAGES.includes(lead.stage)) {
      throw new BadRequestException(
        `Lead is already in terminal stage "${lead.stage}" and cannot be moved to "${stage}"`,
      );
    }
    lead.stage = stage;
    return this.leads.save(lead);
  }
}
