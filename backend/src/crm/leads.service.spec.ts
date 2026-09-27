import { BadRequestException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CustomersService } from './customers.service';
import { Lead, LeadStage } from './entities/lead.entity';
import { Customer } from './entities/customer.entity';

describe('LeadsService', () => {
  const customer: Customer = { id: 'c1', name: 'Acme', phone: '', email: '', company: '', leads: [] };

  const makeService = (existingLead: Partial<Lead>) => {
    const leadsRepo: any = {
      create: (data: any) => data,
      save: (data: any) => Promise.resolve({ id: 'l1', ...data }),
      findOne: () => Promise.resolve({ id: 'l1', ...existingLead }),
    };
    const customersService = {
      findOne: () => Promise.resolve(customer),
    } as unknown as CustomersService;
    return new LeadsService(leadsRepo, customersService);
  };

  it('allows moving a lead through non-terminal stages', async () => {
    const service = makeService({ stage: LeadStage.CONTACTED });
    const updated = await service.updateStage('l1', LeadStage.QUALIFIED);
    expect(updated.stage).toBe(LeadStage.QUALIFIED);
  });

  it('rejects moving a lead out of a terminal stage', async () => {
    const service = makeService({ stage: LeadStage.WON });
    await expect(service.updateStage('l1', LeadStage.CONTACTED)).rejects.toThrow(
      BadRequestException,
    );
  });
});
