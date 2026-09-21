import { useEffect, useState } from 'react';
import { api, Account, CreateJournalLineInput, JournalEntry } from './api';

interface LineDraft {
  accountId: string;
  debit: string;
  credit: string;
}

const emptyLine = (): LineDraft => ({ accountId: '', debit: '', credit: '' });

export function JournalEntriesPanel({ accounts }: { accounts: Account[] }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<LineDraft[]>([emptyLine(), emptyLine()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.listJournalEntries().then(setEntries).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const balanced = totalDebit === totalCredit && totalDebit > 0;

  const updateLine = (index: number, patch: Partial<LineDraft>) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: CreateJournalLineInput[] = lines.map((l) => ({
        accountId: l.accountId,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      }));
      await api.createJournalEntry({ date, description, lines: payload });
      setDescription('');
      setLines([emptyLine(), emptyLine()]);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>سند حسابداری</h2>
      <form onSubmit={submit} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <input
            placeholder="شرح سند"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ flex: 1 }}
          />
        </div>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <select
              value={line.accountId}
              onChange={(e) => updateLine(i, { accountId: e.target.value })}
              required
            >
              <option value="">انتخاب حساب</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="بدهکار"
              value={line.debit}
              onChange={(e) => updateLine(i, { debit: e.target.value, credit: '' })}
              min={0}
            />
            <input
              type="number"
              placeholder="بستانکار"
              value={line.credit}
              onChange={(e) => updateLine(i, { credit: e.target.value, debit: '' })}
              min={0}
            />
          </div>
        ))}
        <button type="button" onClick={() => setLines((prev) => [...prev, emptyLine()])}>
          + ردیف جدید
        </button>
        <p>
          جمع بدهکار: {totalDebit} | جمع بستانکار: {totalCredit}{' '}
          <strong style={{ color: balanced ? 'green' : 'crimson' }}>
            {balanced ? 'موازنه شده' : 'موازنه نشده'}
          </strong>
        </p>
        <button type="submit" disabled={!balanced || loading}>
          ثبت سند
        </button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>تاریخ</th>
            <th>شرح</th>
            <th>ردیف‌ها</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.description}</td>
              <td>
                {entry.lines
                  .map((l) => `${l.account.name}: ${l.debit || `(${l.credit})`}`)
                  .join(' | ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
