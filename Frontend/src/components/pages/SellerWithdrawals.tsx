import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import Navbar from '../Navbar';

interface SellerWithdrawalsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function SellerWithdrawals({ onLogout, onNavigate, currentPage }: SellerWithdrawalsProps) {
  const [showHistory, setShowHistory] = useState(currentPage === 'withdrawal-history');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  React.useEffect(() => {
    setShowHistory(currentPage === 'withdrawal-history');
  }, [currentPage]);

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
            {showHistory && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search With Seller"
                  className="w-[180px] bg-[#0a0f18] border border-[#2d3748] rounded-none px-3 py-1.5 text-[12px] text-slate-300 focus:outline-none"
                />
                <div className="relative min-w-[100px]">
                  <select className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-none px-3 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                    <option>Status</option>
                  </select>
                  {/* <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" /> */}
                </div>
              </div>
            )}

            {!showHistory ? (
              <button
                onClick={() => onNavigate('withdrawal-history')}
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
            ) : (
              <button
                onClick={() => onNavigate('seller-withdrawals')}
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
                <ArrowLeft size={16} /> Back to Pending
              </button>
            )}

            <button
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

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search data..."
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-none px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-none pl-3 pr-8 py-1.5 text-[8px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
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
                <th style={{ ...thStyle, width: '80px' }}>
                  <div className="flex items-center justify-between">ID <SortIcons /></div>
                </th>
                {!showHistory ? (
                  <>
                    <th style={thStyle}><div className="flex items-center justify-between">Seller <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Amount <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Status <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Request Note <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Created At <SortIcons /></div></th>
                  </>
                ) : (
                  <>
                    <th style={thStyle}><div className="flex items-center justify-between">Seller <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Amount <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Status <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Request Note <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Admin Remark <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Processed At <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Processed By <SortIcons /></div></th>
                  </>
                )}
                <th style={{ ...thStyle, borderRight: 'none', width: '100px' }}>
                  <div className="flex items-center justify-between">Action <SortIcons /></div>
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              <tr>
                <td colSpan={showHistory ? 9 : 7} className="px-6 py-28 text-center bg-[#0c101a]">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Database size={52} className="text-slate-600 opacity-60" />
                    <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '200' }}>No data available.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Showing 0 to 0 of 0 entries
          </p>
          <div className="flex items-center gap-4">
            <div className="w-px h-4 bg-white opacity-30" />
            <button className="text-slate-600 opacity-40 cursor-not-allowed"><ChevronsLeft size={12} /></button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed"><ChevronLeft size={12} /></button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed"><ChevronRight size={12} /></button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed"><ChevronsRight size={12} /></button>
            <div className="w-px h-4 bg-white opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
