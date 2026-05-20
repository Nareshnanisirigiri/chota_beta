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
  Trash2,
  Edit2,
  X,
  Loader2,
  ArrowRightLeft
} from 'lucide-react';
import Navbar from '../Navbar';

interface FeaturedSectionsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

interface FeaturedSection {
  id: number;
  scope_type: 'global' | 'category';
  scope_id: number | null;
  title: string;
  slug: string;
  short_description: string | null;
  style: 'with_background' | 'without_background';
  background_type: 'image' | 'color' | null;
  background_color: string | null;
  text_color: string;
  section_type: string;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  category_ids: number[];
  category_titles: string | null;
  media_id: number | null;
  file_name: string | null;
  disk: string | null;
  scope_category_title: string | null;
}

interface Category {
  id: number;
  title: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function FeaturedSections({ onLogout, onNavigate }: FeaturedSectionsProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  // Data States
  const [sections, setSections] = useState<FeaturedSection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<FeaturedSection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    scope_type: 'global' as 'global' | 'category',
    scope_id: '',
    short_description: '',
    style: 'without_background' as 'with_background' | 'without_background',
    background_type: 'color' as 'image' | 'color',
    background_color: '#007bff',
    text_color: '#ffffff',
    section_type: 'featured',
    sort_order: '0',
    status: 'active' as 'active' | 'inactive',
    category_ids: [] as number[],
    image: null as File | null
  });

  const fetchSections = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search
      };
      if (selectedType) params.section_type = selectedType;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedScope) params.scope_type = selectedScope;

      const res = await axios.get(`${BASE_URL}/api/featured-sections`, { params });
      if (res.data.success) {
        setSections(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching featured sections:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category?limit=1000`);
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSections();
  }, [page, limit, selectedType, selectedStatus, selectedScope, search]);

  const handleOpenAdd = () => {
    setEditingSection(null);
    setFormData({
      title: '',
      scope_type: 'global',
      scope_id: '',
      short_description: '',
      style: 'without_background',
      background_type: 'color',
      background_color: '#007bff',
      text_color: '#ffffff',
      section_type: 'featured',
      sort_order: '0',
      status: 'active',
      category_ids: [],
      image: null
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (section: FeaturedSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title,
      scope_type: section.scope_type,
      scope_id: section.scope_id ? String(section.scope_id) : '',
      short_description: section.short_description || '',
      style: section.style,
      background_type: (section.background_type || 'color') as 'image' | 'color',
      background_color: section.background_color || '#007bff',
      text_color: section.text_color || '#ffffff',
      section_type: section.section_type,
      sort_order: String(section.sort_order),
      status: section.status,
      category_ids: section.category_ids || [],
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this featured section?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/featured-sections/${id}`);
      if (res.data.success) {
        alert("Featured section deleted successfully");
        fetchSections();
      }
    } catch (err) {
      console.error("Error deleting section:", err);
      alert("Failed to delete featured section");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required");
    if (!formData.section_type) return alert("Section Type is required");

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('scope_type', formData.scope_type);
      if (formData.scope_type === 'category' && formData.scope_id) {
        payload.append('scope_id', formData.scope_id);
      }
      payload.append('short_description', formData.short_description);
      payload.append('style', formData.style);
      
      if (formData.style === 'with_background') {
        payload.append('background_type', formData.background_type);
        if (formData.background_type === 'color') {
          payload.append('background_color', formData.background_color);
        } else if (formData.image) {
          payload.append('image', formData.image);
        }
      }

      payload.append('text_color', formData.text_color);
      payload.append('section_type', formData.section_type);
      payload.append('sort_order', formData.sort_order);
      payload.append('status', formData.status);
      payload.append('category_ids', formData.category_ids.join(','));

      let res;
      if (editingSection) {
        res = await axios.put(`${BASE_URL}/api/featured-sections/${editingSection.id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post(`${BASE_URL}/api/featured-sections`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        alert(editingSection ? "Featured section updated successfully" : "Featured section created successfully");
        setIsModalOpen(false);
        fetchSections();
      }
    } catch (err: any) {
      console.error("Error saving featured section:", err);
      alert(err.response?.data?.message || "Failed to save featured section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (catId: number) => {
    setFormData(prev => {
      const isSelected = prev.category_ids.includes(catId);
      const newIds = isSelected 
        ? prev.category_ids.filter(id => id !== catId)
        : [...prev.category_ids, catId];
      return { ...prev, category_ids: newIds };
    });
  };

  const handleExport = () => {
    if (sections.length === 0) return;
    const csvHeaders = "ID,Title,Slug,Scope,Section Type,Sort Order,Status,Created At";
    const csvRows = sections.map(s => 
      `"${s.id}","${s.title}","${s.slug}","${s.scope_type}","${s.section_type}","${s.sort_order}","${s.status}","${s.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `featured_sections_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const headers = [
    { label: "ID", width: "70px" },
    { label: "TITLE", width: "auto" },
    { label: "SCOPE", width: "150px" },
    { label: "SECTION TYPE", width: "160px" },
    { label: "SORT ORDER", width: "120px" },
    { label: "STATUS", width: "110px" },
    { label: "MAPPED CATEGORIES", width: "250px" },
    { label: "BACKGROUND", width: "150px" },
    { label: "ACTION", width: "120px" }
  ];

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header and Primary Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Featured Sections</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Featured Sections</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('sort-featured-section')}
              onMouseEnter={() => setHoveredBtn('sort')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'sort' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'sort' ? 'white' : '#3b82f6'
              }}
            >
              <ArrowRightLeft size={16} /> Sort Sections
            </button>

            <button 
              onClick={handleOpenAdd}
              onMouseEnter={() => setHoveredBtn('add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Add Section
            </button>

            <button 
              onClick={fetchSections}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95 whitespace-nowrap"
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

        {/* Row 2: Search and Filters */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search sections..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            
            <select 
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="newly_added">Newly Added</option>
              <option value="top_rated">Top Rated</option>
              <option value="best_seller">Best Seller</option>
              <option value="featured">Featured</option>
            </select>

            <select 
              value={selectedScope}
              onChange={(e) => { setSelectedScope(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Scopes</option>
              <option value="global">Global</option>
              <option value="category">Category-Specific</option>
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Visible / Active</option>
              <option value="inactive">Hidden / Inactive</option>
            </select>

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

        {/* Row 3: Table Area with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1300px]">
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
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      width: header.width,
                      whiteSpace: 'nowrap',
                      borderTop: '2px solid white',
                      borderBottom: '2px solid white',
                      borderLeft: idx === 0 ? '2px solid white' : 'none',
                      borderRight: idx === headers.length - 1 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
                  <td colSpan={9} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading featured sections...</p>
                    </div>
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sections.map((section) => (
                  <tr key={section.id} className="hover:bg-[#141b2d] border-b border-[#1e293b]">
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">{section.id}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-white font-medium text-[13px]">
                      <div>{section.title}</div>
                      <div className="text-[11px] text-slate-500 font-light">{section.slug}</div>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 text-[13px] capitalize">
                      {section.scope_type === 'category' ? (
                        <div>
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[11px]">Category</span>
                          <div className="text-[11px] text-slate-400 mt-1">{section.scope_category_title || `ID: ${section.scope_id}`}</div>
                        </div>
                      ) : (
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[11px]">Global</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-200 text-[13px] capitalize font-medium">
                      {section.section_type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px] font-mono">{section.sort_order}</td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] capitalize font-medium ${
                        section.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {section.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b] text-slate-300 text-[13px]">
                      {section.category_titles ? (
                        <span className="text-slate-300 text-[12px] line-clamp-2" title={section.category_titles}>
                          {section.category_titles}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[12px]">None mapped</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      {section.style === 'with_background' ? (
                        section.background_type === 'image' && section.file_name ? (
                          <img 
                            src={section.disk === 'local_uploads' 
                              ? `${BASE_URL}/uploads/banners/${section.file_name}`
                              : `https://superadmin.chotabeta.com/storage/${section.media_id}/${section.file_name}`
                            }
                            alt="Bg" 
                            className="w-16 h-8 object-cover rounded border border-[#2d3748]"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded border border-[#2d3748]" style={{ backgroundColor: section.background_color || 'transparent' }}></div>
                            <span className="text-[12px] text-slate-400 font-mono">{section.background_color}</span>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-500 text-[12px] italic">No Background</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(section)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit Section"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(section.id)}
                          className="p-1.5 hover:bg-[#1e293b] rounded text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Section"
                        >
                          <Trash2 size={15} />
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
            Showing {sections.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* Add / Edit Featured Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#1e293b] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {editingSection ? 'Edit Featured Section' : 'Create Featured Section'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                
                {/* Scope Type and Scope ID Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Scope Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={formData.scope_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, scope_type: e.target.value as 'global' | 'category' }))}
                        className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="global">Global</option>
                        <option value="category">Category-Specific</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  {formData.scope_type === 'category' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Scope Category <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          required
                          value={formData.scope_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, scope_id: e.target.value }))}
                          className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Choose Scope Category...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Title and Short Description */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Section Title <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Best Sellers 2024" 
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Short Description</label>
                    <textarea 
                      rows={2} 
                      placeholder="Optional subtitle for this section..." 
                      value={formData.short_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                      className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium resize-none" 
                    />
                  </div>
                </div>

                {/* Section Type and Sort Order Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Section Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={formData.section_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, section_type: e.target.value }))}
                        className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="newly_added">Newly Added</option>
                        <option value="top_rated">Top Rated</option>
                        <option value="best_seller">Best Seller</option>
                        <option value="featured">Featured / Custom Mapping</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Sort Order</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                      className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-blue-500 transition-all font-medium" 
                    />
                  </div>
                </div>

                {/* Mapped target Categories */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-1">Target Categories to Display</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[160px] overflow-y-auto border border-[#2d3748] rounded-md p-4 bg-[#0a0f18] scrollbar-thin">
                    {categories.map((cat) => {
                      const isSelected = formData.category_ids.includes(cat.id);
                      return (
                        <label key={cat.id} className="flex items-center gap-2 text-[13px] text-slate-300 cursor-pointer hover:text-white">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleCategorySelect(cat.id)}
                            className="rounded border-[#2d3748] text-blue-600 focus:ring-blue-500/20"
                          />
                          <span className="truncate">{cat.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Style, Background & Text Color settings */}
                <div className="space-y-4 border-t border-[#2d3748] pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Background Style</label>
                      <div className="relative">
                        <select 
                          value={formData.style}
                          onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value as any }))}
                          className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="without_background">Without Background</option>
                          <option value="with_background">With Background</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                      </div>
                    </div>

                    {formData.style === 'with_background' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Background Type</label>
                        <div className="relative">
                          <select 
                            value={formData.background_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, background_type: e.target.value as any }))}
                            className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-2.5 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                          >
                            <option value="color">Solid Color</option>
                            <option value="image">Image Background</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-4 h-4" />
                        </div>
                      </div>
                    )}

                  </div>

                  {formData.style === 'with_background' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#0a0f18] rounded-md border border-[#2d3748]">
                      
                      {formData.background_type === 'color' ? (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Background Color</label>
                          <div className="flex gap-2">
                            <input 
                              type="color" 
                              value={formData.background_color}
                              onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                              className="h-10 w-12 bg-transparent border-0 cursor-pointer rounded"
                            />
                            <input 
                              type="text" 
                              value={formData.background_color}
                              onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-3 text-[14px] text-white font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Background Image</label>
                          {!formData.image ? (
                            <div className="border border-[#2d3748] border-dashed rounded-md py-4 px-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#1a2233]/40 transition-colors h-[100px] bg-[#1e2736] relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))} 
                              />
                              <span className="text-slate-400 text-[12px]">Click to upload background image</span>
                            </div>
                          ) : (
                            <div className="border border-[#2d3748] rounded p-2 bg-[#0c101a] flex items-center justify-between">
                              <span className="text-[12px] text-slate-300 truncate max-w-[200px]">{formData.image.name}</span>
                              <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">Text Theme Color</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={formData.text_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                            className="h-10 w-12 bg-transparent border-0 cursor-pointer rounded"
                          />
                          <input 
                            type="text" 
                            value={formData.text_color}
                            onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                            className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-3 text-[14px] text-white font-mono focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Status toggle */}
                  <div className="flex items-center gap-4 py-2 border-t border-[#2d3748]/50 pt-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${formData.status === 'active' ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${formData.status === 'active' ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className="text-[13px] text-slate-200 font-medium">Status: {formData.status === 'active' ? 'Visible / Active' : 'Hidden / Inactive'}</span>
                  </div>

                </div>

              </div>

              <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-md text-[13px] font-extralight text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-10 py-2 transition-all duration-300 text-[13px] font-medium active:scale-95 bg-blue-600 hover:bg-blue-700 rounded-md text-white shadow-xl shadow-blue-500/10"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {editingSection ? 'Save Changes' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
