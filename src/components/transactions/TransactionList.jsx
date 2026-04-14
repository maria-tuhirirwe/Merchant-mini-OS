import { groupByDate } from '../../utils/formatters';
import TransactionItem from './TransactionItem';
import EmptyState from '../common/EmptyState';

export default function TransactionList({ transactions = [], onEdit, onDelete, compact = false, onAddNew }) {
  if (!transactions.length) {
    return (
      <EmptyState
        icon="💸"
        title="No transactions yet"
        description="Start by recording your first money in or out."
        actionLabel={onAddNew ? 'Add Transaction' : undefined}
        onAction={onAddNew}
      />
    );
  }

  const groups = groupByDate(transactions);

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([label, txns]) => (
        <div key={label}>
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2 px-1">
            {label}
          </p>
          <div className="flex flex-col gap-2">
            {txns.map(tx => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={onEdit}
                onDelete={onDelete}
                compact={compact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
