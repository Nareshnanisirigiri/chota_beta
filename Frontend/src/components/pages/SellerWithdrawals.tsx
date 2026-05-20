import React, { useEffect, useState } from 'react';
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
  ArrowLeft,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface SellerWithdrawalsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

interface WithdrawalRequest {
  id: number;
  seller_id: number;
  seller_name: string;
  amount: string | number;
  status: string;
  request_note: string | null;
  admin_remark: string | null;
  processed_at?: string;
  created_at: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function SellerWithdrawals({ onLogout, onNavigate, currentPage }: SellerWithdrawalsProps) {
  const [showHistory, setShowHistory] = useState(currentPage === 'withdrawal-history');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search & Filters
  const [search, setSearch] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  
  // Action Modal States
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<WithdrawalRequest | null>(null);
  const [actionStatus, setActionStatus] = useState<'approved' | 'rejected'>('approved');
  const [adminRemark, setAdminRemark] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    seller: true,
    amount: true,
    status: true,
    requestNote: true,
    createdAt: true,
    adminRemark: true,
    processedAt: true,
    action: true
  });
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const endpoint = showHistory ? '/api/sellers/withdrawals-history' : '/api/sellers/withdrawals';
      const res = await axios.get(`${BASE_URL}${endpoint}`, {
        params: { search }
      });
      if (res.data.success) {
        setWithdrawals(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      toast.error("Failed to load withdrawal data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowHistory(currentPage === 'withdrawal-history');
    setPage(1);
  }, [currentPage]);

  useEffect(() => {
    fetchWithdrawals();
  }, [showHistory, search]);

  const openActionModal = (row: WithdrawalRequest) => {
    setSelectedRow(row);
    setActionStatus('approved');
    setAdminRemark('');
    setModalOpen(true);
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;

    setSubmitting(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/sellers/withdrawals/${selectedRow.id}`, {
        status: actionStatus,
        admin_remark: adminRemark
      });
      if (res.data.success) {
        toast.success(`Withdrawal request ${actionStatus} successfully`);
        setModalOpen(false);
        fetchWithdrawals();
      } else {
        toast.error(res.data.message || "Failed to process withdrawal request");
      }
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      toast.error("Failed to process withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    if (withdrawals.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = showHistory 
      ? ['ID', 'Seller Name', 'Amount', 'Status', 'Request Note', 'Admin Remark', 'Processed At']
      : ['ID', 'Seller Name', 'Amount', 'Status', 'Request Note', 'Created At'];

    const csvContent = [
      headers.join(','),
      ...withdrawals.map(w => {
        const row = [
          w.id,
          `"${w.seller_name || 'N/A'}"`,
          parseFloat(String(w.amount)).toFixed(2),
          w.status.toUpperCase(),
          `"${w.request_note || ''}"`
        ];
        if (showHistory) {
          row.push(`"${w.admin_remark || ''}"`, formatDate(w.processed_at || ''));
        } else {
          row.push(formatDate(w.created_at));
        }
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${showHistory ? 'seller_withdrawal_history' : 'seller_pending_withdrawals'}_${new Date().toISOString().split('T')[0]}.csv`);
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
  const totalEntries = withdrawals.length;
  const totalPages = Math.ceil(totalEntries / limit) || 1;
  const paginatedWithdrawals = withdrawals.slice((page - 1) * limit, page * limit);

  const thStyle: React.CSSProperties = {
    padding: '10px 16px',
    fontSize: '14px',
    color: 'white',
    fontWeight: '200',
    textTransform: 'uppercase',
    textAlign: 'left',
    letterSpacing: '0.08em',
    borderRight: '1px solid rgba(255, 255, 255, 0.4)',
    borderBottom: '2px solid white',
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Primary Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">
              {showHistory ? 'Withdrawal History' : 'Pending Withdrawal Requests'}
            </h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">{showHistory ? 'Withdrawal History' : 'Seller Withdrawals'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!showHistory ? (
              <button
                onClick={() => onNavigate('withdrawal-history')}
                onMouseEnter={() => setHoveredBtn('history')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5 whitespace-nowrap"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'history' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'history' ? 'white' : '#3b82f6'
                }}
              >
                <History size={16} /> Withdrawal History
              </button>
            ) : (
              <button
                onClick={() => onNavigate('seller-withdrawals')}
                onMouseEnter={() => setHoveredBtn('back')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5 whitespace-nowrap"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'back' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'back' ? 'white' : '#3b82f6'
                }}
              >
                <ArrowLeft size={16} /> Back to Pending
              </button>
            )}

            <button
              onClick={fetchWithdrawals}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5 whitespace-nowrap"
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

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search note or seller..."
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
                    { key: 'seller', label: 'Seller' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'status', label: 'Status' },
                    { key: 'requestNote', label: 'Request Note' },
                    { key: 'createdAt', label: 'Created At' },
                    ...(showHistory ? [
                      { key: 'adminRemark', label: 'Admin Remark' },
                      { key: 'processedAt', label: 'Processed At' }
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
                {visibleColumns.seller && <th style={thStyle}><div className="flex items-center justify-between">Seller <SortIcons /></div></th>}
                {visibleColumns.amount && <th style={thStyle}><div className="flex items-center justify-between">Amount <SortIcons /></div></th>}
                {visibleColumns.status && <th style={thStyle}><div className="flex items-center justify-between">Status <SortIcons /></div></th>}
                {visibleColumns.requestNote && <th style={thStyle}><div className="flex items-center justify-between">Request Note <SortIcons /></div></th>}
                
                {showHistory ? (
                  <>
                    {visibleColumns.adminRemark && <th style={thStyle}><div className="flex items-center justify-between">Admin Remark <SortIcons /></div></th>}
                    {visibleColumns.processedAt && <th style={thStyle}><div className="flex items-center justify-between">Processed At <SortIcons /></div></th>}
                  </>
                ) : (
                  <>
                    {visibleColumns.createdAt && <th style={thStyle}><div className="flex items-center justify-between">Created At <SortIcons /></div></th>}
                  </>
                )}
                {!showHistory && visibleColumns.action && (
                  <th style={{ ...thStyle, borderRight: 'none', width: '150px', textAlign: 'center' }}>
                    ACTION
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading withdrawals...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '200' }}>No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    {visibleColumns.id && <td className="px-4 py-4 text-slate-300">{w.id}</td>}
                    {visibleColumns.seller && <td className="px-4 py-4 text-white font-medium">{w.seller_name || 'N/A'}</td>}
                    {visibleColumns.amount && <td className="px-4 py-4 text-blue-400 font-bold">{formatCurrency(w.amount)}</td>}
                    {visibleColumns.status && (
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          w.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.requestNote && <td className="px-4 py-4 text-slate-300 max-w-[200px] truncate">{w.request_note || 'N/A'}</td>}
                    
                    {showHistory ? (
                      <>
                        {visibleColumns.adminRemark && <td className="px-4 py-4 text-slate-300 max-w-[200px] truncate">{w.admin_remark || 'N/A'}</td>}
                        {visibleColumns.processedAt && <td className="px-4 py-4 text-slate-400">{formatDate(w.processed_at || '')}</td>}
                      </>
                    ) : (
                      <>
                        {visibleColumns.createdAt && <td className="px-4 py-4 text-slate-400">{formatDate(w.created_at)}</td>}
                      </>
                    )}
                    
                    {!showHistory && visibleColumns.action && (
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openActionModal(w)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[12px] font-medium transition-colors"
                        >
                          Process
                        </button>
                      </td>
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
            Showing {paginatedWithdrawals.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* Action Modal */}
      {modalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#2d3748] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
              <h3 className="text-white text-[16px] font-semibold">Process Withdrawal Request</h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
              <div>
                <span className="text-[12px] text-slate-400 uppercase tracking-wider block mb-1">Seller</span>
                <span className="text-white font-medium block">{selectedRow.seller_name}</span>
              </div>

              <div>
                <span className="text-[12px] text-slate-400 uppercase tracking-wider block mb-1">Amount</span>
                <span className="text-blue-400 font-bold block text-lg">{formatCurrency(selectedRow.amount)}</span>
              </div>

              <div>
                <span className="text-[12px] text-slate-400 uppercase tracking-wider block mb-1">Request Note</span>
                <span className="text-slate-300 text-[13px] block italic bg-[#0c111d] p-3 rounded-lg border border-[#2d3748]/50">
                  {selectedRow.request_note || 'No request note provided'}
                </span>
              </div>

              <div>
                <label className="block text-[12px] text-slate-400 uppercase tracking-wider mb-2">Action Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActionStatus('approved')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                      actionStatus === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                        : 'bg-transparent text-slate-400 border-[#2d3748] hover:text-white'
                    }`}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionStatus('rejected')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                      actionStatus === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border-red-500/50 shadow-lg shadow-red-500/5'
                        : 'bg-transparent text-slate-400 border-[#2d3748] hover:text-white'
                    }`}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] text-slate-400 uppercase tracking-wider mb-2">Admin Remark</label>
                <textarea
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Enter notes or rejection reason..."
                  rows={3}
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-slate-300 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-slate-400 hover:text-white border border-[#2d3748] rounded-xl text-[13px] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-medium transition-colors flex items-center gap-2"
                >
                  {submitting && <RefreshCcw size={14} className="animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
