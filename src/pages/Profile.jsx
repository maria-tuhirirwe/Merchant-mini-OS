import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { ConfirmModal } from '../components/common/Modal';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';
import { computeSummary } from '../data/sampleData';

const viewOptions = [
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function Profile() {
  const { user, transactions, logout, updateUser } = useApp();
  const navigate = useNavigate();

  const [editing,       setEditing]       = useState(false);
  const [form,          setForm]          = useState({ name: user.name, preferredView: user.preferredView });
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const allTime = computeSummary(transactions);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateUser(form);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const avatarInitial = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <Layout title="Profile" subtitle="Manage your account">
      {/* Avatar & name */}
      <Card className="!p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold shadow-card-md shrink-0">
            {avatarInitial}
          </div>
          <div>
            <p className="text-lg font-bold text-navy-900">{user.name}</p>
            <p className="text-sm text-navy-400">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
              {user.accountType}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Card className="!p-5 mb-4">
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">All-time Summary</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-base font-bold text-teal-600">USh{(allTime.totalIn / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-navy-400 mt-0.5">Total In</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-red-500">USh{(allTime.totalOut / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-navy-400 mt-0.5">Total Out</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-navy-800">{transactions.length}</p>
            <p className="text-[10px] text-navy-400 mt-0.5">Transactions</p>
          </div>
        </div>
      </Card>

      {/* Account settings */}
      <Card className="!p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-navy-800">Account Settings</p>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="text-teal-600">
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-3">
            <Input
              label="Full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Select
              label="Preferred view"
              value={form.preferredView}
              onChange={e => setForm(f => ({ ...f, preferredView: e.target.value }))}
              options={viewOptions}
              placeholder=""
            />
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} loading={saving} className="ml-auto">
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[
              { label: 'Name',           value: user.name },
              { label: 'Email',          value: user.email },
              { label: 'Account type',   value: user.accountType },
              { label: 'Preferred view', value: viewOptions.find(v => v.value === user.preferredView)?.label || 'Weekly' },
              { label: 'Member since',   value: formatDate(user.joinedDate) },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-1 border-b border-navy-50 last:border-0">
                <span className="text-xs text-navy-400">{row.label}</span>
                <span className="text-sm text-navy-800 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {saved && (
          <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 rounded-xl px-3 py-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully
          </div>
        )}
      </Card>

      {/* Notification settings placeholder */}
      <Card className="!p-5 mb-4">
        <p className="text-sm font-semibold text-navy-800 mb-3">Notifications</p>
        <div className="flex flex-col gap-3">
          {[
            'Daily spending reminders',
            'Weekly summary report',
            'Low balance alerts',
          ].map(item => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-navy-600">{item}</span>
              <div className="w-10 h-5 rounded-full bg-navy-100 flex items-center px-0.5 cursor-not-allowed opacity-60">
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-navy-300 mt-3">Notification settings coming soon</p>
      </Card>

      {/* Logout */}
      <Button
        variant="danger-outline"
        fullWidth
        size="lg"
        onClick={() => setLogoutConfirm(true)}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        }
      >
        Sign Out
      </Button>

      <ConfirmModal
        isOpen={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
      />
    </Layout>
  );
}
