import React, { useState } from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database
} from 'lucide-react';
import Navbar from '../Navbar';

interface PendingWalletDepositsProps {
  onLogout: () => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function PendingWalletDeposits({ onLogout }: PendingWalletDepositsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const hasData = false;

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
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Pending Deposits</span>
            </nav>
          </div>

          <button
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
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none placeholder:text-slate-600 rounded-none"
            />
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="bg-[#1e2736] border border-[#2d3748] pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer rounded-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
              </div>
              <span className="text-[13px] text-white" style={{ fontWeight: '200' }}>entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onMouseEnter={() => setHoveredBtn('columns')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-4 py-1.5 transition-all duration-300 active:scale-95"
              style={{
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'columns' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'columns' ? 'white' : '#3b82f6',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Columns <ChevronDown size={14} className="inline opacity-60 ml-1" />
            </button>
            <button
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
              <Download size={16} /> Export <ChevronDown size={14} className="inline opacity-60" />
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
                  { label: "ACTION", width: "120px" }
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
              {!hasData && (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Database size={40} strokeWidth={1} />
                      <span className="text-[10px] uppercase tracking-widest">No pending deposits found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[1px] bg-white opacity-40 w-full mb-6 mt-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[6px] text-slate-400 uppercase" style={{ fontWeight: '100', letterSpacing: '0.05em' }}>
            Showing 0 to 0 of 0 entries
          </p>

          <div className="flex items-center gap-6">
            <button className="text-slate-600 opacity-20 cursor-not-allowed">
              <ChevronsLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-20 cursor-not-allowed">
              <ChevronLeft size={12} />
            </button>
            <div className="border border-white/20 px-3 py-0.5 rounded text-white text-[11px] font-thin">0</div>
            <button className="text-slate-600 opacity-20 cursor-not-allowed">
              <ChevronRight size={12} />
            </button>
            <button className="text-slate-600 opacity-20 cursor-not-allowed">
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
