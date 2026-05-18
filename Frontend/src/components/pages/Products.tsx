import React from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
} from 'lucide-react';
import Navbar from '../Navbar';
import ProductDetails from './ProductDetails';

interface ProductsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const tableData = [
  {
    id: 7,
    title: 'Plain Mandi Rice',
    category: 'Biryani',
    brand: '',
    featured: 'No',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-19',
    image: 'https://via.placeholder.com/50?text=Rice'
  },
  {
    id: 6,
    title: 'Nijayoy',
    category: 'chicken pickle',
    brand: '',
    featured: 'Yes',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-16',
    image: 'https://via.placeholder.com/50?text=Pickle'
  },
  {
    id: 5,
    title: 'test',
    category: 'Pickles',
    brand: 'Priya',
    featured: 'No',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-16',
    image: 'https://via.placeholder.com/50?text=Test'
  },
  {
    id: 4,
    title: 'Chicken Dum Biryani',
    category: 'Biryani',
    brand: '',
    featured: 'No',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-15',
    image: 'https://via.placeholder.com/50?text=Biryani'
  },
  {
    id: 3,
    title: 'Green Moong, Pesalu, పెసలు',
    category: 'Dal & Pulses',
    brand: 'Premium',
    featured: 'No',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-13',
    image: 'https://via.placeholder.com/50?text=Dal'
  },
  {
    id: 2,
    title: 'Dal',
    category: 'Dal & Pulses',
    brand: 'Premium',
    featured: 'No',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-13',
    image: 'https://via.placeholder.com/50?text=Dal2'
  },
  {
    id: 1,
    title: 'Toor dal',
    category: 'Dal & Pulses',
    brand: 'Premium',
    featured: 'Yes',
    type: 'Product Type',
    status: 'ACTIVE',
    approvalStatus: 'Verification Status',
    createdAt: '2026-03-13',
    image: 'https://via.placeholder.com/50?text=Dal3'
  }
];

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Products({ onLogout, onNavigate }: ProductsProps) {
  const [viewingProduct, setViewingProduct] = React.useState<any>(null);
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = React.useState<string | null>(null);

  if (viewingProduct) {
    return (
      <ProductDetails
        onLogout={onLogout}
        onBack={() => setViewingProduct(null)}
        product={viewingProduct}
      />
    );
  }

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Products</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Products</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {["Product Type", "Product Status", "Verification Status", "Category"].map((filter, idx) => (
              <div key={idx} className="relative min-w-[140px]">
                <select className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-3 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                  <option>{filter}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
            ))}

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
              <Download size={16} /> Export <ChevronDown size={14} className="inline opacity-60" />
            </button>
          </div>
        </div>

        {/* Row 3: Table Section with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "PRODUCT DETAILS", width: "450px" },
                  { label: "ADMIN APPROVAL STATUS", width: "250px" },
                  { label: "CREATED AT", width: "160px" },
                  { label: "ACTION", width: "100px" }
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
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.id}</td>
                  <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="flex gap-4 items-start">
                      <div className="w-[85px] h-[85px] rounded-[2px] bg-white overflow-hidden p-0.5 border border-slate-700/50 flex-shrink-0">
                        <img src={row.image} alt={row.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <h4 style={{ color: '#3b82f6', fontWeight: '500', fontSize: '15px' }} className="truncate" title={row.title}>
                          Title: <span style={{ color: '#3b82f6' }} className="cursor-pointer hover:underline">{row.title}</span>
                        </h4>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                          Category: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.category}</span>
                        </p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                          Brand: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.brand || ''}</span>
                        </p>
                        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                          Featured: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.featured}</span>
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span style={{ backgroundColor: '#1c1c2b', color: '#ef4444', padding: '1px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }} className="lowercase tracking-tight">
                            variant
                          </span>
                          <span style={{ backgroundColor: '#1c1c2b', color: '#22c55e', padding: '1px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }} className="uppercase tracking-tight">
                            ACTIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="flex justify-start">
                      <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-3 py-1 rounded-full uppercase" style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.05em' }}>
                        {row.approvalStatus}
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.createdAt}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => setViewingProduct(row)}
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
                        <Eye size={16} />
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

        {/* Row 4: Footer */}
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
