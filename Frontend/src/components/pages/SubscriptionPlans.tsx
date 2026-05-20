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
  ChevronDown,
  X,
  Loader2,
  CreditCard,
  CheckCircle2,
  XCircle,
  Star,
  Layers
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

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

const PLAN_COLORS = [
  { gradient: 'from-blue-500 to-cyan-500', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { gradient: 'from-purple-500 to-pink-500', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { gradient: 'from-amber-500 to-orange-500', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { gradient: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { gradient: 'from-rose-500 to-red-500', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

export default function SubscriptionPlans({ onLogout, onNavigate }: Props) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/plans`);
      setPlans(res.data?.data || []);
    } catch (err: any) {
      toast.error('Failed to load subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

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
      fetchPlans();
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
      fetchPlans();
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
        className="w-full bg-[#0c111d] border border-[#2d3748] rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-blue-500/50 transition-all"
      />
    </div>
  );

  return (
    <div className="p-8 font-sans text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Header */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight flex items-center gap-2">
              <CreditCard size={20} className="text-blue-400" />
              Subscription Plans
            </h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">Subscriptions</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Plans</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
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
              <Plus size={16} /> Add Plan
            </button>
            <button
              onClick={fetchPlans}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] active:scale-95"
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

        {/* Search */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search plans..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none min-w-[200px]"
          />
        </div>

        {/* Plans Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-blue-500 opacity-50" />
            <p className="mt-4 text-slate-400 text-[12px] uppercase tracking-widest">Loading Plans...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CreditCard size={40} className="text-slate-600 mb-3" />
            <p className="text-slate-400 text-[12px] uppercase tracking-widest">No Subscription Plans Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
            {paginated.map((plan, idx) => {
              const color = PLAN_COLORS[idx % PLAN_COLORS.length];
              const isFree = Boolean(plan.is_free);
              const isRecommended = Boolean(plan.is_recommended);
              const isActive = Boolean(plan.status);
              return (
                <div
                  key={plan.id}
                  className="relative rounded-2xl border border-[#1e293b] bg-[#0c111d] overflow-hidden shadow-xl group hover:border-blue-500/30 transition-all duration-300"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1 w-full bg-gradient-to-r ${color.gradient}`} />

                  {/* Recommended Badge */}
                  {isRecommended && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Star size={10} fill="currentColor" /> Recommended
                      </span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${color.badge}`}>
                            {isFree ? 'Free' : 'Paid'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h3 className="text-white text-[18px] font-bold tracking-tight">{plan.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`text-[22px] font-black bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent`}>
                          {formatPrice(plan.price, plan.is_free)}
                        </div>
                        <div className="text-slate-500 text-[11px]">{plan.duration_days} days</div>
                      </div>
                    </div>

                    {plan.description && (
                      <p className="text-slate-400 text-[12px] leading-relaxed mb-4 line-clamp-2">{plan.description}</p>
                    )}

                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {Object.entries({
                        'Stores': plan.limits?.store_limit,
                        'Products': plan.limits?.product_limit,
                        'Roles': plan.limits?.role_limit,
                        'System Users': plan.limits?.system_user_limit,
                      }).map(([label, val]) => (
                        <div key={label} className="bg-[#1a2235] rounded-lg p-2.5 flex flex-col">
                          <span className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</span>
                          <span className="text-white text-[14px] font-bold mt-0.5">
                            {val == null ? '∞' : val.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-[#1e293b]">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all text-[12px] font-medium"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="flex items-center justify-center gap-2 w-9 h-9 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-1">
            <p className="text-[13px] text-slate-400">
              Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} plans
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30"><ChevronsLeft size={14} /></button>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="text-slate-500 disabled:opacity-30"><ChevronLeft size={14} /></button>
              <div className="bg-blue-600 px-2.5 py-1 rounded text-white text-[11px]">{page}</div>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="text-slate-500 disabled:opacity-30"><ChevronRight size={14} /></button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="text-slate-500 disabled:opacity-30"><ChevronsRight size={14} /></button>
            </div>
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
                <h2 className="text-[17px] font-bold text-white">{isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h2>
                <div className="h-0.5 w-10 bg-blue-500 rounded-full mt-1.5" />
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-500 hover:text-white p-1 transition-all">
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-7 space-y-5 no-scrollbar">
              {/* Plan Name */}
              <div className="space-y-2">
                <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Plan Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Basic, Premium"
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe what this plan offers..."
                  className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none" />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Price (₹)</label>
                  <input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                    disabled={formData.is_free}
                    placeholder="0.00"
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-40" />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-[12px] font-bold uppercase tracking-wider opacity-70">Duration (Days)</label>
                  <input type="number" min="1" value={formData.duration_days} onChange={e => setFormData(p => ({ ...p, duration_days: e.target.value }))}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              {/* Plan Limits */}
              <div className="space-y-3 border border-[#1e293b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={14} className="text-blue-400" />
                  <span className="text-white text-[12px] font-bold uppercase tracking-wider">Plan Limits</span>
                  <span className="text-slate-500 text-[11px]">(Leave blank = Unlimited)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <LimitField label="Store Limit" field="store_limit" />
                  <LimitField label="Product Limit" field="product_limit" />
                  <LimitField label="Role Limit" field="role_limit" />
                  <LimitField label="System User Limit" field="system_user_limit" />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1e293b]/50">
                {[
                  { key: 'is_free', label: 'Free Plan' },
                  { key: 'is_recommended', label: 'Recommended' },
                  { key: 'is_default', label: 'Default Plan' },
                  { key: 'status', label: 'Active Status' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-[#0c111d] rounded-xl border border-[#1e293b]">
                    <span className="text-slate-300 text-[13px] font-medium">{label}</span>
                    <div
                      onClick={() => setFormData(p => ({ ...p, [key]: !(p as any)[key] }))}
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 border ${(formData as any)[key] ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-300 ${(formData as any)[key] ? 'left-[26px]' : 'left-[3px]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-5">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-[13px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting}
                onMouseEnter={() => setHoveredBtn('save')} onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-7 py-3 text-[13px] font-bold active:scale-95 disabled:opacity-50 transition-all"
                style={{
                  borderRadius: '12px', border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'save' ? 'white' : '#3b82f6'
                }}>
                {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                {isEditing ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
