import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { clsx } from '../utils/clsx';
import Layout from '../components/layout/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function AddLoan() {
  const { addLoan } = useApp();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [direction, setDirection] = useState('lent');
  const [form, setForm] = useState({
    personName: '',
    amount: '',
    date: today,
    dueDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.personName.trim()) e.personName = 'Person\'s name is required';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    addLoan({
      direction,
      personName: form.personName.trim(),
      amount: Number(form.amount),
      date: form.date,
      dueDate: form.dueDate || null,
      notes: form.notes.trim(),
    });

    navigate('/loans');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-navy-500 hover:bg-navy-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Record a Loan</h1>
          <p className="text-xs text-navy-400 mt-0.5">Track money lent or borrowed</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Direction toggle */}
        <div>
          <p className="text-sm font-medium text-navy-700 mb-2">Loan Direction</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection('lent')}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                direction === 'lent'
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-navy-200 bg-white text-navy-500 hover:border-navy-300',
              )}
            >
              <span className="text-2xl">🤝</span>
              <div className="text-center">
                <p className="text-sm font-semibold">I Lent Money</p>
                <p className="text-[10px] text-current opacity-70">They owe me</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDirection('borrowed')}
              className={clsx(
                'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                direction === 'borrowed'
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : 'border-navy-200 bg-white text-navy-500 hover:border-navy-300',
              )}
            >
              <span className="text-2xl">💸</span>
              <div className="text-center">
                <p className="text-sm font-semibold">I Borrowed</p>
                <p className="text-[10px] text-current opacity-70">I owe them</p>
              </div>
            </button>
          </div>
        </div>

        {/* Person name */}
        <Input
          label={direction === 'lent' ? 'Who did you lend to?' : 'Who did you borrow from?'}
          placeholder="e.g. Brian Mukasa"
          value={form.personName}
          onChange={e => set('personName', e.target.value)}
          error={errors.personName}
          autoComplete="off"
        />

        {/* Amount */}
        <Input
          label="Amount (UGX)"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          placeholder="0"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          error={errors.amount}
          leftIcon={<span className="text-xs font-semibold">USh</span>}
        />

        {/* Quick amounts */}
        <div className="flex flex-wrap gap-2 -mt-3">
          {[10000, 20000, 50000, 100000, 200000, 500000].map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => set('amount', String(amt))}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                Number(form.amount) === amt
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-navy-600 border-navy-200 hover:border-teal-400',
              )}
            >
              {amt >= 1000 ? `${amt / 1000}k` : amt}
            </button>
          ))}
        </div>

        {/* Date given/received */}
        <Input
          label={direction === 'lent' ? 'Date Given' : 'Date Received'}
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
          error={errors.date}
          max={today}
        />

        {/* Due date (optional) */}
        <Input
          label="Due Date (optional)"
          type="date"
          value={form.dueDate}
          onChange={e => set('dueDate', e.target.value)}
          hint="Leave blank if no specific due date"
        />

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-navy-700">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="e.g. For school fees, to be paid back end of month"
            rows={3}
            className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-navy-300 transition-all"
          />
        </div>

        {/* Submit */}
        <Button type="submit" fullWidth size="lg" className="mt-2">
          Record Loan
        </Button>
      </form>
    </Layout>
  );
}
