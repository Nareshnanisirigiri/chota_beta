import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RefreshCcw,
  Plus,
  ChevronDown,
  Download,
  Database,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Edit2,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface SystemUsersProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface SystemUser {
  id: number;
  email: string;
  status: 'active' | 'inactive';
  name: string | null;
  mobile: string | null;
  role: string | null;
  createdAt: string;
}

interface RoleOption {
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

export default function SystemUsers({ onLogout, onNavigate }: SystemUsersProps) {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: '',
    status: 'active' as 'active' | 'inactive'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search
      };
      const res = await axios.get(`${BASE_URL}/api/admin-users`, { params });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching system users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/roles`, { params: { limit: 100 } });
      if (res.data.success) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching roles for dropdown:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      role: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      mobile: user.mobile || '',
      password: '', // blank to keep current
      role: user.role || '',
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let generated = "";
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: generated }));
    alert(`Generated Password: ${generated}\n\nPlease copy this securely.`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return alert("Email is required");
    if (!editingUser && !formData.password) return alert("Password is required for new users");

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete (payload as any).password;

      let res;
      if (editingUser) {
        res = await axios.put(`${BASE_URL}/api/admin-users/${editingUser.id}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/api/admin-users`, payload);
      }

      if (res.data.success) {
        alert(editingUser ? "User updated successfully" : "System user account created successfully");
        handleCloseModal();
        fetchUsers();
      }
    } catch (err: any) {
      console.error("Error saving user:", err);
      alert(err.response?.data?.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this system user account?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/admin-users/${id}`);
      if (res.data.success) {
        alert("System user deleted successfully");
        fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user account");
    }
  };

  const handleExport = () => {
    if (users.length === 0) return;
    const csvHeaders = "ID,Name,Email,Mobile,Role,Status,Created At";
    const csvRows = users.map(u => 
      `"${u.id}","${(u.name || '').replace(/"/g, '""')}","${u.email}","${u.mobile || ''}","${u.role || ''}","${u.status}","${u.createdAt}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container Card */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b] mt-8">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">System Users</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">System User</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
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
              <Plus size={16} /> Add New User
            </button>
            <button
              onClick={fetchUsers}
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

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
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
              <span className="text-[13px] text-slate-400">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              onMouseEnter={() => setHoveredBtn('export')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95 shadow-sm shadow-blue-500/5"
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
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {[
                  { label: "ID", width: "70px" },
                  { label: "NAME", width: "auto" },
                  { label: "EMAIL", width: "auto" },
                  { label: "MOBILE", width: "150px" },
                  { label: "ROLE", width: "220px" },
                  { label: "CREATED AT", width: "140px" },
                  { label: "ACTION", width: "100px" }
                ].map((header, idx) => (
                  <th
                    key={header.label}
                    style={{
                      padding: '10px 16px',
                      borderBottom: '2px solid white',
                      borderTop: '2px solid white',
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '200',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      width: header.width,
                      whiteSpace: 'nowrap',
                      borderLeft: idx === 0 ? '2px solid white' : 'none',
                      borderRight: idx === 6 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
                  <td colSpan={7} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading system users...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 font-extralight text-[13px] text-center">{user.id}</td>
                    <td className="px-5 py-4 text-slate-100 border-r border-[#2d3748]/30 font-bold text-[13px]">{user.name || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 text-[13px] font-extralight">{user.email}</td>
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center">{user.mobile || 'N/A'}</td>
                    <td className="px-4 py-4 border-r border-[#2d3748]/30">
                      <div className="flex justify-start">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm">
                          {user.role || 'GUEST ADMIN'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-mono text-center">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          onMouseEnter={() => setHoveredAction(`${user.id}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #3b82f6',
                            backgroundColor: hoveredAction === `${user.id}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${user.id}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          onMouseEnter={() => setHoveredAction(`${user.id}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #ef4444',
                            backgroundColor: hoveredAction === `${user.id}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${user.id}-delete` ? 'white' : '#ef4444'
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

        {/* Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleFormSubmit}
            className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden"
            style={{
              backgroundColor: '#111827',
              width: '680px',
              maxWidth: '95vw',
              maxHeight: '90vh'
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">
                  {editingUser ? 'Edit User Privileges' : 'Create New User'}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button 
                type="button"
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-white transition-all hover:scale-110 p-1"
              >
                <X size={22} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar" style={{ backgroundColor: '#111827' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Contact Number</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    placeholder="+91 00000 00000"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Password {!editingUser && <span className="text-red-500">*</span>}</label>
                  <div className="relative">
                    <input
                      type="password"
                      required={!editingUser}
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={editingUser ? "Leave blank to keep current" : "Create secure password"}
                      className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl pl-4 pr-24 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light"
                    />
                    <button 
                      type="button"
                      onClick={handleGeneratePassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/10 rounded border border-blue-500/20"
                    >
                      GENERATE
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">System Role <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      required
                      value={formData.role}
                      onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-light cursor-pointer"
                    >
                      <option value="">Select Administrative Role</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-6 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-5">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 text-[13px] font-bold text-slate-400 hover:text-white transition-all duration-300 uppercase tracking-[0.1em]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-3 px-10 py-3 transition-all duration-300 text-[14px] font-bold active:scale-95 text-white"
                style={{
                  borderRadius: '14px',
                  backgroundColor: '#007bff',
                  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)',
                  minWidth: '200px'
                }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin text-white" />}
                {editingUser ? 'Commit Changes' : 'Initialize Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
