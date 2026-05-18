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
  X,
  Search,
  Loader2,
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface TaxRate {
  id?: number | string;
  _id?: number | string;
  title: string;
  rate: string | number;
  createdAt?: string;
  created_at?: string;
}

interface TaxGroup {
  id?: number | string;
  _id?: number | string;
  title: string;
  taxRateIds: (number | string)[];
  tax_rates?: TaxRate[];
  subTaxes?: any[];
  taxes?: any[];
  sub_taxes?: any[];
  createdAt?: string;
  created_at?: string;
}

interface TaxRatesProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch (e) {
    return dateString;
  }
};

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function TaxRates({ onLogout, onNavigate }: TaxRatesProps) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [taxGroups, setTaxGroups] = useState<TaxGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalType, setGroupModalType] = useState<'add' | 'edit'>('add');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Form State - Rates
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Form State - Groups
  const [selectedGroupId, setSelectedGroupId] = useState<number | string | null>(null);
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedRateIds, setSelectedRateIds] = useState<(number | string)[]>([]);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  const fetchTaxRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/taxrates`);
      const data = response.data;
      if (Array.isArray(data)) {
        setTaxRates(data);
      } else if (data && typeof data === 'object') {
        setTaxRates(data.taxrates || data.data || data.taxRates || []);
      } else {
        setTaxRates([]);
      }
    } catch (error) {
      console.error('Error fetching tax rates:', error);
      toast.error('Failed to load tax rates');
      setTaxRates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxGroups = async () => {
    try {
      setLoadingGroups(true);
      const response = await axios.get(`${BASE_URL}/api/taxgroups`);
      const data = response.data;
      if (Array.isArray(data)) {
        setTaxGroups(data);
      } else if (data && typeof data === 'object') {
        setTaxGroups(data.taxgroups || data.data || data.taxGroups || []);
      } else {
        setTaxGroups([]);
      }
    } catch (error) {
      console.error('Error fetching tax groups:', error);
      toast.error('Failed to load tax groups');
      setTaxGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchTaxRates();
    fetchTaxGroups();
  }, []);

  const handleOpenEdit = (taxRate: TaxRate) => {
    setSelectedId(taxRate.id || taxRate._id || null);
    setTitle(taxRate.title);
    // Explicitly convert to string to handle cases where backend returns a number
    setRate(String(taxRate.rate).replace('%', ''));
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedId(null);
    setTitle('');
    setRate('');
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!title || !rate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsSaving(true);

      // Backend likely expects a number or string without the % symbol for the rate
      const cleanRateValue = rate.toString().replace('%', '').trim();
      const payload = {
        title: title.trim(),
        rate: isNaN(Number(cleanRateValue)) ? cleanRateValue : Number(cleanRateValue)
      };

      console.log('Sending payload:', payload);

      if (modalType === 'add') {
        const response = await axios.post(`${BASE_URL}/api/taxrates/create`, payload);
        console.log('Create response:', response.data);
        toast.success('Tax rate created successfully');
      } else {
        const response = await axios.put(`${BASE_URL}/api/taxrates/${selectedId}`, payload);
        console.log('Update response:', response.data);
        toast.success('Tax rate updated successfully');
      }

      setIsModalOpen(false);
      fetchTaxRates();
    } catch (error: any) {
      console.error('Save error detailed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save tax rate';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddGroup = () => {
    setSelectedGroupId(null);
    setGroupTitle('');
    setSelectedRateIds([]);
    setGroupModalType('add');
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group: TaxGroup) => {
    setSelectedGroupId(group.id || group._id || null);
    setGroupTitle(group.title);
    
    // Extracted IDs from all potential keys provided by the backend response
    const rawRates = group.tax_rates || group.subTaxes || group.taxes || group.sub_taxes || group.taxRateIds || [];
    
    const extractedIds = rawRates.map(item => {
      if (typeof item === 'object' && item !== null) {
        return item.id || item._id; // Extract the ID if the backend returned objects
      }
      return item; // It's already a raw ID
    }).filter(id => id !== undefined);

    setSelectedRateIds(extractedIds);
    setGroupModalType('edit');
    setIsGroupModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!groupTitle || selectedRateIds.length === 0) {
      toast.error('Please provide Title and select at least one rate');
      return;
    }

    try {
      setIsSavingGroup(true);
      // Backend naming conventions can vary (e.g., name/title, taxes/taxRates/taxRateIds)
      // I'm sending all standard variants to ensure compatibility
      const payload = { 
        title: groupTitle.trim(),
        name: groupTitle.trim(),
        taxRateIds: selectedRateIds,
        taxes: selectedRateIds,
        taxRates: selectedRateIds,
        subTaxes: selectedRateIds,
        sub_taxes: selectedRateIds
      };

      console.log('Sending tax group payload:', payload);

      if (groupModalType === 'add') {
        const response = await axios.post(`${BASE_URL}/api/taxgroups/create`, payload);
        console.log('Group Create response:', response.data);
        toast.success('Tax group created successfully');
      } else {
        const response = await axios.put(`${BASE_URL}/api/taxgroups/${selectedGroupId}`, payload);
        console.log('Group Update response:', response.data);
        toast.success('Tax group updated successfully');
      }

      setIsGroupModalOpen(false);
      fetchTaxGroups();
    } catch (error: any) {
      console.error('Group save error detailed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to save tax group';
      toast.error(errorMessage);
    } finally {
      setIsSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this tax group?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/taxgroups/${id}`);
      toast.success('Tax group deleted successfully');
      fetchTaxGroups();
    } catch (error) {
      toast.error('Failed to delete tax group');
    }
  };

  const toggleRateSelection = (id: any) => {
    setSelectedRateIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderLinkedRates = (group: TaxGroup) => {
    // Collect all potential source keys for linked rates
    const rawRates = group.tax_rates || group.subTaxes || group.taxes || group.sub_taxes || group.taxRateIds;
    
    if (Array.isArray(rawRates) && rawRates.length > 0) {
      return rawRates.map(item => {
        // If it's already an object, use it directly
        if (typeof item === 'object' && item !== null) {
          return `${item.title} (${item.rate})`;
        }
        // If it's an ID, find the matching rate in our loaded taxRates state
        const matchedRate = taxRates.find(r => (r.id || r._id) === item);
        return matchedRate ? `${matchedRate.title} (${matchedRate.rate})` : item;
      }).join(', ');
    }
    return 'None';
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this tax rate?')) return;

    try {
      await axios.delete(`${BASE_URL}/api/taxrates/${id}`);
      toast.success('Tax rate deleted successfully');
      fetchTaxRates();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete tax rate');
    }
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Tax Rates Main Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        {/* Row 1: Header and Primary Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-bold tracking-tight">Tax Rates</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Tax Rates</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
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
              <Plus size={16} /> Add Tax Rate
            </button>
            <button
              onClick={fetchTaxRates}
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
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        {/* Row 2: Search and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search rates..."
                className="w-[220px] bg-[#0c111d] border border-[#2d3748] rounded-md pl-10 pr-4 py-1.5 text-[13px] text-slate-300 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-[#0c111d] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-[13px] text-slate-400">entries per page</span>
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

        {/* Row 3: Table Section */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto overflow-y-hidden no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "TITLE", width: "auto" },
                  { label: "RATE (%)", width: "200px" },
                  { label: "CREATED AT", width: "180px" },
                  { label: "ACTION", width: "120px" }
                ].map((header) => (
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
                      width: header.width
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
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                      <Loader2 size={32} className="animate-spin" />
                      <span className="uppercase tracking-widest text-[11px] font-200">Loading tax rates...</span>
                    </div>
                  </td>
                </tr>
              ) : (Array.isArray(taxRates) && taxRates.length === 0) ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                      <RefreshCcw size={32} className="opacity-20" />
                      <span className="uppercase tracking-widest text-[11px] font-200">No Tax Rates Found</span>
                    </div>
                  </td>
                </tr>
              ) : Array.isArray(taxRates) && taxRates.map((row, index) => (
                <tr key={row.id || row._id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{index + 1}</td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{row.title}</td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-blue-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{row.rate}</td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{formatDate(row.createdAt || row.created_at)}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleOpenEdit(row)}
                        onMouseEnter={() => setHoveredAction(`${row.id || row._id}-edit`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          backgroundColor: hoveredAction === `${row.id || row._id}-edit` ? '#3b82f6' : 'transparent',
                          color: hoveredAction === `${row.id || row._id}-edit` ? 'white' : '#3b82f6'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => row.id || row._id ? handleDelete(row.id || row._id) : null}
                        onMouseEnter={() => setHoveredAction(`${row.id || row._id}-delete`)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature White Highlight Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 1 to {taxRates.length} of {taxRates.length} entries
          </p>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed uppercase text-[12px] font-bold">Previous</button>
            <div className="bg-blue-600 px-3 py-1 rounded text-white text-[12px] font-bold">1</div>
            <button className="text-slate-400 hover:text-white transition-colors uppercase text-[12px] font-bold">Next</button>
          </div>
        </div>
      </div>

      {/* Tax Groups Main Card - FORCED SPACED LAYOUT */}
      <div
        className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b]"
        style={{ marginTop: '30px', marginBottom: '80px' }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-[18px] font-bold tracking-tight">Tax Groups</h1>
          <div className="flex gap-2">
            <button
              onClick={handleOpenAddGroup}
              onMouseEnter={() => setHoveredBtn('group-add')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'group-add' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'group-add' ? 'white' : '#3b82f6'
              }}
            >
              <Plus size={16} /> Create Tax Group
            </button>
          </div>
        </div>

        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto overflow-y-hidden no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "GROUP TITLE", width: "auto" },
                  { label: "LINKED RATES", width: "auto" },
                  { label: "CREATED AT", width: "180px" },
                  { label: "ACTION", width: "180px" }
                ].map((header) => (
                  <th key={header.label} style={{ padding: '10px 16px', borderRight: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '2px solid white', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', width: header.width }}>
                    <div className="flex items-center justify-between">{header.label}<SortIcons /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {loadingGroups ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <Loader2 size={32} className="animate-spin text-slate-600 mx-auto mb-4" />
                    <span className="uppercase tracking-widest text-[11px] font-200 text-slate-500">Loading tax groups...</span>
                  </td>
                </tr>
              ) : taxGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <RefreshCcw size={32} className="opacity-20 text-slate-500 mx-auto mb-4" />
                    <span className="uppercase tracking-widest text-[11px] font-200 text-slate-500">No Tax Groups Found</span>
                  </td>
                </tr>
              ) : taxGroups.map((group, index) => (
                <tr key={group.id || group._id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{index + 1}</td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{group.title}</td>
                  <td className="border-r border-[#2d3748]/30 text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>
                    {renderLinkedRates(group)}
                  </td>
                  <td className="border-r border-[#2d3748]/30 uppercase text-slate-400" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200' }}>{formatDate(group.createdAt || group.created_at)}</td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleOpenEditGroup(group)}
                        className="w-8 h-8 flex items-center justify-center transition-all duration-300 border-[#3b82f6] border-2 text-[#3b82f6] rounded-[12px] hover:bg-[#3b82f6] hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id || group._id)}
                        className="w-8 h-8 flex items-center justify-center transition-all duration-300 border-[#ef4444] border-2 text-[#ef4444] rounded-[12px] hover:bg-[#ef4444] hover:text-white"
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
        <div className="h-[2px] bg-white opacity-100 w-full mb-2"></div>
      </div>

      {/* Standard Modal Setup */}
      {(isModalOpen || isGroupModalOpen) && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 overflow-hidden text-left"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        >
          <div
            className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden"
            style={{ backgroundColor: '#111827', width: '500px', maxWidth: '95vw', maxHeight: '85vh' }}
          >
            <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">
                  {isGroupModalOpen ? 'Create Tax Group' : (modalType === 'add' ? 'Add Tax Rate' : 'Edit Tax Rate')}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setIsGroupModalOpen(false); }}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar" style={{ backgroundColor: '#111827' }}>
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                  {isGroupModalOpen ? 'Group Title' : 'Title Label'} <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={isGroupModalOpen ? groupTitle : title}
                  onChange={(e) => isGroupModalOpen ? setGroupTitle(e.target.value) : setTitle(e.target.value)}
                  placeholder={isGroupModalOpen ? "e.g. GST" : "e.g. CGST"}
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                  style={{ fontWeight: '200' }}
                />
              </div>

              {!isGroupModalOpen ? (
                <div className="space-y-3">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                    Percentage Rate (%) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 18"
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-white text-[13px] font-bold tracking-normal uppercase opacity-70">
                    Select Tax Rates <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="space-y-2">
                    {Array.isArray(taxRates) && taxRates.map(rate => (
                      <label key={rate.id || rate._id} className="flex items-center gap-3 p-3 bg-[#0c111d] border border-[#2d3748] rounded-xl cursor-pointer hover:border-blue-500/30 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedRateIds.includes((rate.id || rate._id) as any)}
                          onChange={() => {
                            const rateId = rate.id || rate._id;
                            if (rateId !== undefined) toggleRateSelection(rateId);
                          }}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/20" 
                        />
                        <span className="text-[13px] text-slate-300 font-extralight" style={{ fontWeight: '200' }}>{rate.title} ({rate.rate})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button
                onClick={() => { setIsModalOpen(false); setIsGroupModalOpen(false); }}
                className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                onClick={isGroupModalOpen ? handleSaveGroup : handleSave}
                disabled={isSaving || isSavingGroup}
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
                {(isSaving || isSavingGroup) && <Loader2 size={16} className="animate-spin" />}
                {isGroupModalOpen ? (groupModalType === 'add' ? 'Create Group' : 'Commit Changes') : (modalType === 'add' ? 'Initialize Rate' : 'Commit Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
