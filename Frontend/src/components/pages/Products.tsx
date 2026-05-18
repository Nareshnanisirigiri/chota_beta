import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface Product {
  id: number;
  title: string;
  category: string;
  brand: string;
  featured: string;
  type: string;
  status: string;
  approvalStatus: string;
  createdAt: string;
  image: string;
}

interface ProductsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

// Fallback data in case database is empty or connection fails
const fallbackData: Product[] = [
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
    image: 'https://placehold.co/150x150?text=Rice'
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
    image: 'https://placehold.co/150x150?text=Pickle'
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
    image: 'https://placehold.co/150x150?text=Test'
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
    image: 'https://placehold.co/150x150?text=Biryani'
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
    image: 'https://placehold.co/150x150?text=Dal'
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
    image: 'https://placehold.co/150x150?text=Dal2'
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
    image: 'https://placehold.co/150x150?text=Dal3'
  }
];

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Products({ onLogout, onNavigate }: ProductsProps) {
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Dynamic States
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Product Type');
  const [statusFilter, setStatusFilter] = useState('Product Status');
  const [approvalFilter, setApprovalFilter] = useState('Verification Status');
  const [categoryFilter, setCategoryFilter] = useState('Category');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Fetch Products from Database
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      if (response.data.success) {
        setProducts(response.data.data || []);
      } else {
        toast.error('Failed to load products');
        setProducts(fallbackData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to connect to database. Using fallback data.');
      setProducts(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Unique Filter Lists
  const uniqueTypes = Array.from(new Set(products.map(p => p.type).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(products.map(p => p.status).filter(Boolean)));
  const uniqueApprovals = Array.from(new Set(products.map(p => p.approvalStatus).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Client-Side Search & Multi-Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm === '' ||
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.id.toString()).includes(searchTerm);

    const matchesType = typeFilter === 'Product Type' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'Product Status' || p.status === statusFilter;
    const matchesApproval = approvalFilter === 'Verification Status' || p.approvalStatus === approvalFilter;
    const matchesCategory = categoryFilter === 'Category' || p.category === categoryFilter;

    return matchesSearch && matchesType && matchesStatus && matchesApproval && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredProducts.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage) || 1;

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredProducts.length === 0) {
      toast.error('No products to export');
      return;
    }

    const headers = ['ID', 'Product Title', 'Category', 'Brand', 'Featured', 'Type', 'Status', 'Approval Status', 'Created At'];
    const rows = filteredProducts.map(p => [
      p.id,
      p.title,
      p.category,
      p.brand,
      p.featured,
      p.type,
      p.status,
      p.approvalStatus,
      formatDate(p.createdAt)
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredProducts.length} products successfully!`);
  };

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
            {/* Dynamic Dropdown Filters */}
            <div className="relative min-w-[140px]">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Product Type">Product Type</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Product Status">Product Status</option>
                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={approvalFilter}
                onChange={(e) => { setApprovalFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Verification Status">Verification Status</option>
                {uniqueApprovals.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Category">Category</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>

            <button
              onClick={fetchProducts}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 animate-none"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6'
              }}
            >
              <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Row 2: Search and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={entriesPerPage}
                  onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200" style={{ borderRadius: '12px' }}>
              Columns <ChevronDown size={14} className="inline opacity-60 ml-1" />
            </button>
            <button
              onClick={exportToCSV}
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-[#2d3748] rounded-md bg-[#0c101a]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[13px] mt-4 font-light uppercase tracking-widest">Querying Products Database...</p>
          </div>
        ) : (
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
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 font-extralight tracking-wide uppercase text-xs">
                      No products found in the database.
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.id}</td>
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div className="flex gap-4 items-start">
                          <div 
                            style={{ 
                              width: '85px', 
                              height: '85px', 
                              minWidth: '85px', 
                              minHeight: '85px',
                              backgroundColor: '#1e2736',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              padding: '4px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <img 
                              src={row.image || 'https://via.placeholder.com/150?text=Product'} 
                              alt={row.title} 
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Product';
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            <h4 style={{ color: '#3b82f6', fontWeight: '500', fontSize: '15px' }} className="truncate" title={row.title}>
                              Title: <span style={{ color: '#3b82f6' }} className="cursor-pointer hover:underline">{row.title}</span>
                            </h4>
                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                              Category: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.category}</span>
                            </p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                              Brand: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.brand || '—'}</span>
                            </p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14.5px', fontWeight: '500' }}>
                              Featured: <span style={{ color: '#ffffff', fontWeight: 'normal' }}>{row.featured}</span>
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <span style={{ backgroundColor: '#1c1c2b', color: '#ef4444', padding: '1px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }} className="lowercase tracking-tight">
                                {row.type || 'variant'}
                              </span>
                              <span style={{ backgroundColor: '#1c1c2b', color: '#22c55e', padding: '1px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }} className="uppercase tracking-tight">
                                {row.status || 'ACTIVE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px' }}>
                        <div className="flex justify-start">
                          <span className={`px-3 py-1 rounded-full uppercase border text-[11px] font-medium tracking-wider ${String(row.approvalStatus).toUpperCase() === 'APPROVED' || String(row.approvalStatus).toUpperCase() === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {row.approvalStatus}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{formatDate(row.createdAt)}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Row 4: Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[12px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '100' }}>
            Showing {filteredProducts.length === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredProducts.length)} of {filteredProducts.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={14} />
            </button>
            <div className="bg-blue-600 px-3 py-1 rounded text-white text-[12px] font-medium">{currentPage} / {totalPages}</div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
