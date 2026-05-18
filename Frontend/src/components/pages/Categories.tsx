import React, { useState, useEffect } from 'react';
import {
  Plus, Upload, ArrowUpDown, RefreshCcw, ChevronDown, Edit2, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, X, Loader2, Info
} from 'lucide-react';
import Navbar from '../Navbar';
import { toast } from 'sonner';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatImageUrl = (url: string | null) => {
  if (!url) return 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const filename = url.split(/[/\\]/).pop(); return `${BASE_URL}/uploads/categories/${filename}`;
};

interface CategoriesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

const Toggle = ({ enabled, onClick, label }: { enabled: boolean, onClick: () => void, label: string }) => (
  <div className="flex items-center cursor-pointer gap-3" onClick={onClick}>
    <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-[2px] transition-all duration-200 shadow-sm ${enabled ? 'left-[22px]' : 'left-[2px]'}`} />
    </div>
    <span className="font-medium" style={{ fontSize: '13px', color: '#000' }}>{label}</span>
  </div>
);

export default function Categories({ onLogout, onNavigate }: CategoriesProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parent_id: '',
    commission: 0,
    backgroundType: 'Color',
    backgroundColor: '#000000',
    fontColor: '#000000',
    status: 'active',
    requires_approval: '0',
    image: null as File | string | null,
    banner: null as File | string | null,
    icon: null as File | string | null,
    activeIcon: null as File | string | null,
    remove_image: false,
    remove_banner: false,
    remove_icon: false,
    remove_activeIcon: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      const allCategories = res.data?.data || [];
      
      const formattedCategories = allCategories.map((c: any) => {
        let parentName = 'N/A';
        if (c.parent_id) {
          const parent = allCategories.find((p: any) => p.id === c.parent_id);
          if (parent) parentName = parent.title;
        }

        let metadataObj = {};
        try {
          metadataObj = typeof c.metadata === 'string' ? JSON.parse(c.metadata) : c.metadata || {};
        } catch(e) {}

        return {
          ...c,
          parentName,
          metadataObj
        };
      });

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: file,
        [`remove_${name}`]: false 
      }));
    }
  };

  const handleRemoveImage = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: null,
      [`remove_${name}`]: true
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      parent_id: '',
      commission: 0,
      backgroundType: 'Color',
      backgroundColor: '#000000',
      fontColor: '#000000',
      status: 'active',
      requires_approval: '0',
      image: null,
      banner: null,
      icon: null,
      activeIcon: null,
      remove_image: false,
      remove_banner: false,
      remove_icon: false,
      remove_activeIcon: false
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/category/${id}`);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
        toast.error('Category Name is required');
        return;
    }
    
    setIsSubmitting(true);
    try {
      const endpoint = isEditing ? `/api/category/${editingId}` : '/api/category/create';
      const method = isEditing ? 'put' : 'post';

      const data = new FormData();
      data.append('title', formData.title);
      if (formData.parent_id) data.append('parent_id', formData.parent_id);
      data.append('description', formData.description || '');
      data.append('commission', (formData.commission || 0).toString());
      data.append('status', formData.status);
      data.append('requires_approval', formData.requires_approval);
      data.append('backgroundType', formData.backgroundType);
      data.append('backgroundColor', formData.backgroundColor);
      data.append('fontColor', formData.fontColor);

      if (formData.image instanceof File) data.append('image', formData.image);
      if (formData.banner instanceof File) data.append('banner', formData.banner);
      if (formData.icon instanceof File) data.append('icon', formData.icon);
      if (formData.activeIcon instanceof File) data.append('activeIcon', formData.activeIcon);

      if (formData.remove_image) data.append('remove_image', 'true');
      if (formData.remove_banner) data.append('remove_banner', 'true');
      if (formData.remove_icon) data.append('remove_icon', 'true');
      if (formData.remove_activeIcon) data.append('remove_activeIcon', 'true');

      await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(`Category ${isEditing ? 'updated' : 'created'} successfully`);
      setIsAddModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    console.log("Edit button clicked for category:", category);
    setFormData({
      title: category.title || '',
      description: category.description || '',
      parent_id: category.parent_id || '',
      commission: parseFloat(category.commission) || 0,
      backgroundType: category.metadataObj?.backgroundType || 'Color',
      backgroundColor: category.metadataObj?.backgroundColor || '#000000',
      fontColor: category.metadataObj?.fontColor || '#000000',
      status: category.status || 'inactive',
      requires_approval: category.requires_approval?.toString() || '0',
      image: category.metadataObj?.image || null,
      banner: category.metadataObj?.banner || null,
      icon: category.metadataObj?.icon || null,
      activeIcon: category.metadataObj?.activeIcon || null,
      remove_image: false,
      remove_banner: false,
      remove_icon: false,
      remove_activeIcon: false
    });
    setIsEditing(true);
    setEditingId(category.id);
    setIsAddModalOpen(true);
  };

  const renderFilePreview = (name: string, fileOrUrl: File | string | null, label: string, required = false) => {
    if (!fileOrUrl) {
      return (
        <div className="space-y-1">
          <label className="text-[13px] font-medium text-slate-700 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="border border-slate-300 rounded-md py-4 px-6 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors h-[100px] bg-white relative">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)} />
            <span className="text-slate-500 text-[13px]">Drag & Drop your files or <span className="text-blue-600 font-medium underline">Browse</span></span>
          </div>
        </div>
      );
    }

    const isFile = fileOrUrl instanceof File;
    const url = isFile ? URL.createObjectURL(fileOrUrl) : formatImageUrl(fileOrUrl as string);
    const fileName = isFile ? fileOrUrl.name : (fileOrUrl as string).split(/[/\\]/).pop();

    return (
      <div className="space-y-1">
        <label className="text-[13px] font-medium text-slate-700 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="border border-slate-200 rounded-lg p-2 bg-[#1a1a1a] flex flex-col items-center justify-center relative overflow-hidden group min-h-[140px]">
          <button 
            onClick={() => handleRemoveImage(name)}
            className="absolute top-2 left-2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded flex items-center justify-center text-white z-10 transition-colors"
          >
            <X size={14} />
          </button>
          
          <div className="absolute top-2 left-10 text-[10px] text-white/80 z-10 font-mono hidden md:block">
            {fileName}
          </div>

          <img src={url} alt={label} className="max-w-full max-h-[160px] object-contain relative z-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Categories Content Card (DARK THEME) */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Integrated Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Categories</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Categories</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #4973B6',
                backgroundColor: hoveredBtn === 'add' ? '#4973B6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#4973B6'
              }}
            >
              <Plus size={16} /> Add Category
            </button>
            <button
              onClick={() => onNavigate?.('bulk-upload')}
              onMouseEnter={() => setHoveredBtn('bulk')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
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
              onMouseEnter={() => setHoveredBtn('sort')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #4973B6',
                backgroundColor: hoveredBtn === 'sort' ? '#4973B6' : 'transparent',
                color: hoveredBtn === 'sort' ? 'white' : '#4973B6'
              }}
            >
              <ArrowUpDown size={16} /> Sort
            </button>
            <button
              onClick={fetchData}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #4973B6',
                backgroundColor: hoveredBtn === 'refresh' ? '#4973B6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#4973B6'
              }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />} Refresh
            </button>
          </div>
        </div>

        {/* Controls Bar */}
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
              <span className="text-[13px] text-slate-100 font-extralight" style={{ fontWeight: '200' }}>entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowColumnDropdown(prev => !prev)}
                className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200 flex items-center gap-2"
                style={{ borderRadius: '12px' }}
              >
                Columns <ChevronDown size={14} className="opacity-60" />
              </button>

              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#2d3748] rounded-lg shadow-lg z-50">
                  <div className="px-3 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer">ID</div>
                  <div className="px-3 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer">Name</div>
                  <div className="px-3 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer">Image</div>
                  <div className="px-3 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer">Parent</div>
                </div>
              )}
            </div>
            <button
              onMouseEnter={() => setHoveredBtn('export')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #4973B6',
                backgroundColor: hoveredBtn === 'export' ? '#4973B6' : 'transparent',
                color: hoveredBtn === 'export' ? 'white' : '#4973B6'
              }}
            >
              <Download size={16} />
              Export <ChevronDown size={14} className="inline opacity-60 ml-1" />
            </button>
          </div>
        </div>

        {/* Categories Table Area with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#4973B6 #1e2736' }}>
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {[
                  { label: "ID", width: "90px" },
                  { label: "TITLE", width: "auto" },
                  { label: "IMAGE", width: "120px" },
                  { label: "PARENT", width: "150px" },
                  { label: "COMMISSION", width: "130px" },
                  { label: "STATUS", width: "110px" },
                  { label: "REQUIRES APPROVAL", width: "150px" },
                  { label: "CREATED AT", width: "140px" },
                  { label: "ACTION", width: "120px" }
                ].map((header, idx) => (
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
                      borderRight: idx === 8 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
                  <td colSpan={9} className="py-20 text-center">
                    <Loader2 size={40} className="animate-spin mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-slate-400 font-extralight uppercase tracking-widest text-[12px]">Loading Categories...</p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <p className="text-slate-400 font-extralight uppercase tracking-widest text-[12px]">No Categories Found</p>
                  </td>
                </tr>
              ) : categories.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.id}</td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>{row.title}</td>
                  <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '4px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="flex justify-center">
                      <div className="bg-white rounded-sm overflow-hidden p-0.5 flex items-center justify-center border border-slate-700/50 shadow-inner" style={{ width: '50px', height: '38px' }}>
                        <img src={formatImageUrl(row.metadataObj?.image)} alt={row.title} className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                  </td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                    {row.parentName}
                  </td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em', textAlign: 'left' }}>{parseFloat(row.commission).toFixed(2)}%</td>
                  <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="flex justify-start">
                      <span className={(row.status === 'active') ? "text-emerald-400 uppercase" : "text-red-400 uppercase"} style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}>
                        {(row.status === 'active') ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="flex justify-start">
                      <span
                        className={`${(row.requires_approval === 1 || row.requires_approval === '1') ? 'text-blue-400' : 'text-amber-400'} uppercase tracking-widest whitespace-nowrap`}
                        style={{ fontSize: '13px', fontWeight: '200', letterSpacing: '0.1em' }}
                      >
                        {(row.requires_approval === 1 || row.requires_approval === '1') ? 'REQUIRED' : 'NOT REQUIRED'}
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                    {row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'N/A'}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        onMouseEnter={() => setHoveredAction(`${row.id}-edit`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #4973B6',
                          backgroundColor: hoveredAction === `${row.id}-edit` ? '#4973B6' : 'transparent',
                          color: hoveredAction === `${row.id}-edit` ? 'white' : '#4973B6'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        onMouseEnter={() => setHoveredAction(`${row.id}-delete`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #ef4444',
                          backgroundColor: hoveredAction === `${row.id}-delete` ? '#ef4444' : 'transparent',
                          color: hoveredAction === `${row.id}-delete` ? 'white' : '#ef4444'
                        }}
                      >
                        <Trash2 size={16} />
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

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 1 to {categories.length} of {categories.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={16} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <div className="bg-blue-600 px-3 py-0.5 rounded text-white text-[12px] font-extralight" style={{ fontWeight: '200' }}>1</div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Light Theme Modal Form (Matches screenshot perfectly) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden" style={{ zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-lg shadow-xl flex flex-col w-full overflow-hidden relative" style={{ maxWidth: '650px', maxHeight: '95vh', color: '#000' }}>
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100" style={{ borderColor: '#f1f5f9' }}>
              <h2 className="font-semibold" style={{ fontSize: '16px', color: '#000' }}>
                {isEditing ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ color: '#64748b' }} className="hover:text-slate-900 transition-colors">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Category Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  style={{ fontSize: '13px', borderColor: '#cbd5e1', color: '#000' }}
                  placeholder="Makhana"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none bg-white"
                  style={{ fontSize: '13px', borderColor: '#cbd5e1', color: '#000' }}
                  placeholder="Enter description..."
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Parent Category</label>
                <div className="relative">
                  <select
                    name="parent_id"
                    value={formData.parent_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    style={{ fontSize: '13px', borderColor: '#cbd5e1', color: '#000' }}
                  >
                    <option value="">Search Category</option>
                    {categories.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#000', width: '16px', height: '16px' }} />
                </div>
              </div>

              {renderFilePreview('image', formData.image, 'Image', true)}
              {renderFilePreview('banner', formData.banner, 'Banner', false)}
              {renderFilePreview('icon', formData.icon, 'Icon', false)}
              {renderFilePreview('activeIcon', formData.activeIcon, 'Active Icon', false)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Background Type</label>
                <div className="relative">
                  <select
                    name="backgroundType"
                    value={formData.backgroundType}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    style={{ fontSize: '13px', borderColor: '#cbd5e1', color: '#000' }}
                  >
                    <option value="Color">Color</option>
                    <option value="Gradient">Gradient</option>
                    <option value="Image">Image</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#000', width: '16px', height: '16px' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#475569' }}>This background will be displayed on the home page of the category.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Background Color <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="flex">
                  <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-0.5 cursor-pointer bg-white"
                    style={{ height: '32px', borderColor: '#cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Font Color</label>
                <div className="flex">
                  <input
                    type="color"
                    name="fontColor"
                    value={formData.fontColor}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-0.5 cursor-pointer bg-white"
                    style={{ height: '32px', borderColor: '#cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="font-medium" style={{ fontSize: '13px', color: '#000' }}>Commission</label>
                
                <div className="p-3 bg-blue-50 rounded-md flex items-start gap-2 mb-2" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <Info size={16} className="text-blue-500 flex-shrink-0" style={{ marginTop: '2px' }} />
                  <span className="leading-snug" style={{ fontSize: '13px', color: '#000' }}>Subscription module is enabled. If you do not want to apply category-wise commission, simply set it to 0%.</span>
                </div>

                <input
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  style={{ fontSize: '13px', borderColor: '#cbd5e1', color: '#000' }}
                />
                <p style={{ fontSize: '11px', color: '#475569' }}>Enter commission percentage (0-100)</p>
              </div>

              <div className="flex items-center gap-10 pt-2 pb-6">
                <Toggle
                  label="Status"
                  enabled={formData.status === 'active'}
                  onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                />
                <Toggle
                  label="Requires Approval"
                  enabled={formData.requires_approval === '1'}
                  onClick={() => setFormData(prev => ({ ...prev, requires_approval: prev.requires_approval === '1' ? '0' : '1' }))}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white flex justify-end gap-3 shadow-sm z-10 relative" style={{ borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                style={{ fontSize: '13px', borderColor: '#cbd5e1' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                style={{ fontSize: '13px', backgroundColor: '#2563eb' }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isEditing ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
