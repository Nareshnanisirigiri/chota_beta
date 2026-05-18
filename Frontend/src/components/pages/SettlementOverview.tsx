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
  Wallet,
  Undo2,
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import Navbar from '../Navbar';

interface SettlementOverviewProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function SettlementOverview({ onLogout, onNavigate }: SettlementOverviewProps) {
  const [activeTab, setActiveTab] = useState('Payouts');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const thStyle = {
    padding: '14px 16px',
    fontSize: '13px',
    color: 'white',
    fontWeight: '200' as const,
    textTransform: 'uppercase' as const,
    textAlign: 'left' as const,
    letterSpacing: '0.1em',
    borderRight: '1px solid rgba(255,255,255,0.15)',
    borderBottom: '2px solid white',
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Settle All Commissions Modal Overlay */}
      {showSettleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center relative overflow-hidden">
            {/* Abstract background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 blur-[80px] rounded-full" />

            <button
              onClick={() => setShowSettleModal(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-500 flex items-center justify-center mb-6 mt-2 relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
              <Check size={32} className="text-blue-500 relative z-10" />
            </div>

            <h2 className="text-white text-[20px] font-bold tracking-tight mb-2 italic">Confirm Settlement</h2>
            <p className="text-slate-400 text-[14px] text-center mb-10 leading-relaxed font-medium">
              Are you sure you want to settle all unsettled commissions for the selected period? This action is permanent.
            </p>

            <div className="flex gap-4 w-full pt-6 border-t border-[#1e293b]">
              <button
                onMouseEnter={() => setHoveredBtn('modal-back')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setShowSettleModal(false)}
                className="flex-1 py-3 text-[13px] font-bold transition-all uppercase tracking-widest active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #64748b',
                  backgroundColor: hoveredBtn === 'modal-back' ? '#64748b' : 'transparent',
                  color: hoveredBtn === 'modal-back' ? 'white' : '#94a3b8',
                }}
              >
                Go Back
              </button>
              <button
                onMouseEnter={() => setHoveredBtn('modal-confirm')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setShowSettleModal(false)}
                className="flex-1 py-3 text-[13px] font-bold transition-all uppercase tracking-widest active:scale-95 shadow-lg shadow-blue-500/10"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'modal-confirm' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'modal-confirm' ? 'white' : '#3b82f6',
                }}
              >
                Yes, Settle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Buttons */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">
              {showHistory ? 'Settlement History' : 'Earnings & Deductions'}
            </h1>

          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <select className="w-full bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer" style={{ borderRadius: '12px' }}>
                <option>Store</option>
              </select>
            </div>

            {!showHistory ? (
              <button
                onClick={() => setShowHistory(true)}
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
                <History size={16} /> Settlement History
              </button>
            ) : (
              <button
                onClick={() => setShowHistory(false)}
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
                <ArrowLeft size={16} /> Back to Unsettled
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

        {!showHistory && (
          <>
            {/* Tabs Region — Two Separate Toggle Buttons */}
            <div className="mb-6 mt-4 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('Payouts')}
                className="flex items-center gap-2 px-6 py-3 text-[13px] font-semibold transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: activeTab === 'Payouts' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'Payouts' ? 'white' : '#3b82f6',
                }}
              >
                <Wallet size={14} /> Payouts
              </button>
              <button
                onClick={() => setActiveTab('Returns')}
                className="flex items-center gap-2 px-6 py-2 text-[13px] font-semibold transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: activeTab === 'Returns' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'Returns' ? 'white' : '#3b82f6',
                }}
              >
                <Undo2 size={14} /> Returns &amp; Deductions
              </button>
            </div>

            {/* Action Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowSettleModal(true)}
                onMouseEnter={() => setHoveredBtn('settle')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-1 px-2 py-2 text-[13px] font-bold active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #10b981',
                  backgroundColor: hoveredBtn === 'settle' ? '#10b981' : 'transparent',
                  color: hoveredBtn === 'settle' ? 'white' : '#10b981'
                }}
              >
                <Wallet size={18} /> Settle All Commissions
              </button>
            </div>
          </>
        )}

        {/* Search and Columns Row */}
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
                    <th style={thStyle}><div className="flex items-center justify-between">Order Details <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Marketplace Fee <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Payout Amount <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Last Updated <SortIcons /></div></th>
                  </>
                ) : (
                  <>
                    <th style={thStyle}><div className="flex items-center justify-between">Entry Type <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Details <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Description <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Amount <SortIcons /></div></th>
                    <th style={thStyle}><div className="flex items-center justify-between">Settlement Date <SortIcons /></div></th>
                  </>
                )}
                {!showHistory && (
                  <th style={{ ...thStyle, borderRight: 'none', width: '100px' }}>
                    <div className="flex items-center justify-between">Action <SortIcons /></div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              <tr>
                <td colSpan={showHistory ? 6 : 6} className="px-6 py-28 text-center bg-[#0c101a]">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Database size={52} className="text-slate-600 opacity-60" />
                    <p className="text-[14px] text-slate-500 font-light tracking-wide" style={{ fontWeight: '200' }}>No data available.</p>
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
