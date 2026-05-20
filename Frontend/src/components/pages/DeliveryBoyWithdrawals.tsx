import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database,
  History,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryBoyWithdrawalsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface WithdrawalRequest {
  id: number;
  delivery_boy_id: number;
  delivery_boy_name: string;
  amount: string | number;
  status: string;
  request_note: string | null;
  created_at: string;
}

interface DeliveryBoy {
  id: number;
  full_name: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={12} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={12} style={{ display: 'block' }} />
  </div>
);

export default function DeliveryBoyWithdrawals({ onLogout, onNavigate }: DeliveryBoyWithdrawalsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search & Filters
  const [search, setSearch] = useState<string>('');
  const [selectedBoyId, setSelectedBoyId] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  
  // Action Modal States
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<WithdrawalRequest | null>(null);
  const [actionStatus, setActionStatus] = useState<'approved' | 'rejected'>('approved');
  const [adminRemark, setAdminRemark] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const params: any = { search };
      if (selectedBoyId) params.delivery_boy_id = selectedBoyId;

      const res = await axios.get(`${BASE_URL}/api/delivery-boys/withdrawals`, { params });
      if (res.data.success) {
        setWithdrawals(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching pending withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-boys?limit=1000`);
      if (res.data.success) {
        setDeliveryBoys(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [selectedBoyId, search]);

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
      const res = await axios.put(`${BASE_URL}/api/delivery-boys/withdrawals/${selectedRow.id}`, {
        status: actionStatus,
        admin_remark: adminRemark
      });
      if (res.data.success) {
        alert(`Withdrawal request ${actionStatus} successfully!`);
        setModalOpen(false);
        fetchWithdrawals();
      }
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      alert("Failed to process withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const csvHeaders = "ID,Delivery Boy,Amount,Status,Request Note,Created At";
    const csvRows = withdrawals.map(w => 
      `"${w.id}","${w.delivery_boy_name}","${parseFloat(String(w.amount)).toFixed(2)}","${w.status}","${w.request_note || ''}","${w.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pending_withdrawals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Math
  const totalEntries = withdrawals.length;
  const totalPages = Math.ceil(totalEntries / limit) || 1;
  const paginatedWithdrawals = withdrawals.slice((page - 1) * limit, page * limit);

  // Formatters
  const formatCurrency = (val: string | number) => {
    const num = parseFloat(String(val));
    return isNaN(num) ? '₹0.00' : `₹${num.toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const headers = [
    { label: "ID", width: "80px" },
    { label: "DELIVERY BOY", width: "auto" },
    { label: "AMOUNT", width: "150px" },
    { label: "STATUS", width: "120px" },
    { label: "REQUEST NOTE", width: "250px" },
    { label: "CREATED AT", width: "180px" },
    { label: "ACTION", width: "100px" }
  ];

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header and Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Pending Withdrawal Requests</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Withdrawals</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <select 
                value={selectedBoyId}
                onChange={(e) => { setSelectedBoyId(e.target.value); setPage(1); }}
                className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="">All Delivery Boys</option>
                {deliveryBoys.map(db => (
                  <option key={db.id} value={db.id}>{db.full_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <button 
              onClick={() => onNavigate('delivery-boys-withdrawal-history')}
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
              <History size={16} /> Withdrawal History
            </button>

            <button 
              onClick={fetchWithdrawals}
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
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Row 2: Search and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search request note..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[240px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select 
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-400">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Row 3: Table Section with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1000px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {headers.map((header, idx) => (
                  <th 
                    key={header.label}
                    style={{ 
                      padding: '10px 16px', 
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '200',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      width: header.width,
                      whiteSpace: 'nowrap',
                      borderTop: '2px solid white',
                      borderBottom: '2px solid white',
                      borderLeft: idx === 0 ? '2px solid white' : 'none',
                      borderRight: idx === headers.length - 1 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading withdrawals...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{w.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">{w.delivery_boy_name}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-emerald-400 font-bold text-[14px]">{formatCurrency(w.amount)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[12px] font-medium capitalize">
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{w.request_note || 'N/A'}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-400 text-[12px]">{formatDate(w.created_at)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <button
                        onClick={() => openActionModal(w)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[12px] transition-all duration-200 active:scale-95"
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Footers Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
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

      {/* WITHDRAWAL PROCESS MODAL */}
      {modalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#1e293b]">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                Process Withdrawal Request
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
              <div className="p-4 bg-[#1e2736] rounded-lg border border-[#2d3748] text-[13px] space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Delivery Boy:</span> <span className="text-white font-medium">{selectedRow.delivery_boy_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Amount Requested:</span> <span className="text-emerald-400 font-bold">{formatCurrency(selectedRow.amount)}</span></div>
                {selectedRow.request_note && (
                  <div className="flex justify-between flex-col border-t border-[#2d3748] pt-2">
                    <span className="text-slate-400 block mb-1">Request Note:</span>
                    <span className="text-slate-200 italic font-light">{selectedRow.request_note}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-slate-400 uppercase font-medium">Action</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="action_status" 
                      value="approved" 
                      checked={actionStatus === 'approved'} 
                      onChange={() => setActionStatus('approved')}
                      className="accent-blue-600"
                    />
                    Approve & Pay
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="action_status" 
                      value="rejected" 
                      checked={actionStatus === 'rejected'} 
                      onChange={() => setActionStatus('rejected')}
                      className="accent-blue-600"
                    />
                    Reject Request
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-slate-400 uppercase font-medium">Remarks / Transaction Details</label>
                <textarea
                  placeholder="Enter UPI transaction ID, bank reference, or rejection remark..."
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  className="w-full bg-[#0c101a] border border-[#2d3748] rounded px-3 py-2 text-[13px] text-white focus:outline-none focus:border-blue-500 min-h-[60px] resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2 rounded text-[13px] transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <RefreshCcw size={14} className="animate-spin" />}
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
