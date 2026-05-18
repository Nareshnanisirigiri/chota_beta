import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2
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

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

interface WalletTransactionsProps {
  onLogout: () => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function WalletTransactions({ onLogout }: WalletTransactionsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  
  // Data and UI states
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    customer: '',
    customCustomer: '',
    amount: '',
    transactionRef: '',
    type: 'deposit',
    status: 'Completed',
    paymentMethod: 'system'
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/wallet-transactions`);
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load wallet transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users for dropdown:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      customer: '',
      customCustomer: '',
      amount: '',
      transactionRef: '',
      type: 'deposit',
      status: 'Completed',
      paymentMethod: 'system'
    });
    setSelectedTransaction(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsEditModal(true);
    
    // Check if customer matches an existing user name
    const matchesUser = users.some(u => u.name === transaction.customer);
    
    setFormData({
      customer: matchesUser ? transaction.customer : 'CUSTOM_INPUT',
      customCustomer: matchesUser ? '' : transaction.customer,
      amount: String(transaction.amount),
      transactionRef: transaction.transactionRef || '',
      type: transaction.type,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod
    });
    
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction record?')) return;
    
    try {
      await axios.delete(`${BASE_URL}/api/wallet-transactions/${id}`);
      toast.success('Transaction deleted successfully');
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleSubmit = async () => {
    // Validate fields
    const finalCustomer = formData.customer === 'CUSTOM_INPUT' ? formData.customCustomer : formData.customer;
    
    if (!finalCustomer) {
      toast.error('Customer name is required');
      return;
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer: finalCustomer,
        amount: parseFloat(formData.amount),
        transactionRef: formData.transactionRef || null,
        type: formData.type,
        status: formData.status,
        paymentMethod: formData.paymentMethod
      };

      if (isEditModal && selectedTransaction) {
        await axios.put(`${BASE_URL}/api/wallet-transactions/${selectedTransaction.id}`, payload);
        toast.success('Transaction updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/wallet-transactions`, payload);
        toast.success('Transaction created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      const msg = error.response?.data?.message || 'Failed to save transaction';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Customer', 'Amount', 'Transaction Ref', 'Type', 'Status', 'Payment Method', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        `"${t.customer}"`,
        t.amount,
        `"${t.transactionRef || ''}"`,
        t.type,
        t.status,
        t.paymentMethod,
        t.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  // Filter and search
  const filteredTransactions = transactions.filter(t => 
    t.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalEntries = filteredTransactions.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Pagination navigation helpers
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

        {/* Row 1: Header and Primary Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Wallet Transactions</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => window.location.reload()}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Wallet Transactions</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setIsEditModal(false); setIsModalOpen(true); }}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Transaction
            </button>

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
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />} Refresh
            </button>
          </div>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search transactions..."
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
                  { label: "TYPE", width: "120px" },
                  { label: "STATUS", width: "130px" },
                  { label: "PAYMENT METHOD", width: "160px" },
                  { label: "CREATED AT", width: "180px" },
                  { label: "ACTIONS", width: "120px" }
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
                  <td colSpan={8} className="py-20 text-center text-slate-400">
                    <Loader2 size={40} className="animate-spin mx-auto text-blue-500 opacity-50 mb-3" />
                    Loading transactions...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-400 font-light">
                    No transactions found
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
                    <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', textAlign: 'center' }}>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider ${
                        row.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        row.type === 'withdrawal' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', textAlign: 'center' }}>
                      <span className={`uppercase tracking-widest whitespace-nowrap text-[13px] font-medium ${
                        row.status === 'Completed' ? 'text-emerald-400' :
                        row.status === 'Pending' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em', textAlign: 'center' }}>
                      {row.paymentMethod}
                    </td>
                    <td className="border-r border-[#2d3748]/30 text-slate-400 uppercase" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '12px', fontWeight: '200', letterSpacing: '0.1em' }}>
                      {row.createdAt ? new Date(row.createdAt).toISOString().replace('T', ' ').substring(0, 19) : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-start gap-2">
                        <button
                          onClick={() => handleEditClick(row)}
                          onMouseEnter={() => setHoveredAction(`${row.id}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            backgroundColor: hoveredAction === `${row.id}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${row.id}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          onMouseEnter={() => setHoveredAction(`${row.id}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #ef4444',
                            backgroundColor: hoveredAction === `${row.id}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${row.id}-delete` ? 'white' : '#ef4444'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
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

      {/* Add/Edit Modal (Standardized 500px Card) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 overflow-hidden text-left"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
          {/* Main Card - FORCED WIDTH 500px */}
          <div
            className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden"
            style={{
              backgroundColor: '#111827',
              width: '500px',
              maxWidth: '95vw',
              maxHeight: '85vh'
            }}
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">
                  {isEditModal ? 'Update Transaction' : 'Add Wallet Transaction'}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar" style={{ backgroundColor: '#111827' }}>
              {/* Customer selection */}
              <div className="space-y-2">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Select Customer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  >
                    <option value="">-- Choose customer --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.email || u.mobile || 'No contact'})
                      </option>
                    ))}
                    <option value="CUSTOM_INPUT">-- Enter custom name instead --</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {/* Custom Customer Input if selected */}
              {(formData.customer === 'CUSTOM_INPUT' || users.length === 0) && (
                <div className="space-y-2">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customCustomer"
                    value={formData.customCustomer}
                    onChange={handleInputChange}
                    placeholder="Enter custom customer name"
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  />
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Amount (INR ₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount (e.g. 150.00)"
                  step="0.01"
                  min="0"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                />
              </div>

              {/* Transaction Ref */}
              <div className="space-y-2">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  name="transactionRef"
                  value={formData.transactionRef}
                  onChange={handleInputChange}
                  placeholder="Enter transaction reference"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                />
              </div>

              {/* Grid for Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="refund">Refund</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Payment Method
                </label>
                <div className="relative">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  >
                    <option value="system">system</option>
                    <option value="razorpay">razorpay</option>
                    <option value="stripe">stripe</option>
                    <option value="cash">cash</option>
                    <option value="bank_transfer">bank transfer</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                onMouseEnter={() => setHoveredBtn('save')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-3 px-8 py-3 transition-all duration-300 text-[13px] font-bold active:scale-95 whitespace-nowrap disabled:opacity-50"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'save' ? 'white' : '#3b82f6',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)'
                }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isEditModal ? 'Save Changes' : 'Create Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
