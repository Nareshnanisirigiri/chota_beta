import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  RefreshCcw,
  History,
  ChevronDown,
  Download,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  Undo2,
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import Navbar from '../Navbar';

interface SettlementOverviewProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface Store {
  id: number;
  name: string;
}

interface SettlementRecord {
  id: number;
  seller_id: number;
  order_id: number;
  entry_type: 'credit' | 'debit';
  amount: string | number;
  description: string;
  posted_at?: string;
  settled_at?: string;
  settlement_reference?: string;
  seller_name: string;
  order_number: string | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function SettlementOverview({ onLogout, onNavigate }: SettlementOverviewProps) {
  const [activeTab, setActiveTab] = useState<'Payouts' | 'Returns'>('Payouts');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Data States
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [records, setRecords] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [settling, setSettling] = useState<boolean>(false);

  // Search & Pagination
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Column Visibility
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    orderDetails: true,
    entryType: true,
    marketplaceFee: true,
    amount: true,
    lastUpdated: true,
    settlementDate: true,
    settlementRef: true
  });
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/stores`);
      if (res.data.success) {
        setStores(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  const fetchSettlementData = async () => {
    setLoading(true);
    try {
      if (showHistory) {
        const res = await axios.get(`${BASE_URL}/api/sellers/settlements-history`, {
          params: { store_id: selectedStoreId, search }
        });
        if (res.data.success) {
          setRecords(res.data.data);
        }
      } else {
        const type = activeTab === 'Payouts' ? 'payout' : 'deduction';
        const res = await axios.get(`${BASE_URL}/api/sellers/settlements`, {
          params: { store_id: selectedStoreId, type, search }
        });
        if (res.data.success) {
          setRecords(res.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching settlements:', err);
      toast.error('Failed to load settlement data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchSettlementData();
    setPage(1);
  }, [showHistory, activeTab, selectedStoreId, search]);

  const handleSettleAll = async () => {
    setSettling(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/sellers/settlements/settle`, {
        store_id: selectedStoreId || null
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Settlement processed successfully');
        setShowSettleModal(false);
        fetchSettlementData();
      } else {
        toast.error(res.data.message || 'Failed to process settlements');
      }
    } catch (err) {
      console.error('Error processing settlement:', err);
      toast.error('Failed to process settlement');
    } finally {
      setSettling(false);
    }
  };

  const handleExport = () => {
    if (records.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = showHistory 
      ? ['ID', 'Seller Name', 'Order ID', 'Type', 'Amount', 'Description', 'Settlement Date', 'Reference']
      : ['ID', 'Seller Name', 'Order ID', 'Type', 'Amount', 'Description', 'Posted At'];

    const csvContent = [
      headers.join(','),
      ...records.map(r => {
        const row = [
          r.id,
          `"${r.seller_name || 'N/A'}"`,
          r.order_number || 'N/A',
          r.entry_type.toUpperCase(),
          parseFloat(String(r.amount)).toFixed(2),
          `"${r.description || ''}"`
        ];
        if (showHistory) {
          row.push(formatDate(r.settled_at || ''), `"${r.settlement_reference || ''}"`);
        } else {
          row.push(formatDate(r.posted_at || ''));
        }
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${showHistory ? 'settlement_history' : 'unsettled_commissions'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: string | number) => {
    const num = parseFloat(String(val));
    return isNaN(num) ? '₹0.00' : `₹${num.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    } catch {
      return dateStr;
    }
  };

  // Pagination Math
  const totalEntries = records.length;
  const totalPages = Math.ceil(totalEntries / limit) || 1;
  const paginatedRecords = records.slice((page - 1) * limit, page * limit);

  const thStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: '13px',
    color: 'white',
    fontWeight: '200',
    textTransform: 'uppercase',
    textAlign: 'left',
    letterSpacing: '0.1em',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    borderBottom: '2px solid white',
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Confirm Settlement Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 blur-[80px] rounded-full" />

            <button
              onClick={() => setShowSettleModal(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center mb-6 mt-2 relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
              <Check size={32} className="text-blue-500 relative z-10" />
            </div>

            <h2 className="text-white text-[20px] font-bold tracking-tight mb-2 italic">Confirm Settlement</h2>
            <p className="text-slate-400 text-[14px] text-center mb-10 leading-relaxed font-medium">
              Are you sure you want to settle all unsettled commissions for the selected period? This action is permanent.
            </p>

            <div className="flex gap-4 w-full pt-6 border-t border-[#1e293b]">
              <button
                onMouseEnter={() => setHoveredBtn('modal-back')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setShowSettleModal(false)}
                className="flex-1 py-3 text-[13px] font-bold transition-all uppercase tracking-widest active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #64748b',
                  backgroundColor: hoveredBtn === 'modal-back' ? '#64748b' : 'transparent',
                  color: hoveredBtn === 'modal-back' ? 'white' : '#94a3b8',
                }}
              >
                Go Back
              </button>
              <button
                onMouseEnter={() => setHoveredBtn('modal-confirm')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={handleSettleAll}
                disabled={settling}
                className="flex-1 py-3 text-[13px] font-bold transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-blue-500/10"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  backgroundColor: hoveredBtn === 'modal-confirm' ? '#10b981' : 'transparent',
                  color: hoveredBtn === 'modal-confirm' ? 'white' : '#10b981',
                }}
              >
                {settling ? 'Settling...' : 'Yes, Settle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Buttons */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">
              {showHistory ? 'Settlement History' : 'Earnings & Deductions'}
            </h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">{showHistory ? 'Settlement History' : 'Settlement Overview'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <select 
                value={selectedStoreId}
                onChange={(e) => { setSelectedStoreId(e.target.value); setPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer" 
                style={{ borderRadius: '12px' }}
              >
                <option value="">All Stores</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {!showHistory ? (
              <button
                onClick={() => setShowHistory(true)}
                onMouseEnter={() => setHoveredBtn('history')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'history' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'history' ? 'white' : '#3b82f6'
                }}
              >
                <History size={16} /> Settlement History
              </button>
            ) : (
              <button
                onClick={() => setShowHistory(false)}
                onMouseEnter={() => setHoveredBtn('back')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'back' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'back' ? 'white' : '#3b82f6'
                }}
              >
                <ArrowLeft size={16} /> Back to Unsettled
              </button>
            )}

            <button
              onClick={fetchSettlementData}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6'
              }}
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {!showHistory && (
          <>
            {/* Tabs Region */}
            <div className="mb-6 mt-4 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('Payouts')}
                className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: activeTab === 'Payouts' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'Payouts' ? 'white' : '#3b82f6',
                }}
              >
                <Wallet size={14} /> Payouts
              </button>
              <button
                onClick={() => setActiveTab('Returns')}
                className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: activeTab === 'Returns' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'Returns' ? 'white' : '#3b82f6',
                }}
              >
                <Undo2 size={14} /> Returns &amp; Deductions
              </button>
            </div>

            {/* Action Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowSettleModal(true)}
                onMouseEnter={() => setHoveredBtn('settle')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  backgroundColor: hoveredBtn === 'settle' ? '#10b981' : 'transparent',
                  color: hoveredBtn === 'settle' ? 'white' : '#10b981'
                }}
              >
                <Wallet size={18} /> Settle All Commissions
              </button>
            </div>
          </>
        )}

        {/* Search and Columns Row */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search description or order..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select 
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Columns Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200" 
                style={{ borderRadius: '12px' }}
              >
                Columns <ChevronDown size={14} className="inline opacity-60 ml-1" />
              </button>
              {showColumnsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e2736] border border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'orderDetails', label: 'Order Details' },
                    { key: 'entryType', label: 'Entry Type' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'lastUpdated', label: 'Date' },
                    ...(showHistory ? [
                      { key: 'settlementDate', label: 'Settled At' },
                      { key: 'settlementRef', label: 'Ref Link' }
                    ] : [])
                  ].map((col) => (
                    <div 
                      key={col.key}
                      onClick={() => setVisibleColumns(prev => ({ ...prev, [col.key]: !prev[col.key as keyof typeof visibleColumns] }))}
                      className="px-4 py-2 text-[14px] text-slate-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors flex items-center justify-between"
                    >
                      {col.label}
                      {visibleColumns[col.key as keyof typeof visibleColumns] && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleExport}
              onMouseEnter={() => setHoveredBtn('export')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'export' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'export' ? 'white' : '#3b82f6'
              }}
            >
              <Download size={16} /> Export <ChevronDown size={14} className="inline opacity-60 ml-1" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#2d3748] overflow-hidden rounded-t-sm overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[1200px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {visibleColumns.id && <th style={{ ...thStyle, width: '80px' }}><div className="flex items-center justify-between">ID <SortIcons /></div></th>}
                {visibleColumns.orderDetails && <th style={thStyle}><div className="flex items-center justify-between">Order / Details <SortIcons /></div></th>}
                {visibleColumns.entryType && <th style={thStyle}><div className="flex items-center justify-between">Entry Type <SortIcons /></div></th>}
                {visibleColumns.amount && <th style={thStyle}><div className="flex items-center justify-between">Amount <SortIcons /></div></th>}
                {visibleColumns.lastUpdated && <th style={thStyle}><div className="flex items-center justify-between">Date <SortIcons /></div></th>}

                {showHistory && (
                  <>
                    {visibleColumns.settlementDate && <th style={thStyle}><div className="flex items-center justify-between">Settled At <SortIcons /></div></th>}
                    {visibleColumns.settlementRef && <th style={{ ...thStyle, borderRight: 'none' }}><div className="flex items-center justify-between">Settlement Ref <SortIcons /></div></th>}
                  </>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading settlement records...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[14px] text-slate-500 font-light tracking-wide" style={{ fontWeight: '200' }}>No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    {visibleColumns.id && <td className="px-4 py-4 text-slate-300">{r.id}</td>}
                    {visibleColumns.orderDetails && (
                      <td className="px-4 py-4">
                        <span className="text-white font-medium block">{r.seller_name}</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">Order: {r.order_number || 'N/A'}</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{r.description}</span>
                      </td>
                    )}
                    {visibleColumns.entryType && (
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          r.entry_type === 'credit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {r.entry_type}
                        </span>
                      </td>
                    )}
                    {visibleColumns.amount && <td className="px-4 py-4 text-blue-400 font-bold">{formatCurrency(r.amount)}</td>}
                    {visibleColumns.lastUpdated && <td className="px-4 py-4 text-slate-400">{formatDate(r.posted_at || '')}</td>}

                    {showHistory && (
                      <>
                        {visibleColumns.settlementDate && <td className="px-4 py-4 text-slate-400">{formatDate(r.settled_at || '')}</td>}
                        {visibleColumns.settlementRef && <td className="px-4 py-4 text-emerald-400 font-mono text-[12px]">{r.settlement_reference || 'N/A'}</td>}
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Showing {paginatedRecords.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPage(1)} 
              disabled={page === 1}
              className={`text-slate-400 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              className={`text-slate-400 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="bg-blue-600 px-3 py-0.5 rounded text-white text-[12px] font-medium">{page}</div>
            <button 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              disabled={page === totalPages}
              className={`text-slate-400 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setPage(totalPages)} 
              disabled={page === totalPages}
              className={`text-slate-400 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
