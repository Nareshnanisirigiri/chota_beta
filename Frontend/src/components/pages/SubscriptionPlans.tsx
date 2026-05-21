import React, { useState, useEffect } from 'react';
import {
  Plus,
  RefreshCcw,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Star,
  Layers,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Sliders,
  Eye,
  ArrowRight,
  Search,
  Users,
  ChevronDown
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface PlanLimit {
  store_limit?: number | null;
  product_limit?: number | null;
  role_limit?: number | null;
  system_user_limit?: number | null;
  variation_product_limit?: number | null;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string | number;
  duration_type: string;
  duration_days: number;
  is_free: number | boolean;
  is_default: number | boolean;
  is_recommended: number | boolean;
  status: number | boolean;
  created_at: string;
  updated_at: string;
  limits: PlanLimit;
  subscribers_count?: number;
}

interface Props {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  duration_days: '30',
  is_free: false,
  is_recommended: false,
  is_default: false,
  status: true,
  limits: {
    store_limit: '',
    product_limit: '',
    role_limit: '',
    system_user_limit: '',
    variation_product_limit: ''
  }
};

export default function SubscriptionPlans({ onLogout, onNavigate }: Props) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [sellerSubscriptions, setSellerSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  
  // Table state
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    status: true,
    configurations: true,
    subscribers: true,
    action: true
  });

  // Settings state
  const [enableSubscription, setEnableSubscription] = useState(true);
  const [subscriptionHeading, setSubscriptionHeading] = useState('');
  const [subscriptionDescription, setSubscriptionDescription] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [copiedCron, setCopiedCron] = useState(false);

  const cronCommand = `* * * * * /usr/bin/php /home/chotabetasuresh/superadmin.chotabeta.com/artisan schedule:run >> /home/chotabetasuresh/superadmin.chotabeta.com/storage/logs/schedule.txt`;

  const fetchPlansAndSubs = async () => {
    setIsLoading(true);
    try {
      const plansRes = await axios.get(`${BASE_URL}/api/subscriptions/plans`);
      const subsRes = await axios.get(`${BASE_URL}/api/subscriptions/seller-subscriptions`);
      
      const plansData = plansRes.data?.data || [];
      const subsData = subsRes.data?.data || [];
      
      // Calculate subscribers count for each plan
      const plansWithCounts = plansData.map((plan: SubscriptionPlan) => {
        const count = subsData.filter((s: any) => s.plan_id === plan.id).length;
        return {
          ...plan,
          subscribers_count: count
        };
      });
      
      setPlans(plansWithCounts);
      setSellerSubscriptions(subsData);
    } catch (err: any) {
      toast.error('Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    setIsSettingsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/settings`);
      if (res.data?.success && res.data?.data) {
        const isEnabled = res.data.data.enableSubscription === true || res.data.data.enableSubscription === 'true';
        setEnableSubscription(isEnabled);
        setSubscriptionHeading(res.data.data.subscriptionHeading || '');
        setSubscriptionDescription(res.data.data.subscriptionDescription || '');
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansAndSubs();
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const payload = {
        enableSubscription,
        subscriptionHeading,
        subscriptionDescription
      };
      const res = await axios.post(`${BASE_URL}/api/settings`, payload);
      if (res.data?.success) {
        toast.success('Subscription settings updated successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('Error saving subscription settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCopyCron = () => {
    navigator.clipboard.writeText(cronCommand);
    setCopiedCron(true);
    toast.success('Cron command copied to clipboard');
    setTimeout(() => setCopiedCron(false), 3000);
  };

  const handleExportCSV = () => {
    if (plans.length === 0) return toast.info('No plans to export');
    
    const headers = ['ID', 'Name', 'Price', 'Duration Days', 'Is Free', 'Is Recommended', 'Is Default', 'Status', 'Store Limit', 'Product Limit', 'Role Limit', 'System User Limit'];
    const rows = plans.map(p => [
      p.id,
      p.name,
      p.price,
      p.duration_days,
      p.is_free ? 'Yes' : 'No',
      p.is_recommended ? 'Yes' : 'No',
      p.is_default ? 'Yes' : 'No',
      p.status ? 'Active' : 'Inactive',
      p.limits?.store_limit == null ? 'Unlimited' : p.limits.store_limit,
      p.limits?.product_limit == null ? 'Unlimited' : p.limits.product_limit,
      p.limits?.role_limit == null ? 'Unlimited' : p.limits.role_limit,
      p.limits?.system_user_limit == null ? 'Unlimited' : p.limits.system_user_limit
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'subscription_plans.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Plans exported successfully as CSV');
    setShowExportDropdown(false);
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setIsEditing(true);
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: String(plan.price),
      duration_days: String(plan.duration_days),
      is_free: Boolean(plan.is_free),
      is_recommended: Boolean(plan.is_recommended),
      is_default: Boolean(plan.is_default),
      status: Boolean(plan.status),
      limits: {
        store_limit: plan.limits?.store_limit != null ? String(plan.limits.store_limit) : '',
        product_limit: plan.limits?.product_limit != null ? String(plan.limits.product_limit) : '',
        role_limit: plan.limits?.role_limit != null ? String(plan.limits.role_limit) : '',
        system_user_limit: plan.limits?.system_user_limit != null ? String(plan.limits.system_user_limit) : '',
        variation_product_limit: plan.limits?.variation_product_limit != null ? String(plan.limits.variation_product_limit) : ''
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) return toast.error('Plan name is required');
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: formData.is_free ? 0 : parseFloat(formData.price as string) || 0,
        duration_days: parseInt(formData.duration_days as string) || 30,
        limits: {
          store_limit: formData.limits.store_limit !== '' ? parseInt(formData.limits.store_limit as string) : null,
          product_limit: formData.limits.product_limit !== '' ? parseInt(formData.limits.product_limit as string) : null,
          role_limit: formData.limits.role_limit !== '' ? parseInt(formData.limits.role_limit as string) : null,
          system_user_limit: formData.limits.system_user_limit !== '' ? parseInt(formData.limits.system_user_limit as string) : null,
          variation_product_limit: formData.limits.variation_product_limit !== '' ? parseInt(formData.limits.variation_product_limit as string) : null
        }
      };

      if (isEditing && editingId) {
        await axios.put(`${BASE_URL}/api/subscriptions/plans/${editingId}`, payload);
        toast.success('Plan updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/subscriptions/plans`, payload);
        toast.success('Plan created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchPlansAndSubs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/subscriptions/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlansAndSubs();
    } catch (err: any) {
      toast.error('Failed to delete plan');
    }
  };

  const filtered = plans.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const formatPrice = (price: string | number, isFree: number | boolean) => {
    if (isFree || Number(price) === 0) return 'FREE';
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  const LimitField = ({ label, field }: { label: string; field: keyof typeof emptyForm['limits'] }) => (
    <div className="space-y-1.5">
      <label className="text-slate-400 text-[11px] uppercase tracking-wider font-medium">{label}</label>
      <input
        type="number"
        min="0"
        placeholder="Unlimited"
        value={(formData.limits as any)[field]}
        onChange={e => setFormData(prev => ({ ...prev, limits: { ...prev.limits, [field]: e.target.value } }))}
        className="w-full bg-[#0c111d] border border-[#2d3748] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all"
      />
    </div>
  );

  return (
    <div className="p-8 font-sans text-white min-h-screen bg-[#070b14] selection:bg-blue-500/30">
      <Navbar onLogout={onLogout} />

      {/* SECTION 1: Subscription Settings Card (Full Width) */}
      <div className="dashboard-card p-6 shadow-2xl bg-[#111827] border border-[#1e293b] rounded-xl mb-6 mt-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-blue-400" />
            <h2 className="text-[14px] font-bold text-white uppercase tracking-wider">Subscription Settings</h2>
          </div>
          {/* Keep the Enable toggle here as a clean header element */}
          <div className="flex items-center gap-3 bg-[#0c111d] py-1 px-3 rounded-lg border border-[#1e293b]">
            <span className="text-slate-300 text-[12px] font-medium">Enable Subscription</span>
            <div
              onClick={() => setEnableSubscription(!enableSubscription)}
              className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 border ${
                enableSubscription ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${enableSubscription ? 'left-[22px]' : 'left-[2px]'}`} />
            </div>
          </div>
        </div>

        {isSettingsLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-blue-500 opacity-50" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scheduler Details */}
            <div className="space-y-3">
              <h3 className="text-[13px] font-bold text-white">Scheduler for Subscription Expiry Process</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Add the following scheduler command on your server. The scheduler will run every hour to update and expire expired subscriptions automatically. Output is redirected to a log file so you can verify that the scheduler is running.
              </p>
              
              {/* Command box */}
              <div className="bg-[#0c111d] border border-[#2d3748] rounded-xl p-4 font-mono text-[12px] text-slate-300 break-all select-all relative group leading-relaxed">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Server Cron Command</span>
                  <button
                    onClick={handleCopyCron}
                    className="text-blue-400 hover:text-blue-300 text-[11px] flex items-center gap-1 cursor-pointer bg-[#1e2736] px-2.5 py-1 rounded-md"
                  >
                    {copiedCron ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedCron ? 'Copied!' : 'Copy Command'}
                  </button>
                </div>
                <div className="whitespace-pre-wrap">{cronCommand}</div>
              </div>
              <p className="text-[11px] text-slate-500">
                Note: If your PHP binary path differs from <span className="font-mono text-slate-400">/usr/bin/php</span>, adjust it accordingly.
              </p>
            </div>

            {/* Warning Alert Banner */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-[12px] space-y-2 leading-relaxed">
              <div className="flex gap-2 items-start font-bold text-[13px] text-amber-400">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <span>Subscription expiry processing is currently not functioning because the required scheduler command has not been configured on the server.</span>
              </div>
              <p className="pl-6 text-slate-300">
                Cron status: <span className="font-semibold text-red-400">Not detected</span> . The log file was not found at
              </p>
              <div className="ml-6 font-mono text-slate-800 bg-[#e2e8f0] px-3 py-1.5 rounded-lg select-all max-w-max break-all">
                /home/chotabetasuresh/superadmin.chotabeta.com/storage/logs/schedule.txt
              </div>
              <p className="pl-6 text-slate-300">
                This likely means the cron job has not been added or has not executed yet.
              </p>
              <p className="pl-6 text-slate-300">
                For more details on configuring notifications, please refer to our documentation.:{' '}
                <a href="#" className="text-blue-400 font-semibold underline hover:text-blue-300">
                  please refer to our documentation
                </a>
                .
              </p>
            </div>

            {/* Heading and Description inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Subscription Heading</label>
                <input
                  type="text"
                  value={subscriptionHeading}
                  onChange={e => setSubscriptionHeading(e.target.value)}
                  placeholder="e.g. Choose Your Subscription Plan"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Subscription Description</label>
                <input
                  type="text"
                  value={subscriptionDescription}
                  onChange={e => setSubscriptionDescription(e.target.value)}
                  placeholder="e.g. Select a plan below that fits your business limits."
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-sans"
                />
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-start">
              <button
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-[13px] transition-all duration-300 flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSavingSettings ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Title & Buttons Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-8">
        <div>
          <h1 className="text-white text-[22px] font-bold tracking-tight">Subscription Plans</h1>
          <nav className="flex items-center gap-2 text-[12px] mt-1 text-slate-400">
            <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">Subscription Plans</span>
          </nav>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate?.('seller-subscriptions')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-500/10 text-[12px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer bg-transparent"
          >
            <Users size={14} /> Subscribers
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={14} /> Add Plan
          </button>
          <button
            onClick={fetchPlansAndSubs}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-500/10 text-[12px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer bg-transparent"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />} Refresh
          </button>
        </div>
      </div>

      {/* SECTION 2: Subscription Plans Table Card (Full Width) */}
      <div className="dashboard-card p-6 shadow-2xl bg-[#111827] border border-[#1e293b] rounded-xl mb-6">
        {/* Filter and entries controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-9 pr-3 py-1.5 text-[13px] text-slate-300 focus:outline-none w-full"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-center gap-2 text-[13px] text-slate-400">
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="bg-[#1e2736] border border-[#2d3748] rounded px-2 py-1 text-slate-200 outline-none cursor-pointer"
              >
                {[5, 10, 25, 50].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <span>entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 relative">
            {/* Columns Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-200 px-4 py-1.5 text-[12px] font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                Columns <ChevronDown size={14} className="opacity-60" />
              </button>
              {showColumnDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111827] border border-[#2d3748] rounded-lg shadow-xl z-50 p-2 space-y-1">
                  {Object.entries({
                    id: 'ID',
                    name: 'Name',
                    status: 'Status',
                    configurations: 'Plan Configurations',
                    subscribers: 'Subscribers Count',
                    action: 'Action'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-slate-300 hover:bg-[#1e2736] rounded cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={(visibleColumns as any)[key]}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, [key]: !(prev as any)[key] }))}
                        className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10 px-4 py-1.5 text-[12px] font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                Export <ChevronDown size={14} className="opacity-60" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[#111827] border border-[#2d3748] rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-slate-200 hover:bg-blue-600 hover:text-white transition-colors border-b border-slate-700/50 cursor-pointer bg-transparent"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => { toast.info('Excel export will generate standard spreadsheet data'); handleExportCSV(); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-slate-200 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer bg-transparent"
                  >
                    Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {visibleColumns.id && (
                  <th style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">ID <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.name && (
                  <th style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">NAME <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">STATUS <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.configurations && (
                  <th style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">PLAN CONFIGURATIONS <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.subscribers && (
                  <th style={{ padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">SUBSCRIBERS COUNT <SortIcons /></div>
                  </th>
                )}
                {visibleColumns.action && (
                  <th style={{ padding: '10px 14px', borderBottom: '2px solid white', fontSize: '11px', color: 'white', fontWeight: '200', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    ACTION
                  </th>
                )}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto text-blue-500 opacity-50" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-[12px] uppercase tracking-widest">
                    No Subscription Plans Found
                  </td>
                </tr>
              ) : paginated.map((plan) => {
                const isFree = Boolean(plan.is_free);
                const isRecommended = Boolean(plan.is_recommended);
                const isActive = Boolean(plan.status);
                
                return (
                  <tr key={plan.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    {visibleColumns.id && (
                      <td className="px-4 py-4 text-slate-400 text-[13px] font-light border-r border-[#2d3748]/30 uppercase tracking-widest">{plan.id}</td>
                    )}
                    {visibleColumns.name && (
                      <td className="px-4 py-4 border-r border-[#2d3748]/30">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-blue-500 text-[13px] font-semibold">Name: {plan.name}</span>
                            {isRecommended && (
                              <span className="bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-[13px] font-bold text-slate-100 mt-0.5">
                            {isFree ? 'Is Free' : `₹ ${Number(plan.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </div>
                          <div className="text-slate-400 text-[12px]">Duration: {plan.duration_days} Days</div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.status && (
                      <td className="px-4 py-4 border-r border-[#2d3748]/30">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/20'
                        }`}>
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.configurations && (
                      <td className="px-4 py-4 border-r border-[#2d3748]/30">
                        <div className="text-slate-400 text-[12px] space-y-1 font-light font-mono">
                          <div>1. store limit: <span className="text-slate-300 font-medium">{plan.limits?.store_limit == null ? 'Unlimited' : plan.limits.store_limit}</span></div>
                          <div>2. product limit: <span className="text-slate-300 font-medium">{plan.limits?.product_limit == null ? 'Unlimited' : plan.limits.product_limit}</span></div>
                          <div>3. role limit: <span className="text-slate-300 font-medium">{plan.limits?.role_limit == null ? 'Unlimited' : plan.limits.role_limit}</span></div>
                          <div>4. system user limit: <span className="text-slate-300 font-medium">{plan.limits?.system_user_limit == null ? 'Unlimited' : plan.limits.system_user_limit}</span></div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.subscribers && (
                      <td className="px-4 py-4 text-center border-r border-[#2d3748]/30">
                        <button
                          onClick={() => onNavigate?.('seller-subscriptions')}
                          className="text-blue-500 hover:text-blue-400 font-bold hover:underline text-[14px] bg-transparent border-none cursor-pointer"
                        >
                          {plan.subscribers_count ?? 0}
                        </button>
                      </td>
                    )}
                    {visibleColumns.action && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(plan)}
                            className="p-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500/10 transition-all cursor-pointer bg-transparent"
                            title="Edit Plan"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-1 rounded border border-red-500 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer bg-transparent"
                            title="Delete Plan"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* White line under table */}
        <div className="h-[2px] bg-white w-full mb-5" />

        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[12px] text-slate-400">
            Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, filtered.length)} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30 cursor-pointer bg-transparent border-none"><ChevronsLeft size={13} /></button>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30 cursor-pointer bg-transparent border-none"><ChevronLeft size={13} /></button>
              <div className="bg-blue-600 px-2 rounded text-white text-[11px] font-semibold py-0.5">{page}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="text-slate-500 disabled:opacity-30 cursor-pointer bg-transparent border-none"><ChevronRight size={13} /></button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="text-slate-500 disabled:opacity-30 cursor-pointer bg-transparent border-none"><ChevronsRight size={13} /></button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Plan Comparison Grid Preview Card (Full Width) */}
      <div className="dashboard-card p-6 shadow-2xl bg-[#111827] border border-[#1e293b] rounded-xl mb-12">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#1e293b]">
          <Eye size={18} className="text-blue-400" />
          <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">Preview</h2>
        </div>

        {plans.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-[12px] uppercase">
            Create subscription plans above to view comparison preview
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
            <table className="w-full text-left border-collapse min-w-[800px] border border-[#1e293b]/50">
              <thead>
                <tr className="bg-[#0c101a]">
                  <th className="p-4 w-[220px] border-b border-[#1e293b]/50"></th>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    const isFree = Boolean(plan.is_free);
                    return (
                      <th
                        key={plan.id}
                        className={`p-5 text-center relative border-b border-[#1e293b]/50 ${
                          isRecommended ? 'border-x border-t border-blue-500 bg-blue-500/[0.03]' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2 min-h-[160px] justify-between">
                          <div className="space-y-1.5 flex flex-col items-center">
                            <span className="text-slate-300 text-[13px] font-semibold uppercase tracking-wider">{plan.name}</span>
                            <span className="text-[24px] font-extrabold text-white">
                              {isFree ? 'Free' : `₹${Number(plan.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                            </span>
                            <span className="text-slate-500 text-[11px] font-normal">Duration: {plan.duration_days} Days</span>
                          </div>
                          
                          <button
                            onClick={() => toast.info(`This is a preview. Sellers will see this option to subscribe to the '${plan.name}' plan.`)}
                            className={`w-full max-w-[150px] py-2 rounded-lg text-[12px] font-bold transition-all duration-300 cursor-pointer ${
                              isRecommended
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'
                                : 'bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300'
                            }`}
                          >
                            Choose Plan
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Configuration Subheader Row */}
                <tr>
                  <td colSpan={[...plans].length + 1} className="bg-[#1e2736]/40 px-5 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-[#1e293b]/50">
                    PLAN CONFIGURATIONS
                  </td>
                </tr>

                {/* Store Limit Row */}
                <tr className="hover:bg-slate-800/10 transition-colors border-b border-[#1e293b]/30">
                  <td className="p-4 pl-5 text-[13px] text-slate-400 font-medium font-mono">Store Limit</td>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    return (
                      <td key={plan.id} className={`p-4 text-center text-[13px] text-slate-100 font-normal ${isRecommended ? 'border-x border-blue-500 bg-blue-500/[0.03]' : ''}`}>
                        {plan.limits?.store_limit == null ? 'Unlimited' : plan.limits.store_limit}
                      </td>
                    );
                  })}
                </tr>

                {/* Product Limit Row */}
                <tr className="hover:bg-slate-800/10 transition-colors border-b border-[#1e293b]/30">
                  <td className="p-4 pl-5 text-[13px] text-slate-400 font-medium font-mono">Product Limit</td>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    return (
                      <td key={plan.id} className={`p-4 text-center text-[13px] text-slate-100 font-normal ${isRecommended ? 'border-x border-blue-500 bg-blue-500/[0.03]' : ''}`}>
                        {plan.limits?.product_limit == null ? 'Unlimited' : plan.limits.product_limit}
                      </td>
                    );
                  })}
                </tr>

                {/* Role Limit Row */}
                <tr className="hover:bg-slate-800/10 transition-colors border-b border-[#1e293b]/30">
                  <td className="p-4 pl-5 text-[13px] text-slate-400 font-medium font-mono">Role Limit</td>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    return (
                      <td key={plan.id} className={`p-4 text-center text-[13px] text-slate-100 font-normal ${isRecommended ? 'border-x border-blue-500 bg-blue-500/[0.03]' : ''}`}>
                        {plan.limits?.role_limit == null ? 'Unlimited' : plan.limits.role_limit}
                      </td>
                    );
                  })}
                </tr>

                {/* System User Limit Row */}
                <tr className="hover:bg-slate-800/10 transition-colors border-b border-[#1e293b]/30">
                  <td className="p-4 pl-5 text-[13px] text-slate-400 font-medium font-mono">System User Limit</td>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    return (
                      <td key={plan.id} className={`p-4 text-center text-[13px] text-slate-100 font-normal ${isRecommended ? 'border-x border-blue-500 bg-blue-500/[0.03]' : ''}`}>
                        {plan.limits?.system_user_limit == null ? 'Unlimited' : plan.limits.system_user_limit}
                      </td>
                    );
                  })}
                </tr>

                {/* Bottom Choose Plan Button Row */}
                <tr>
                  <td className="p-4 border-b border-[#1e293b]/50"></td>
                  {[...plans].sort((a, b) => Number(a.price) - Number(b.price)).map((plan) => {
                    const isRecommended = Boolean(plan.is_recommended);
                    return (
                      <td
                        key={plan.id}
                        className={`p-4 text-center border-b border-[#1e293b]/50 ${
                          isRecommended ? 'border-x border-b border-blue-500 bg-blue-500/[0.03] rounded-b-xl' : ''
                        }`}
                      >
                        <div className="flex justify-center">
                          <button
                            onClick={() => toast.info(`This is a preview. Sellers will see this option to subscribe to the '${plan.name}' plan.`)}
                            className={`w-full max-w-[150px] py-2 rounded-lg text-[12px] font-bold transition-all duration-300 cursor-pointer ${
                              isRecommended
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                : 'bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300'
                            }`}
                          >
                            Choose Plan
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70"
          style={{ backdropFilter: 'blur(6px)' }}>
          <div className="border border-[#1e293b] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
            style={{ backgroundColor: '#111827', width: '560px', maxWidth: '95vw', maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div className="px-7 py-5 border-b border-[#1e293b] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-white">{isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h2>
                <div className="h-0.5 w-10 bg-blue-500 rounded-full mt-1.5" />
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-500 hover:text-white p-1 transition-all cursor-pointer">
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-7 space-y-5 no-scrollbar">
              {/* Plan Name */}
              <div className="space-y-1.5">
                <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Plan Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Basic Access, Enterprise"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what limits and features this plan includes..."
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none font-sans" />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Price (₹)</label>
                  <input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                    disabled={formData.is_free}
                    placeholder="0.00"
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Duration (Days)</label>
                  <input type="number" min="1" value={formData.duration_days} onChange={e => setFormData(p => ({ ...p, duration_days: e.target.value }))}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              {/* Plan Limits */}
              <div className="space-y-3 border border-[#1e293b] rounded-xl p-4 bg-[#0c111d]/50">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={14} className="text-blue-400" />
                  <span className="text-white text-[12px] font-bold uppercase tracking-wider">Plan Limits</span>
                  <span className="text-slate-500 text-[11px]">(Leave empty for Unlimited)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <LimitField label="Store Limit" field="store_limit" />
                  <LimitField label="Product Limit" field="product_limit" />
                  <LimitField label="Role Limit" field="role_limit" />
                  <LimitField label="System User Limit" field="system_user_limit" />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1e293b]/50">
                {[
                  { key: 'is_free', label: 'Free Plan' },
                  { key: 'is_recommended', label: 'Recommended' },
                  { key: 'is_default', label: 'Default Plan' },
                  { key: 'status', label: 'Active Status' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-2.5 bg-[#0c111d] rounded-xl border border-[#1e293b]">
                    <span className="text-slate-300 text-[12px] font-medium">{label}</span>
                    <div
                      onClick={() => {
                        const nextVal = !(formData as any)[key];
                        setFormData(p => {
                          const updated = { ...p, [key]: nextVal };
                          // If marked free, reset price to 0 or empty
                          if (key === 'is_free' && nextVal) {
                            updated.price = '0';
                          }
                          return updated;
                        });
                      }}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-300 border ${(formData as any)[key] ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-600'}`}
                    >
                      <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${(formData as any)[key] ? 'left-[22px]' : 'left-[2px]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-5">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-[12px] font-bold text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer bg-transparent border-none">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting}
                onMouseEnter={() => setHoveredBtn('save')} onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold active:scale-95 disabled:opacity-50 transition-all cursor-pointer rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500/10 bg-transparent"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                {isEditing ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
