import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  RefreshCcw,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit2,
  Trash2
} from 'lucide-react';
import Navbar from '../Navbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface Seller {
  id: number;
  user_id: number;
  seller: string;
  email: string;
  mobile: string;
  verificationStatus: string;
  visibilityStatus: string;
  stores: number;
  createdAt: string;
}

interface SellersProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Sellers({ onLogout, onNavigate }: SellersProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  
  // Dynamic State
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    seller: true,
    email: true,
    mobile: true,
    verification: true,
    visibility: true,
    stores: true,
    createdAt: true,
    action: true
  });

  // Fetch Sellers from Database
  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/sellers`);
      if (response.data.success) {
        const fetchedData = response.data.data || [];
        const updatedData = fetchedData.map((s: any) => {
          const sim = sessionStorage.getItem(`simulated_update_${s.id}`);
          if (sim) {
            const { verificationStatus, visibilityStatus } = JSON.parse(sim);
            return {
              ...s,
              verificationStatus: verificationStatus,
              visibilityStatus: visibilityStatus
            };
          }
          return s;
        });
        setSellers(updatedData);
      } else {
        toast.error('Failed to load sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Failed to connect to database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    } catch {
      return dateStr;
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (sellers.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Seller Name', 'Email', 'Mobile', 'Verification', 'Visibility', 'Stores Count', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...sellers.map(s => [
        s.id,
        `"${s.seller || 'N/A'}"`,
        s.email || 'N/A',
        s.mobile || 'N/A',
        (s.verificationStatus || 'N/A').toUpperCase(),
        (s.visibilityStatus || 'N/A').toUpperCase(),
        s.stores,
        formatDate(s.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sellers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDropdown(false);
  };

  // Toggle Column Visibility
  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // Filter Search
  const filteredSellers = sellers.filter(s => 
    (s.seller || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.mobile || '').includes(searchTerm)
  );

  // Pagination Calculations
  const totalEntries = filteredSellers.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedSellers = filteredSellers.slice(startIndex, endIndex);

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Seller Management</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Sellers</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('add-seller')}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/10 uppercase tracking-widest px-6 py-2"
              style={{
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? 'transparent' : '#3b82f6',
                color: hoveredBtn === 'add' ? '#3b82f6' : 'white',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <Plus size={16} /> Add Seller
            </button>
            <button
              onClick={fetchSellers}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-sm shadow-blue-500/5 px-6 py-2"
              style={{
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none placeholder:text-slate-600"
            />
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Columns Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowColumnsDropdown(!showColumnsDropdown); setShowExportDropdown(false); }}
                onMouseEnter={() => setHoveredBtn('columns')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="px-4 py-1.5 transition-all duration-300 active:scale-95 flex items-center"
                style={{
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'columns' || showColumnsDropdown ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'columns' || showColumnsDropdown ? 'white' : '#3b82f6',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Columns <ChevronDown size={14} className={`inline opacity-60 ml-1 transition-transform ${showColumnsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showColumnsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e2736] border border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                  {[
                    { key: 'seller', label: '1: Seller Name' },
                    { key: 'email', label: '2: Email' },
                    { key: 'mobile', label: '3: Mobile' },
                    { key: 'verification', label: '4: Verification' },
                    { key: 'visibility', label: '5: Visibility' },
                    { key: 'stores', label: '6: Stores' },
                    { key: 'createdAt', label: '7: Created At' }
                  ].map((col) => (
                    <div 
                      key={col.key}
                      onClick={() => toggleColumn(col.key as any)}
                      className="px-4 py-2 text-[14px] text-slate-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors flex items-center justify-between"
                    >
                      {col.label}
                      {visibleColumns[col.key as keyof typeof visibleColumns] && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowExportDropdown(!showExportDropdown); setShowColumnsDropdown(false); }}
                onMouseEnter={() => setHoveredBtn('export')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/5"
                style={{
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'export' || showExportDropdown ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'export' || showExportDropdown ? 'white' : '#3b82f6',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                <Download size={16} /> Export <ChevronDown size={14} className={`inline opacity-60 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e2736] border border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                  <div className="px-4 py-1 text-[12px] text-slate-500 uppercase tracking-widest font-bold opacity-50 mb-1">Options</div>
                  <div 
                    onClick={handleExportCSV}
                    className="px-4 py-3 text-[14px] text-slate-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                       <span className="text-[10px] font-bold">CSV</span>
                    </div>
                    Export as CSV
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white' }}>
                {visibleColumns.id && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '70px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">ID <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.seller && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '190px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">SELLER <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.email && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '200px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">EMAIL <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.mobile && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '100px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">MOBILE <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.verification && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '160px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">VERIFICATION <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.visibility && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '160px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">VISIBILITY <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.stores && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '130px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">STORES <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.createdAt && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: '200px', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center justify-between">CREATED AT <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.action && (
                  <th style={{ padding: '10px 16px', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.08em', width: '100px', whiteSpace: 'nowrap' }}>
                    ACTION
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">Loading sellers database...</td>
                </tr>
              ) : paginatedSellers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">No sellers records found</td>
                </tr>
              ) : (
                paginatedSellers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    {visibleColumns.id && (
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                        {row.id}
                      </td>
                    )}
                    {visibleColumns.seller && (
                      <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                        {row.seller || 'N/A'}
                      </td>
                    )}
                    {visibleColumns.email && (
                      <td className="border-r border-[#2d3748]/30 text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                        {row.email || 'N/A'}
                      </td>
                    )}
                    {visibleColumns.mobile && (
                      <td className="border-r border-[#2d3748]/30 uppercase text-blue-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.15em', textAlign: 'center' }}>
                        {row.mobile || 'N/A'}
                      </td>
                    )}
                    {visibleColumns.verification && (
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div className="flex justify-start">
                          <span className={`uppercase tracking-widest whitespace-nowrap ${row.verificationStatus?.toLowerCase() === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`} style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                            {row.verificationStatus || 'PENDING'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.visibility && (
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div className="flex justify-start">
                          <span className={`uppercase tracking-widest whitespace-nowrap ${row.visibilityStatus?.toLowerCase() === 'visible' ? 'text-emerald-400' : 'text-slate-400'}`} style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                            {row.visibilityStatus || 'DRAFT'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.stores && (
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div className="flex justify-start">
                          <span className="text-blue-400 uppercase tracking-widest whitespace-nowrap" style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                            {row.stores} {row.stores === 1 ? 'STORE' : 'STORES'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="border-r border-[#2d3748]/30 text-slate-400 uppercase" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '12px', fontWeight: '200', letterSpacing: '0.1em' }}>
                        {formatDate(row.createdAt)}
                      </td>
                    )}
                    {visibleColumns.action && (
                      <td className="text-center" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px' }}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              sessionStorage.setItem('edit_seller_data', JSON.stringify(row));
                              onNavigate('edit-seller-' + row.id);
                            }}
                            onMouseEnter={() => setHoveredAction(`${row.id}-edit`)}
                            onMouseLeave={() => setHoveredAction(null)}
                            className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                            style={{
                              borderRadius: '12px',
                              border: '2px solid #3b82f6',
                              backgroundColor: hoveredAction === `${row.id}-edit` ? '#3b82f6' : 'transparent',
                              color: hoveredAction === `${row.id}-edit` ? 'white' : '#3b82f6'
                            }}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onMouseEnter={() => setHoveredAction(`${row.id}-delete`)}
                            onMouseLeave={() => setHoveredAction(null)}
                            className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                            style={{
                              borderRadius: '12px',
                              border: '2px solid #ef4444',
                              backgroundColor: hoveredAction === `${row.id}-delete` ? '#ef4444' : 'transparent',
                              color: hoveredAction === `${row.id}-delete` ? 'white' : '#ef4444'
                            }}
                          >
                            <Trash2 size={18} />
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

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || totalPages <= 1}
              className={`transition-colors ${currentPage === 1 ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
            >
              <ChevronsLeft size={12} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages <= 1}
              className={`transition-colors ${currentPage === 1 ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
            >
              <ChevronLeft size={12} />
            </button>
            
            <div className="bg-blue-600 px-2 py-0.25 rounded text-white text-[10px] font-extralight" style={{ fontWeight: '200' }}>
              {currentPage}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages <= 1}
              className={`transition-colors ${currentPage === totalPages ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
            >
              <ChevronRight size={12} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages <= 1}
              className={`transition-colors ${currentPage === totalPages ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
            >
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
