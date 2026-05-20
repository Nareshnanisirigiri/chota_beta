import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database,
  Eye,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryBoysProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface DeliveryBoy {
  id: number;
  user_id: number;
  delivery_zone_id: number | null;
  full_name: string;
  address: string | null;
  driver_license: string | null;
  driver_license_number: string | null;
  vehicle_type: string | null;
  vehicle_registration: string | null;
  verification_status: 'pending' | 'rejected' | 'verified';
  verification_remark: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  email: string;
  mobile: string;
  delivery_zone_name: string | null;
  total_orders?: number;
  completed_orders?: number;
  average_rating?: number;
}

interface Zone {
  id: number;
  name: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function DeliveryBoys({ onLogout, onNavigate }: DeliveryBoysProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters & Search States
  const [search, setSearch] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Pagination States
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Detail Modal States
  const [selectedBoyId, setSelectedBoyId] = useState<number | null>(null);
  const [detailedBoy, setDetailedBoy] = useState<DeliveryBoy | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [verificationForm, setVerificationForm] = useState({
    status: 'pending',
    remark: ''
  });

  // Fetch Delivery Boys
  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedZone) params.zone_id = selectedZone;
      if (selectedVerification) params.verification_status = selectedVerification;
      if (selectedStatus) params.status = selectedStatus;

      const res = await axios.get(`${BASE_URL}/api/delivery-boys`, { params });
      if (res.data.success) {
        setDeliveryBoys(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Zones
  const fetchZones = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-boys/zones`);
      if (res.data.success) {
        setZones(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    fetchDeliveryBoys();
  }, [page, limit, selectedZone, selectedVerification, selectedStatus]);

  // Handle Search Input (with debounce ideally, simple trigger on enter or button for now, or just search on state change)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDeliveryBoys();
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this delivery boy?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/delivery-boys/${id}`);
      if (res.data.success) {
        alert("Delivery boy deleted successfully");
        fetchDeliveryBoys();
      }
    } catch (err) {
      console.error("Error deleting delivery boy:", err);
      alert("Failed to delete delivery boy");
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await axios.put(`${BASE_URL}/api/delivery-boys/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        fetchDeliveryBoys();
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Fetch Detailed Delivery Boy for Modal
  const openDetailModal = async (id: number) => {
    setSelectedBoyId(id);
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/delivery-boys/${id}`);
      if (res.data.success) {
        setDetailedBoy(res.data.data);
        setVerificationForm({
          status: res.data.data.verification_status,
          remark: res.data.data.verification_remark || ''
        });
      }
    } catch (err) {
      console.error("Error fetching detailed boy:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Verification Update
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoyId) return;
    try {
      const res = await axios.put(`${BASE_URL}/api/delivery-boys/${selectedBoyId}/verification`, {
        verification_status: verificationForm.status,
        verification_remark: verificationForm.remark
      });
      if (res.data.success) {
        alert("Verification status updated successfully!");
        setModalOpen(false);
        fetchDeliveryBoys();
      }
    } catch (err) {
      console.error("Error updating verification:", err);
      alert("Failed to update verification status");
    }
  };

  // Export Data
  const handleExport = () => {
    const headersLine = "ID,Name,Email,Mobile,Zone,Vehicle Type,Verification,Status,Created At";
    const csvRows = deliveryBoys.map(db => 
      `"${db.id}","${db.full_name}","${db.email}","${db.mobile}","${db.delivery_zone_name || ''}","${db.vehicle_type || ''}","${db.verification_status}","${db.status}","${db.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headersLine, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `delivery_boys_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formatting dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status Badge Helper
  const renderVerificationBadge = (status: 'pending' | 'rejected' | 'verified') => {
    const classes = {
      pending: "bg-amber-500/10 text-amber-500 border border-amber-500/30",
      rejected: "bg-red-500/10 text-red-500 border border-red-500/30",
      verified: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
    };

    const icons = {
      pending: <Clock size={12} className="inline mr-1" />,
      rejected: <ShieldAlert size={12} className="inline mr-1" />,
      verified: <CheckCircle size={12} className="inline mr-1" />
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium capitalize flex items-center justify-center w-fit ${classes[status]}`}>
        {icons[status]}{status}
      </span>
    );
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header and Primary Selects */}
        <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-[18px] font-medium tracking-tight">Delivery Boys</h1>
              <nav className="flex items-center gap-2 text-[12px] mt-1">
                <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
                <span className="text-slate-500">/</span>
                <span className="text-blue-200/80">Delivery Boys</span>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative min-w-[160px]">
                <select 
                  value={selectedZone}
                  onChange={(e) => { setSelectedZone(e.target.value); setPage(1); }}
                  className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="">All Zones</option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative min-w-[160px]">
                <select 
                  value={selectedVerification}
                  onChange={(e) => { setSelectedVerification(e.target.value); setPage(1); }}
                  className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="">All Verifications</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative min-w-[160px]">
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
                  className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={fetchDeliveryBoys}
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
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[240px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <button type="submit" className="hidden" />
            <div className="flex items-center gap-3">
              <select 
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-400">entries per page</span>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
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
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1300px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {[
                  { label: "ID", width: "70px" },
                  { label: "FULL NAME", width: "auto" },
                  { label: "EMAIL", width: "auto" },
                  { label: "MOBILE", width: "130px" },
                  { label: "DELIVERY ZONE", width: "160px" },
                  { label: "VEHICLE TYPE", width: "140px" },
                  { label: "VERIFICATION STATUS", width: "180px" },
                  { label: "STATUS", width: "120px" },
                  { label: "CREATED AT", width: "160px" },
                  { label: "ACTION", width: "120px" }
                ].map((header, idx, arr) => (
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
                      borderRight: idx === arr.length - 1 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading delivery boys...</p>
                    </div>
                  </td>
                </tr>
              ) : deliveryBoys.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                deliveryBoys.map((db, idx) => (
                  <tr key={db.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 font-medium text-[13px]">{db.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">{db.full_name}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{db.email}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{db.mobile}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      {db.delivery_zone_name ? (
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[12px]">{db.delivery_zone_name}</span>
                      ) : (
                        <span className="text-slate-500 text-[12px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] capitalize">{db.vehicle_type || 'N/A'}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{renderVerificationBadge(db.verification_status)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <button
                        onClick={() => handleToggleStatus(db.id, db.status)}
                        className={`px-3 py-1 rounded text-[12px] font-bold uppercase transition-all ${
                          db.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20'
                        }`}
                      >
                        {db.status}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-400 text-[12px]">{formatDate(db.created_at)}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(db.id)}
                          className="p-1.5 hover:bg-blue-500/20 rounded text-blue-400 transition-colors"
                          title="View Details / Verify"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(db.id)}
                          className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Row 4: Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {deliveryBoys.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPage(1)} 
              disabled={page === 1}
              className={`text-slate-400 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              className={`text-slate-400 transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="bg-blue-600 px-3 py-0.5 rounded text-white text-[12px] font-medium">{page}</div>
            <button 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              disabled={page === totalPages}
              className={`text-slate-400 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setPage(totalPages)} 
              disabled={page === totalPages}
              className={`text-slate-400 transition-colors ${page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL & VERIFICATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1e293b]">
              <h2 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle className="text-blue-500" size={18} /> Delivery Boy Details & Verification
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-300">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <RefreshCcw size={32} className="animate-spin text-blue-500" />
                  <p className="text-[14px]">Loading details...</p>
                </div>
              ) : detailedBoy ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Details */}
                  <div className="space-y-4">
                    <h3 className="text-[14px] font-bold text-white border-b border-[#2d3748] pb-1 uppercase tracking-wider">Personal Information</h3>
                    <div className="space-y-2 text-[13px]">
                      <div className="flex justify-between"><span className="text-slate-500">Full Name:</span> <span className="font-semibold text-white">{detailedBoy.full_name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="text-white">{detailedBoy.email}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Mobile:</span> <span className="text-white">{detailedBoy.mobile}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Address:</span> <span className="text-white text-right max-w-[200px] break-words">{detailedBoy.address || 'N/A'}</span></div>
                    </div>

                    <h3 className="text-[14px] font-bold text-white border-b border-[#2d3748] pb-1 uppercase tracking-wider mt-6">Delivery & Vehicle Info</h3>
                    <div className="space-y-2 text-[13px]">
                      <div className="flex justify-between"><span className="text-slate-500">Zone:</span> <span className="text-white">{detailedBoy.delivery_zone_name || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Vehicle Type:</span> <span className="text-white capitalize">{detailedBoy.vehicle_type || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">License Number:</span> <span className="text-white">{detailedBoy.driver_license_number || 'N/A'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Total Assignments:</span> <span className="text-white font-semibold">{detailedBoy.total_orders}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Completed Deliveries:</span> <span className="text-white font-semibold text-emerald-400">{detailedBoy.completed_orders}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Average Rating:</span> <span className="text-yellow-400 font-semibold">{detailedBoy.average_rating ? `⭐ ${detailedBoy.average_rating}` : 'No rating yet'}</span></div>
                    </div>
                  </div>

                  {/* Right Column: Documents and Verification Action */}
                  <div className="space-y-4">
                    <h3 className="text-[14px] font-bold text-white border-b border-[#2d3748] pb-1 uppercase tracking-wider">Documents</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[12px] text-slate-500 block mb-1">Driver License</span>
                        {detailedBoy.driver_license ? (
                          <a 
                            href={`${BASE_URL}/uploads/${detailedBoy.driver_license}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block border border-[#2d3748] hover:border-blue-500 rounded p-1 text-center bg-[#0c101a] text-[11px] text-blue-400"
                          >
                            View Driver License
                          </a>
                        ) : (
                          <div className="border border-dashed border-[#2d3748] rounded py-3 text-center text-slate-600 text-[12px]">Not uploaded</div>
                        )}
                      </div>
                      <div>
                        <span className="text-[12px] text-slate-500 block mb-1">Vehicle Reg</span>
                        {detailedBoy.vehicle_registration ? (
                          <a 
                            href={`${BASE_URL}/uploads/${detailedBoy.vehicle_registration}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block border border-[#2d3748] hover:border-blue-500 rounded p-1 text-center bg-[#0c101a] text-[11px] text-blue-400"
                          >
                            View Vehicle Reg
                          </a>
                        ) : (
                          <div className="border border-dashed border-[#2d3748] rounded py-3 text-center text-slate-600 text-[12px]">Not uploaded</div>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleVerificationSubmit} className="space-y-4 mt-6 p-4 bg-[#1e2736] rounded-lg border border-[#2d3748]">
                      <h4 className="text-[13px] font-bold text-white uppercase tracking-wide">Update Verification</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 uppercase font-medium">Status</label>
                        <select
                          value={verificationForm.status}
                          onChange={(e) => setVerificationForm(f => ({ ...f, status: e.target.value }))}
                          className="w-full bg-[#0c101a] border border-[#2d3748] rounded px-3 py-1.5 text-[13px] text-white focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-slate-400 uppercase font-medium">Remarks</label>
                        <textarea
                          placeholder="Provide reasons for rejection or comments..."
                          value={verificationForm.remark}
                          onChange={(e) => setVerificationForm(f => ({ ...f, remark: e.target.value }))}
                          className="w-full bg-[#0c101a] border border-[#2d3748] rounded px-3 py-1.5 text-[13px] text-white focus:outline-none min-h-[60px] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] py-2 rounded transition-colors active:scale-[0.98]"
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-red-400">Failed to load details.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
