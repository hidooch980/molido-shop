export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  isActive: boolean;
}

export interface JournalLine {
  id: string;
  account: Account;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
}

export interface CreateJournalLineInput {
  accountId: string;
  debit: number;
  credit: number;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  listAccounts: () => request<Account[]>('/accounts'),
  createAccount: (input: { code: string; name: string; type: AccountType }) =>
    request<Account>('/accounts', { method: 'POST', body: JSON.stringify(input) }),
  listJournalEntries: () => request<JournalEntry[]>('/journal-entries'),
  createJournalEntry: (input: {
    date: string;
    description: string;
    lines: CreateJournalLineInput[];
  }) => request<JournalEntry>('/journal-entries', { method: 'POST', body: JSON.stringify(input) }),
};
