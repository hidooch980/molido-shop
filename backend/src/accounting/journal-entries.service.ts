import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry, JournalLine } from './entities/journal-entry.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { AccountsService } from './accounts.service';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly entries: Repository<JournalEntry>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(dto: CreateJournalEntryDto): Promise<JournalEntry> {
    const totalDebit = dto.lines.reduce((sum, l) => sum + l.debit, 0);
    const totalCredit = dto.lines.reduce((sum, l) => sum + l.credit, 0);

    if (Math.round((totalDebit - totalCredit) * 100) !== 0) {
      throw new BadRequestException(
        `Journal entry is not balanced: debit=${totalDebit}, credit=${totalCredit}`,
      );
    }

    for (const line of dto.lines) {
      if (line.debit > 0 && line.credit > 0) {
        throw new BadRequestException(
          'A journal line cannot have both debit and credit amounts',
        );
      }
      if (line.debit === 0 && line.credit === 0) {
        throw new BadRequestException(
          'A journal line must have a non-zero debit or credit amount',
        );
      }
    }

    const lines: JournalLine[] = [];
    for (const line of dto.lines) {
      const account = await this.accountsService.findOne(line.accountId);
      const journalLine = new JournalLine();
      journalLine.account = account;
      journalLine.debit = line.debit;
      journalLine.credit = line.credit;
      lines.push(journalLine);
    }

    const entry = this.entries.create({
      date: dto.date,
      description: dto.description,
      lines,
    });
    return this.entries.save(entry);
  }

  findAll(): Promise<JournalEntry[]> {
    return this.entries.find({ order: { date: 'DESC' } });
  }

  async findOne(id: string): Promise<JournalEntry> {
    const entry = await this.entries.findOne({ where: { id } });
    if (!entry) {
      throw new NotFoundException(`Journal entry ${id} not found`);
    }
    return entry;
  }
}
