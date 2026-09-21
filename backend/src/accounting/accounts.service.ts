import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
  ) {}

  async create(dto: CreateAccountDto): Promise<Account> {
    const existing = await this.accounts.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Account code ${dto.code} already exists`);
    }
    return this.accounts.save(this.accounts.create(dto));
  }

  findAll(): Promise<Account[]> {
    return this.accounts.find({ order: { code: 'ASC' } });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accounts.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }
    return account;
  }
}
