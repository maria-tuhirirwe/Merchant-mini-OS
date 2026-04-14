import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import MobileMoneyForm from '../components/mobilemoney/MobileMoneyForm';
import { useApp } from '../context/AppContext';
import { clsx } from '../utils/clsx';

const typeOptions = [
  { label: 'Money In',  value: 'in'  },
  { label: 'Money Out', value: 'out' },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 200000];

// ─── Mode selector tiles ─────────────────────────────────────────────────────

function ModeTiles({ mode, onChange }) {
  const tiles = [
    {
      id: 'manual',
      icon: '✏️',
      label: 'Manual Entry',
      sub: 'Type it yourself',
    },
    {
      id: 'momo',
      icon: '📱',
      label: 'Mobile Money',
      sub: 'MTN · Airtel',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {tiles.map(t => {
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={clsx(
              'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-150 focus:outline-none',
              active
                ? 'border-teal-500 bg-teal-50/80 shadow-sm'
                : 'border-dashed border-navy-200 bg-white/60 opacity-70 hover:opacity-100 hover:border-navy-300',
            )}
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            <div className="text-center">
              <p className={clsx('text-sm font-semibold', active ? 'text-teal-700' : 'text-navy-600')}>
                {t.label}
              </p>
              <p className={clsx('text-[10px] mt-0.5', active ? 'text-teal-500' : 'text-navy-400')}>
                {t.sub}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Manual entry form ────────────────────────────────────────────────────────

function ManualForm({ prefill = {}, onSuccess }) {
  const { categories, addTransaction } = useApp();
  const [searchParams] = useSearchParams();

  const today = new Date().toISOString().split('T')[0];

  const [type,        setType]        = useState(prefill.type     || searchParams.get('type') || 'in');
  const [amount,      setAmount]      = useState(prefill.amount   ? String(prefill.amount) : '');
  const [category,    setCategory]    = useState(prefill.category || '');
  const [date,        setDate]        = useState(prefill.date     || today);
  const [note,        setNote]        = useState(prefill.note     || '');
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { setCategory(''); }, [type]);

  const filteredCats = categories.filter(c => c.type === type || c.type === 'both');

  const validate = () => {
    const e = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!category) e.category = 'Please select a category';
    if (!date)     e.date     = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      addTransaction({ type, amount: Number(amount), category, date, note });
      onSuccess(type);
    } catch {
      setSubmitError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="!p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <p className="text-sm font-medium text-navy-700 mb-2">Transaction type</p>
          <SegmentedControl options={typeOptions} value={type} onChange={setType} className="w-full" />
        </div>

        <Input
          label="Amount (UGX)"
          type="number"
          inputMode="numeric"
          placeholder="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          error={errors.amount}
          min="0"
          step="1"
          leftIcon={<span className="text-navy-400 font-medium text-sm">USh</span>}
        />

        <Select
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          error={errors.category}
          options={filteredCats.map(c => ({ value: c.name, label: `${c.icon} ${c.name}` }))}
          placeholder="Select category"
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          error={errors.date}
          max={today}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-navy-700">
            Note <span className="text-navy-400 font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add a short note..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-navy-200 bg-white/60 px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-navy-300 transition-all"
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-500 bg-red-50/80 border border-red-200 rounded-xl px-3 py-2">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          className={clsx('mt-1', type === 'in' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-500 hover:bg-red-600')}
        >
          {type === 'in' ? '+ Record Income' : '− Record Expense'}
        </Button>
      </form>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddTransaction() {
  const navigate = useNavigate();

  const [mode,          setMode]          = useState('manual');
  const [success,       setSuccess]       = useState(false);
  const [successType,   setSuccessType]   = useState('in');
  const [manualPrefill, setManualPrefill] = useState({});

  const handleModeChange = (m) => {
    setMode(m);
    setSuccess(false);
  };

  // Called when Manual form saves successfully
  const handleManualSuccess = (type) => {
    setSuccessType(type);
    setSuccess(true);
  };

  // Called from MoMo "Record Manually Instead" — switch mode and carry over data
  const handleSwitchToManual = (prefill) => {
    setManualPrefill(prefill);
    setMode('manual');
  };

  const handleAddAnother = () => {
    setSuccess(false);
    setManualPrefill({});
  };

  if (success) {
    return (
      <Layout title="Add Transaction">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-navy-900 mb-1">Transaction Saved!</h2>
          <p className="text-sm text-navy-400 mb-8">
            Your {successType === 'in' ? 'income' : 'expense'} has been recorded successfully.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={handleAddAnother} variant="outline" fullWidth>Add Another</Button>
            <Button onClick={() => navigate('/dashboard')} fullWidth>Go to Dashboard</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Add Transaction" subtitle="Record money in or out quickly">
      {/* Mode tiles — always visible */}
      <ModeTiles mode={mode} onChange={handleModeChange} />

      {/* Form area */}
      {mode === 'manual' ? (
        <>
          <ManualForm prefill={manualPrefill} onSuccess={handleManualSuccess} />
          <div className="mt-4">
            <p className="text-xs text-navy-400 mb-2 px-1">Quick amounts</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map(v => (
                <button
                  key={v}
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 bg-white/60 text-navy-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all"
                >
                  USh{v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card className="!p-5">
          <MobileMoneyForm onSwitchToManual={handleSwitchToManual} />
        </Card>
      )}
    </Layout>
  );
}
