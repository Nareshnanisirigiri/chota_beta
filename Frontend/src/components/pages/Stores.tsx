import React, { useState } from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Info,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface StoresProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const tableData = [
  { id: 7, name: 'Athidi Grand Inn Family Restaurant', city: 'Utukuru', contactNumber: '08886660031', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-15', sellerName: 'Soori Food' },
  { id: 6, name: 'Meat Mart', city: 'Rajampet', contactNumber: '08886660031', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-14', sellerName: 'pickflys' },
  { id: 5, name: 'Fresh Vegetables', city: 'Rajampet', contactNumber: '08886660031', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-14', sellerName: 'pickflys' },
  { id: 4, name: 'Athidi Restaurant', city: 'Utukuru', contactNumber: '9966399663', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-13', sellerName: 'pickflys' },
  { id: 3, name: 'Juice Centre', city: 'Rajampet', contactNumber: '08886660031', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-13', sellerName: 'pickflys' },
  { id: 2, name: 'Juice Centre', city: 'Rajampet', contactNumber: '08886660031', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-13', sellerName: 'pickflys' },
  { id: 1, name: 'YVG General Store', city: 'Rajampet', contactNumber: '8886660033', verificationStatus: 'APPROVED', visibilityStatus: 'VISIBLE', createdAt: '2026-03-13', sellerName: 'pickflys' }
];

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Stores({ onLogout, onNavigate }: StoresProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

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
    whiteSpace: 'nowrap'
  };

  const tdStyle: React.CSSProperties = {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '15px',
    paddingBottom: '15px',
    fontSize: '13px',
    fontWeight: '200',
    whiteSpace: 'nowrap'
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Stores</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Stores</span>
            </nav>
          </div>

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

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 font-200" style={{ fontWeight: '200' }}>Filter by Seller</label>
            <input
              type="text"
              placeholder="Search With Seller"
              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2 text-[13px] text-slate-300 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400" style={{ fontWeight: '200' }}>Verification Status</label>
            <div className="relative">
              <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-none px-4 py-2 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>Select Status</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400" style={{ fontWeight: '200' }}>Visibility Status</label>
            <div className="relative">
              <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-none px-4 py-2 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>Select Status</option>
              </select>
            </div>
          </div>
          <div className="flex self-end justify-end">
            <button
              onMouseEnter={() => setHoveredBtn('filter')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-4 py-0.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'filter' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'filter' ? 'white' : '#3b82f6'
              }}
            >
              Filter
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-4 flex items-center justify-between mb-8 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="text-blue-500"><Info size={20} /></div>
            <p className="text-blue-200/80 text-[13px] font-light ">To verify a store, simply click the Eye icon from the Store table.</p>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors opacity-50"><X size={18} /></button>
        </div>

        {/* Search and Entries Row */}
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
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                <th style={{ ...thStyle, width: '50px' }}><div className="flex items-center justify-between">ID <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '380px' }}><div className="flex items-center justify-between">Name <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '120px' }}><div className="flex items-center justify-between">City <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '110px' }}><div className="flex items-center justify-between">Contact Number <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '120px' }}><div className="flex items-center justify-between">Verification Status <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '100px' }}><div className="flex items-center justify-between">Visibility Status <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '120px' }}><div className="flex items-center justify-between">Created At <SortIcons /></div></th>
                <th style={{ ...thStyle, width: '160px' }}><div className="flex items-center justify-between">Seller Name <SortIcons /></div></th>
                <th style={{ ...thStyle, borderRight: 'none', width: '80px' }}><div className="flex items-center justify-between">Actions <SortIcons /></div></th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="border-r border-[#2d3748]/30 text-slate-400" style={{ ...tdStyle, textAlign: 'center' }}>{row.id}</td>
                  <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ ...tdStyle, fontWeight: '400' }}>{row.name}</td>
                  <td className="border-r border-[#2d3748]/30 text-slate-300" style={tdStyle}>{row.city}</td>
                  <td className="border-r border-[#2d3748]/30 text-slate-300" style={tdStyle}>{row.contactNumber}</td>
                  <td className="border-r border-[#2d3748]/30 text-emerald-400 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>{row.verificationStatus}</td>
                  <td className="border-r border-[#2d3748]/30 text-emerald-400 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>{row.visibilityStatus}</td>
                  <td className="border-r border-[#2d3748]/30 text-slate-400 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>{row.createdAt}</td>
                  <td className="border-r border-[#2d3748]/30 text-blue-400" style={tdStyle}>{row.sellerName}</td>
                  <td style={{ ...tdStyle, borderRight: 'none', textAlign: 'center' }}>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onNavigate('store-details')}
                        onMouseEnter={() => setHoveredAction(`${row.id}-view`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          backgroundColor: hoveredAction === `${row.id}-view` ? '#3b82f6' : 'transparent',
                          color: hoveredAction === `${row.id}-view` ? 'white' : '#3b82f6'
                        }}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[6px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '100' }}>
            Showing 1 to {tableData.length} of {tableData.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={12} />
            </button>
            <div className="bg-blue-600 px-2 py-0.25 rounded text-white text-[10px] font-extralight" style={{ fontWeight: '200' }}>1</div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={12} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
