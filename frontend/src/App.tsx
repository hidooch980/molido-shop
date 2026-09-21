import { useState } from 'react';
import { Account } from './api';
import { AccountsPanel } from './AccountsPanel';
import { JournalEntriesPanel } from './JournalEntriesPanel';

export function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>مولیدو حساب</h1>
      <AccountsPanel onAccountsChanged={setAccounts} />
      <hr style={{ margin: '24px 0' }} />
      <JournalEntriesPanel accounts={accounts} />
    </main>
  );
}
