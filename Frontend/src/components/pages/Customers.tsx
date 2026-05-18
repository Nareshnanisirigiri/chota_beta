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
  Download
} from 'lucide-react';
import Navbar from '../Navbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface Customer {
  id: number;
  name: string;
  email: string;
  mobile: string;
  balance: string | number;
  created_at: string;
}

interface CustomersProps {
  onLogout: () => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Customers({ onLogout }: CustomersProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    details: true,
    balance: true,
    createdAt: true
  });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Balance', 'Registered At'];
    const csvContent = [
      headers.join(','),
      ...customers.map(c => [
        c.id,
        `"${c.name}"`,
        c.email,
        c.mobile,
        c.balance,
        new Date(c.created_at).toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDropdown(false);
  };

  const toggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile?.includes(searchTerm)
  );

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Customer Database</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => (window as any).navigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Customers</span>
            </nav>
          </div>

          <button
            onClick={fetchCustomers}
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
              fontWeight: '200'
            }}
          >
            <RefreshCcw className={isLoading ? 'animate-spin' : ''} size={16} /> Refresh
          </button>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
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
                className="px-4 py-1.5 rounded-md text-[13px] transition-all duration-300 active:scale-95 flex items-center"
                style={{
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'columns' || showColumnsDropdown ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'columns' || showColumnsDropdown ? 'white' : '#3b82f6',
                  borderRadius: '12px',
                  fontWeight: '200'
                }}
              >
                Columns <ChevronDown size={14} className={`ml-1 transition-transform ${showColumnsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showColumnsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e2736] border border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                  {[
                    { key: 'name', label: '1: Name' },
                    { key: 'details', label: '2: Details' },
                    { key: 'balance', label: '3: Wallet Balance' },
                    { key: 'createdAt', label: '4: Created At' }
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
                className="flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/5"
                style={{
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'export' || showExportDropdown ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'export' || showExportDropdown ? 'white' : '#3b82f6',
                  padding: '6px 20px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '200'
                }}
              >
                <Download size={16} /> Export <ChevronDown size={14} className={`transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e2736] border border-[#2d3748] rounded-xl shadow-2xl z-50 py-2">
                  <div className="px-4 py-1 text-[12px] text-slate-500 uppercase tracking-widest font-bold opacity-50 mb-1">Options</div>
                  <div 
                    onClick={handleExportCSV}
                    className="px-4 py-3 text-[14px] text-slate-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:text-white">
                       <span className="text-[10px] font-bold">CSV</span>
                    </div>
                    Excel / CSV
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {visibleColumns.id && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', width: '80px' }}>
                    <div className="flex items-center justify-between">ID <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.name && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase' }}>
                    <div className="flex items-center justify-between">NAME <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.details && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase' }}>
                    <div className="flex items-center justify-between">CONTACT DETAILS <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.balance && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', width: '180px' }}>
                    <div className="flex items-center justify-between">WALLET BALANCE <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.createdAt && (
                  <th style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', width: '180px' }}>
                    <div className="flex items-center justify-between">REGISTERED AT <SortIcons /></div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">Loading customers...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    {visibleColumns.id && <td className="border-r border-[#2d3748]/30 uppercase text-slate-300 p-4 text-[13px] font-extralight tracking-widest">{row.id}</td>}
                    {visibleColumns.name && <td className="border-r border-[#2d3748]/30 uppercase text-slate-100 p-4 text-[13px] font-extralight tracking-widest">{row.name}</td>}
                    {visibleColumns.details && (
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-300 p-4 text-[13px] font-extralight tracking-widest">
                        <div className="text-slate-100">{row.email}</div>
                        <div className="text-blue-400 text-[11px] mt-1">{row.mobile}</div>
                      </td>
                    )}
                    {visibleColumns.balance && (
                      <td className="border-r border-[#2d3748]/30 uppercase text-emerald-400 p-4 text-[13px] font-extralight tracking-widest text-right">
                        ₹{parseFloat(String(row.balance || row.wallet_balance || 0)).toFixed(2)}
                      </td>
                    )}
                    {visibleColumns.createdAt && (
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-400 p-4 text-[13px] font-extralight tracking-widest">
                        {row.created_at || row.createdAt ? new Date(row.created_at || row.createdAt).toISOString().split('T')[0] : 'N/A'}
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
            Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} entries
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
