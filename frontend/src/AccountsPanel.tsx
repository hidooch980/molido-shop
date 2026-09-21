import { useEffect, useState } from 'react';
import { api, Account, AccountType } from './api';

const ACCOUNT_TYPES: AccountType[] = ['asset', 'liability', 'equity', 'revenue', 'expense'];

export function AccountsPanel({ onAccountsChanged }: { onAccountsChanged: (a: Account[]) => void }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('asset');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const list = await api.listAccounts();
    setAccounts(list);
    onAccountsChanged(list);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.createAccount({ code, name, type });
      setCode('');
      setName('');
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>سرفصل‌های حساب</h2>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="کد حساب" value={code} onChange={(e) => setCode(e.target.value)} required />
        <input placeholder="نام حساب" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
          {ACCOUNT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          افزودن
        </button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>کد</th>
            <th>نام</th>
            <th>نوع</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id}>
              <td>{a.code}</td>
              <td>{a.name}</td>
              <td>{a.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
