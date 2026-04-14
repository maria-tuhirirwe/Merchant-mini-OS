import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import SegmentedControl from '../components/common/SegmentedControl';
import { useApp } from '../context/AppContext';

const typeOptions = [
  { label: 'Money In',  value: 'in'  },
  { label: 'Money Out', value: 'out' },
];

export default function AddTransaction() {
  const { categories, addTransaction } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [type,        setType]        = useState(searchParams.get('type') || 'in');
  const [amount,      setAmount]      = useState('');
  const [category,    setCategory]    = useState('');
  const [date,        setDate]        = useState(new Date().toISOString().split('T')[0]);
  const [note,        setNote]        = useState('');
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Reset category when type changes
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
      // Simulate API call
      await new Promise(r => setTimeout(r, 600));
      addTransaction({ type, amount: Number(amount), category, date, note });
      setSuccess(true);
    } catch {
      setSubmitError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setAmount(''); setCategory(''); setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({}); setSuccess(false);
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
            Your {type === 'in' ? 'income' : 'expense'} has been recorded successfully.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={handleAddAnother} variant="outline" fullWidth>
              Add Another
            </Button>
            <Button onClick={() => navigate('/dashboard')} fullWidth>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Add Transaction" subtitle="Record money in or out quickly">
      <Card className="!p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Type toggle */}
          <div>
            <p className="text-sm font-medium text-navy-700 mb-2">Transaction type</p>
            <SegmentedControl
              options={typeOptions}
              value={type}
              onChange={setType}
              className="w-full"
            />
          </div>

          {/* Amount */}
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
            leftIcon={
              <span className="text-navy-400 font-medium text-sm">USh</span>
            }
          />

          {/* Category */}
          <Select
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            error={errors.category}
            options={filteredCats.map(c => ({ value: c.name, label: `${c.icon} ${c.name}` }))}
            placeholder="Select category"
          />

          {/* Date */}
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            error={errors.date}
            max={new Date().toISOString().split('T')[0]}
          />

          {/* Note */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-700">
              Note <span className="text-navy-400 font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Add a short note..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-navy-300 transition-all"
            />
          </div>

          {/* Submit error */}
          {submitError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {submitError}
            </p>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
            className={type === 'in'
              ? 'bg-teal-600 hover:bg-teal-700 mt-2'
              : 'bg-red-500 hover:bg-red-600 mt-2'}
          >
            {type === 'in' ? '+ Record Income' : '− Record Expense'}
          </Button>
        </form>
      </Card>

      {/* Quick amount buttons */}
      <div className="mt-4">
        <p className="text-xs text-navy-400 mb-2 px-1">Quick amounts</p>
        <div className="flex flex-wrap gap-2">
          {[5000, 10000, 20000, 50000, 100000, 200000].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(String(v))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 bg-white text-navy-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all"
            >
              USh{v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
