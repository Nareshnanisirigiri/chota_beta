import React from 'react';
import {
  RefreshCcw,
  Plus,
  Search,
  ChevronDown,
  Download,
  Database,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

interface FeaturedSectionsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function FeaturedSections({ onLogout, onNavigate }: FeaturedSectionsProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isStatusActive, setIsStatusActive] = React.useState(true);
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);

  const headers = [
    { label: "ID", width: "70px" },
    { label: "TITLE", width: "auto" },
    { label: "SLUG", width: "130px" },
    { label: "SCOPE TYPE", width: "130px" },
    { label: "SECTION TYPE", width: "150px" },
    { label: "SORT ORDER", width: "120px" },
    { label: "STATUS", width: "110px" },
    { label: "CREATED AT", width: "160px" },
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
            <h1 className="text-white text-[18px] font-bold tracking-tight">Featured Sections</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Featured Sections</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2">
                {[ "All Types", "All Status", "All Scopes" ].map((filter, idx) => (
                  <div key={idx} className="relative min-w-[130px]">
                    <select className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-3 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                      <option>{filter}</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  </div>
                ))}
             </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Section
            </button>

            <button 
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
              placeholder="Search sections..."
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
              <tr>
                <td colSpan={9} className="px-6 py-28 text-center bg-[#0c101a]">
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

        {/* Footers Pagination */}
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

      {/* Add Featured Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#1e293b] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight italic underline underline-offset-8 decoration-blue-500/30">Create Featured Section</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-700/30">
                <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-2">Scope Type <span className="text-red-500">*</span></label>
                <div className="relative w-full max-w-[300px]">
                  <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                    <option>Global</option>
                    <option>Region</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Section Title <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g. Best Sellers 2024" className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Section Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                      <option>Select Section Type</option>
                      <option>Products Grid</option>
                      <option>Categories List</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Sort Order</label>
                  <input type="text" placeholder="0" className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Display Style <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                      <option>Select Layout Style</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Target Categories</label>
                  <div className="relative">
                    <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                      <option>Search Category</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Short Description</label>
                  <textarea rows={2} placeholder="Optional subtitle for this section..." className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Background Type</label>
                  <div className="relative">
                    <select className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                      <option>Solid Color</option>
                      <option>Gradient</option>
                      <option>Image</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Text Theme Color</label>
                  <div className="h-10 w-full bg-[#000] border border-[#2d3748] rounded-md cursor-pointer flex items-center justify-center text-[10px] font-bold text-white/40">PICK COLOR</div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div 
                    onClick={() => setIsStatusActive(!isStatusActive)}
                    className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${isStatusActive ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${isStatusActive ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-[13px] text-slate-200 tracking-tight cursor-pointer font-extralight" style={{ fontWeight: '200' }}>Status: {isStatusActive ? 'Visible' : 'Hidden'}</span>
                </div>

              </div>
            </div>

            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-md text-[13px] font-extralight text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                style={{ fontWeight: '200' }}
              >
                Cancel
              </button>
              <button 
                onMouseEnter={() => setHoveredBtn('save')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-10 py-2 transition-all duration-300 text-[13px] font-medium active:scale-95 uppercase tracking-widest shadow-xl shadow-blue-500/10"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'save' ? 'white' : '#3b82f6'
                }}
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
