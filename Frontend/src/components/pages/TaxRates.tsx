import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCcw, ChevronDown, Edit2, Trash2, Download, X, Search, Loader2 } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface TaxRate {
  id: number;
  title: string;
  rate: string | number;
  created_at?: string;
  updated_at?: string;
}

interface TaxClass {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const formatDate = (d?: string) => {
  if (!d) return 'N/A';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return d; }
};

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)' }} />
    <ChevronDown size={11} />
  </div>
);

const TH_STYLE: React.CSSProperties = {
  padding: '10px 16px',
  borderRight: '1px solid rgba(255,255,255,0.4)',
  borderBottom: '2px solid white',
  fontSize: '13px',
  color: 'white',
  fontWeight: 200,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const TD_STYLE: React.CSSProperties = {
  padding: '18px 16px',
  fontSize: '13px',
  fontWeight: 200,
};

export default function TaxRates({ onLogout, onNavigate }: Props) {
  // ── Data ──────────────────────────────────────────────────────────────────
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [classes, setClasses] = useState<TaxClass[]>([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // ── Search ────────────────────────────────────────────────────────────────
  const [rateSearch, setRateSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');

  // ── Modal state ───────────────────────────────────────────────────────────
  const [rateModal, setRateModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number; title: string; rate: string }>({
    open: false, mode: 'add', title: '', rate: '',
  });
  const [classModal, setClassModal] = useState<{ open: boolean; mode: 'add' | 'edit'; id?: number; title: string }>({
    open: false, mode: 'add', title: '',
  });
  const [saving, setSaving] = useState(false);

  // ── Hover states ──────────────────────────────────────────────────────────
  const [hBtn, setHBtn] = useState<string | null>(null);
  const [hAct, setHAct] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/tax/rates`);
      setRates(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load tax rates');
      setRates([]);
    } finally {
      setLoadingRates(false);
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    setLoadingClasses(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/tax/classes`);
      setClasses(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load tax classes');
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  useEffect(() => { fetchRates(); fetchClasses(); }, [fetchRates, fetchClasses]);

  // ── Filtered ───────────────────────────────────────────────────────────────
  const filteredRates = rates.filter(r =>
    r.title.toLowerCase().includes(rateSearch.toLowerCase())
  );
  const filteredClasses = classes.filter(c =>
    c.title.toLowerCase().includes(classSearch.toLowerCase())
  );

  // ── Rate CRUD ──────────────────────────────────────────────────────────────
  const openAddRate = () => setRateModal({ open: true, mode: 'add', title: '', rate: '' });
  const openEditRate = (r: TaxRate) => setRateModal({ open: true, mode: 'edit', id: r.id, title: r.title, rate: String(r.rate) });

  const saveRate = async () => {
    if (!rateModal.title.trim() || rateModal.rate === '') { toast.error('Title and Rate are required'); return; }
    const numRate = parseFloat(rateModal.rate);
    if (isNaN(numRate)) { toast.error('Rate must be a valid number'); return; }
    setSaving(true);
    try {
      if (rateModal.mode === 'add') {
        await axios.post(`${BASE_URL}/api/tax/rates/create`, { title: rateModal.title.trim(), rate: numRate });
        toast.success('Tax rate created');
      } else {
        await axios.put(`${BASE_URL}/api/tax/rates/${rateModal.id}`, { title: rateModal.title.trim(), rate: numRate });
        toast.success('Tax rate updated');
      }
      setRateModal(m => ({ ...m, open: false }));
      fetchRates();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save tax rate');
    } finally {
      setSaving(false);
    }
  };

  const deleteRate = async (id: number) => {
    if (!window.confirm('Delete this tax rate?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/tax/rates/${id}`);
      toast.success('Tax rate deleted');
      fetchRates();
    } catch { toast.error('Failed to delete tax rate'); }
  };

  // ── Class CRUD ─────────────────────────────────────────────────────────────
  const openAddClass = () => setClassModal({ open: true, mode: 'add', title: '' });
  const openEditClass = (c: TaxClass) => setClassModal({ open: true, mode: 'edit', id: c.id, title: c.title });

  const saveClass = async () => {
    if (!classModal.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (classModal.mode === 'add') {
        await axios.post(`${BASE_URL}/api/tax/classes/create`, { title: classModal.title.trim() });
        toast.success('Tax class created');
      } else {
        await axios.put(`${BASE_URL}/api/tax/classes/${classModal.id}`, { title: classModal.title.trim() });
        toast.success('Tax class updated');
      }
      setClassModal(m => ({ ...m, open: false }));
      fetchClasses();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save tax class');
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (id: number) => {
    if (!window.confirm('Delete this tax class?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/tax/classes/${id}`);
      toast.success('Tax class deleted');
      fetchClasses();
    } catch { toast.error('Failed to delete tax class'); }
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) { toast.error('No data to export'); return; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = filename;
    a.click();
  };

  // ── Reusable button styles ─────────────────────────────────────────────────
  const outlineBtn = (key: string, color = '#3b82f6') => ({
    borderRadius: '12px',
    border: `2px solid ${color}`,
    backgroundColor: hBtn === key ? color : 'transparent',
    color: hBtn === key ? 'white' : color,
  });

  const actionBtn = (key: string, color: string) => ({
    borderRadius: '12px',
    border: `2px solid ${color}`,
    backgroundColor: hAct === key ? color : 'transparent',
    color: hAct === key ? 'white' : color,
  });

  // ── Table renderer ─────────────────────────────────────────────────────────
  const renderTable = (
    title: string,
    cols: { label: string; width?: string }[],
    loading: boolean,
    search: string,
    onSearch: (v: string) => void,
    onAdd: () => void,
    onRefresh: () => void,
    onExport: () => void,
    addLabel: string,
    rows: JSX.Element[],
    totalCount: number,
  ) => (
    <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-[18px] font-bold tracking-tight">{title}</h2>
          <nav className="flex items-center gap-2 text-[12px] mt-1">
            <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
            <span className="text-slate-500">/</span>
            <span className="text-blue-200/80">{title}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAdd}
            onMouseEnter={() => setHBtn(`add-${title}`)} onMouseLeave={() => setHBtn(null)}
            className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
            style={outlineBtn(`add-${title}`)}
          ><Plus size={15} /> {addLabel}</button>
          <button
            onClick={onRefresh}
            onMouseEnter={() => setHBtn(`ref-${title}`)} onMouseLeave={() => setHBtn(null)}
            className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
            style={outlineBtn(`ref-${title}`)}
          ><RefreshCcw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
          <input
            value={search} onChange={e => onSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-[220px] bg-[#0c111d] border border-[#2d3748] rounded-md pl-9 pr-4 py-1.5 text-[13px] text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <button
          onClick={onExport}
          onMouseEnter={() => setHBtn(`exp-${title}`)} onMouseLeave={() => setHBtn(null)}
          className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
          style={outlineBtn(`exp-${title}`)}
        ><Download size={15} /> Export CSV</button>
      </div>

      {/* Table */}
      <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
              {cols.map(col => (
                <th key={col.label} style={{ ...TH_STYLE, width: col.width }}>
                  <div className="flex items-center justify-between">{col.label}<SortIcons /></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#0c101a' }}>
            {loading ? (
              <tr><td colSpan={cols.length} className="text-center py-16">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <Loader2 size={28} className="animate-spin" />
                  <span className="uppercase tracking-widest text-[11px]">Loading {title.toLowerCase()}...</span>
                </div>
              </td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={cols.length} className="text-center py-16">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <RefreshCcw size={28} className="opacity-20" />
                  <span className="uppercase tracking-widest text-[11px]">No {title} Found</span>
                </div>
              </td></tr>
            ) : rows}
          </tbody>
        </table>
      </div>
      <div className="h-[2px] bg-white w-full mb-4" />
      <p className="text-[13px] text-slate-400" style={{ fontWeight: 200 }}>
        Showing {rows.length} of {totalCount} entries
      </p>
    </div>
  );

  // ── Rate rows ──────────────────────────────────────────────────────────────
  const rateRows = filteredRates.map((row, i) => (
    <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#94a3b8' }}>{i + 1}</td>
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#f1f5f9', textTransform: 'uppercase' }}>{row.title}</td>
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#60a5fa' }}>{row.rate}%</td>
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#64748b' }}>{formatDate(row.created_at)}</td>
      <td style={TD_STYLE}>
        <div className="flex items-center gap-2">
          <button onClick={() => openEditRate(row)}
            onMouseEnter={() => setHAct(`r${row.id}-e`)} onMouseLeave={() => setHAct(null)}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-90"
            style={actionBtn(`r${row.id}-e`, '#3b82f6')}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => deleteRate(row.id)}
            onMouseEnter={() => setHAct(`r${row.id}-d`)} onMouseLeave={() => setHAct(null)}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-90"
            style={actionBtn(`r${row.id}-d`, '#ef4444')}>
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  ));

  // ── Class rows ─────────────────────────────────────────────────────────────
  const classRows = filteredClasses.map((row, i) => (
    <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#94a3b8' }}>{i + 1}</td>
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#f1f5f9', textTransform: 'uppercase' }}>{row.title}</td>
      <td style={{ ...TD_STYLE, borderRight: '1px solid rgba(45,55,72,0.3)', color: '#64748b' }}>{formatDate(row.created_at)}</td>
      <td style={TD_STYLE}>
        <div className="flex items-center gap-2">
          <button onClick={() => openEditClass(row)}
            onMouseEnter={() => setHAct(`c${row.id}-e`)} onMouseLeave={() => setHAct(null)}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-90"
            style={actionBtn(`c${row.id}-e`, '#3b82f6')}>
            <Edit2 size={14} />
          </button>
          <button onClick={() => deleteClass(row.id)}
            onMouseEnter={() => setHAct(`c${row.id}-d`)} onMouseLeave={() => setHAct(null)}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-90"
            style={actionBtn(`c${row.id}-d`, '#ef4444')}>
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="p-8 font-sans text-white min-h-screen bg-[#070b14]" style={{ marginBottom: '80px' }}>
      <Navbar onLogout={onLogout} />

      {/* ── Tax Rates Table ── */}
      {renderTable(
        'Tax Rates',
        [
          { label: 'ID', width: '70px' },
          { label: 'Title', width: 'auto' },
          { label: 'Rate (%)', width: '160px' },
          { label: 'Created At', width: '160px' },
          { label: 'Action', width: '110px' },
        ],
        loadingRates, rateSearch, setRateSearch,
        openAddRate, fetchRates,
        () => exportCSV(rates, 'tax_rates.csv'),
        'Add Tax Rate', rateRows, rates.length,
      )}

      {/* ── Tax Classes Table ── */}
      {renderTable(
        'Tax Classes',
        [
          { label: 'ID', width: '70px' },
          { label: 'Title', width: 'auto' },
          { label: 'Created At', width: '160px' },
          { label: 'Action', width: '110px' },
        ],
        loadingClasses, classSearch, setClassSearch,
        openAddClass, fetchClasses,
        () => exportCSV(classes, 'tax_classes.csv'),
        'Add Tax Class', classRows, classes.length,
      )}

      {/* ── Rate Modal ─────────────────────────────────────────────────────── */}
      {rateModal.open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60"
          style={{ backdropFilter: 'blur(4px)' }}>
          <div className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden"
            style={{ backgroundColor: '#111827', width: '480px', maxWidth: '95vw' }}>
            <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white">{rateModal.mode === 'add' ? 'Add Tax Rate' : 'Edit Tax Rate'}</h2>
                <div className="h-0.5 w-10 bg-blue-500 rounded-full mt-1" />
              </div>
              <button onClick={() => setRateModal(m => ({ ...m, open: false }))}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                <input type="text" value={rateModal.title}
                  onChange={e => setRateModal(m => ({ ...m, title: e.target.value }))}
                  placeholder="e.g. CGST"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Percentage Rate (%) <span className="text-red-500">*</span></label>
                <input type="number" value={rateModal.rate}
                  onChange={e => setRateModal(m => ({ ...m, rate: e.target.value }))}
                  placeholder="e.g. 18"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button onClick={() => setRateModal(m => ({ ...m, open: false }))}
                className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Cancel</button>
              <button onClick={saveRate} disabled={saving}
                onMouseEnter={() => setHBtn('save-rate')} onMouseLeave={() => setHBtn(null)}
                className="flex items-center gap-2 px-8 py-3 text-[13px] font-bold transition-all duration-300 active:scale-95 disabled:opacity-50"
                style={{ borderRadius: '12px', border: '2px solid #3b82f6', backgroundColor: hBtn === 'save-rate' ? '#3b82f6' : 'transparent', color: hBtn === 'save-rate' ? 'white' : '#3b82f6' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {rateModal.mode === 'add' ? 'Create Rate' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Class Modal ─────────────────────────────────────────────────────── */}
      {classModal.open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60"
          style={{ backdropFilter: 'blur(4px)' }}>
          <div className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden"
            style={{ backgroundColor: '#111827', width: '480px', maxWidth: '95vw' }}>
            <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white">{classModal.mode === 'add' ? 'Add Tax Class' : 'Edit Tax Class'}</h2>
                <div className="h-0.5 w-10 bg-blue-500 rounded-full mt-1" />
              </div>
              <button onClick={() => setClassModal(m => ({ ...m, open: false }))}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                <input type="text" value={classModal.title}
                  onChange={e => setClassModal(m => ({ ...m, title: e.target.value }))}
                  placeholder="e.g. GST"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button onClick={() => setClassModal(m => ({ ...m, open: false }))}
                className="text-[12px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Cancel</button>
              <button onClick={saveClass} disabled={saving}
                onMouseEnter={() => setHBtn('save-class')} onMouseLeave={() => setHBtn(null)}
                className="flex items-center gap-2 px-8 py-3 text-[13px] font-bold transition-all duration-300 active:scale-95 disabled:opacity-50"
                style={{ borderRadius: '12px', border: '2px solid #3b82f6', backgroundColor: hBtn === 'save-class' ? '#3b82f6' : 'transparent', color: hBtn === 'save-class' ? 'white' : '#3b82f6' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {classModal.mode === 'add' ? 'Create Class' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
