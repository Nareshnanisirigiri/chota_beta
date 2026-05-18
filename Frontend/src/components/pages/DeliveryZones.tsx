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
  Edit2,
  Trash2,
  Info,
  Maximize2,
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryZonesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

const FormField = ({ label, placeholder, required = false, info = false, suffix = '' }: { label: string, placeholder: string, required?: boolean, info?: boolean, suffix?: string }) => (
  <div className="flex-1">
    <label className="flex items-center gap-1 text-slate-400 text-[12px] uppercase font-bold tracking-wider mb-2">
      {label} {required && <span className="text-red-500">*</span>}
      {info && <Info size={14} className="text-slate-500 cursor-pointer hover:text-blue-500 transition-colors" />}
    </label>
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-2.5 text-[13px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all ${suffix ? 'pr-14' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[11px] font-bold border-l border-[#2d3748] pl-3">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default function DeliveryZones({ onLogout, onNavigate }: DeliveryZonesProps) {
  const [view, setView] = React.useState<'list' | 'add'>('list');
  const [rushEnabled, setRushEnabled] = React.useState(false);
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = React.useState<string | null>(null);

  const headers = [
    { label: "ID", width: "70px", align: 'left' },
    { label: "NAME", width: "240px", align: 'left' },
    { label: "CENTER COORDINATES", width: "300px", align: 'left' },
    { label: "RADIUS (KM)", width: "130px", align: 'left' },
    { label: "DELIVERY TIME PER KM", width: "180px", align: 'left' },
    { label: "BUFFER TIME", width: "130px", align: 'left' },
    { label: "STATUS", width: "110px", align: 'center' },
    { label: "CREATED AT", width: "140px", align: 'left' },
    { label: "ACTION", width: "110px", align: 'center' }
  ];

  const deliveryZones = [
    {
      id: 2,
      name: 'Rajampet Zone',
      centerCoordinates: '14.20116878, 79.16439568',
      radius: '6.596 km',
      deliveryTimePerKm: '2 Minutes',
      bufferTime: '7 Minutes',
      status: 'ACTIVE',
      createdAt: '2026-03-12',
    },
    {
      id: 1,
      name: 'Hyderabad Zone',
      centerCoordinates: '17.41581757, 78.50075745',
      radius: '31.409 km',
      deliveryTimePerKm: '3 Minutes',
      bufferTime: '20 Minutes',
      status: 'ACTIVE',
      createdAt: '2026-03-12',
    },
  ];

  if (view === 'add') {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
        <Navbar onLogout={onLogout} />

        <div className="dashboard-card p-0 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
          <div className="px-6 py-6 border-b border-[#1e293b]/50 flex items-center justify-between">
            <div>
              <h1 className="text-white text-[22px] font-bold tracking-tight">Add Delivery Zone</h1>
              <nav className="flex items-center gap-2 text-[12px] mt-1">
                <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => setView('list')}>List</span>
                <span className="text-slate-500">/</span>
                <span className="text-blue-200/80">Add Zone</span>
              </nav>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-[#0a0f18]/50 border border-[#2d3748]/50 rounded-xl p-6">
              <div className="flex justify-center mb-6">
                <button
                  onMouseEnter={() => setHoveredBtn('remove')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="flex items-center gap-2 px-6 py-2 transition-all duration-300 text-[13px] font-medium active:scale-95 uppercase tracking-widest shadow-lg shadow-red-500/10"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #ef4444',
                    backgroundColor: hoveredBtn === 'remove' ? '#ef4444' : 'transparent',
                    color: hoveredBtn === 'remove' ? 'white' : '#ef4444'
                  }}
                >
                  Remove Polygon
                </button>
              </div>

              {/* Map Placeholder */}
              <div className="relative w-full h-[450px] bg-[#1e2736] rounded-lg overflow-hidden border border-[#2d3748] shadow-inner">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=14.201,79.164&zoom=12&size=1200x450&key=MOCK_KEY&style=feature:all|element:labels|visibility:off&style=feature:geometry|color:0x212121&style=feature:water|color:0x000000"
                  alt="Map Background"
                  className="w-full h-full object-cover opacity-50 grayscale contrast-125"
                />

                {/* Map Search Box */}
                <div className="absolute top-6 left-6 w-[340px] bg-[#111827]/95 backdrop-blur-md border border-[#2d3748] rounded-md p-4 shadow-2xl">
                  <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-2">Search for a place:</p>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md py-2.5 pl-10 pr-4 text-[13px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                      placeholder="Start typing..."
                    />
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex flex-col gap-3">
                  <button className="bg-[#111827]/90 p-2.5 rounded-md border border-[#2d3748] text-slate-400 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95">
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="mt-10 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Zone Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai Central"
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all shadow-inner font-extralight"
                      style={{ fontWeight: '200' }}
                    />
                  </div>
                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <h3 className="text-blue-500 text-[16px] font-bold tracking-tight mb-8 flex items-center gap-2 italic underline decoration-blue-500/30 underline-offset-8">
                    Delivery Charges and Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Free Delivery Amount" placeholder="e.g. 500" info />
                    <FormField label="Buffer Time" placeholder="e.g. 10" required info suffix="MINS" />
                  </div>

                  <div className="flex items-center gap-3 mb-10 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                    <div
                      onClick={() => setRushEnabled(!rushEnabled)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${rushEnabled ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${rushEnabled ? 'left-6' : 'left-1'}`} />
                    </div>
                    <label className="text-slate-200 text-[13px] font-bold tracking-wide cursor-pointer flex items-center gap-2">
                      Rush Delivery Enabled
                      <Info size={14} className="text-slate-500" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Rush Delivery Time Per KM" placeholder="e.g. 3" info suffix="MINS" />
                    <FormField label="Rush Delivery Charges" placeholder="e.g. 100" info />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Delivery Time Per KM" placeholder="e.g. 5" required info suffix="MINS" />
                    <FormField label="Regular Delivery Charges" placeholder="e.g. 50" required info />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Distance Based Delivery Charges" placeholder="e.g. 10" info />
                    <FormField label="Per Store Drop Off Fee" placeholder="e.g. 20" info />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Handling Charges" placeholder="e.g. 15" info />
                  </div>
                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <h3 className="text-emerald-500 text-[16px] font-bold tracking-tight mb-8 flex items-center gap-2 italic underline decoration-emerald-500/30 underline-offset-8">
                    Delivery Boy Earnings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FormField label="Base Fee" placeholder="e.g. 50.00" info />
                    <FormField label="Per Store Pickup Fee" placeholder="e.g. 15.00" info />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField label="Distance-Based Fee" placeholder="e.g. 10.00" info />
                    <FormField label="Per-Order Incentive" placeholder="e.g. 20.00" info />
                  </div>
                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em] mb-4 block">Initial Status</label>
                  <div className="relative max-w-sm">
                    <select className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-all font-extralight" style={{ fontWeight: '200' }}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-8 border-t border-[#2d3748]/50">
                  <button
                    onClick={() => setView('list')}
                    className="bg-transparent border border-[#2d3748] text-slate-400 font-extralight px-10 py-2.5 rounded-md text-[14px] transition-all hover:bg-slate-800 hover:text-white uppercase tracking-widest"
                    style={{ fontWeight: '200' }}
                  >
                    Cancel
                  </button>
                  <button
                    onMouseEnter={() => setHoveredBtn('save')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    className="flex items-center gap-2 px-12 py-2.5 transition-all duration-300 text-[14px] font-medium active:scale-95 uppercase tracking-widest shadow-xl shadow-blue-500/10"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #3b82f6',
                      backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                      color: hoveredBtn === 'save' ? 'white' : '#3b82f6'
                    }}
                  >
                    Save Zone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Delivery Zones</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Zones List</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('add')}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-lg shadow-blue-500/10 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Delivery Zone
            </button>
            <button
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-lg shadow-blue-500/5 whitespace-nowrap"
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

        {/* Table Area with SOLID WHITE HEADER BORDER */}
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
                      textAlign: header.align as any,
                      letterSpacing: '0.08em',
                      width: header.width,
                      whiteSpace: 'nowrap',
                      borderTop: '2px solid white',
                      borderBottom: '2px solid white',
                      borderLeft: idx === 0 ? '2px solid white' : 'none',
                      borderRight: idx === headers.length - 1 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    <div className={`flex items-center ${header.align === 'center' ? 'justify-center' : 'justify-between'}`}>
                      {header.label}
                      <SortIcons />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {deliveryZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 font-extralight text-[14px] text-left" style={{ fontWeight: '200' }}>{zone.id}</td>
                  <td className="px-5 py-5 text-slate-100 border-r border-[#2d3748]/30 font-extralight text-[14px] text-left" style={{ fontWeight: '200' }}>{zone.name}</td>
                  <td className="px-4 py-5 text-blue-400 border-r border-[#2d3748]/30 text-[13px] font-mono tracking-tighter" style={{ fontWeight: '200' }}>{zone.centerCoordinates}</td>
                  <td className="px-4 py-5 text-slate-100 border-r border-[#2d3748]/30 text-[14px] font-extralight text-left" style={{ fontWeight: '200' }}>{zone.radius}</td>
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 text-[14px] text-left font-extralight" style={{ fontWeight: '200' }}>{zone.deliveryTimePerKm}</td>
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 text-[14px] text-left font-extralight" style={{ fontWeight: '200' }}>{zone.bufferTime}</td>
                  <td className="px-4 py-5 border-r border-[#2d3748]/30 text-center">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {zone.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-slate-400 border-r border-[#2d3748]/30 text-[14px] text-left font-extralight" style={{ fontWeight: '200' }}>{zone.createdAt}</td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onMouseEnter={() => setHoveredAction(`${zone.id}-edit`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          backgroundColor: hoveredAction === `${zone.id}-edit` ? '#3b82f6' : 'transparent',
                          color: hoveredAction === `${zone.id}-edit` ? 'white' : '#3b82f6'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onMouseEnter={() => setHoveredAction(`${zone.id}-delete`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #ef4444',
                          backgroundColor: hoveredAction === `${zone.id}-delete` ? '#ef4444' : 'transparent',
                          color: hoveredAction === `${zone.id}-delete` ? 'white' : '#ef4444'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Footers Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 1 to {deliveryZones.length} of {deliveryZones.length} entries
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
