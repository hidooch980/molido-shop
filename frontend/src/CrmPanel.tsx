import { useEffect, useState } from 'react';
import { api, Customer, Lead, LeadStage } from './api';

const STAGES: LeadStage[] = ['new', 'contacted', 'qualified', 'won', 'lost'];
const TERMINAL: LeadStage[] = ['won', 'lost'];

export function CrmPanel() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [leadCustomerId, setLeadCustomerId] = useState('');
  const [leadTitle, setLeadTitle] = useState('');
  const [leadValue, setLeadValue] = useState('');

  const load = async () => {
    const [c, l] = await Promise.all([api.listCustomers(), api.listLeads()]);
    setCustomers(c);
    setLeads(l);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createCustomer({ name: customerName, phone: customerPhone || undefined });
      setCustomerName('');
      setCustomerPhone('');
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const addLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createLead({
        customerId: leadCustomerId,
        title: leadTitle,
        value: Number(leadValue) || 0,
      });
      setLeadTitle('');
      setLeadValue('');
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const changeStage = async (id: string, stage: LeadStage) => {
    setError(null);
    try {
      await api.updateLeadStage(id, stage);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <section>
      <h2>CRM</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <h3>مشتریان</h3>
      <form onSubmit={addCustomer} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="نام مشتری" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        <input placeholder="تلفن" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        <button type="submit">افزودن مشتری</button>
      </form>
      <table style={{ marginBottom: 24 }}>
        <thead>
          <tr>
            <th>نام</th>
            <th>تلفن</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>سرنخ‌های فروش</h3>
      <form onSubmit={addLead} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={leadCustomerId} onChange={(e) => setLeadCustomerId(e.target.value)} required>
          <option value="">انتخاب مشتری</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input placeholder="عنوان فرصت" value={leadTitle} onChange={(e) => setLeadTitle(e.target.value)} required />
        <input type="number" placeholder="ارزش" value={leadValue} onChange={(e) => setLeadValue(e.target.value)} min={0} />
        <button type="submit">افزودن سرنخ</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>مشتری</th>
            <th>عنوان</th>
            <th>ارزش</th>
            <th>مرحله</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id}>
              <td>{l.customer.name}</td>
              <td>{l.title}</td>
              <td>{l.value}</td>
              <td>
                <select
                  value={l.stage}
                  disabled={TERMINAL.includes(l.stage)}
                  onChange={(e) => changeStage(l.id, e.target.value as LeadStage)}
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
