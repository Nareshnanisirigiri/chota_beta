import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  CreditCard,
  Download,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface SubscriptionTransaction {
  id: number;
  uuid: string;
  seller_id: number;
  seller_subscription_id: number;
  plan_id: number;
  payment_gateway: string;
  transaction_id: string;
  amount: string | number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  store_name: string | null;
  seller_name: string | null;
  seller_email: string | null;
  plan_name: string | null;
}

interface Props {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
  pending:   { label: 'Pending',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',   icon: AlertCircle },
  failed:    { label: 'Failed',    color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',       icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',   icon: Clock },
};

export default function SubscriptionTransactions({ onLogout, onNavigate }: Props) {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const perPage = 10;

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/transactions`);
      setTransactions(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load subscription transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const exportCSV = () => {
    if (transactions.length === 0) return toast.error('No data to export');
    const headers = ['ID', 'Seller Name', 'Seller Email', 'Store Name', 'Plan Name', 'Amount', 'Payment Gateway', 'Transaction ID', 'Status', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      t.seller_name || '-',
      t.seller_email || '-',
      t.store_name || '-',
      t.plan_name || '-',
      `₹${Number(t.amount).toLocaleString('en-IN')}`,
      t.payment_gateway || '-',
      t.transaction_id || '-',
      t.status,
      t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'
    ]);
    const csv = [headers, ...rows].map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `subscription_transactions_${Date.now()}.csv`;
    link.click();
  };

  const filtered = transactions.filter(t => {
    const matchSearch =
      (t.seller_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.seller_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.store_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.plan_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.transaction_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.payment_gateway || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Stats
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  };

  return (
    <div className="p-8 font-sans text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight flex items-center gap-2">
              <CreditCard size={20} className="text-blue-400" />
              Subscription Transactions
            </h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">Subscriptions</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Transactions</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              onMouseEnter={() => setHoveredBtn('export')} onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #10b981',
                backgroundColor: hoveredBtn === 'export' ? '#10b981' : 'transparent',
                color: hoveredBtn === 'export' ? 'white' : '#10b981'
              }}
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={fetchTransactions}
              onMouseEnter={() => setHoveredBtn('refresh')} onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6'
              }}
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCcw size={15} />} Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total Transactions', value: stats.total, color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, color: 'from-emerald-500 to-teal-500', textColor: 'text-emerald-400' },
            { label: 'Pending', value: stats.pending, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400' },
            { label: 'Failed', value: stats.failed, color: 'from-red-500 to-rose-500', textColor: 'text-red-400' },
            { 
              label: 'Total Revenue', 
              value: `₹${stats.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 
              color: 'from-purple-500 to-pink-500', 
              textColor: 'text-purple-400' 
            },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0c111d] rounded-xl p-4 border border-[#1e293b] relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${stat.color}`} />
              <p className="text-slate-500 text-[11px] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search by seller, store, plan, txn ID..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-9 pr-4 py-1.5 text-[13px] text-slate-300 focus:outline-none w-full"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none appearance-none pr-8 min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {['#', 'SELLER', 'STORE', 'PLAN', 'AMOUNT', 'GATEWAY', 'TRANSACTION ID', 'STATUS', 'DATE'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '12px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <Loader2 size={36} className="animate-spin mx-auto text-blue-500 opacity-50" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400 text-[12px] uppercase tracking-widest">
                    No Transactions Found
                  </td>
                </tr>
              ) : paginated.map((txn) => {
                const cfg = STATUS_CONFIG[txn.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <tr key={txn.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="px-4 py-4 text-slate-400 text-[12px]" style={{ fontWeight: 200 }}>
                      {txn.id}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white text-[13px] font-medium">{txn.seller_name || '—'}</div>
                      <div className="text-slate-500 text-[11px]">{txn.seller_email || '—'}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-[13px]" style={{ fontWeight: 200 }}>
                      {txn.store_name || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-blue-400 text-[12px] font-medium bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                        {txn.plan_name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-emerald-400 text-[13px] font-semibold">
                      {Number(txn.amount) === 0 ? 'FREE' : `₹${Number(txn.amount).toLocaleString('en-IN')}`}
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-[12px]" style={{ fontWeight: 200 }}>
                      {txn.payment_gateway || '—'}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-[12px] font-mono select-all">
                      {txn.transaction_id || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-[12px]">
                      {formatDate(txn.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* White line under table */}
        <div className="h-[2px] bg-white w-full mb-5" />

        {/* Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400">
            Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage(1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30">
              <ChevronsLeft size={13} />
            </button>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30">
              <ChevronLeft size={13} />
            </button>
            <div className="bg-blue-600 px-2.5 py-1 rounded text-white text-[11px]">{page}</div>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="text-slate-500 disabled:opacity-30">
              <ChevronRight size={13} />
            </button>
            <button onClick={() => setPage(totalPages || 1)} disabled={page >= totalPages} className="text-slate-500 disabled:opacity-30">
              <ChevronsRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
