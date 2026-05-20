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
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface RolesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface Role {
  id: number;
  name: string;
  guardName: string;
  createdAt: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Roles({ onLogout, onNavigate }: RolesProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [roleName, setRoleName] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search
      };
      const res = await axios.get(`${BASE_URL}/api/roles`, { params });
      if (res.data.success) {
        setRoles(res.data.data);
        setTotalEntries(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, limit, search]);

  const handleOpenAdd = () => {
    setEditingRole(null);
    setRoleName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoleName('');
    setEditingRole(null);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return alert("Role Designation name is required");

    setIsSubmitting(true);
    try {
      const payload = {
        name: roleName,
        guardName: 'admin'
      };

      let res;
      if (editingRole) {
        res = await axios.put(`${BASE_URL}/api/roles/${editingRole.id}`, payload);
      } else {
        res = await axios.post(`${BASE_URL}/api/roles`, payload);
      }

      if (res.data.success) {
        alert(editingRole ? "Role updated successfully" : "Role created successfully");
        handleCloseModal();
        fetchRoles();
      }
    } catch (err: any) {
      console.error("Error saving role:", err);
      alert(err.response?.data?.message || "Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this role designation?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/api/roles/${id}`);
      if (res.data.success) {
        alert("Role designation deleted successfully");
        fetchRoles();
      }
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("Failed to delete role designation");
    }
  };

  const handleExport = () => {
    if (roles.length === 0) return;
    const csvHeaders = "ID,Name,Guard Name,Created At";
    const csvRows = roles.map(r => 
      `"${r.id}","${r.name.replace(/"/g, '""')}","${r.guardName}","${r.createdAt}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `roles_${Date.now()}.csv`);
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
            <h1 className="text-white text-[18px] font-medium tracking-tight">System Roles</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Roles</span>
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
              <Plus size={16} /> Add New Role
            </button>
            <button
              onClick={fetchRoles}
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
              placeholder="Search roles..."
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
              <span className="text-[13px] text-slate-100">entries per page</span>
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
          <table className="w-full text-center text-sm border-collapse min-w-[900px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736' }}>
                {[
                  { label: "ID", width: "80px" },
                  { label: "NAME", width: "auto" },
                  { label: "GUARD NAME", width: "150px" },
                  { label: "CREATED AT", width: "160px" },
                  { label: "PERMISSIONS", width: "160px" },
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
                      borderRight: idx === 5 ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.4)'
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
                  <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex items-center justify-center gap-3">
                      <RefreshCcw size={20} className="animate-spin text-blue-500" />
                      <p className="text-[16px] text-slate-400 font-medium tracking-wide">Loading roles...</p>
                    </div>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium tracking-wide">No data available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="px-4 py-4 text-slate-300 border-r border-[#2d3748]/30 font-extralight text-[13px] text-center">{role.id}</td>
                    <td className="px-5 py-4 text-slate-100 border-r border-[#2d3748]/30 font-bold text-[13px] text-left uppercase tracking-tight italic bg-white/5">{role.name}</td>
                    <td className="px-5 py-4 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center">{role.guardName}</td>
                    <td className="px-4 py-4 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-mono text-center">
                      {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-4 border-r border-[#2d3748]/30">
                      <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-[11px] uppercase tracking-widest hover:text-blue-300 transition-colors cursor-pointer">
                        <ShieldCheck size={14} /> Full Access
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(role)}
                          onMouseEnter={() => setHoveredAction(`${role.id}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #3b82f6',
                            backgroundColor: hoveredAction === `${role.id}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${role.id}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          onMouseEnter={() => setHoveredAction(`${role.id}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #ef4444',
                            backgroundColor: hoveredAction === `${role.id}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${role.id}-delete` ? 'white' : '#ef4444'
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
            Showing {roles.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
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

      {/* Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveRole}
            className="border border-[#1e293b] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden"
            style={{
              backgroundColor: '#111827',
              width: '520px',
              maxWidth: '95vw',
              maxHeight: '85vh'
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between" style={{ backgroundColor: '#111827' }}>
              <div className="flex flex-col gap-1">
                <h2 className="text-[18px] font-bold text-white tracking-tight leading-none">
                  {editingRole ? 'Edit Role Configuration' : 'Create New Role'}
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
            <div className="flex-1 overflow-y-auto p-8 space-y-7 no-scrollbar" style={{ backgroundColor: '#111827' }}>
               <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white text-[13px] font-bold tracking-normal block">
                    Role Designation <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Content Manager" 
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-light" 
                  />
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
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
