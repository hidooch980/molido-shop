import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Lead } from './entities/lead.entity';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Lead])],
  controllers: [CustomersController, LeadsController],
  providers: [CustomersService, LeadsService],
})
export class CrmModule {}
