import React from 'react';
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
} from 'lucide-react';
import Navbar from '../Navbar';

interface PromosProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Promos({ onLogout, onNavigate }: PromosProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);

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
              <Plus size={16} /> Add Promo
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

        {/* Row 3: Table Section with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-center text-sm border-collapse min-w-[1500px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "70px" },
                  { label: "PROMO CODE", width: "150px" },
                  { label: "PROMO MODE", width: "150px" },
                  { label: "DISCOUNT TYPE", width: "150px" },
                  { label: "DISCOUNT AMOUNT", width: "160px" },
                  { label: "START DATE", width: "160px" },
                  { label: "END DATE", width: "160px" },
                  { label: "USAGE COUNT", width: "130px" },
                  { label: "MAX USAGE", width: "130px" },
                  { label: "STATUS", width: "110px" },
                  { label: "ACTION", width: "90px" }
                ].map((header, idx) => (
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
                      width: header.width,
                      whiteSpace: 'nowrap'
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
                <td colSpan={11} className="px-6 py-28 text-center bg-[#0c101a]">
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

      {/* Create Promo Modal */}
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
          <div
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
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>Create Promo</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >✕</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>

              {/* Promo Code */}
              <div>
                <label style={lbl}>Promo Code <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="Enter promo code" style={inp} />
              </div>

              {/* Discount Type */}
              <div>
                <label style={lbl}>Discount Type <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
                    <option>Select Discount Type</option>
                    <option>Percentage</option>
                    <option>Flat Amount</option>
                  </select>
                  <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Description - full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Description <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea rows={3} placeholder="Enter description" style={{ ...inp, resize: 'vertical', height: 'auto', lineHeight: 1.5 }} />
              </div>

              {/* Discount Amount */}
              <div>
                <label style={lbl}>Discount Amount / Percent</label>
                <input type="text" placeholder="Enter discount amount" style={inp} />
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  If Discount Type is Percentage, then Discount Amount should be between 0 and 100. If Discount Type is Flet, then Discount Amount should be greater than 0.
                </p>
              </div>

              {/* Max Discount Value */}
              <div>
                <label style={lbl}>Max Discount Value</label>
                <input type="text" placeholder="Enter maximum discount value" style={inp} />
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Required for percentage discounts</p>
              </div>

              {/* Start Date */}
              <div>
                <label style={lbl}>Start Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="datetime-local" style={{ ...inp, colorScheme: 'dark' }} />
              </div>

              {/* End Date */}
              <div>
                <label style={lbl}>End Date <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="datetime-local" style={{ ...inp, colorScheme: 'dark' }} />
              </div>

              {/* Minimum Order Total */}
              <div>
                <label style={lbl}>Minimum Order Total <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="Enter minimum order total" style={inp} />
              </div>

              {/* Promo Mode */}
              <div>
                <label style={lbl}>Promo Mode <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
                    <option>Select Promo Mode</option>
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                  <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Max Total Usage */}
              <div>
                <label style={lbl}>Max Total Usage <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="Enter maximum total usage" style={inp} />
              </div>

              {/* Max Usage Per User */}
              <div>
                <label style={lbl}>Max Usage Per User <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="Enter maximum usage per user" style={inp} />
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
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent', border: '1px solid #2d3748',
                  borderRadius: '8px', padding: '8px 20px',
                  fontSize: '13px', color: '#94a3b8', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#64748b'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.color = '#94a3b8'; }}
              >Cancel</button>
              <button
                style={{
                  backgroundColor: '#2563eb', border: 'none',
                  borderRadius: '8px', padding: '9px 22px',
                  fontSize: '13px', fontWeight: 600, color: 'white',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '7px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
              >
                <Plus size={15} /> Create New Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
