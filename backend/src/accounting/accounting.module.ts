import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { JournalEntry, JournalLine } from './entities/journal-entry.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalLine])],
  controllers: [AccountsController, JournalEntriesController],
  providers: [AccountsService, JournalEntriesService],
})
export class AccountingModule {}
