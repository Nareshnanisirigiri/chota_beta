import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryZonesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface DeliveryZone {
  id: number;
  name: string;
  slug: string;
  center_latitude: number;
  center_longitude: number;
  radius_km: number;
  rush_delivery_time_per_km: number | null;
  rush_delivery_charges: number | null;
  delivery_time_per_km: number;
  regular_delivery_charges: number;
  free_delivery_amount: number | null;
  distance_based_delivery_charges: number | null;
  per_store_drop_off_fee: number | null;
  handling_charges: number | null;
  delivery_boy_base_fee: string | null;
  delivery_boy_per_store_pickup_fee: string | null;
  delivery_boy_distance_based_fee: string | null;
  delivery_boy_per_order_incentive: string | null;
  buffer_time: number;
  boundary_json: string | null;
  rush_delivery_enabled: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function DeliveryZones({ onLogout, onNavigate }: DeliveryZonesProps) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Search & Status filters
  const [search, setSearch] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Hover animations
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    center_latitude: '',
    center_longitude: '',
    radius_km: '5',
    rush_delivery_time_per_km: '',
    rush_delivery_charges: '',
    delivery_time_per_km: '5',
    regular_delivery_charges: '30',
    free_delivery_amount: '',
    distance_based_delivery_charges: '',
    per_store_drop_off_fee: '',
    handling_charges: '',
    delivery_boy_base_fee: '',
    delivery_boy_per_store_pickup_fee: '',
    delivery_boy_distance_based_fee: '',
    delivery_boy_per_order_incentive: '',
    buffer_time: '10',
    boundary_json: '[]',
    rush_delivery_enabled: false,
    status: 'active' as 'active' | 'inactive'
  });

  const fetchZones = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      const res = await axios.get(`${BASE_URL}/api/delivery-zones`, { params });
      if (res.data.success) {
        setZones(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching delivery zones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [page, limit, search, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setFormData({
      name: '',
      center_latitude: '17.41581757',
      center_longitude: '78.50075745',
      radius_km: '10',
      rush_delivery_time_per_km: '',
      rush_delivery_charges: '',
      delivery_time_per_km: '5',
      regular_delivery_charges: '40',
      free_delivery_amount: '',
      distance_based_delivery_charges: '',
      per_store_drop_off_fee: '',
      handling_charges: '',
      delivery_boy_base_fee: '',
      delivery_boy_per_store_pickup_fee: '',
      delivery_boy_distance_based_fee: '',
      delivery_boy_per_order_incentive: '',
      buffer_time: '10',
      boundary_json: '[]',
      rush_delivery_enabled: false,
      status: 'active'
    });
    setView('form');
  };

  const handleOpenEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      center_latitude: String(zone.center_latitude),
      center_longitude: String(zone.center_longitude),
      radius_km: String(zone.radius_km),
      rush_delivery_time_per_km: zone.rush_delivery_time_per_km ? String(zone.rush_delivery_time_per_km) : '',
      rush_delivery_charges: zone.rush_delivery_charges ? String(zone.rush_delivery_charges) : '',
      delivery_time_per_km: String(zone.delivery_time_per_km),
      regular_delivery_charges: String(zone.regular_delivery_charges),
      free_delivery_amount: zone.free_delivery_amount ? String(zone.free_delivery_amount) : '',
      distance_based_delivery_charges: zone.distance_based_delivery_charges ? String(zone.distance_based_delivery_charges) : '',
      per_store_drop_off_fee: zone.per_store_drop_off_fee ? String(zone.per_store_drop_off_fee) : '',
      handling_charges: zone.handling_charges ? String(zone.handling_charges) : '',
      delivery_boy_base_fee: zone.delivery_boy_base_fee ? String(zone.delivery_boy_base_fee) : '',
      delivery_boy_per_store_pickup_fee: zone.delivery_boy_per_store_pickup_fee ? String(zone.delivery_boy_per_store_pickup_fee) : '',
      delivery_boy_distance_based_fee: zone.delivery_boy_distance_based_fee ? String(zone.delivery_boy_distance_based_fee) : '',
      delivery_boy_per_order_incentive: zone.delivery_boy_per_order_incentive ? String(zone.delivery_boy_per_order_incentive) : '',
      buffer_time: String(zone.buffer_time),
      boundary_json: zone.boundary_json || '[]',
      rush_delivery_enabled: zone.rush_delivery_enabled === 1,
      status: zone.status
    });
    setView('form');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this delivery zone?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/delivery-zones/${id}`);
      if (res.data.success) {
        alert("Delivery zone deleted successfully");
        fetchZones();
      }
    } catch (err) {
      console.error("Error deleting zone:", err);
      alert("Failed to delete zone");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Zone Name is required");
    if (!formData.center_latitude || !formData.center_longitude) return alert("Center Latitude and Longitude are required");

    setSaving(true);
    try {
      const payload = {
        ...formData,
        rush_delivery_enabled: formData.rush_delivery_enabled ? 1 : 0
      };

      let res;
      if (editingZone) {
        res = await axios.put(`${BASE_URL}/api/delivery-zones/${editingZone.id}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/api/delivery-zones`, payload);
      }

      if (res.data.success) {
        alert(editingZone ? "Delivery zone updated successfully" : "Delivery zone created successfully");
        setView('list');
        fetchZones();
      }
    } catch (err: any) {
      console.error("Error saving delivery zone:", err);
      alert(err.response?.data?.message || "Failed to save delivery zone");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (zones.length === 0) return;
    const csvHeaders = "ID,Name,Slug,Center Lat,Center Lng,Radius KM,Regular Charge,Free Delivery Amt,Status,Created At";
    const csvRows = zones.map(z => 
      `"${z.id}","${z.name}","${z.slug}","${z.center_latitude}","${z.center_longitude}","${z.radius_km}","${z.regular_delivery_charges}","${z.free_delivery_amount}","${z.status}","${z.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `delivery_zones_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = [
    { label: "ID", width: "70px", align: 'left' },
    { label: "NAME", width: "240px", align: 'left' },
    { label: "CENTER COORDINATES", width: "300px", align: 'left' },
    { label: "RADIUS (KM)", width: "130px", align: 'left' },
    { label: "DELIVERY TIME PER KM", width: "180px", align: 'left' },
    { label: "BUFFER TIME", width: "130px", align: 'left' },
    { label: "STATUS", width: "110px", align: 'center' },
    { label: "ACTION", width: "110px", align: 'center' }
  ];

  if (view === 'form') {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
        <Navbar onLogout={onLogout} />

        <div className="dashboard-card p-0 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
          <div className="px-6 py-6 border-b border-[#1e293b]/50 flex items-center justify-between">
            <div>
              <h1 className="text-white text-[22px] font-bold tracking-tight">
                {editingZone ? 'Edit Delivery Zone' : 'Add Delivery Zone'}
              </h1>
              <nav className="flex items-center gap-2 text-[12px] mt-1">
                <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => setView('list')}>List</span>
                <span className="text-slate-500">/</span>
                <span className="text-blue-200/80">{editingZone ? 'Edit Zone' : 'Add Zone'}</span>
              </nav>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="bg-[#0a0f18]/50 border border-[#2d3748]/50 rounded-xl p-6">
              
              {/* Map Placeholder */}
              <div className="relative w-full h-[320px] bg-[#1e2736] rounded-lg overflow-hidden border border-[#2d3748] shadow-inner mb-8">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=17.415,78.500&zoom=11&size=1200x320&key=MOCK_KEY&style=feature:all|element:labels|visibility:off&style=feature:geometry|color:0x212121&style=feature:water|color:0x000000"
                  alt="Map Background"
                  className="w-full h-full object-cover opacity-50 grayscale contrast-125"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <div className="text-center p-4 bg-slate-900/90 border border-slate-700/60 rounded-lg max-w-[400px]">
                    <h4 className="text-[14px] font-bold text-white mb-1">Interactive Map Boundary Selection</h4>
                    <p className="text-[12px] text-slate-400">Map rendering & manual polygon drawing tool is set to auto-detect boundary coordinates from Center Latitude / Longitude input.</p>
                  </div>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Zone Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai Central"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Center Latitude <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 17.415817"
                      value={formData.center_latitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, center_latitude: e.target.value }))}
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Center Longitude <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 78.500757"
                      value={formData.center_longitude}
                      onChange={(e) => setFormData(prev => ({ ...prev, center_longitude: e.target.value }))}
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                    />
                  </div>

                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <h3 className="text-blue-500 text-[16px] font-bold tracking-tight mb-8 flex items-center gap-2 italic underline decoration-blue-500/30 underline-offset-8">
                    Delivery Charges and Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Radius (KM)</label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={formData.radius_km}
                        onChange={(e) => setFormData(prev => ({ ...prev, radius_km: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Free Delivery Amount</label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={formData.free_delivery_amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, free_delivery_amount: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Buffer Time (MINS) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 10"
                        value={formData.buffer_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, buffer_time: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-10 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rush_delivery_enabled: !prev.rush_delivery_enabled }))}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${formData.rush_delivery_enabled ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${formData.rush_delivery_enabled ? 'left-6' : 'left-1'}`} />
                    </button>
                    <label className="text-slate-200 text-[13px] font-bold tracking-wide cursor-pointer flex items-center gap-2">
                      Rush Delivery Enabled
                    </label>
                  </div>

                  {formData.rush_delivery_enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Rush Delivery Time Per KM (MINS)</label>
                        <input
                          type="number"
                          placeholder="e.g. 3"
                          value={formData.rush_delivery_time_per_km}
                          onChange={(e) => setFormData(prev => ({ ...prev, rush_delivery_time_per_km: e.target.value }))}
                          className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Rush Delivery Charges</label>
                        <input
                          type="number"
                          placeholder="e.g. 100"
                          value={formData.rush_delivery_charges}
                          onChange={(e) => setFormData(prev => ({ ...prev, rush_delivery_charges: e.target.value }))}
                          className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Delivery Time Per KM (MINS) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 5"
                        value={formData.delivery_time_per_km}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_time_per_km: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Regular Delivery Charges <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 50"
                        value={formData.regular_delivery_charges}
                        onChange={(e) => setFormData(prev => ({ ...prev, regular_delivery_charges: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Distance Based Delivery Charges</label>
                      <input
                        type="number"
                        placeholder="e.g. 10"
                        value={formData.distance_based_delivery_charges}
                        onChange={(e) => setFormData(prev => ({ ...prev, distance_based_delivery_charges: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Per Store Drop Off Fee</label>
                      <input
                        type="number"
                        placeholder="e.g. 20"
                        value={formData.per_store_drop_off_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, per_store_drop_off_fee: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Handling Charges</label>
                      <input
                        type="number"
                        placeholder="e.g. 15"
                        value={formData.handling_charges}
                        onChange={(e) => setFormData(prev => ({ ...prev, handling_charges: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <h3 className="text-emerald-500 text-[16px] font-bold tracking-tight mb-8 flex items-center gap-2 italic underline decoration-emerald-500/30 underline-offset-8">
                    Delivery Boy Earnings
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Base Fee</label>
                      <input
                        type="text"
                        placeholder="e.g. 50.00"
                        value={formData.delivery_boy_base_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_boy_base_fee: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-light"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Per Store Pickup Fee</label>
                      <input
                        type="text"
                        placeholder="e.g. 15.00"
                        value={formData.delivery_boy_per_store_pickup_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_boy_per_store_pickup_fee: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Distance-Based Fee</label>
                      <input
                        type="text"
                        placeholder="e.g. 10.00"
                        value={formData.delivery_boy_distance_based_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_boy_distance_based_fee: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em]">Per-Order Incentive</label>
                      <input
                        type="text"
                        placeholder="e.g. 20.00"
                        value={formData.delivery_boy_per_order_incentive}
                        onChange={(e) => setFormData(prev => ({ ...prev, delivery_boy_per_order_incentive: e.target.value }))}
                        className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2d3748]/50 pt-8 mt-10">
                  <label className="text-slate-400 text-[11px] uppercase font-bold tracking-[0.15em] mb-4 block">Zone Status</label>
                  <div className="relative max-w-sm">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full bg-[#0d1520] border border-[#1e2d45] rounded-md px-4 py-3 text-[14px] text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-all font-light cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-8 border-t border-[#2d3748]/50">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="bg-transparent border border-[#2d3748] text-slate-400 font-light px-10 py-2.5 rounded-md text-[14px] transition-all hover:bg-slate-800 hover:text-white uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
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
                    {saving && <Loader2 size={16} className="animate-spin text-blue-500" />}
                    Save Zone
                  </button>
                </div>
              </div>

            </div>
          </form>
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
              onClick={handleOpenAdd}
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
              onClick={fetchZones}
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search zone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex items-center gap-3">
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[12px] text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

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
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading delivery zones...</p>
                    </div>
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 text-[13px]">{zone.id}</td>
                    <td className="px-5 py-4 text-slate-100 border-r border-[#2d3748]/30 font-medium text-[13px]">{zone.name}</td>
                    <td className="px-4 py-4 text-blue-400 border-r border-[#2d3748]/30 text-[13px] font-mono">{zone.center_latitude}, {zone.center_longitude}</td>
                    <td className="px-4 py-4 text-slate-100 border-r border-[#2d3748]/30 text-[13px]">{zone.radius_km} KM</td>
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 text-[13px]">{zone.delivery_time_per_km} Mins</td>
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 text-[13px]">{zone.buffer_time} Mins</td>
                    <td className="px-4 py-4 border-r border-[#2d3748]/30 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide capitalize ${
                        zone.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(zone)}
                          onMouseEnter={() => setHoveredAction(`${zone.id}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #3b82f6',
                            backgroundColor: hoveredAction === `${zone.id}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${zone.id}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
                          onMouseEnter={() => setHoveredAction(`${zone.id}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #ef4444',
                            backgroundColor: hoveredAction === `${zone.id}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${zone.id}-delete` ? 'white' : '#ef4444'
                          }}
                        >
                          <Trash2 size={14} />
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

        {/* Footers Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {zones.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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
    </div>
  );
}
