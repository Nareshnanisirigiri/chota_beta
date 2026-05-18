import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Navbar from '../Navbar';

interface FAQsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function FAQs({ onLogout, onNavigate }: FAQsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqStatus, setFaqStatus] = useState('Active');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqStatus('Active');
  };

  const handleAddFaq = () => {
    // TODO: wire up to API
    console.log({ faqQuestion, faqAnswer, faqStatus });
    handleCloseModal();
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
            <div className="relative min-w-[140px]">
              <select className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[8px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200" style={{ borderRadius: '12px' }}>
              Columns <ChevronDown size={14} className="inline opacity-60" />
            </button>
            <button
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
              <tr>
                <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Database size={52} className="text-slate-600 opacity-60" />
                    <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Row 4: Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[6px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '100' }}>
            Showing 0 to 0 of 0 entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronRight size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* ===== Add FAQ Modal ===== */}
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
          <div
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
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>Add Faq</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  cursor: 'pointer', fontSize: '20px', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '28px', height: '28px', borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
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
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1e2d45')}
                />
              </div>

              {/* Answer */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#cbd5e1', marginBottom: '8px' }}>
                  Answer <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
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
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1e2d45')}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent', border: '1px solid #2d3748',
                  borderRadius: '8px', padding: '8px 20px',
                  fontSize: '13px', color: '#94a3b8', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.color = '#94a3b8'; }}
              >Cancel</button>
              <button
                onClick={handleAddFaq}
                style={{
                  backgroundColor: '#2563eb', border: 'none',
                  borderRadius: '8px', padding: '8px 22px',
                  fontSize: '13px', fontWeight: 600, color: 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
