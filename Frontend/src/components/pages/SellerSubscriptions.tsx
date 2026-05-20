import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  CreditCard,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface SellerSubscription {
  id: number;
  seller_id: number;
  plan_id: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  price_paid: string | number;
  created_at: string;
  store_name: string;
  seller_name: string;
  seller_email: string;
  plan_name: string;
}

interface Props {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  expired:   { label: 'Expired',   color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',   icon: Clock },
  cancelled: { label: 'Cancelled', color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',       icon: XCircle },
  pending:   { label: 'Pending',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: AlertCircle },
};

export default function SellerSubscriptions({ onLogout, onNavigate }: Props) {
  const [subscriptions, setSubscriptions] = useState<SellerSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const perPage = 10;

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/seller-subscriptions`);
      setSubscriptions(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load seller subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const exportCSV = () => {
    if (subscriptions.length === 0) return toast.error('No data to export');
    const headers = ['ID', 'Seller', 'Email', 'Store', 'Plan', 'Status', 'Price Paid', 'Start Date', 'End Date'];
    const rows = subscriptions.map(s => [
      s.id, s.seller_name || '-', s.seller_email || '-', s.store_name || '-',
      s.plan_name || '-', s.status,
      `₹${Number(s.price_paid).toLocaleString('en-IN')}`,
      s.start_date ? new Date(s.start_date).toLocaleDateString() : '-',
      s.end_date ? new Date(s.end_date).toLocaleDateString() : '-'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `seller_subscriptions_${Date.now()}.csv`;
    link.click();
  };

  const filtered = subscriptions.filter(s => {
    const matchSearch =
      (s.seller_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.store_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.plan_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.seller_email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const daysLeft = (endDate: string) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 86400));
    return diff;
  };

  // Stats
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
  };

  return (
    <div className="p-8 font-sans text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight flex items-center gap-2">
              <Users size={20} className="text-blue-400" />
              Seller Subscriptions
            </h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">Subscriptions</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Seller Subscriptions</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              onMouseEnter={() => setHoveredBtn('export')} onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
              style={{ borderRadius: '12px', border: '2px solid #10b981', backgroundColor: hoveredBtn === 'export' ? '#10b981' : 'transparent', color: hoveredBtn === 'export' ? 'white' : '#10b981' }}
            >
              <Download size={15} /> Export
            </button>
            <button
              onClick={fetchSubscriptions}
              onMouseEnter={() => setHoveredBtn('refresh')} onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
              style={{ borderRadius: '12px', border: '2px solid #3b82f6', backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent', color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6' }}
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCcw size={15} />} Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' },
            { label: 'Active', value: stats.active, color: 'from-emerald-500 to-teal-500', textColor: 'text-emerald-400' },
            { label: 'Expired', value: stats.expired, color: 'from-slate-400 to-slate-500', textColor: 'text-slate-400' },
            { label: 'Cancelled', value: stats.cancelled, color: 'from-red-500 to-rose-500', textColor: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0c111d] rounded-xl p-4 border border-[#1e293b] relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${stat.color}`} />
              <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search by seller, store, plan..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none min-w-[220px]"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none appearance-none pr-8"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {['#', 'SELLER', 'STORE', 'PLAN', 'PRICE PAID', 'START DATE', 'END DATE', 'DAYS LEFT', 'STATUS'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '12px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr><td colSpan={9} className="py-20 text-center"><Loader2 size={36} className="animate-spin mx-auto text-blue-500 opacity-50" /></td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-slate-400 text-[12px] uppercase tracking-widest">No Subscriptions Found</td></tr>
              ) : paginated.map((sub) => {
                const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const days = daysLeft(sub.end_date);
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="px-4 py-4 text-slate-400 text-[12px]" style={{ fontWeight: 200 }}>{sub.id}</td>
                    <td className="px-4 py-4">
                      <div className="text-white text-[13px] font-medium">{sub.seller_name || '—'}</div>
                      <div className="text-slate-500 text-[11px]">{sub.seller_email || '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-[13px]" style={{ fontWeight: 200 }}>{sub.store_name || '—'}</td>
                    <td className="px-4 py-4">
                      <span className="text-blue-400 text-[12px] font-medium bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">{sub.plan_name || '—'}</span>
                    </td>
                    <td className="px-4 py-4 text-emerald-400 text-[13px] font-semibold">
                      {Number(sub.price_paid) === 0 ? 'FREE' : `₹${Number(sub.price_paid).toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-[12px]">{formatDate(sub.start_date)}</td>
                    <td className="px-4 py-4 text-slate-400 text-[12px]">{formatDate(sub.end_date)}</td>
                    <td className="px-4 py-4">
                      {days !== null ? (
                        <span className={`text-[12px] font-semibold ${days > 7 ? 'text-emerald-400' : days >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* White line */}
        <div className="h-[2px] bg-white w-full mb-5" />

        {/* Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400">
            Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage(1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30"><ChevronsLeft size={13} /></button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30"><ChevronLeft size={13} /></button>
            <div className="bg-blue-600 px-2.5 py-1 rounded text-white text-[11px]">{page}</div>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="text-slate-500 disabled:opacity-30"><ChevronRight size={13} /></button>
            <button onClick={() => setPage(totalPages || 1)} disabled={page >= totalPages} className="text-slate-500 disabled:opacity-30"><ChevronsRight size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
