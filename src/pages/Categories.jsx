import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { ConfirmModal } from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import { useApp } from '../context/AppContext';

const COLOR_OPTIONS = [
  '#14b8a6', '#22c55e', '#3b82f6', '#8b5cf6',
  '#f59e0b', '#ec4899', '#f87171', '#06b6d4',
  '#10b981', '#64748b',
];

const EMOJI_OPTIONS = [
  '🍽️','🚗','🏠','🛍️','📦','📱','🏦','💼',
  '💰','🎓','💻','📝','⚡','🎮','🏥','✈️',
];

function CategoryForm({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Category name"
        placeholder="e.g. Medical"
        value={value.name || ''}
        onChange={e => onChange({ ...value, name: e.target.value })}
      />
      <div>
        <p className="text-sm font-medium text-navy-700 mb-2">Icon</p>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => onChange({ ...value, icon: em })}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                value.icon === em
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-transparent hover:border-navy-200 hover:bg-navy-50'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-navy-700 mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map(col => (
            <button
              key={col}
              type="button"
              onClick={() => onChange({ ...value, color: col })}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                value.color === col ? 'border-navy-800 scale-110' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-navy-700 mb-2">Use for</p>
        <div className="flex gap-2">
          {[
            { value: 'both', label: 'Both' },
            { value: 'in',   label: 'Money In' },
            { value: 'out',  label: 'Money Out' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...value, type: opt.value })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                value.type === opt.value
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white border-navy-200 text-navy-600 hover:border-teal-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();

  const [addOpen,       setAddOpen]       = useState(false);
  const [editTarget,    setEditTarget]    = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saving,        setSaving]        = useState(false);

  const defaultForm = { name: '', icon: '📝', color: '#14b8a6', type: 'both' };
  const [addForm,  setAddForm]  = useState(defaultForm);
  const [editForm, setEditForm] = useState(defaultForm);

  const handleAdd = async () => {
    if (!addForm.name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    addCategory(addForm);
    setSaving(false);
    setAddOpen(false);
    setAddForm(defaultForm);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setEditForm({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type });
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim() || !editTarget) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateCategory({ ...editTarget, ...editForm });
    setSaving(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 400));
    deleteCategory(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const typeLabel = (t) => ({ both: 'Both', in: 'Money In', out: 'Money Out' }[t] || 'Both');
  const typeBadge = (t) => ({ both: 'neutral', in: 'income', out: 'expense' }[t] || 'neutral');

  return (
    <Layout
      title="Categories"
      subtitle="Organise your transactions"
      action={
        <Button size="sm" onClick={() => setAddOpen(true)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add
        </Button>
      }
    >
      {categories.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="No categories yet"
          description="Add your first category to start organising transactions."
          actionLabel="Add Category"
          onAction={() => setAddOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <Card key={cat.id} className="!p-4 flex items-center gap-3">
              {/* Icon bubble */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${cat.color}25` }}
              >
                {cat.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-800">{cat.name}</p>
                <Badge variant={typeBadge(cat.type)} className="mt-1">
                  {typeLabel(cat.type)}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-300 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-navy-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); setAddForm(defaultForm); }}
        title="Add Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleAdd} loading={saving} disabled={!addForm.name.trim()}>Add Category</Button>
          </>
        }
      >
        <CategoryForm value={addForm} onChange={setAddForm} />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditTarget(null)} disabled={saving}>Cancel</Button>
            <Button onClick={handleEditSave} loading={saving} disabled={!editForm.name.trim()}>Save Changes</Button>
          </>
        }
      >
        <CategoryForm value={editForm} onChange={setEditForm} />
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Existing transactions with this category will not be affected.`}
      />
    </Layout>
  );
}
