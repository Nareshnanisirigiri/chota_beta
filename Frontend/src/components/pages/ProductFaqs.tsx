import React, { useState, useEffect } from 'react';
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
  Database,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface ProductFaq {
  id: number;
  product_id: number;
  question: string;
  answer: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  productTitle?: string;
}

interface Product {
  id: number;
  title: string;
}

interface ProductFaqsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function ProductFaqs({ onLogout, onNavigate }: ProductFaqsProps) {
  const [faqs, setFaqs] = useState<ProductFaq[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<ProductFaq | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    product_id: '',
    question: '',
    answer: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all Product FAQs
  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/product-faqs`);
      if (response.data && response.data.success) {
        setFaqs(response.data.data || []);
      } else {
        setFaqs([]);
        toast.error('Failed to load FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to connect to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch simple product list for selection
  const fetchProductsList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      // Parse products list
      const items = response.data?.data || response.data || [];
      if (Array.isArray(items)) {
        setProducts(items.map((i: any) => ({
          id: i.id,
          title: i.title || i.name || 'Unnamed Product'
        })));
      }
    } catch (error) {
      console.error('Error fetching products list:', error);
    }
  };

  useEffect(() => {
    fetchFaqs();
    fetchProductsList();
  }, []);

  const resetForm = () => {
    setFormData({
      product_id: products[0]?.id ? String(products[0].id) : '',
      question: '',
      answer: '',
      status: 'active'
    });
    setSelectedFaq(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    resetForm();
    if (products.length > 0) {
      setFormData(prev => ({ ...prev, product_id: String(products[0].id) }));
    }
    setIsModalOpen(true);
  };

  const openEditModal = (faq: ProductFaq) => {
    setSelectedFaq(faq);
    setFormData({
      product_id: String(faq.product_id),
      question: faq.question,
      answer: faq.answer,
      status: faq.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.product_id) {
      toast.error('Please select a product');
      return;
    }
    if (!formData.question.trim()) {
      toast.error('Question is required');
      return;
    }
    if (!formData.answer.trim()) {
      toast.error('Answer is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = !!selectedFaq;
      const url = isEditing
        ? `${BASE_URL}/api/product-faqs/${selectedFaq.id}`
        : `${BASE_URL}/api/product-faqs/create`;

      const method = isEditing ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: {
          product_id: Number(formData.product_id),
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          status: formData.status
        }
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || `FAQ ${isEditing ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        resetForm();
        fetchFaqs();
      } else {
        toast.error(response.data?.message || 'Failed to save FAQ');
      }
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await axios.delete(`${BASE_URL}/api/product-faqs/${id}`);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'FAQ deleted successfully');
        fetchFaqs();
      } else {
        toast.error(response.data?.message || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  // CSV Export
  const handleExport = () => {
    if (faqs.length === 0) {
      toast.error('No FAQ entries to export');
      return;
    }

    const headers = ['ID', 'Product ID', 'Product Title', 'Question', 'Answer', 'Status', 'Created At'];
    const rows = faqs.map(faq => [
      faq.id,
      faq.product_id,
      faq.productTitle || 'N/A',
      `"${faq.question.replace(/"/g, '""')}"`,
      `"${faq.answer.replace(/"/g, '""')}"`,
      faq.status.toUpperCase(),
      faq.created_at || 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `product_faqs_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Successfully exported FAQs to CSV!');
  };

  // Filters logic
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.productTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = !selectedProductFilter || String(faq.product_id) === selectedProductFilter;
    const matchesStatus = !selectedStatusFilter || faq.status === selectedStatusFilter;

    return matchesSearch && matchesProduct && matchesStatus;
  });

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredFaqs.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredFaqs.length / entriesPerPage) || 1;

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        
        {/* Row 1: Header and Primary Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Product Faqs</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('products')}>Products</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Product Faqs</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
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
              <Plus size={16} /> Add FAQ
            </button>
            <button
              onClick={fetchFaqs}
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

        {/* Row 2: Advanced Search and Dropdown Filtering */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by question, answer, product..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={selectedProductFilter}
              onChange={(e) => { setSelectedProductFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="">Filter by Product</option>
              {products.map(p => (
                <option key={p.id} value={String(p.id)}>{p.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={(e) => { setSelectedStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#1e2736] border border-[#2d3748] rounded-md px-3 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
            >
              <option value="">Filter by Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="flex items-center gap-2">
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md px-2 py-1.5 text-[12px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[13px] text-slate-300 whitespace-nowrap">per page</span>
            </div>
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
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Row 3: Table Section with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "PRODUCT", width: "200px" },
                  { label: "QUESTION", width: "250px" },
                  { label: "ANSWER", width: "350px" },
                  { label: "STATUS", width: "120px" },
                  { label: "CREATED AT", width: "150px" },
                  { label: "ACTION", width: "120px" }
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
                    <p className="mt-4 text-slate-400 font-extralight uppercase tracking-widest text-[12px]">Loading FAQ database...</p>
                  </td>
                </tr>
              ) : currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center border-r border-[#2d3748]/30">
                    <div className="flex flex-col items-center gap-2">
                      <Database size={24} className="opacity-20" />
                      <span className="text-[16px] font-extralight tracking-tight opacity-50">No matching records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                currentEntries.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{row.id}</td>
                    <td className="border-r border-[#2d3748]/30 text-blue-400 font-medium" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '14px', letterSpacing: '0.05em' }}>{row.productTitle || `Product ID: ${row.product_id}`}</td>
                    <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: 'normal' }}>{row.question}</td>
                    <td className="border-r border-[#2d3748]/30 text-slate-300 font-light" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', lineHeight: '1.4' }}>{row.answer}</td>
                    <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px' }}>
                      <span className={row.status === 'active' ? "text-emerald-400 uppercase" : "text-red-400 uppercase"} style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '15px', paddingBottom: '15px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                      {row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-start gap-2">
                        <button
                          onClick={() => openEditModal(row)}
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
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
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

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {filteredFaqs.length === 0 ? 0 : indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredFaqs.length)} of {filteredFaqs.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="bg-blue-600 px-3 py-0.5 rounded text-white text-[12px] font-medium">{currentPage} / {totalPages}</div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`text-slate-400 hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product FAQ Modal (Forced 500px Theme Compliant Layout) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 overflow-hidden text-left"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
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
                  {selectedFaq ? 'Update FAQ Details' : 'Create Product FAQ'}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-7 no-scrollbar" style={{ backgroundColor: '#111827' }}>
              {/* Product Selector */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleInputChange}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  >
                    <option value="" disabled>-- Choose a Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={String(p.id)}>{p.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the question"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                />
              </div>

              {/* Answer */}
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  placeholder="Enter the FAQ answer"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light resize-none"
                />
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-10 pt-4 border-t border-[#1e293b]/50">
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 border ${formData.status === 'active' ? 'bg-blue-600 border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-800 border-slate-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-300 ${formData.status === 'active' ? 'left-[26px]' : 'left-[3px]'}`} />
                  </div>
                  <span className="text-[13px] text-slate-200 font-bold tracking-tight">Status (Active)</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
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
                {selectedFaq ? 'Save Changes' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
