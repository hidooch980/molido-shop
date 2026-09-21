import { BadRequestException } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { AccountsService } from './accounts.service';
import { Account, AccountType } from './entities/account.entity';

describe('JournalEntriesService', () => {
  const cash: Account = { id: '1', code: '1000', name: 'Cash', type: AccountType.ASSET, isActive: true };
  const revenue: Account = { id: '2', code: '4000', name: 'Revenue', type: AccountType.REVENUE, isActive: true };

  const makeService = () => {
    const entriesRepo: any = {
      create: (data: any) => data,
      save: (data: any) => Promise.resolve({ id: 'e1', ...data }),
      find: () => Promise.resolve([]),
    };
    const accountsService = {
      findOne: (id: string) => Promise.resolve(id === '1' ? cash : revenue),
    } as unknown as AccountsService;
    return new JournalEntriesService(entriesRepo, accountsService);
  };

  it('accepts a balanced entry', async () => {
    const service = makeService();
    const entry = await service.create({
      date: '2026-09-21',
      description: 'Cash sale',
      lines: [
        { accountId: '1', debit: 100, credit: 0 },
        { accountId: '2', debit: 0, credit: 100 },
      ],
    });
    expect(entry).toBeDefined();
  });

  it('rejects an unbalanced entry', async () => {
    const service = makeService();
    await expect(
      service.create({
        date: '2026-09-21',
        description: 'Broken entry',
        lines: [
          { accountId: '1', debit: 100, credit: 0 },
          { accountId: '2', debit: 0, credit: 90 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects a line with both debit and credit set', async () => {
    const service = makeService();
    await expect(
      service.create({
        date: '2026-09-21',
        description: 'Invalid line',
        lines: [
          { accountId: '1', debit: 100, credit: 100 },
          { accountId: '2', debit: 0, credit: 100 },
        ],
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
