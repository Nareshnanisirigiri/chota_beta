import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RefreshCcw,
  Plus,
  ChevronDown,
  Download,
  Database,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Edit2,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface PromosProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface Promo {
  id: number;
  code: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  discount_type: 'free_shipping' | 'flat' | 'percent';
  discount_amount: string | null;
  promo_mode: 'instant' | 'cashback';
  usage_count: number;
  individual_use: number;
  max_total_usage: number | null;
  max_usage_per_user: number | null;
  min_order_total: string | null;
  max_discount_value: string | null;
  created_at: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Promos({ onLogout, onNavigate }: PromosProps) {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [selectedDiscountType, setSelectedDiscountType] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'free_shipping' | 'flat' | 'percent',
    discount_amount: '',
    promo_mode: 'instant' as 'instant' | 'cashback',
    max_total_usage: '',
    max_usage_per_user: '',
    min_order_total: '',
    max_discount_value: '',
    start_date: '',
    end_date: '',
    individual_use: 0
  });

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedDiscountType) {
        params.discount_type = selectedDiscountType;
      }
      const res = await axios.get(`${BASE_URL}/api/promos`, { params });
      if (res.data.success) {
        setPromos(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching promos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [page, limit, search, selectedDiscountType]);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percent',
      discount_amount: '',
      promo_mode: 'instant',
      max_total_usage: '',
      max_usage_per_user: '',
      min_order_total: '',
      max_discount_value: '',
      start_date: '',
      end_date: '',
      individual_use: 0
    });
    setIsModalOpen(true);
  };

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const tzoffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleOpenEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_amount: promo.discount_amount ? String(promo.discount_amount) : '',
      promo_mode: promo.promo_mode,
      max_total_usage: promo.max_total_usage ? String(promo.max_total_usage) : '',
      max_usage_per_user: promo.max_usage_per_user ? String(promo.max_usage_per_user) : '',
      min_order_total: promo.min_order_total ? String(promo.min_order_total) : '',
      max_discount_value: promo.max_discount_value ? String(promo.max_discount_value) : '',
      start_date: formatDateForInput(promo.start_date),
      end_date: formatDateForInput(promo.end_date),
      individual_use: promo.individual_use
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/promos/${id}`);
      if (res.data.success) {
        alert("Promo code deleted successfully");
        fetchPromos();
      }
    } catch (err) {
      console.error("Error deleting promo:", err);
      alert("Failed to delete promo code");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return alert("Promo code is required");
    if (!formData.discount_type) return alert("Discount Type is required");

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 19).replace('T', ' ') : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 19).replace('T', ' ') : null
      };

      let res;
      if (editingPromo) {
        res = await axios.put(`${BASE_URL}/api/promos/${editingPromo.id}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/api/promos`, payload);
      }

      if (res.data.success) {
        alert(editingPromo ? "Promo updated successfully" : "Promo created successfully");
        setIsModalOpen(false);
        fetchPromos();
      }
    } catch (err: any) {
      console.error("Error saving promo:", err);
      alert(err.response?.data?.message || "Failed to save promo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    if (promos.length === 0) return;
    const csvHeaders = "ID,Promo Code,Discount Type,Discount Amount,Promo Mode,Usage Count,Max Total Usage,Start Date,End Date,Created At";
    const csvRows = promos.map(p => 
      `"${p.id}","${p.code}","${p.discount_type}","${p.discount_amount}","${p.promo_mode}","${p.usage_count}","${p.max_total_usage}","${p.start_date}","${p.end_date}","${p.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `promo_codes_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lbl: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#94a3b8',
    marginBottom: '6px',
  };

  const inp: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#0d1520',
    border: '1px solid #1e2d45',
    borderRadius: '6px',
    padding: '9px 12px',
    fontSize: '13px',
    color: '#e2e8f0',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const headers = [
    { label: "ID", width: "70px" },
    { label: "PROMO CODE", width: "150px" },
    { label: "PROMO MODE", width: "150px" },
    { label: "DISCOUNT TYPE", width: "150px" },
    { label: "DISCOUNT AMOUNT", width: "160px" },
    { label: "START DATE", width: "160px" },
    { label: "END DATE", width: "160px" },
    { label: "USAGE COUNT", width: "130px" },
    { label: "MAX USAGE", width: "130px" },
    { label: "ACTION", width: "100px" }
  ];

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Inside Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Promos</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Promo Codes</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-lg shadow-blue-500/5"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Promo
            </button>
            <button
              onClick={fetchPromos}
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search code..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            
            <select
              value={selectedDiscountType}
              onChange={(e) => { setSelectedDiscountType(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Discount Types</option>
              <option value="percent">Percentage</option>
              <option value="flat">Flat Amount</option>
              <option value="free_shipping">Free Shipping</option>
            </select>

            <div className="flex items-center gap-3">
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 focus:outline-none cursor-pointer"
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
          <table className="w-full text-left text-sm border-collapse min-w-[1500px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {headers.map((header, idx) => (
                  <th
                    key={header.label}
                    style={{
                      padding: '10px 16px',
                      borderBottom: '2px solid white',
                      borderTop: '2px solid white',
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '200',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      width: header.width,
                      whiteSpace: 'nowrap',
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
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading promos...</p>
                    </div>
                  </td>
                </tr>
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{promo.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">
                      <div>{promo.code}</div>
                      <div className="text-[11px] text-slate-500 font-light">{promo.description}</div>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 text-[13px] capitalize font-mono">
                      {promo.promo_mode}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 text-[13px] capitalize">
                      {promo.discount_type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 text-[13px] font-mono">
                      {promo.discount_type === 'percent' ? `${promo.discount_amount}%` : `₹${promo.discount_amount || '0'}`}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] font-mono">
                      {promo.start_date ? new Date(promo.start_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] font-mono">
                      {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] font-mono">
                      {promo.usage_count}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] font-mono">
                      {promo.max_total_usage || 'Unlimited'}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(promo)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit Promo"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Promo"
                        >
                          <Trash2 size={15} />
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
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Row 4: Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {promos.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* Create / Edit Promo Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          <form
            onSubmit={handleFormSubmit}
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#131a27',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '680px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid #1e293b',
              backgroundColor: '#0f1623',
            }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>
                {editingPromo ? 'Edit Promo' : 'Create Promo'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
              >✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', maxHeight: '60vh', overflowY: 'auto' }} className="scrollbar-thin">

              {/* Promo Code */}
              <div>
                <label style={lbl}>Promo Code <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter promo code" 
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  style={inp} 
                />
              </div>

              {/* Discount Type */}
              <div>
                <label style={lbl}>Discount Type <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={formData.discount_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value as any }))}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="percent">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                  <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Description - full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Description</label>
                <textarea 
                  rows={3} 
                  placeholder="Enter description" 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ ...inp, resize: 'vertical', height: 'auto', lineHeight: 1.5 }} 
                />
              </div>

              {/* Discount Amount */}
              <div>
                <label style={lbl}>Discount Amount / Percent</label>
                <input 
                  type="text" 
                  placeholder="Enter discount amount" 
                  value={formData.discount_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: e.target.value }))}
                  style={inp} 
                />
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  If Discount Type is Percentage, then Discount Amount should be between 0 and 100. If Discount Type is Flat, then Discount Amount should be greater than 0.
                </p>
              </div>

              {/* Max Discount Value */}
              <div>
                <label style={lbl}>Max Discount Value</label>
                <input 
                  type="text" 
                  placeholder="Enter maximum discount value" 
                  value={formData.max_discount_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_discount_value: e.target.value }))}
                  style={inp} 
                />
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Required for percentage discounts</p>
              </div>

              {/* Start Date */}
              <div>
                <label style={lbl}>Start Date</label>
                <input 
                  type="datetime-local" 
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  style={{ ...inp, colorScheme: 'dark' }} 
                />
              </div>

              {/* End Date */}
              <div>
                <label style={lbl}>End Date</label>
                <input 
                  type="datetime-local" 
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  style={{ ...inp, colorScheme: 'dark' }} 
                />
              </div>

              {/* Minimum Order Total */}
              <div>
                <label style={lbl}>Minimum Order Total</label>
                <input 
                  type="text" 
                  placeholder="Enter minimum order total" 
                  value={formData.min_order_total}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_order_total: e.target.value }))}
                  style={inp} 
                />
              </div>

              {/* Promo Mode */}
              <div>
                <label style={lbl}>Promo Mode <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={formData.promo_mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, promo_mode: e.target.value as any }))}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="instant">Instant</option>
                    <option value="cashback">Cashback</option>
                  </select>
                  <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Max Total Usage */}
              <div>
                <label style={lbl}>Max Total Usage</label>
                <input 
                  type="text" 
                  placeholder="Enter maximum total usage" 
                  value={formData.max_total_usage}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_total_usage: e.target.value }))}
                  style={inp} 
                />
              </div>

              {/* Max Usage Per User */}
              <div>
                <label style={lbl}>Max Usage Per User</label>
                <input 
                  type="text" 
                  placeholder="Enter maximum usage per user" 
                  value={formData.max_usage_per_user}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_usage_per_user: e.target.value }))}
                  style={inp} 
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px',
              borderTop: '1px solid #1e293b',
              backgroundColor: '#0f1623',
            }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent', border: '1px solid #2d3748',
                  borderRadius: '8px', padding: '8px 20px',
                  fontSize: '13px', color: '#94a3b8', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#2563eb', border: 'none',
                  borderRadius: '8px', padding: '9px 22px',
                  fontSize: '13px', fontWeight: 600, color: 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  transition: 'background-color 0.2s',
                }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {editingPromo ? 'Save Changes' : 'Create New Promo'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
