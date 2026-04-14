import Card from '../common/Card';
import SegmentedControl from '../common/SegmentedControl';

export default function ChartCard({ title, children, toggle, onToggle, toggleOptions }) {
  return (
    <Card className="!p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-navy-800">{title}</h2>
        {toggleOptions && (
          <SegmentedControl
            options={toggleOptions}
            value={toggle}
            onChange={onToggle}
          />
        )}
      </div>
      {children}
    </Card>
  );
}
