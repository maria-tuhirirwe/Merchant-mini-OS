import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrencyShort } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-md border border-navy-100 px-3 py-2 text-xs">
      <p className="font-semibold text-navy-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'income' ? 'Money In' : 'Money Out'}: {formatCurrencyShort(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function SpendingChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f87171" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          name="income"
          stroke="#14b8a6"
          strokeWidth={2}
          fill="url(#incomeGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#14b8a6' }}
        />
        <Area
          type="monotone"
          dataKey="expense"
          name="expense"
          stroke="#f87171"
          strokeWidth={2}
          fill="url(#expenseGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#f87171' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
