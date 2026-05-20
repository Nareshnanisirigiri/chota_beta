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
  CheckSquare,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryBoyCashCollectionsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface CashCollection {
  id: number;
  order_id: number;
  delivery_boy_name: string;
  status: string;
  cod_cash_collected: string | number;
  cod_cash_submitted: string | number;
  cash_remaining: string | number;
  cod_submission_status: string;
  created_at: string;
}

interface DeliveryBoy {
  id: number;
  full_name: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function DeliveryBoyCashCollections({ onLogout, onNavigate }: DeliveryBoyCashCollectionsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [collections, setCollections] = useState<CashCollection[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search & Filters
  const [search, setSearch] = useState<string>('');
  const [selectedBoyId, setSelectedBoyId] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  
  // Submission Modal States
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<CashCollection | null>(null);
  const [submitAmount, setSubmitAmount] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const params: any = { search };
      if (selectedBoyId) params.delivery_boy_id = selectedBoyId;

      const res = await axios.get(`${BASE_URL}/api/delivery-boys/cash-collections`, { params });
      if (res.data.success) {
        setCollections(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching cash collections:", err);
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
      console.error("Error fetching delivery boys list:", err);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [selectedBoyId, search]);

  const openSubmitModal = (row: CashCollection) => {
    setSelectedRow(row);
    setSubmitAmount(String(parseFloat(String(row.cash_remaining)).toFixed(2)));
    setSubmitModalOpen(true);
  };

  const handleSubmitCash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRow) return;

    const amt = parseFloat(submitAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid submission amount.");
      return;
    }

    if (amt > parseFloat(String(selectedRow.cash_remaining))) {
      alert(`Submission amount cannot exceed remaining cash (${formatCurrency(selectedRow.cash_remaining)})`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/delivery-boys/cash-submit`, {
        assignment_id: selectedRow.id,
        amount: amt
      });
      if (res.data.success) {
        alert("Cash submission recorded successfully!");
        setSubmitModalOpen(false);
        fetchCollections();
      }
    } catch (err) {
      console.error("Error submitting cash:", err);
      alert("Failed to submit cash collection");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const csvHeaders = "ID,Order ID,Delivery Boy,Status,Cash Collected,Cash Submitted,Cash Remaining,Submission Status,Created At";
    const csvRows = collections.map(c => 
      `"${c.id}","${c.order_id}","${c.delivery_boy_name}","${c.status}","${parseFloat(String(c.cod_cash_collected)).toFixed(2)}","${parseFloat(String(c.cod_cash_submitted)).toFixed(2)}","${parseFloat(String(c.cash_remaining)).toFixed(2)}","${c.cod_submission_status}","${c.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pending_cash_collections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Math
  const totalEntries = collections.length;
  const totalPages = Math.ceil(totalEntries / limit) || 1;
  const paginatedCollections = collections.slice((page - 1) * limit, page * limit);

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
    { label: "ID", width: "70px" },
    { label: "ORDER ID", width: "120px" },
    { label: "DELIVERY BOY", width: "auto" },
    { label: "STATUS", width: "120px" },
    { label: "CASH COLLECTED", width: "180px" },
    { label: "CASH SUBMITTED", width: "180px" },
    { label: "CASH REMAINING", width: "180px" },
    { label: "SUBMISSION STATUS", width: "180px" },
    { label: "CREATED AT", width: "150px" },
    { label: "ACTION", width: "90px" }
  ];

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header and Primary Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Pending Cash Collections</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Cash Collections</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[200px]">
              <select 
                value={selectedBoyId}
                onChange={(e) => { setSelectedBoyId(e.target.value); setPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="">All Delivery Boys</option>
                {deliveryBoys.map(db => (
                  <option key={db.id} value={db.id}>{db.full_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button 
              onClick={() => onNavigate('cash-collection-history')}
              onMouseEnter={() => setHoveredBtn('history')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'history' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'history' ? 'white' : '#3b82f6'
              }}
            >
              <History size={16} /> Submission History
            </button>

            <button 
              onClick={fetchCollections}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
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

        {/* Row 2: Search and Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by order ID or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
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

        {/* Row 3: Table Area with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1300px]">
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
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading cash collections...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedCollections.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCollections.map((col) => (
                  <tr key={col.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{col.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">#{col.order_id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 font-medium text-[13px]">{col.delivery_boy_name}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] capitalize">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[12px]">{col.status}</span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{formatCurrency(col.cod_cash_collected)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{formatCurrency(col.cod_cash_submitted)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-amber-400 font-bold text-[14px]">{formatCurrency(col.cash_remaining)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      <span className={`px-2 py-0.5 rounded-full text-[12px] capitalize font-medium ${
                        col.cod_submission_status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                      }`}>
                        {col.cod_submission_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-400 text-[12px]">{formatDate(col.created_at)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <button
                        onClick={() => openSubmitModal(col)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-[12px] transition-all duration-200 active:scale-95"
                      >
                        <CheckSquare size={13} /> Submit
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
            Showing {paginatedCollections.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* CASH SUBMISSION DIALOG */}
      {submitModalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#1e293b]">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <CheckSquare className="text-blue-500" size={18} /> Submit Collected Cash
              </h3>
              <button onClick={() => setSubmitModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitCash} className="p-6 space-y-4">
              <div className="p-4 bg-[#1e2736] rounded-lg border border-[#2d3748] text-[13px] space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Delivery Boy:</span> <span className="text-white font-medium">{selectedRow.delivery_boy_name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Order ID:</span> <span className="text-white">#{selectedRow.order_id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Total Collected:</span> <span className="text-slate-300">{formatCurrency(selectedRow.cod_cash_collected)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Already Submitted:</span> <span className="text-slate-300">{formatCurrency(selectedRow.cod_cash_submitted)}</span></div>
                <div className="flex justify-between border-t border-[#2d3748] pt-2"><span className="text-slate-400 font-semibold">Remaining to Submit:</span> <span className="text-amber-400 font-bold">{formatCurrency(selectedRow.cash_remaining)}</span></div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-slate-400 uppercase font-medium">Submission Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount to submit"
                  value={submitAmount}
                  onChange={(e) => setSubmitAmount(e.target.value)}
                  className="w-full bg-[#0c101a] border border-[#2d3748] rounded px-3 py-2 text-[13px] text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
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
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
