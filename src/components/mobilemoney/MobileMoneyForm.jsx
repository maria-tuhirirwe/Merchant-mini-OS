import { useState, useEffect } from 'react';
import { clsx } from '../../utils/clsx';
import { useApp } from '../../context/AppContext';
import { detectProvider, sanitizePhone, formatPhoneDisplay, isValidPhone } from '../../utils/phoneUtils';
import { simulateMomoRequest, getProviderLabel } from '../../utils/momoSimulator';
import { formatCurrencyShort } from '../../utils/formatters';
import Input from '../common/Input';
import Button from '../common/Button';
import SegmentedControl from '../common/SegmentedControl';
import ProviderPill from './ProviderPill';
import MobileMoneyModal from './MobileMoneyModal';

const typeOptions = [
  { label: '↑ Money In',  value: 'in'  },
  { label: '↓ Money Out', value: 'out' },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 200000];

export default function MobileMoneyForm({ onSwitchToManual, prefill = {} }) {
  const { categories, addTransaction } = useApp();

  const today = new Date().toISOString().split('T')[0];

  const [type,     setType]     = useState(prefill.type     || 'in');
  const [amount,   setAmount]   = useState(prefill.amount   ? String(prefill.amount) : '');
  const [phone,    setPhone]    = useState(prefill.phone    || '');
  const [provider, setProvider] = useState(prefill.provider || null);
  const [category, setCategory] = useState(prefill.category || '');
  const [date,     setDate]     = useState(prefill.date     || today);
  const [note,     setNote]     = useState(prefill.note     || '');
  const [autoDetected, setAutoDetected] = useState(false);

  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalStatus, setModalStatus] = useState('pending');

  const filteredCats = categories.filter(c => c.type === type || c.type === 'both');

  // Reset category when type changes
  useEffect(() => { setCategory(''); }, [type]);

  // Auto-detect provider from phone
  const handlePhoneChange = (raw) => {
    const digits = sanitizePhone(raw);
    setPhone(digits);
    const detected = detectProvider(digits);
    if (detected) {
      setProvider(detected);
      setAutoDetected(true);
    } else {
      setAutoDetected(false);
    }
  };

  const handleProviderClick = (id) => {
    setProvider(id);
    setAutoDetected(false);
  };

  const validate = () => {
    const e = {};
    if (!amount || Number(amount) <= 0)   e.amount   = 'Enter a valid amount';
    if (!isValidPhone(phone))             e.phone    = 'Enter a valid Ugandan phone number (10 digits starting with 0)';
    if (!provider)                        e.provider = 'Select a provider';
    if (!category)                        e.category = 'Select a category';
    if (!date)                            e.date     = 'Date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    // Small delay so the button spinner is visible before the modal opens
    await new Promise(r => setTimeout(r, 800));

    setModalStatus('pending');
    setModalOpen(true);
    setSubmitting(false);

    // Simulate the provider request
    const { status } = await simulateMomoRequest();
    setModalStatus(status);

    if (status === 'success') {
      addTransaction({
        type,
        amount:   Number(amount),
        category,
        date,
        note: [getProviderLabel(provider), formatPhoneDisplay(phone), note].filter(Boolean).join(' · '),
      });
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setModalStatus('pending');
  };

  const handleRetry = async () => {
    setModalStatus('pending');
    const { status } = await simulateMomoRequest();
    setModalStatus(status);
    if (status === 'success') {
      addTransaction({
        type,
        amount:   Number(amount),
        category,
        date,
        note: [getProviderLabel(provider), formatPhoneDisplay(phone), note].filter(Boolean).join(' · '),
      });
    }
  };

  const handleAddAnother = () => {
    setModalOpen(false);
    setAmount(''); setPhone(''); setProvider(null);
    setCategory(''); setNote(''); setDate(today);
    setAutoDetected(false);
  };

  const handleRecordManually = () => {
    setModalOpen(false);
    onSwitchToManual({ type, amount, category, date, note });
  };

  const details = { type, amount: Number(amount), phone: formatPhoneDisplay(phone), provider, category, date, note };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

        {/* Provider pills */}
        <div>
          <p className="text-sm font-medium text-navy-700 mb-2">Provider</p>
          <div className="flex gap-2">
            <ProviderPill providerId="mtn"    selected={provider === 'mtn'}    onClick={handleProviderClick} />
            <ProviderPill providerId="airtel" selected={provider === 'airtel'} onClick={handleProviderClick} />
          </div>
          {autoDetected && provider && (
            <p className="text-xs text-teal-600 mt-1.5 font-medium">
              ✓ {getProviderLabel(provider)} detected from phone number
            </p>
          )}
          {errors.provider && (
            <p className="text-xs text-red-500 mt-1">{errors.provider}</p>
          )}
        </div>

        {/* Money In / Out */}
        <div>
          <p className="text-sm font-medium text-navy-700 mb-2">Transaction type</p>
          <SegmentedControl options={typeOptions} value={type} onChange={setType} className="w-full" />
        </div>

        {/* Amount */}
        <div>
          <Input
            label="Amount (UGX)"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            error={errors.amount}
            min="1"
            step="1"
            leftIcon={<span className="text-xs font-semibold text-navy-400">USh</span>}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {QUICK_AMOUNTS.map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                  Number(amount) === v
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-navy-200 bg-white/60 text-navy-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700',
                )}
              >
                {formatCurrencyShort(v)}
              </button>
            ))}
          </div>
        </div>

        {/* Phone number */}
        <Input
          label={type === 'in' ? 'Receive payment from (phone)' : 'Send payment to (phone)'}
          type="tel"
          inputMode="numeric"
          placeholder="e.g. 0772 000 000"
          value={formatPhoneDisplay(phone)}
          onChange={e => handlePhoneChange(e.target.value)}
          error={errors.phone}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
        />

        {/* Grouped classification card */}
        <div>
          <p className="text-sm font-medium text-navy-700 mb-2">For your records</p>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden divide-y divide-navy-50/60">

            {/* Category */}
            <div className="px-4 py-3">
              <label className="block text-[10px] font-semibold text-navy-400 uppercase tracking-widest mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })); }}
                className="w-full bg-transparent text-sm font-medium text-navy-800 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="" disabled>Select category…</option>
                {filteredCats.map(c => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Date */}
            <div className="px-4 py-3">
              <label className="block text-[10px] font-semibold text-navy-400 uppercase tracking-widest mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: '' })); }}
                className="w-full bg-transparent text-sm font-medium text-navy-800 focus:outline-none cursor-pointer"
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Note */}
            <div className="px-4 py-3">
              <label className="block text-[10px] font-semibold text-navy-400 uppercase tracking-widest mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full bg-transparent text-sm text-navy-800 placeholder-navy-300 focus:outline-none"
              />
            </div>
          </div>

          <p className="text-xs text-navy-400 mt-2 italic">
            Category and reason help this appear correctly in your summaries.
          </p>
        </div>

        {/* CTA */}
        <Button
          type="submit"
          loading={submitting}
          fullWidth
          size="lg"
          className="mt-1"
          rightIcon={
            !submitting && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )
          }
        >
          {submitting
            ? `Connecting to ${provider ? getProviderLabel(provider) : 'provider'}…`
            : type === 'in'
              ? `Request Payment via ${provider ? getProviderLabel(provider) : 'Mobile Money'}`
              : `Send via ${provider ? getProviderLabel(provider) : 'Mobile Money'}`
          }
        </Button>
      </form>

      <MobileMoneyModal
        isOpen={modalOpen}
        status={modalStatus}
        details={details}
        onCancel={handleCancel}
        onRetry={handleRetry}
        onRecordManually={handleRecordManually}
        onAddAnother={handleAddAnother}
      />
    </>
  );
}
