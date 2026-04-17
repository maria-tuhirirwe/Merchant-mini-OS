import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useApp } from '../context/AppContext';
import { parseSmartInput, getParseConfidence } from '../utils/smartParser';
import { formatCurrencyShort } from '../utils/formatters';
import { clsx } from '../utils/clsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000];

// ─── Category Grid ────────────────────────────────────────────────────────────
function CategoryGrid({ selected, onSelect, type }) {
  const { categories } = useApp();
  const filtered = categories.filter(c => c.type === type || c.type === 'both');

  return (
    <div className="grid grid-cols-4 gap-2">
      {filtered.map(cat => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.name)}
          className={clsx(
            'flex flex-col items-center gap-1 rounded-2xl p-2.5 border-2 transition-all duration-150 active:scale-95',
            selected === cat.name
              ? 'border-teal-400 bg-teal-50 shadow-sm'
              : 'border-transparent bg-white/60 hover:bg-white/90',
          )}
        >
          <span className="text-xl leading-none">{cat.icon}</span>
          <span className={clsx(
            'text-[10px] font-medium text-center leading-tight',
            selected === cat.name ? 'text-teal-700' : 'text-navy-500',
          )}>
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── NumPad ───────────────────────────────────────────────────────────────────
function NumPad({ value, onChange }) {
  const keys = ['1','2','3','4','5','6','7','8','9','000','0','⌫'];

  const handleKey = (key) => {
    if (key === '⌫') {
      onChange(value.length > 1 ? value.slice(0, -1) : '0');
    } else if (key === '000') {
      onChange(value === '0' ? '0' : value + '000');
    } else {
      onChange(value === '0' ? key : value + key);
    }
  };

  const displayValue = parseInt(value || '0', 10);

  return (
    <div>
      {/* Amount display */}
      <div className="text-center py-4">
        <p className="text-[10px] text-navy-400 font-medium uppercase tracking-widest mb-1">Amount</p>
        <p className="text-4xl font-bold text-navy-900 tracking-tight">
          {displayValue === 0 ? (
            <span className="text-navy-300">0</span>
          ) : (
            formatCurrencyShort(displayValue)
          )}
        </p>
      </div>

      {/* Keys */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className={clsx(
              'h-14 rounded-2xl text-lg font-semibold transition-all duration-100 active:scale-95',
              key === '⌫'
                ? 'bg-red-50 text-red-500 border border-red-100'
                : key === '000'
                ? 'bg-navy-100/60 text-navy-600 text-base'
                : 'bg-white/80 text-navy-800 border border-navy-100 hover:bg-teal-50 hover:border-teal-200',
            )}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Parsed Preview Badge ─────────────────────────────────────────────────────
function ParsedPreview({ parsed }) {
  const confidence = getParseConfidence(parsed);
  if (!parsed || confidence < 40) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-1 py-2">
      {parsed.type && (
        <span className={clsx(
          'px-2.5 py-1 rounded-full text-xs font-semibold',
          parsed.type === 'in'
            ? 'bg-teal-100 text-teal-700'
            : 'bg-red-100 text-red-700',
        )}>
          {parsed.type === 'in' ? '↑ Income' : '↓ Expense'}
        </span>
      )}
      {parsed.amount && (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-navy-100 text-navy-700">
          {formatCurrencyShort(parsed.amount)}
        </span>
      )}
      {parsed.category && (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {parsed.category}
        </span>
      )}
      {confidence === 100 && (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          ✓ Ready to save
        </span>
      )}
    </div>
  );
}

// ─── Chat Input Tab ───────────────────────────────────────────────────────────
function ChatTab({ onSuccess }) {
  const { addTransaction } = useApp();
  const [text,    setText]    = useState('');
  const [parsed,  setParsed]  = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = (val) => {
    setText(val);
    setParsed(val.trim() ? parseSmartInput(val) : null);
    setError('');
  };

  const examplePrompts = [
    'I spent 10k on lunch',
    'Received 50k from client',
    'Paid 3k boda fare',
    'Bought airtime 5k',
  ];

  const handleSave = async () => {
    if (!parsed?.amount)    { setError('Could not detect an amount. Try: "spent 10k on food"'); return; }
    if (!parsed?.type)      { setError('Is this income or expense? Try adding "spent" or "received"'); return; }
    if (!parsed?.category)  { setError('Category not detected — tap Quick Add to pick one manually'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    addTransaction({
      type:     parsed.type,
      amount:   parsed.amount,
      category: parsed.category,
      note:     parsed.raw,
    });
    setLoading(false);
    onSuccess(parsed.type);
  };

  const confidence = getParseConfidence(parsed);

  return (
    <div className="flex flex-col gap-4">
      {/* Input box */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => handleChange(e.target.value)}
          placeholder="e.g. I spent 10k on lunch"
          rows={3}
          className="w-full rounded-2xl border-2 border-navy-200 bg-white/70 backdrop-blur-sm px-4 py-3.5 text-base text-navy-900 placeholder-navy-300 resize-none focus:outline-none focus:border-teal-400 transition-all leading-relaxed"
        />
        {text && (
          <button
            type="button"
            onClick={() => { setText(''); setParsed(null); setError(''); }}
            className="absolute top-3 right-3 text-navy-300 hover:text-navy-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Parsed preview */}
      <ParsedPreview parsed={parsed} />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || confidence < 40}
        className={clsx(
          'w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95',
          confidence >= 75
            ? 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
            : confidence >= 40
            ? 'bg-teal-200 text-teal-800'
            : 'bg-navy-100 text-navy-400 cursor-not-allowed',
        )}
      >
        {loading ? 'Saving…' : 'Save Transaction'}
      </button>

      {/* Example prompts */}
      {!text && (
        <div>
          <p className="text-[11px] text-navy-400 font-medium mb-2 px-1">Try saying:</p>
          <div className="flex flex-col gap-1.5">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleChange(prompt)}
                className="text-left px-3.5 py-2.5 rounded-xl bg-white/60 border border-navy-100 text-sm text-navy-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quick Add Tab ────────────────────────────────────────────────────────────
function QuickTab({ initialType, onSuccess }) {
  const { addTransaction } = useApp();
  const [searchParams]  = useSearchParams();
  const [type,     setType]    = useState(initialType || searchParams.get('type') || 'out');
  const [amount,   setAmount]  = useState('0');
  const [category, setCategory] = useState('');
  const [note,     setNote]    = useState('');
  const [error,    setError]   = useState('');
  const [loading,  setLoading] = useState(false);

  const handleSave = async () => {
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) { setError('Please enter an amount'); return; }
    if (!category)        { setError('Please select a category'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    addTransaction({ type, amount: amt, category, note });
    setLoading(false);
    onSuccess(type);
  };

  // Quick amount chips
  const handleQuickAmount = (val) => setAmount(String(val));

  return (
    <div className="flex flex-col gap-4">
      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: 'in',  label: '↑ Income',  active: 'bg-teal-600 text-white border-teal-600', inactive: 'bg-white/60 text-navy-600 border-navy-200' },
          { value: 'out', label: '↓ Expense', active: 'bg-red-500  text-white border-red-500',  inactive: 'bg-white/60 text-navy-600 border-navy-200' },
        ].map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { setType(opt.value); setCategory(''); }}
            className={clsx(
              'py-3 rounded-2xl font-bold text-sm border-2 transition-all duration-150 active:scale-95',
              type === opt.value ? opt.active : opt.inactive,
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* NumPad */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-4 shadow-card">
        <NumPad value={amount} onChange={setAmount} />
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-[11px] text-navy-400 font-medium mb-2 px-1">Quick amounts</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_AMOUNTS.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => handleQuickAmount(v)}
              className={clsx(
                'px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all active:scale-95',
                parseInt(amount) === v
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white/70 border-navy-200 text-navy-600 hover:border-teal-300 hover:text-teal-700',
              )}
            >
              {v >= 1_000_000 ? `${v/1_000_000}M` : `${v/1000}k`}
            </button>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div>
        <p className="text-[11px] text-navy-400 font-medium mb-2 px-1">Category</p>
        <CategoryGrid selected={category} onSelect={setCategory} type={type} />
      </div>

      {/* Optional note */}
      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note (optional)"
        className="w-full rounded-xl border border-navy-200 bg-white/60 px-4 py-3 text-sm text-navy-900 placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all"
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className={clsx(
          'w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 active:scale-95',
          type === 'in'
            ? 'bg-teal-600 hover:bg-teal-700'
            : 'bg-red-500 hover:bg-red-600',
          loading && 'opacity-70 cursor-not-allowed',
        )}
      >
        {loading ? 'Saving…' : type === 'in' ? '+ Save Income' : '− Save Expense'}
      </button>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ txType, onAddAnother, onDone }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4 animate-bounce-once">
        <span className="text-4xl">✓</span>
      </div>
      <h2 className="text-xl font-bold text-navy-900 mb-2">Saved!</h2>
      <p className="text-sm text-navy-400 mb-8">
        Your {txType === 'in' ? 'income' : 'expense'} has been recorded.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onAddAnother}
          className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all"
        >
          Add Another
        </button>
        <button
          onClick={onDone}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AddTransaction() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab,         setTab]         = useState('chat');
  const [successType, setSuccessType] = useState(null);

  const initialType = searchParams.get('type') || 'out';

  const handleSuccess = (type) => setSuccessType(type);
  const handleReset   = () => setSuccessType(null);

  if (successType) {
    return (
      <Layout title="Add Transaction">
        <SuccessScreen
          txType={successType}
          onAddAnother={handleReset}
          onDone={() => navigate('/dashboard')}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Add Transaction" subtitle="Tap, type, or say it — your choice">

      {/* Tab switcher */}
      <div className="flex gap-1 bg-navy-100/70 rounded-2xl p-1 mb-5">
        {[
          { id: 'chat',  label: '💬 Smart Input' },
          { id: 'quick', label: '⚡ Quick Add' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              tab === t.id
                ? 'bg-white text-navy-800 shadow-sm'
                : 'text-navy-400 hover:text-navy-600',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'chat' ? (
        <ChatTab onSuccess={handleSuccess} />
      ) : (
        <QuickTab initialType={initialType} onSuccess={handleSuccess} />
      )}
    </Layout>
  );
}
