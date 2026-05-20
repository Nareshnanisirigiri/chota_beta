import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database,
  Loader2,
  Check,
  X
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface WalletTransaction {
  id: number;
  customer: string;
  amount: string | number;
  transactionRef: string | null;
  type: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface PendingWalletDepositsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function PendingWalletDeposits({ onLogout, onNavigate }: PendingWalletDepositsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/wallet-transactions`);
      const allTxns = response.data.data || [];
      // Filter for pending transactions (mostly deposits)
      const pendingTxns = allTxns.filter((t: WalletTransaction) => t.status?.toLowerCase() === 'pending');
      setTransactions(pendingTxns);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load pending deposits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleStatusUpdate = async (row: WalletTransaction, newStatus: 'Completed' | 'Failed') => {
    const actionText = newStatus === 'Completed' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${actionText} this deposit?`)) return;

    setIsProcessing(row.id);
    try {
      const payload = {
        customer: row.customer,
        amount: row.amount,
        transactionRef: row.transactionRef,
        type: row.type,
        status: newStatus,
        paymentMethod: row.paymentMethod
      };

      await axios.put(`${BASE_URL}/api/wallet-transactions/${row.id}`, payload);
      toast.success(`Deposit ${actionText}d successfully`);
      fetchTransactions();
    } catch (error) {
      console.error(`Error updating deposit status to ${newStatus}:`, error);
      toast.error(`Failed to ${actionText} deposit`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Customer', 'Amount', 'Transaction Ref', 'Payment Method', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        `"${t.customer}"`,
        t.amount,
        `"${t.transactionRef || ''}"`,
        t.paymentMethod,
        t.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pending_deposits_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported pending deposits to CSV');
  };

  // Search filter
  const filteredTransactions = transactions.filter(t => 
    t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(t.amount).includes(searchTerm)
  );

  // Pagination logic
  const totalEntries = filteredTransactions.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Refresh Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Pending Wallet Deposits</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Pending Deposits</span>
            </nav>
          </div>

          <button
            onClick={fetchTransactions}
            onMouseEnter={() => setHoveredBtn('refresh')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-sm shadow-blue-500/5"
            style={{
              border: '2px solid #3b82f6',
              backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
              color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6',
              padding: '6px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={16} /> Refresh
          </button>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search pending deposits..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none placeholder:text-slate-600 rounded-md"
            />
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={entriesPerPage}
                  onChange={(e) => { setEntriesPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                  className="bg-[#1e2736] border border-[#2d3748] pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer rounded-md"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
              </div>
              <span className="text-[13px] text-white" style={{ fontWeight: '200' }}>entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              onMouseEnter={() => setHoveredBtn('export')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/5"
              style={{
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'export' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'export' ? 'white' : '#3b82f6',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Area with baseline 16px alignment */}
        <div className="border border-[#2d3748]/50 overflow-hidden rounded-sm">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "CUSTOMER", width: "auto" },
                  { label: "AMOUNT", width: "180px" },
                  { label: "PAYMENT METHOD", width: "180px" },
                  { label: "CREATED AT", width: "180px" },
                  { label: "ACTION", width: "150px" }
                ].map((header) => (
                  <th
                    key={header.label}
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
                      borderBottom: '2px solid white',
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '200',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      width: header.width
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {header.label}
                      <SortIcons />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">
                    <Loader2 size={40} className="animate-spin mx-auto text-blue-500 opacity-50 mb-3" />
                    Loading deposits...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Database size={40} strokeWidth={1} />
                      <span className="text-[10px] uppercase tracking-widest">No pending deposits found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      {row.id}
                    </td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      {row.customer}
                    </td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-emerald-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '14px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      <div>₹{parseFloat(String(row.amount)).toFixed(2)}</div>
                      {row.transactionRef && (
                        <div className="text-slate-600 font-normal lowercase tracking-tight line-clamp-1" style={{ fontSize: '10px' }}>
                          {row.transactionRef}
                        </div>
                      )}
                    </td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      {row.paymentMethod}
                    </td>
                    <td className="border-r border-[#2d3748]/30 text-slate-400 uppercase" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '12px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      {row.createdAt ? new Date(row.createdAt).toISOString().replace('T', ' ').substring(0, 19) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-start gap-2">
                        {isProcessing === row.id ? (
                          <Loader2 size={16} className="animate-spin text-blue-500 mx-auto" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(row, 'Completed')}
                              onMouseEnter={() => setHoveredAction(`${row.id}-approve`)}
                              onMouseLeave={() => setHoveredAction(null)}
                              className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                              title="Approve Deposit"
                              style={{
                                borderRadius: '12px',
                                border: '2px solid #10b981',
                                backgroundColor: hoveredAction === `${row.id}-approve` ? '#10b981' : 'transparent',
                                color: hoveredAction === `${row.id}-approve` ? 'white' : '#10b981'
                              }}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(row, 'Failed')}
                              onMouseEnter={() => setHoveredAction(`${row.id}-reject`)}
                              onMouseLeave={() => setHoveredAction(null)}
                              className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                              title="Reject Deposit"
                              style={{
                                borderRadius: '12px',
                                border: '2px solid #ef4444',
                                backgroundColor: hoveredAction === `${row.id}-reject` ? '#ef4444' : 'transparent',
                                color: hoveredAction === `${row.id}-reject` ? 'white' : '#ef4444'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[1px] bg-white opacity-40 w-full mb-6 mt-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {totalEntries > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
          </p>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronsLeft size={14} />
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={14} />
            </button>
            
            <div className="border border-white/20 px-3 py-0.5 rounded text-white text-[11px] font-thin bg-blue-600/30">
              {currentPage} / {totalPages}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
