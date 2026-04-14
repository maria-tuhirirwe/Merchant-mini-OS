import { clsx } from '../../utils/clsx';
import { getProvider } from '../../utils/momoSimulator';

export default function ProviderPill({ providerId, selected, onClick }) {
  const p = getProvider(providerId);
  if (!p) return null;

  return (
    <button
      type="button"
      onClick={() => onClick(providerId)}
      style={selected ? {
        borderColor: p.border,
        backgroundColor: p.activeBg,
        color: p.color,
      } : {}}
      className={clsx(
        'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-150',
        selected
          ? 'shadow-sm'
          : 'border-dashed border-navy-200 text-navy-400 bg-white/60 hover:border-navy-300',
      )}
    >
      <span className="text-base leading-none">📲</span>
      <span>{p.label}</span>
    </button>
  );
}
