import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TransactionItem from '../components/transactions/TransactionItem';
import FilterBar from '../components/transactions/FilterBar';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { ConfirmModal } from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SegmentedControl from '../components/common/SegmentedControl';
import { useApp } from '../context/AppContext';
import { groupByDate } from '../utils/formatters';
import { computeSummary } from '../data/sampleData';

const typeOptions = [
  { label: 'Money In',  value: 'in'  },
  { label: 'Money Out', value: 'out' },
];

export default function TransactionHistory() {
  const { transactions, categories, updateTransaction, deleteTransaction } = useApp();
  const navigate = useNavigate();

  const [filters,       setFilters]       = useState({ search: '', type: '', category: '', dateFrom: '', dateTo: '' });
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editForm,      setEditForm]      = useState({});
  const [editLoading,   setEditLoading]   = useState(false);

  // Apply filters
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.category.toLowerCase().includes(q) && !(t.note || '').toLowerCase().includes(q)) return false;
      }
      if (filters.type     && t.type     !== filters.type)     return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.dateFrom && t.date < filters.dateFrom)       return false;
      if (filters.dateTo   && t.date > filters.dateTo)         return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters]);

  const summary = useMemo(() => computeSummary(filtered), [filtered]);
  const groups  = useMemo(() => groupByDate(filtered), [filtered]);

  const openEdit = useCallback((tx) => {
    setEditTarget(tx);
    setEditForm({ type: tx.type, amount: tx.amount, category: tx.category, date: tx.date, note: tx.note || '' });
  }, []);

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    await new Promise(r => setTimeout(r, 500));
    updateTransaction({ ...editTarget, ...editForm, amount: Number(editForm.amount) });
    setEditLoading(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 400));
    deleteTransaction(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const filteredCats = editForm.type
    ? categories.filter(c => c.type === editForm.type || c.type === 'both')
    : categories;

  return (
    <Layout title="Transaction History" subtitle={`${filtered.length} records`}>
      {/* Mini summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Money In',  value: `USh${(summary.totalIn  / 1000).toFixed(0)}k`, color: 'text-teal-600' },
          { label: 'Money Out', value: `USh${(summary.totalOut / 1000).toFixed(0)}k`, color: 'text-red-500'  },
          { label: 'Balance',   value: `USh${(summary.balance  / 1000).toFixed(0)}k`, color: 'text-navy-800' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-navy-100 shadow-card text-center">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-navy-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <FilterBar categories={categories} onFilter={setFilters} className="mb-4" />

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No matching transactions"
          description="Try adjusting your search or filters."
          actionLabel="Add Transaction"
          onAction={() => navigate('/add')}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {Object.entries(groups).map(([label, txns]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2 px-1">
                {label} · {txns.length} item{txns.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-col gap-2">
                {txns.map(tx => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Transaction"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditTarget(null)} disabled={editLoading}>Cancel</Button>
            <Button onClick={handleEditSave} loading={editLoading}>Save Changes</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-navy-700 mb-2">Type</p>
            <SegmentedControl
              options={typeOptions}
              value={editForm.type || 'in'}
              onChange={v => setEditForm(f => ({ ...f, type: v, category: '' }))}
              className="w-full"
            />
          </div>
          <Input
            label="Amount (UGX)"
            type="number"
            value={editForm.amount || ''}
            onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
            min="0"
            step="0.01"
          />
          <Select
            label="Category"
            value={editForm.category || ''}
            onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
            options={filteredCats.map(c => ({ value: c.name, label: `${c.icon} ${c.name}` }))}
            placeholder="Select category"
          />
          <Input
            label="Date"
            type="date"
            value={editForm.date || ''}
            onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-navy-700">Note</label>
            <textarea
              value={editForm.note || ''}
              onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-900 placeholder-navy-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${deleteTarget?.type === 'in' ? 'income' : 'expense'} of USh${deleteTarget?.amount?.toLocaleString()}? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </Layout>
  );
}
