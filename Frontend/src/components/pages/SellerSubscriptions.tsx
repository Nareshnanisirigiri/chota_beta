import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  ChevronDown
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface SellerSubscription {
  id: number;
  seller_id: number;
  plan_id: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: string;
  end_date: string;
  price_paid: string | number;
  created_at: string;
  store_name: string;
  seller_name: string;
  seller_email: string;
  plan_name: string;
}

interface Props {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVE',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border-emerald-500/30',
    icon: CheckCircle
  },
  expired: {
    label: 'EXPIRED',
    color: 'text-slate-400',
    bg: 'bg-slate-800/30 border-slate-700/30',
    icon: Clock
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'text-red-400',
    bg: 'bg-red-500/20 border-red-500/20',
    icon: XCircle
  },
  pending: {
    label: 'PENDING',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20 border-rose-500/20',
    icon: AlertCircle
  }
};

const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => (
  <div className="flex flex-col gap-[2px] ml-2" style={{ opacity: active ? 0.9 : 0.25 }}>
    <ChevronDown size={10} className={`transform rotate-180 transition-colors ${active && direction === 'asc' ? 'text-blue-500 font-bold' : 'text-slate-400'}`} />
    <ChevronDown size={10} className={`transition-colors ${active && direction === 'desc' ? 'text-blue-500 font-bold' : 'text-slate-400'}`} />
  </div>
);

const PLAN_DISPLAY_MAP: Record<string, string> = {
  'FREE TRAIL': 'TRAIL ACCESS',
  'FREE TRIAL': 'TRAIL ACCESS',
  'TRAIL ACCESS': 'TRAIL ACCESS',
  'Basic': 'Basic Access',
  'Basic Access': 'Basic Access',
  'Standard': 'Standard Access',
  'Standard Access': 'Standard Access',
  'Premium': 'Premium Access',
  'Premium Access': 'Premium Access',
  'Enterprise': 'Enterprise Access',
  'Enterprise Access': 'Enterprise Access'
};

const getDisplayPlanName = (dbName: string): string => {
  if (!dbName) return '';
  const upper = dbName.toUpperCase();
  if (upper.includes('TRAIL') || upper.includes('TRIAL')) return 'TRAIL ACCESS';
  if (upper.includes('BASIC')) return 'Basic Access';
  if (upper.includes('STANDARD')) return 'Standard Access';
  if (upper.includes('PREMIUM')) return 'Premium Access';
  if (upper.includes('ENTERPRISE')) return 'Enterprise Access';
  return dbName + ' Access';
};

const formatPrice = (price: string | number): string => {
  const val = Number(price);
  if (isNaN(val)) return '₹ 0.00';
  return '₹ ' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function SellerSubscriptions({ onLogout, onNavigate }: Props) {
  const [subscriptions, setSubscriptions] = useState<SellerSubscription[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchWithSeller, setSearchWithSeller] = useState('');
  const [search, setSearch] = useState('');

  // Pagination & Sorting States
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Dropdown States
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    seller: true,
    plan: true,
    pricePaid: true,
    period: true,
    status: true,
    createdAt: true
  });

  const columnList = [
    { key: 'seller', label: '1: Seller' },
    { key: 'plan', label: '2: Plan' },
    { key: 'pricePaid', label: '3: Price Paid' },
    { key: 'period', label: '4: Period' },
    { key: 'status', label: '5: Status' },
    { key: 'createdAt', label: '6: Created At' }
  ];

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/seller-subscriptions`);
      setSubscriptions(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load seller subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/plans`);
      setPlans(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    fetchPlans();
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Helper date format: YYYY-MM-DD / YYYY-MM-DD
  const formatPeriod = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '—';
    const format = (dStr: string) => {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return '—';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    return `${format(startDate)} / ${format(endDate)}`;
  };

  // Helper date format: YYYY-MM-DD HH:MM
  const formatCreatedAt = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  // Filter logic
  const filtered = subscriptions.filter(s => {
    // Top Row Filters
    const matchesPlanFilter = planFilter === 'all' || 
      getDisplayPlanName(s.plan_name).toLowerCase() === planFilter.toLowerCase();
      
    const matchesStatusFilter = statusFilter === 'all' || 
      (s.status || '').toLowerCase() === statusFilter.toLowerCase();
      
    const matchesSearchWithSeller = !searchWithSeller ||
      (s.seller_name || '').toLowerCase().includes(searchWithSeller.toLowerCase()) ||
      (s.seller_email || '').toLowerCase().includes(searchWithSeller.toLowerCase());

    // Middle Row General Search
    const matchesGeneralSearch = !search ||
      String(s.id).includes(search) ||
      (s.seller_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.seller_email || '').toLowerCase().includes(search.toLowerCase()) ||
      getDisplayPlanName(s.plan_name).toLowerCase().includes(search.toLowerCase()) ||
      (s.store_name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(s.price_paid).includes(search);

    return matchesPlanFilter && matchesStatusFilter && matchesSearchWithSeller && matchesGeneralSearch;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    let valA: any = a[sortColumn as keyof SellerSubscription];
    let valB: any = b[sortColumn as keyof SellerSubscription];

    if (sortColumn === 'seller') {
      valA = (a.seller_name || '').toLowerCase();
      valB = (b.seller_name || '').toLowerCase();
    } else if (sortColumn === 'plan') {
      valA = getDisplayPlanName(a.plan_name).toLowerCase();
      valB = getDisplayPlanName(b.plan_name).toLowerCase();
    } else if (sortColumn === 'pricePaid') {
      valA = Number(a.price_paid) || 0;
      valB = Number(b.price_paid) || 0;
    } else if (sortColumn === 'period') {
      valA = a.start_date || '';
      valB = b.start_date || '';
    }

    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    const strA = String(valA);
    const strB = String(valB);

    return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });

  const exportCSV = (type: 'all' | 'filtered') => {
    const targetData = type === 'all' ? subscriptions : filtered;
    if (targetData.length === 0) return toast.error('No data to export');
    const headers = ['ID', 'Seller', 'Email', 'Store', 'Plan', 'Status', 'Price Paid', 'Start Date', 'End Date'];
    const rows = targetData.map(s => [
      s.id,
      s.seller_name || '-',
      s.seller_email || '-',
      s.store_name || '-',
      getDisplayPlanName(s.plan_name) || '-',
      s.status.toUpperCase(),
      formatPrice(s.price_paid),
      s.start_date ? formatPeriod(s.start_date, s.end_date).split(' / ')[0] : '-',
      s.end_date ? formatPeriod(s.start_date, s.end_date).split(' / ')[1] : '-'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `seller_subscriptions_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportDropdown(false);
    toast.success(`Exported ${targetData.length} records successfully!`);
  };

  const totalPages = Math.ceil(sorted.length / perPage) || 1;
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <div
      className="p-8 font-sans min-h-screen bg-[#070b14] text-slate-100 transition-colors duration-300"
      onClick={() => {
        setShowColumnsDropdown(false);
        setShowExportDropdown(false);
      }}
    >
      <Navbar onLogout={onLogout} />

      {/* Top Banner Text */}
      <div className="flex items-center gap-2 mb-6 text-[13px] text-slate-400 font-medium">
        <span>Chota Beta | More Sellers. More Choices. Better Deals.</span>
        <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-500/10 text-blue-400 rounded">
          Multiple Vendor
        </span>
      </div>

      {/* Main Container Card */}
      <div
        className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border border-[#1e293b] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Breadcrumb and Filters Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#2d3748]/30">
          <div>
            <h1 className="text-[20px] font-semibold text-white">Subscribers</h1>
            <nav className="flex items-center gap-1.5 text-[12px] mt-1 text-slate-400">
              <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span>/</span>
              <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => onNavigate?.('subscription-plans')}>Subscriptions</span>
              <span>/</span>
              <span className="text-slate-400 font-normal">Subscribers</span>
            </nav>
          </div>

          {/* Filters Grid */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Plan Filter */}
            <div className="relative">
              <select
                value={planFilter}
                onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-[6px] pl-3 pr-8 py-1.5 text-[13px] text-slate-300 focus:outline-none appearance-none cursor-pointer min-w-[130px] shadow-sm"
              >
                <option value="all">Plan Filter</option>
                {Array.from(new Set(plans.map(p => getDisplayPlanName(p.name)))).map((displayName, idx) => (
                  <option key={idx} value={displayName}>{displayName}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3 pointer-events-none opacity-60 text-slate-500" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-[6px] pl-3 pr-8 py-1.5 text-[13px] text-slate-300 focus:outline-none appearance-none cursor-pointer min-w-[130px] shadow-sm"
              >
                <option value="all">Status Filter</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3 pointer-events-none opacity-60 text-slate-500" />
            </div>

            {/* Search With Seller Input */}
            <input
              type="text"
              placeholder="Search With Seller"
              value={searchWithSeller}
              onChange={(e) => { setSearchWithSeller(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-[6px] px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none min-w-[170px] shadow-sm"
            />

            {/* Refresh Button */}
            <button
              onClick={fetchSubscriptions}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-blue-500 text-blue-500 rounded-[6px] hover:bg-blue-500 hover:text-white transition-all duration-300 active:scale-95 text-[13px] font-normal bg-transparent shadow-sm"
            >
              <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Middle Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-[6px] px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none min-w-[200px]"
            />
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="bg-[#1e2736] border border-[#2d3748] rounded-[6px] pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-2.5 pointer-events-none opacity-60 text-slate-500" />
              </div>
              <span className="text-[13px] text-slate-400">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Columns Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowColumnsDropdown(!showColumnsDropdown); setShowExportDropdown(false); }}
                className="bg-transparent border border-[#2d3748] hover:border-slate-500 px-4 py-1.5 text-[13px] text-slate-200 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm rounded-md"
              >
                Columns <ChevronDown size={14} className="opacity-60" />
              </button>
              {showColumnsDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#2d3748] shadow-lg z-50 py-1 rounded-md"
                >
                  {columnList.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => setVisibleColumns({
                        ...visibleColumns,
                        [col.key]: !visibleColumns[col.key as keyof typeof visibleColumns]
                      })}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#1e2736] text-left text-[13px] text-slate-300 transition-colors bg-transparent"
                    >
                      <span>{col.label}</span>
                      {visibleColumns[col.key as keyof typeof visibleColumns] && <span className="text-blue-500 font-semibold mr-1">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowExportDropdown(!showExportDropdown); setShowColumnsDropdown(false); }}
                className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500/10 transition-all duration-300 active:scale-95 shadow-sm bg-transparent"
              >
                <Download size={15} /> Export <ChevronDown size={14} className="opacity-60 ml-1" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-[#111827] border border-[#1e293b] z-50 p-1">
                  <button
                    onClick={() => exportCSV('all')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#1e2736] text-slate-300 rounded font-extralight tracking-wider uppercase bg-transparent"
                  >
                    Export All Records
                  </button>
                  <button
                    onClick={() => exportCSV('filtered')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#1e2736] text-slate-300 rounded font-extralight tracking-wider uppercase border-t border-[#2d3748]/30 bg-transparent"
                  >
                    Export Filtered Only
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white' }} className="text-white">
                <th
                  onClick={() => handleSort('id')}
                  className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  style={{ width: '70px' }}
                >
                  <div className="flex items-center justify-between">
                    ID
                    <SortIcon active={sortColumn === 'id'} direction={sortDirection} />
                  </div>
                </th>
                {visibleColumns.seller && (
                  <th
                    onClick={() => handleSort('seller')}
                    className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      SELLER
                      <SortIcon active={sortColumn === 'seller'} direction={sortDirection} />
                    </div>
                  </th>
                )}
                {visibleColumns.plan && (
                  <th
                    onClick={() => handleSort('plan')}
                    className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      PLAN
                      <SortIcon active={sortColumn === 'plan'} direction={sortDirection} />
                    </div>
                  </th>
                )}
                {visibleColumns.pricePaid && (
                  <th
                    onClick={() => handleSort('pricePaid')}
                    className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      PRICE PAID
                      <SortIcon active={sortColumn === 'pricePaid'} direction={sortDirection} />
                    </div>
                  </th>
                )}
                {visibleColumns.period && (
                  <th
                    onClick={() => handleSort('period')}
                    className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      PERIOD
                      <SortIcon active={sortColumn === 'period'} direction={sortDirection} />
                    </div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th
                    onClick={() => handleSort('status')}
                    className="p-3 border-r border-[#2d3748]/30 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      STATUS
                      <SortIcon active={sortColumn === 'status'} direction={sortDirection} />
                    </div>
                  </th>
                )}
                {visibleColumns.createdAt && (
                  <th
                    onClick={() => handleSort('created_at')}
                    className="p-3 border-b-2 border-white font-medium text-[12px] tracking-wider text-left uppercase cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      CREATED AT
                      <SortIcon active={sortColumn === 'created_at'} direction={sortDirection} />
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-[#0c101a] divide-y divide-[#2d3748]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 size={36} className="animate-spin mx-auto text-blue-500 opacity-60" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 dark:text-slate-500 text-[12px] uppercase tracking-widest font-normal">
                    No Subscriptions Found
                  </td>
                </tr>
              ) : (
                paginated.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                      <td className="px-4 py-4 text-slate-400 text-[12px] font-normal border-r border-[#2d3748]/30">
                        {sub.id}
                      </td>
                      {visibleColumns.seller && (
                        <td className="px-4 py-4 border-r border-[#2d3748]/30">
                          <div className="text-blue-500 text-[13px] font-medium hover:underline cursor-pointer">
                            {sub.seller_name || '—'}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            {sub.seller_email || '—'}
                          </div>
                        </td>
                      )}
                      {visibleColumns.plan && (
                        <td className="px-4 py-4 text-slate-300 text-[13px] border-r border-[#2d3748]/30">
                          {getDisplayPlanName(sub.plan_name) || '—'}
                        </td>
                      )}
                      {visibleColumns.pricePaid && (
                        <td className="px-4 py-4 text-slate-300 text-[13px] border-r border-[#2d3748]/30">
                          {formatPrice(sub.price_paid)}
                        </td>
                      )}
                      {visibleColumns.period && (
                        <td className="px-4 py-4 text-slate-400 text-[12px] border-r border-[#2d3748]/30">
                          {formatPeriod(sub.start_date, sub.end_date)}
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-4 py-4 border-r border-[#2d3748]/30">
                          <span className={`inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>
                      )}
                      {visibleColumns.createdAt && (
                        <td className="px-4 py-4 text-slate-400 text-[12px]">
                          {formatCreatedAt(sub.created_at)}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* White highlight boundary line */}
        <div className="h-[2px] bg-white w-full mb-4"></div>

        {/* Card Footer Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-1">
          <p className="text-[12px] text-slate-400 font-extralight tracking-tight">
            Showing {sorted.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, sorted.length)} of {sorted.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || isLoading}
              className={`text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer ${page === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
              className={`text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer ${page === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={14} />
            </button>
            <div className="bg-blue-600 px-3 py-1 rounded text-white text-[12px] font-medium">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || isLoading}
              className={`text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer ${page === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || isLoading}
              className={`text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer ${page === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
