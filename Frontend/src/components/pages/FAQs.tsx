import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  RefreshCcw,
  ChevronDown,
  Download,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface FAQsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function FAQs({ onLogout, onNavigate }: FAQsProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqStatus, setFaqStatus] = useState('active');

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      const res = await axios.get(`${BASE_URL}/api/faqs`, { params });
      if (res.data.success) {
        setFaqs(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [page, limit, search, selectedStatus]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqStatus(faq.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqStatus('active');
    setEditingFaq(null);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) {
      return alert("Question and Answer are required");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        question: faqQuestion,
        answer: faqAnswer,
        status: faqStatus
      };

      let res;
      if (editingFaq) {
        res = await axios.put(`${BASE_URL}/api/faqs/${editingFaq.id}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/api/faqs`, payload);
      }

      if (res.data.success) {
        alert(editingFaq ? "FAQ updated successfully" : "FAQ created successfully");
        handleCloseModal();
        fetchFaqs();
      }
    } catch (err: any) {
      console.error("Error saving FAQ:", err);
      alert(err.response?.data?.message || "Failed to save FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/faqs/${id}`);
      if (res.data.success) {
        alert("FAQ deleted successfully");
        fetchFaqs();
      }
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      alert("Failed to delete FAQ");
    }
  };

  const handleExport = () => {
    if (faqs.length === 0) return;
    const csvHeaders = "ID,Question,Answer,Status,Created At";
    const csvRows = faqs.map(f => 
      `"${f.id}","${f.question.replace(/"/g, '""')}","${f.answer.replace(/"/g, '""')}","${f.status}","${f.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `faqs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = [
    { label: "ID", width: "80px" },
    { label: "QUESTION", width: "auto" },
    { label: "ANSWER", width: "auto" },
    { label: "STATUS", width: "150px" },
    { label: "CREATED AT", width: "180px" },
    { label: "ACTION", width: "100px" }
  ];

  return (
    <>
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Standardized FAQs</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">FAQs</span>
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
              <Plus size={16} /> Add FAQ
            </button>
            <button
              onClick={fetchFaqs}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5"
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
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              onMouseEnter={() => setHoveredBtn('export')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/10"
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
                  <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading FAQs...</p>
                    </div>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{faq.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">
                      {faq.question}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      {faq.answer}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] capitalize font-medium ${
                        faq.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {faq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-400 text-[13px] font-mono">
                      {new Date(faq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-red-400 hover:text-red-300 transition-colors"
                          title="Delete FAQ"
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
            Showing {faqs.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* ===== Add / Edit FAQ Modal ===== */}
      {isModalOpen && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <form
            onSubmit={handleSaveFaq}
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#131a27',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '640px',
              padding: '0',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
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
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  cursor: 'pointer', fontSize: '20px', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
              >✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Question */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px' }}>
                  Question <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter question"
                  value={faqQuestion}
                  onChange={e => setFaqQuestion(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    backgroundColor: '#0d1520', border: '1px solid #1e2d45',
                    borderRadius: '6px', padding: '10px 14px',
                    fontSize: '13px', color: '#e2e8f0',
                    resize: 'vertical', outline: 'none',
                    fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Answer */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px' }}>
                  Answer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter answer"
                  value={faqAnswer}
                  onChange={e => setFaqAnswer(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    backgroundColor: '#0d1520', border: '1px solid #1e2d45',
                    borderRadius: '6px', padding: '10px 14px',
                    fontSize: '13px', color: '#e2e8f0',
                    resize: 'vertical', outline: 'none',
                    fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Status */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px' }}>
                  Status
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={faqStatus}
                    onChange={e => setFaqStatus(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      backgroundColor: '#0d1520', border: '1px solid #1e2d45',
                      borderRadius: '6px', padding: '10px 36px 10px 14px',
                      fontSize: '13px', color: '#e2e8f0',
                      appearance: 'none', outline: 'none', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={16}
                    style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b', pointerEvents: 'none',
                    }}
                  />
                </div>
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
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent', border: '1px solid #2d3748',
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
                  borderRadius: '8px', padding: '8px 22px',
                  fontSize: '13px', fontWeight: 600, color: 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {editingFaq ? 'Save Changes' : 'Add FAQ'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
