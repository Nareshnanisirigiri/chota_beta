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
  CreditCard,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryBoyEarningsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface Earning {
  id: number;
  order_id: number;
  delivery_boy_name: string;
  status: string;
  total_earnings: string | number;
  payment_status: string;
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

export default function DeliveryBoyEarnings({ onLogout, onNavigate }: DeliveryBoyEarningsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search & Filter States
  const [search, setSearch] = useState<string>('');
  const [selectedBoyId, setSelectedBoyId] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  
  // Pay Modal States
  const [payModalOpen, setPayModalOpen] = useState<boolean>(false);
  const [selectedEarningId, setSelectedEarningId] = useState<number | null>(null);
  const [selectedEarningRow, setSelectedEarningRow] = useState<Earning | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [submittingPay, setSubmittingPay] = useState<boolean>(false);

  // Fetch Earnings
  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const params: any = { search };
      if (selectedBoyId) params.delivery_boy_id = selectedBoyId;
      
      const res = await axios.get(`${BASE_URL}/api/delivery-boys/earnings`, { params });
      if (res.data.success) {
        setEarnings(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching pending earnings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Delivery Boys for dropdown
  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-boys?limit=1000`);
      if (res.data.success) {
        setDeliveryBoys(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching delivery boys list:", err);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [selectedBoyId, search]);

  // Handle Pay Action
  const openPayModal = (earning: Earning) => {
    setSelectedEarningId(earning.id);
    setSelectedEarningRow(earning);
    setTransactionId('');
    setPayModalOpen(true);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEarningId) return;
    
    setSubmittingPay(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/delivery-boys/earnings/${selectedEarningId}/settle`, {
        transaction_id: transactionId
      });
      if (res.data.success) {
        alert("Payment settled successfully!");
        setPayModalOpen(false);
        fetchEarnings();
      }
    } catch (err) {
      console.error("Error settling payment:", err);
      alert("Failed to settle payment");
    } finally {
      setSubmittingPay(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const csvHeaders = "ID,Order ID,Delivery Boy,Status,Total Earnings,Payment Status,Created At";
    const csvRows = earnings.map(e => 
      `"${e.id}","${e.order_id}","${e.delivery_boy_name}","${e.status}","${parseFloat(String(e.total_earnings)).toFixed(2)}","${e.payment_status}","${e.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pending_earnings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Math
  const totalEntries = earnings.length;
  const totalPages = Math.ceil(totalEntries / limit) || 1;
  const paginatedEarnings = earnings.slice((page - 1) * limit, page * limit);

  // Formatter
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
    { label: "ORDER ID", width: "120px" },
    { label: "DELIVERY BOY", width: "auto" },
    { label: "STATUS", width: "120px" },
    { label: "TOTAL EARNINGS", width: "180px" },
    { label: "PAYMENT STATUS", width: "180px" },
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
            <h1 className="text-white text-[18px] font-bold tracking-tight">Pending Payments</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Pending Payments</span>
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
              onClick={() => onNavigate('delivery-boys-earnings-history')}
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
              <History size={16} /> Payment History
            </button>

            <button 
              onClick={fetchEarnings}
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
              placeholder="Search by order ID or name..."
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
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1100px]">
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
                  <td colSpan={8} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading pending earnings...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedEarnings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEarnings.map((earn) => (
                  <tr key={earn.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{earn.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">#{earn.order_id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 font-medium text-[13px]">{earn.delivery_boy_name}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] capitalize">
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[12px]">{earn.status}</span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-emerald-400 font-bold text-[14px]">{formatCurrency(earn.total_earnings)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[12px] font-medium capitalize">
                        {earn.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-400 text-[12px]">{formatDate(earn.created_at)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <button
                        onClick={() => openPayModal(earn)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-[12px] transition-all duration-200 active:scale-95"
                      >
                        <CreditCard size={13} /> Settle
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
            Showing {paginatedEarnings.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* SETTLEMENT MODAL */}
      {payModalOpen && selectedEarningRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#1e293b]">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <CreditCard className="text-blue-500" size={18} /> Settle Delivery Boy Payment
              </h3>
              <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div className="p-4 bg-[#1e2736] rounded-lg border border-[#2d3748] text-[13px] space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Delivery Boy:</span> <span className="text-white font-medium">{selectedEarningRow.delivery_boy_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Order ID:</span> <span className="text-white">#{selectedEarningRow.order_id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Amount Due:</span> <span className="text-emerald-400 font-bold">{formatCurrency(selectedEarningRow.total_earnings)}</span></div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-slate-400 uppercase font-medium">Transaction / Reference ID</label>
                <input
                  type="text"
                  placeholder="Enter Bank or UPI Transaction Ref"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-[#0c101a] border border-[#2d3748] rounded px-3 py-2 text-[13px] text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 rounded text-[13px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPay}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2 rounded text-[13px] transition-colors flex items-center justify-center gap-2"
                >
                  {submittingPay && <RefreshCcw size={14} className="animate-spin" />}
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
