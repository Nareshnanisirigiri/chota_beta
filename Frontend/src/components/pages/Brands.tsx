import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  RefreshCcw,
  ChevronDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface Brand {
  id?: string | number;
  _id?: string | number;
  brandName: string;
  title?: string;
  scopeType: string;
  scopeCategory?: string;
  scopeId?: string;
  image?: string;
  logo?: string;
  status: string | boolean;
  createdAt?: string;
  description?: string;
}

interface BrandsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

const formatImageUrl = (url: string, slug?: string) => {
  if (url) {
    if (url.startsWith('http')) return url;
    const filename = url.split(/[/\\]/).pop();
    // If it looks like a local upload (has a timestamp like multer), serve locally
    if (filename && filename.match(/\d{10,}/)) {
        return `http://localhost:5000/uploads/brands/${filename}`;
    }
    // Production images are in Uploads/Brands
    return `https://chotabeta-backend.onrender.com/Uploads/Brands/${filename}`;
  }
  if (slug) {
    // If image field is empty, fallback to assuming the image is named after the slug
    return `https://chotabeta-backend.onrender.com/Uploads/Brands/${slug}.png`;
  }
  return 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png';
};

export default function Brands({ onLogout, onNavigate }: BrandsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [brandsData, setBrandsData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    scopeType: 'GLOBAL',
    scopeCategory: '',
    status: true
  });

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/brands`);
      console.log('FETCHED BRANDS DATA:', response.data);
      // Handle both { data: [...] } and direct array responses
      const brands = response.data?.data || response.data;
      setBrandsData(Array.isArray(brands) ? brands : []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      brandName: '',
      description: '',
      scopeType: 'GLOBAL',
      scopeCategory: '',
      status: true
    });
    setLogoFile(null);
    setSelectedBrand(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
  };

  const handleSubmit = async () => {
    if (!formData.brandName) {
      toast.error('Brand name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const brandId = selectedBrand?._id || selectedBrand?.id;
      const isEditing = !!brandId;

      if (!isEditing && !logoFile) {
        toast.error('Brand logo is required');
        setIsSubmitting(false);
        return;
      }

      const url = isEditing
        ? `${BASE_URL}/api/brands/${brandId}`
        : `${BASE_URL}/api/brands/create`;

      const method = isEditing ? 'put' : 'post';

      const data = new FormData();
      // Backend is strict, use specifically requested field names
      data.append('brandName', formData.brandName);
      data.append('description', formData.description || '');
      
      // Use standard snake_case as suggested by bulk upload schema
      data.append('scope_type', formData.scopeType);
      data.append('scope_id', formData.scopeCategory || '');
      data.append('status', formData.status ? 'ACTIVE' : 'INACTIVE');

      if (logoFile) {
        data.append('logo', logoFile);
      }

      const response = await axios({
        method,
        url,
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Brand ${isEditing ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        resetForm();
        fetchBrands();
      }
    } catch (error: any) {
      console.error('Error saving brand:', error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to save brand';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    try {
      await axios.delete(`${BASE_URL}/api/brands/${id}`);
      toast.success('Brand deleted successfully');
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      brandName: brand.brandName || brand.title || '',
      description: brand.description || '',
      scopeType: brand.scopeType || (brand as any).scope_type || 'GLOBAL',
      scopeCategory: brand.scopeCategory || brand.scopeId || (brand as any).scope_id || '',
      status: brand.status === 'ACTIVE' || brand.status === 'active' || brand.status === true
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Row 1: Header and Primary Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Brands</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Brands</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Brand
            </button>
            <button
              onClick={() => onNavigate?.('bulk-upload-brands')}
              onMouseEnter={() => setHoveredBtn('bulk')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #10b981',
                backgroundColor: hoveredBtn === 'bulk' ? '#10b981' : 'transparent',
                color: hoveredBtn === 'bulk' ? 'white' : '#10b981'
              }}
            >
              <Upload size={16} /> Bulk Upload
            </button>
            <button
              onClick={fetchBrands}
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
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />} Refresh
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
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "50px" },
                  { label: "TITLE", width: "160px" },
                  { label: "SCOPE TYPE", width: "180px" },
                  { label: "IMAGE", width: "100px" },
                  { label: "STATUS", width: "100px" },
                  { label: "CREATED AT", width: "100px" },
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 size={40} className="animate-spin mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-slate-400 font-extralight uppercase tracking-widest text-[12px]">Loading Brands...</p>
                  </td>
                </tr>
              ) : brandsData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <p className="text-slate-400 font-extralight uppercase tracking-widest text-[12px]">No Brands Found</p>
                  </td>
                </tr>
              ) : (
                brandsData.map((row: any, index) => {
                  let imageUrl = row.image || row.logo || '';
                  if (row.metadata) {
                    try {
                      const parsedMeta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata;
                      if (parsedMeta && parsedMeta.image) imageUrl = parsedMeta.image;
                    } catch (e) {}
                  }

                  return (
                    <tr key={row._id || row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.id || index + 1}</td>
                      <td className="border-r border-[#2d3748]/30  text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>{row.brandName || row.title}</td>
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '4px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div
                          className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded uppercase inline-block"
                          style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}
                        >
                          {(row.scopeType || row.scope_type || 'GLOBAL') === 'CATEGORY' ? `CATEGORY (${row.scopeCategory || row.scopeId || row.scope_id || 'N/A'})` : (row.scopeType || row.scope_type || 'GLOBAL')}
                        </div>
                      </td>
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
                        <div className="flex justify-start">
                          <div className="bg-white rounded-sm overflow-hidden p-0.5 border border-slate-700/50 shadow-inner flex items-center justify-center" style={{ width: '60px', height: '42px' }}>
                            <img 
                              src={formatImageUrl(imageUrl, row.slug)} 
                              alt={row.brandName || row.title} 
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png';
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                        <div className="flex justify-start">
                          <span className={(row.status === 'ACTIVE' || row.status === 'active' || row.status === true) ? "text-emerald-400 uppercase" : "text-red-400 uppercase"} style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                            {(row.status === 'ACTIVE' || row.status === 'active' || row.status === true) ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                        {(row.createdAt || row.created_at) ? new Date(row.createdAt || row.created_at).toISOString().split('T')[0] : 'N/A'}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center justify-start gap-2">
                          <button
                          onClick={() => handleEditClick(row)}
                          onMouseEnter={() => setHoveredAction(`${row._id || row.id}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            backgroundColor: hoveredAction === `${row._id || row.id}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${row._id || row.id}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(row._id || (row.id as any))}
                          onMouseEnter={() => setHoveredAction(`${row._id || row.id}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #ef4444',
                            backgroundColor: hoveredAction === `${row._id || row.id}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${row._id || row.id}-delete` ? 'white' : '#ef4444'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 1 to {brandsData.length} of {brandsData.length} entries
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

      {/* Add/Edit Modal (Standardized 500px Card) */}
      {(isModalOpen || (isEditModalOpen && selectedBrand)) && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 overflow-hidden text-left"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
          {/* Main Card - FORCED WIDTH 500px */}
          <div
            className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden"
            style={{
              backgroundColor: '#111827',
              width: '500px',
              maxWidth: '95vw',
              maxHeight: '85vh'
            }}
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">
                  {isModalOpen ? 'Create New Brand' : 'Update Brand Details'}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); resetForm(); }}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-7 no-scrollbar" style={{ backgroundColor: '#111827' }}>
              {/* Scope Type */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">Scope Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="scopeType"
                    value={formData.scopeType}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  >
                    <option value="GLOBAL">Global</option>
                    <option value="CATEGORY">Category</option>
                    <option value="REGION">Region</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {formData.scopeType === 'CATEGORY' && (
                <div className="space-y-3">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">Scope Category <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="scopeCategory"
                    value={formData.scopeCategory}
                    onChange={handleInputChange}
                    placeholder="Enter category name or ID"
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  />
                </div>
              )}

              {/* Brand Name */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">Brand Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                  style={{ fontWeight: '200' }}
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter brand description"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight resize-none"
                  style={{ fontWeight: '200' }}
                />
              </div>

              {/* Brand Logo Upload Area */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">Brand Logo {!selectedBrand && <span className="text-red-500">*</span>}</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#0c111d] border-2 border-dashed border-[#2d3748] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 transition-colors cursor-pointer group relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {logoFile ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Preview" 
                        className="w-24 h-24 object-contain rounded-md bg-white p-1"
                      />
                      <span className="text-blue-500 text-sm font-medium">{logoFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-[13px] text-slate-400 font-extralight" style={{ fontWeight: '200' }}>
                        Drag & Drop your files or <span className="text-blue-500 font-medium">Browse</span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-10 pt-4 border-t border-[#1e293b]/50">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 border ${formData.status ? 'bg-blue-600 border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-800 border-slate-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-300 ${formData.status ? 'left-[26px]' : 'left-[3px]'}`} />
                  </div>
                  <span className="text-[13px] text-slate-200 font-bold tracking-tight">Status</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); resetForm(); }}
                className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                onMouseEnter={() => setHoveredBtn('save')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-3 px-8 py-3 transition-all duration-300 text-[13px] font-bold active:scale-95 whitespace-nowrap disabled:opacity-50"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'save' ? 'white' : '#3b82f6',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)'
                }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isModalOpen ? 'Create Brand' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
