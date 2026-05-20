import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Database,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';

interface BannersProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface Banner {
  id: number;
  type: 'product' | 'category' | 'brand' | 'custom';
  scope_type: 'global' | 'category';
  scope_id: number | null;
  title: string;
  slug: string;
  custom_url: string | null;
  product_id: number | null;
  category_id: number | null;
  brand_id: number | null;
  position: 'top' | 'carousel';
  visibility_status: 'published' | 'draft';
  display_order: number;
  metadata: string | null;
  created_at: string;
  updated_at: string;
  media_id: number | null;
  file_name: string | null;
  disk: string | null;
  product_title: string | null;
  category_title: string | null;
  brand_title: string | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Banners({ onLogout, onNavigate }: BannersProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  
  // Data States
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Form View Toggler (Instead of modal, we render inline page to match screenshot)
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Form Field States
  const [formData, setFormData] = useState({
    title: '',
    type: '', // category, product, brand, custom
    scope_type: 'global', // global, category
    scope_id: '',
    custom_url: '',
    product_id: '',
    category_id: '',
    brand_id: '',
    position: '', // top, carousel
    visibility_status: 'draft', // default to Draft as in screenshot
    display_order: 0,
    image: null as File | null
  });

  // Reference Lists for Dropdowns
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);

  // Fetch Banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedType) params.type = selectedType;
      if (selectedPosition) params.position = selectedPosition;
      if (selectedStatus) params.visibility_status = selectedStatus;

      const res = await axios.get(`${BASE_URL}/api/banners`, { params });
      if (res.data.success) {
        setBanners(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown references
  const fetchReferences = async () => {
    try {
      const [catRes, prodRes, brandRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/category`),
        axios.get(`${BASE_URL}/api/products`),
        axios.get(`${BASE_URL}/api/brands`)
      ]);
      if (catRes.data.success) setCategoriesList(catRes.data.data || []);
      if (prodRes.data.success) setProductsList(prodRes.data.data || []);
      if (brandRes.data.success) setBrandsList(brandRes.data.data || []);
    } catch (err) {
      console.error("Error fetching references:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page, limit, selectedType, selectedPosition, selectedStatus]);

  useEffect(() => {
    fetchReferences();
  }, []);

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBanners();
  };

  // Reset Form state
  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      scope_type: 'global',
      scope_id: '',
      custom_url: '',
      product_id: '',
      category_id: '',
      brand_id: '',
      position: '',
      visibility_status: 'draft',
      display_order: 0,
      image: null
    });
  };

  // Handle Create Banner Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Title is required");
      return;
    }
    if (!formData.type) {
      alert("Type is required");
      return;
    }
    if (!formData.position) {
      alert("Position is required");
      return;
    }
    if (!formData.image) {
      alert("Banner Image is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('scope_type', formData.scope_type);
      
      if (formData.scope_type === 'category' && formData.scope_id) {
        data.append('scope_id', formData.scope_id);
      }
      
      if (formData.type === 'category' && formData.category_id) {
        data.append('category_id', formData.category_id);
      } else if (formData.type === 'product' && formData.product_id) {
        data.append('product_id', formData.product_id);
      } else if (formData.type === 'brand' && formData.brand_id) {
        data.append('brand_id', formData.brand_id);
      } else if (formData.type === 'custom' && formData.custom_url) {
        data.append('custom_url', formData.custom_url);
      }

      data.append('position', formData.position);
      data.append('visibility_status', formData.visibility_status);
      data.append('display_order', formData.display_order.toString());
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const res = await axios.post(`${BASE_URL}/api/banners`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        alert("Banner created successfully");
        setIsCreating(false);
        resetForm();
        fetchBanners();
      }
    } catch (err: any) {
      console.error("Error creating banner:", err);
      alert(err.response?.data?.message || "Failed to create banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/banners/${id}`);
      if (res.data.success) {
        alert("Banner deleted successfully");
        fetchBanners();
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
      alert("Failed to delete banner");
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (banners.length === 0) return;
    const headers = ['ID', 'Title', 'Type', 'Scope Type', 'Position', 'Visibility Status', 'Display Order', 'Created At'];
    const rows = banners.map(b => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      b.type,
      b.scope_type,
      b.position,
      b.visibility_status,
      b.display_order,
      new Date(b.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `banners_list_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renders the Create Banner view (Dark Mode theme matching previous styling)
  if (isCreating) {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
        <Navbar onLogout={onLogout} />

        {/* Create Banner Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-[20px] font-medium tracking-tight">Create Banner</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1 text-slate-400">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span>/</span>
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => setIsCreating(false)}>Banners</span>
              <span>/</span>
              <span className="text-slate-500">Create Banner</span>
            </nav>
          </div>

          <button
            onClick={() => setIsCreating(false)}
            onMouseEnter={() => setHoveredBtn('back')}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center gap-2 px-4 py-1.5 border transition-all duration-300 rounded-md text-[13px] font-medium shadow-sm"
            style={{
              borderColor: '#3b82f6',
              backgroundColor: hoveredBtn === 'back' ? '#3b82f6' : 'transparent',
              color: hoveredBtn === 'back' ? 'white' : '#3b82f6'
            }}
          >
            <ChevronLeft size={16} /> Back to List
          </button>
        </div>

        {/* Main Card Panel (Dark theme styling) */}
        <div className="bg-[#111827] rounded-lg border border-[#1e293b] shadow-2xl overflow-hidden mb-8">
          
          {/* Card Header Title */}
          <div className="px-6 py-4 border-b border-[#1e293b] bg-transparent">
            <h3 className="font-semibold text-[15px] text-slate-200">Banner Information</h3>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            
            {/* Scope Type Selector (Row 1 - Full Width) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-300">
                Scope Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.scope_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, scope_type: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="global">Global</option>
                  <option value="category">Category-Specific</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
              </div>
            </div>

            {/* Conditional Scope Category Dropdown */}
            {formData.scope_type === 'category' && (
              <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-indigo-500">
                <label className="text-[13px] font-medium text-slate-300">
                  Select Scope Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.scope_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, scope_id: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Choose Scope Category...</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                </div>
              </div>
            )}

            {/* Title & Link Type Grid (Row 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Title input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter banner title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Type Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Select banner type</option>
                    <option value="category">Category Link</option>
                    <option value="product">Product Link</option>
                    <option value="brand">Brand Link</option>
                    <option value="custom">Custom URL Link</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                </div>
              </div>

            </div>

            {/* Conditionals Row (Target Selector dropdowns based on Link Type) */}
            {formData.type && (
              <div className="pl-3 border-l-2 border-blue-500 py-1 space-y-4">
                
                {/* Category targets */}
                {formData.type === 'category' && (
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-[13px] font-medium text-slate-300">
                      Select Target Category <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                        className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">Choose Category...</option>
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                    </div>
                  </div>
                )}

                {/* Product targets */}
                {formData.type === 'product' && (
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-[13px] font-medium text-slate-300">
                      Select Target Product <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.product_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                        className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">Choose Product...</option>
                        {productsList.map((prod) => (
                          <option key={prod.id} value={prod.id}>{prod.title} (ID: {prod.id})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                    </div>
                  </div>
                )}

                {/* Brand targets */}
                {formData.type === 'brand' && (
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-[13px] font-medium text-slate-300">
                      Select Target Brand <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.brand_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand_id: e.target.value }))}
                        className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="">Choose Brand...</option>
                        {brandsList.map((brand) => (
                          <option key={brand.id} value={brand.id}>{brand.title || brand.brandName}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                    </div>
                  </div>
                )}

                {/* Custom targets */}
                {formData.type === 'custom' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-slate-300">
                      Custom Redirect URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/special-promotion"
                      value={formData.custom_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_url: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

              </div>
            )}

            {/* Position & Visibility Grid (Row 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Position selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Position <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Select banner position</option>
                    <option value="top">Top Banner</option>
                    <option value="carousel">Carousel Banner</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                </div>
              </div>

              {/* Visibility Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-slate-300">
                  Visibility Status <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.visibility_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility_status: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
                </div>
              </div>

            </div>

            {/* Display Order (Row 4) */}
            <div className="flex flex-col gap-1.5 max-w-[300px]">
              <label className="text-[13px] font-medium text-slate-300">Display Order</label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full border rounded-md px-3 py-2 text-[13px] text-slate-300 border-[#2d3748] bg-[#1e2736] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Banner Image Uploader (Row 5) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-300">Banner Image</label>
              {!formData.image ? (
                <div className="border border-[#2d3748] border-dashed rounded-md py-6 px-6 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#1a2233]/40 transition-colors h-[120px] bg-[#1e2736] relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))} 
                  />
                  <span className="text-slate-400 text-[13px]">
                    Drag & Drop your files or <span className="text-blue-400 font-medium underline">Browse</span>
                  </span>
                </div>
              ) : (
                <div className="border border-[#2d3748] rounded-lg p-2 bg-[#0c101a] flex flex-col items-center justify-center relative overflow-hidden group min-h-[140px]">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 left-2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded flex items-center justify-center text-white z-10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="absolute top-2 left-10 text-[10px] text-white/80 z-10 font-mono">
                    {formData.image.name}
                  </div>

                  <img src={URL.createObjectURL(formData.image)} alt="Banner Preview" className="max-w-full max-h-[160px] object-contain relative z-0" />
                </div>
              )}
            </div>

            {/* Footer Buttons (Row 6) */}
            <div className="flex justify-between items-center pt-6 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-blue-400 hover:text-blue-300 text-[13px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 font-medium text-[13px] text-white bg-[#2563eb] hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2 shadow-sm"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Create Banner
              </button>
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
            <h1 className="text-white text-[18px] font-medium tracking-tight font-display">Banners List</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1 text-slate-400">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span>/</span>
              <span className="text-blue-200/80">Banners</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setIsCreating(true); }}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-lg shadow-blue-500/10 uppercase tracking-widest"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Create Banner
            </button>
            <button
              onClick={fetchBanners}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5"
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

        {/* Search, Filter & Entries Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search banners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-[240px] bg-[#1e2736] border border-[#2d3748] rounded-md pl-9 pr-4 py-1.5 text-[13px] text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            </form>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="category">Category Link</option>
              <option value="product">Product Link</option>
              <option value="brand">Brand Link</option>
              <option value="custom">Custom URL Link</option>
            </select>

            {/* Position Filter */}
            <select
              value={selectedPosition}
              onChange={(e) => { setSelectedPosition(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Positions</option>
              <option value="top">Top Banner</option>
              <option value="carousel">Carousel Banner</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <div className="flex items-center gap-3">
              <select
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '14px'
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-400">entries per page</span>
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
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left text-sm border-collapse min-w-[1400px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "70px" },
                  { label: "TITLE", width: "auto" },
                  { label: "BANNER IMAGE", width: "160px" },
                  { label: "TYPE", width: "120px" },
                  { label: "SCOPE TYPE", width: "120px" },
                  { label: "LINK TARGET", width: "220px" },
                  { label: "POSITION", width: "120px" },
                  { label: "STATUS", width: "140px" },
                  { label: "DISPLAY ORDER", width: "130px" },
                  { label: "CREATED AT", width: "150px" },
                  { label: "ACTION", width: "100px" }
                ].map((header) => (
                  <th 
                    key={header.label}
                    style={{ 
                      padding: '12px 16px', 
                      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
                      borderBottom: '2px solid white',
                      fontSize: '13px',
                      color: 'white',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
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
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCcw size={32} className="text-blue-500 animate-spin" />
                      <span className="text-[14px] text-slate-400">Loading banner records...</span>
                    </div>
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No banner records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr 
                    key={banner.id} 
                    className="hover:bg-[#1a2233]/40 transition-colors border-b border-[#2d3748] last:border-b-0"
                  >
                    <td className="px-4 py-3 font-mono text-[13px] text-slate-400">{banner.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-[13px]">{banner.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{banner.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {banner.media_id && banner.file_name ? (
                        <div className="relative group">
                          <img 
                            src={banner.disk === 'local_uploads'
                              ? `${BASE_URL}/uploads/banners/${banner.file_name}`
                              : `https://superadmin.chotabeta.com/storage/${banner.media_id}/${banner.file_name}`
                            } 
                            alt={banner.title} 
                            className="w-24 h-12 object-cover rounded border border-[#2d3748] shadow-sm hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.onerror = null;
                              target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="80" viewBox="0 0 150 80"><rect width="100%" height="100%" fill="%231e2736"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23a0aec0">Banner</text></svg>`;
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[12px] italic">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wider uppercase ${
                        banner.type === 'category' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        banner.type === 'product' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        banner.type === 'brand' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {banner.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-300 capitalize">{banner.scope_type}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-300">
                      {banner.type === 'category' && (
                        <div>
                          <div className="text-[12px] text-slate-400">Category</div>
                          <div className="text-blue-400 text-[13px]">{banner.category_title || `ID: ${banner.category_id}`}</div>
                        </div>
                      )}
                      {banner.type === 'product' && (
                        <div>
                          <div className="text-[12px] text-slate-400">Product</div>
                          <div className="text-blue-400 text-[13px] truncate max-w-[200px]" title={banner.product_title || ''}>
                            {banner.product_title || `ID: ${banner.product_id}`}
                          </div>
                        </div>
                      )}
                      {banner.type === 'brand' && (
                        <div>
                          <div className="text-[12px] text-slate-400">Brand</div>
                          <div className="text-blue-400 text-[13px]">{banner.brand_title || `ID: ${banner.brand_id}`}</div>
                        </div>
                      )}
                      {banner.type === 'custom' && banner.custom_url && (
                        <a 
                          href={banner.custom_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[13px]"
                        >
                          <span className="truncate max-w-[180px]">{banner.custom_url}</span>
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      )}
                      {banner.type === 'custom' && !banner.custom_url && (
                        <span className="text-slate-500 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-300 capitalize">{banner.position}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        banner.visibility_status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {banner.visibility_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-slate-300 text-center">{banner.display_order}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-400">
                      {new Date(banner.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                          title="Delete Banner"
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

        {/* Footer / Pagination */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400">
            Showing {banners.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
          </p>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(1)} 
              disabled={page === 1}
              className={`p-1.5 rounded border border-[#2d3748] ${page === 1 ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-300 hover:bg-[#1e2736]'}`}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              className={`p-1.5 rounded border border-[#2d3748] ${page === 1 ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-300 hover:bg-[#1e2736]'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[13px] text-slate-300 px-2">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              disabled={page === totalPages}
              className={`p-1.5 rounded border border-[#2d3748] ${page === totalPages ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-300 hover:bg-[#1e2736]'}`}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setPage(totalPages)} 
              disabled={page === totalPages}
              className={`p-1.5 rounded border border-[#2d3748] ${page === totalPages ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-300 hover:bg-[#1e2736]'}`}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
