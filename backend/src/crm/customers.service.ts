import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
  ) {}

  create(dto: CreateCustomerDto): Promise<Customer> {
    return this.customers.save(this.customers.create(dto));
  }

  findAll(): Promise<Customer[]> {
    return this.customers.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customers.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return customer;
  }
}
