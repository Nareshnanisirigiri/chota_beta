import React from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '../Navbar';

interface EarningHistoryProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function EarningHistory({ onLogout, onNavigate }: EarningHistoryProps) {
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);

  const headers = [
    { label: "ID", width: "70px" },
    { label: "ORDER ID", width: "120px" },
    { label: "DELIVERY BOY", width: "auto" },
    { label: "TOTAL EARNINGS", width: "160px" },
    { label: "PAYMENT STATUS", width: "180px" },
    { label: "PAID AT", width: "160px" },
    { label: "TRANSACTION ID", width: "180px" },
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
            <h1 className="text-white text-[18px] font-bold tracking-tight">Payment History</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Earning History</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <select className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>Delivery Boy</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button 
              onClick={() => onNavigate?.('delivery-boys-earnings')}
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
              <ArrowLeft size={16} /> Back
            </button>

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
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 rounded-xl text-[13px] text-slate-200" style={{ borderRadius: '12px' }}>
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

        {/* Row 3: Table Section with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
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
                <td colSpan={8} className="px-6 py-28 text-center bg-[#0c101a]">
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
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 0 to 0 of 0 entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={16} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <div className="bg-blue-600 px-3 py-0.5 rounded text-white text-[12px] font-extralight" style={{ fontWeight: '200' }}>1</div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
