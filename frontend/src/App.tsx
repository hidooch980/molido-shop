import { useState } from 'react';
import { Account } from './api';
import { AccountsPanel } from './AccountsPanel';
import { JournalEntriesPanel } from './JournalEntriesPanel';
import { CrmPanel } from './CrmPanel';

type Module = 'accounting' | 'crm';

export function App() {
  const [module, setModule] = useState<Module>('accounting');
  const [accounts, setAccounts] = useState<Account[]>([]);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>مولیدو</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setModule('accounting')} disabled={module === 'accounting'}>
          حسابداری
        </button>
        <button onClick={() => setModule('crm')} disabled={module === 'crm'}>
          CRM
        </button>
      </nav>

      {module === 'accounting' && (
        <>
          <AccountsPanel onAccountsChanged={setAccounts} />
          <hr style={{ margin: '24px 0' }} />
          <JournalEntriesPanel accounts={accounts} />
        </>
      )}

      {module === 'crm' && <CrmPanel />}
    </main>
  );
}
