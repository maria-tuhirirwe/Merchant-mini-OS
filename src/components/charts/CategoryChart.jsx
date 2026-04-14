import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrencyShort } from '../../utils/formatters';

const COLORS = [
  '#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f87171', '#10b981', '#06b6d4',
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-white rounded-xl shadow-card-md border border-navy-100 px-3 py-2 text-xs">
      <p className="font-semibold text-navy-700">{entry.name}</p>
      <p className="text-navy-500">{formatCurrencyShort(entry.value)}</p>
    </div>
  );
};

const CustomLegend = ({ payload = [] }) => (
  <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 justify-center">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 text-xs text-navy-500">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
        {entry.value}
      </div>
    ))}
  </div>
);

export default function CategoryChart({ data = [] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-navy-300 text-sm">
      No data available
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
