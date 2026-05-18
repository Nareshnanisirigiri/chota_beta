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
  Info,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface Store {
  id: number;
  name: string;
  city: string;
  contactNumber: string;
  verificationStatus: string;
  visibilityStatus: string;
  createdAt: string;
  sellerName: string;
}

interface StoresProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Stores({ onLogout, onNavigate }: StoresProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  
  // Dynamic States
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [sellerSearch, setSellerSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('Select Status');
  const [visibilityFilter, setVisibilityFilter] = useState('Select Status');
  
  // Active Filter Applied State
  const [appliedSellerSearch, setAppliedSellerSearch] = useState('');
  const [appliedVerificationFilter, setAppliedVerificationFilter] = useState('Select Status');
  const [appliedVisibilityFilter, setAppliedVisibilityFilter] = useState('Select Status');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Dropdown States
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(true);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    city: true,
    contactNumber: true,
    verificationStatus: true,
    visibilityStatus: true,
    createdAt: true,
    sellerName: true,
    action: true
  });

  // Fetch Stores from Database
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/stores`);
      if (response.data.success) {
        setStores(response.data.data || []);
      } else {
        toast.error('Failed to load stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleApplyFilters = () => {
    setAppliedSellerSearch(sellerSearch);
    setAppliedVerificationFilter(verificationFilter);
    setAppliedVisibilityFilter(visibilityFilter);
    setCurrentPage(1);
    toast.success('Filters applied successfully');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSellerSearch('');
    setVerificationFilter('Select Status');
    setVisibilityFilter('Select Status');
    setAppliedSellerSearch('');
    setAppliedVerificationFilter('Select Status');
    setAppliedVisibilityFilter('Select Status');
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  // Date Formatting Helper
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

  // Client-Side Search & Multi-Filter Logic
  const filteredStores = stores.filter(s => {
    const matchesSearch = searchTerm === '' ||
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contactNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.id.toString()).includes(searchTerm);
      
    const matchesSeller = appliedSellerSearch === '' ||
      (s.sellerName || '').toLowerCase().includes(appliedSellerSearch.toLowerCase());
      
    let matchesVerification = true;
    if (appliedVerificationFilter !== 'Select Status') {
      matchesVerification = (s.verificationStatus || '').toUpperCase() === appliedVerificationFilter.toUpperCase();
    }
    
    let matchesVisibility = true;
    if (appliedVisibilityFilter !== 'Select Status') {
      matchesVisibility = (s.visibilityStatus || '').toUpperCase() === appliedVisibilityFilter.toUpperCase();
    }
    
    return matchesSearch && matchesSeller && matchesVerification && matchesVisibility;
  });

  // Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStores.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredStores.length / entriesPerPage) || 1;

  // Export to CSV Function
  const exportToCSV = (type: 'all' | 'filtered') => {
    const dataToExport = type === 'all' ? stores : filteredStores;
    if (dataToExport.length === 0) {
      toast.error('No stores to export');
      return;
    }

    const headers = ['ID', 'Store Name', 'City', 'Contact Number', 'Verification Status', 'Visibility Status', 'Created At', 'Seller Name'];
    const rows = dataToExport.map(s => [
      s.id,
      s.name,
      s.city,
      s.contactNumber,
      s.verificationStatus,
      s.visibilityStatus,
      formatDate(s.createdAt),
      s.sellerName || 'N/A'
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stores_${type}_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDropdown(false);
    toast.success(`Exported ${dataToExport.length} stores successfully!`);
  };

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
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]" onClick={() => {
      setShowColumnsDropdown(false);
      setShowExportDropdown(false);
    }}>
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8" onClick={(e) => e.stopPropagation()}>

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
            onClick={fetchStores}
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
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400 font-200" style={{ fontWeight: '200' }}>Filter by Seller</label>
            <input
              type="text"
              placeholder="Search With Seller"
              value={sellerSearch}
              onChange={(e) => setSellerSearch(e.target.value)}
              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2 text-[13px] text-slate-300 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400" style={{ fontWeight: '200' }}>Verification Status</label>
            <div className="relative">
              <select 
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full bg-[#1e2736] border border-[#2d3748] rounded-none px-4 py-2 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Select Status">Select Status</option>
                <option value="approved">Approved</option>
                <option value="not_approved">Not Approved</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none opacity-60" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] text-slate-400" style={{ fontWeight: '200' }}>Visibility Status</label>
            <div className="relative">
              <select 
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
                className="w-full bg-[#1e2736] border border-[#2d3748] rounded-none px-4 py-2 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="Select Status">Select Status</option>
                <option value="visible">Visible</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none opacity-60" />
            </div>
          </div>
          <div className="flex gap-2 self-end justify-end">
            <button
              onClick={handleApplyFilters}
              onMouseEnter={() => setHoveredBtn('filter')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'filter' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'filter' ? 'white' : '#3b82f6'
              }}
            >
              Filter
            </button>
            {(appliedSellerSearch !== '' || appliedVerificationFilter !== 'Select Status' || appliedVisibilityFilter !== 'Select Status') && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 border border-red-500 text-red-500 rounded-[12px] hover:bg-red-500 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        {showInfoBox && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-4 flex items-center justify-between mb-8 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="text-blue-500"><Info size={20} /></div>
              <p className="text-blue-200/80 text-[13px] font-light ">To verify a store, simply click the Eye icon from the Store table.</p>
            </div>
            <button onClick={() => setShowInfoBox(false)} className="text-slate-500 hover:text-white transition-colors opacity-50"><X size={18} /></button>
          </div>
        )}

        {/* Search and Entries Row */}
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
                <ChevronDown size={12} className="absolute right-2 top-2.5 pointer-events-none opacity-60" />
              </div>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Columns Toggle Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowColumnsDropdown(!showColumnsDropdown); setShowExportDropdown(false); }}
                className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200 flex items-center gap-1 active:scale-95 transition-transform" 
                style={{ borderRadius: '12px' }}
              >
                Columns <ChevronDown size={14} className="opacity-60" />
              </button>
              {showColumnsDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-2xl bg-[#111827] border border-[#1e293b] z-50 p-2 space-y-1">
                  <p className="text-[11px] text-slate-400 px-2 py-1 font-medium border-b border-[#2d3748]/40 mb-1">Toggle Columns</p>
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800/40 rounded cursor-pointer text-xs uppercase tracking-wider text-slate-300 font-extralight">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col as keyof typeof visibleColumns]}
                        onChange={() => setVisibleColumns({
                          ...visibleColumns,
                          [col]: !visibleColumns[col as keyof typeof visibleColumns]
                        })}
                        className="rounded border-[#2d3748] text-blue-500 bg-[#0c101a] focus:ring-0 focus:ring-offset-0"
                      />
                      {col.replace(/([A-Z])/g, ' $1')}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowExportDropdown(!showExportDropdown); setShowColumnsDropdown(false); }}
                onMouseEnter={() => setHoveredBtn('export')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'export' || showExportDropdown ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'export' || showExportDropdown ? 'white' : '#3b82f6'
                }}
              >
                <Download size={16} /> Export <ChevronDown size={14} className="opacity-60 ml-1" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-[#111827] border border-[#1e293b] z-50 p-1">
                  <button 
                    onClick={() => exportToCSV('all')} 
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#1e2736] text-slate-300 rounded font-extralight tracking-wider uppercase"
                  >
                    Export All Records
                  </button>
                  <button 
                    onClick={() => exportToCSV('filtered')} 
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#1e2736] text-slate-300 rounded font-extralight tracking-wider uppercase border-t border-[#2d3748]/30"
                  >
                    Export Filtered Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table View / Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] border border-[#2d3748] rounded-md bg-[#0c101a]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[13px] mt-4 font-light uppercase tracking-widest">Querying Stores Database...</p>
          </div>
        ) : (
          <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
            <table className="w-full text-left border-collapse min-w-[1300px]">
              <thead>
                <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                  {visibleColumns.id && <th style={{ ...thStyle, width: '70px' }}><div className="flex items-center justify-between">ID <SortIcons /></div></th>}
                  {visibleColumns.name && <th style={{ ...thStyle, width: '380px' }}><div className="flex items-center justify-between">Name <SortIcons /></div></th>}
                  {visibleColumns.city && <th style={{ ...thStyle, width: '140px' }}><div className="flex items-center justify-between">City <SortIcons /></div></th>}
                  {visibleColumns.contactNumber && <th style={{ ...thStyle, width: '160px' }}><div className="flex items-center justify-between">Contact Number <SortIcons /></div></th>}
                  {visibleColumns.verificationStatus && <th style={{ ...thStyle, width: '180px' }}><div className="flex items-center justify-between">Verification Status <SortIcons /></div></th>}
                  {visibleColumns.visibilityStatus && <th style={{ ...thStyle, width: '160px' }}><div className="flex items-center justify-between">Visibility Status <SortIcons /></div></th>}
                  {visibleColumns.createdAt && <th style={{ ...thStyle, width: '160px' }}><div className="flex items-center justify-between">Created At <SortIcons /></div></th>}
                  {visibleColumns.sellerName && <th style={{ ...thStyle, width: '220px' }}><div className="flex items-center justify-between">Seller Name <SortIcons /></div></th>}
                  {visibleColumns.action && <th style={{ ...thStyle, borderRight: 'none', width: '90px' }}><div className="flex items-center justify-between">Actions <SortIcons /></div></th>}
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#0c101a' }}>
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center py-12 text-slate-400 font-extralight tracking-wide uppercase text-xs">
                      No store records found in the database.
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                      {visibleColumns.id && <td className="border-r border-[#2d3748]/30 text-slate-400" style={{ ...tdStyle, textAlign: 'center' }}>{row.id}</td>}
                      {visibleColumns.name && <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ ...tdStyle, fontWeight: '400' }}>{row.name}</td>}
                      {visibleColumns.city && <td className="border-r border-[#2d3748]/30 text-slate-300" style={tdStyle}>{row.city}</td>}
                      {visibleColumns.contactNumber && <td className="border-r border-[#2d3748]/30 text-slate-300" style={tdStyle}>{row.contactNumber || 'N/A'}</td>}
                      {visibleColumns.verificationStatus && (
                        <td className="border-r border-[#2d3748]/30 text-slate-300 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${(row.verificationStatus || '').toUpperCase() === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {row.verificationStatus || 'PENDING'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.visibilityStatus && (
                        <td className="border-r border-[#2d3748]/30 text-slate-300 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${(row.visibilityStatus || '').toUpperCase() === 'VISIBLE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                            {row.visibilityStatus || 'DRAFT'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.createdAt && <td className="border-r border-[#2d3748]/30 text-slate-400 uppercase" style={{ ...tdStyle, letterSpacing: '0.05em' }}>{formatDate(row.createdAt)}</td>}
                      {visibleColumns.sellerName && <td className="border-r border-[#2d3748]/30 text-blue-400 font-light" style={tdStyle}>{row.sellerName || 'N/A'}</td>}
                      {visibleColumns.action && (
                        <td style={{ ...tdStyle, borderRight: 'none', textAlign: 'center' }}>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                sessionStorage.setItem('view_store_id', String(row.id));
                                onNavigate('store-details');
                              }}
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
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-4"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[12px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '100' }}>
            Showing {filteredStores.length === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredStores.length)} of {filteredStores.length} entries
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
