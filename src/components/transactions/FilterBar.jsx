import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { clsx } from '../../utils/clsx';

export default function FilterBar({ categories = [], onFilter, className = '' }) {
  const [search,   setSearch]   = useState('');
  const [type,     setType]     = useState('');
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');
  const [expanded, setExpanded] = useState(false);

  const apply = () => {
    onFilter({ search, type, category, dateFrom, dateTo });
  };

  const reset = () => {
    setSearch(''); setType(''); setCategory('');
    setDateFrom(''); setDateTo('');
    onFilter({ search: '', type: '', category: '', dateFrom: '', dateTo: '' });
  };

  const hasFilters = search || type || category || dateFrom || dateTo;

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {/* Search row */}
      <div className="flex gap-2">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          className="flex-1"
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <Button
          variant="outline"
          size="md"
          onClick={() => setExpanded(x => !x)}
          className={hasFilters ? 'border-teal-500 text-teal-700' : ''}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {hasFilters ? 'Filtered' : 'Filter'}
        </Button>
      </div>

      {/* Expanded filter panel */}
      {expanded && (
        <div className="bg-white rounded-2xl border border-navy-100 shadow-card p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              value={type}
              onChange={e => setType(e.target.value)}
              options={[
                { value: 'in',  label: 'Money In' },
                { value: 'out', label: 'Money Out' },
              ]}
              placeholder="All types"
            />
            <Select
              label="Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              options={categories.map(c => ({ value: c.name, label: c.name }))}
              placeholder="All categories"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From date"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
            <Input
              label="To date"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={reset} className="text-red-500 hover:bg-red-50">
              Clear filters
            </Button>
            <Button size="sm" onClick={apply} className="ml-auto">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
