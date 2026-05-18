import React from 'react';
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
  Edit2,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import Navbar from '../Navbar';

interface SystemUsersProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function SystemUsers({ onLogout, onNavigate }: SystemUsersProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);

  const users = [
    {
      id: 2,
      name: 'Suresh N',
      email: 'soori.916@gmail.com',
      mobile: '8886660031',
      role: 'MANAGING DIRECTOR',
      createdAt: '2026-02-27',
    },
  ];

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
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
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-1.5 rounded-xl transition-all text-[13px] font-medium active:scale-95 shadow-lg shadow-blue-500/10 uppercase tracking-widest"
            >
              <Plus size={16} /> Add New User
            </button>
            <button className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-1.5 rounded-xl transition-all text-[13px] font-medium active:scale-95 shadow-sm shadow-blue-500/5 hover:bg-blue-500 hover:text-white">
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Search and Entries Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-[13px] text-slate-400">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 rounded-md text-[13px] text-slate-200">
              Columns <ChevronDown size={14} className="inline opacity-60" />
            </button>
            <button className="flex items-center gap-2 border-2 border-blue-500 text-blue-500 px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all active:scale-95 hover:bg-blue-500 hover:text-white">
              <Download size={16} /> Export <ChevronDown size={14} className="inline opacity-60 ml-1" />
            </button>
          </div>
        </div>

        {/* Table Area with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 font-extralight text-[13px] text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{user.id}</td>
                  <td className="px-5 py-5 text-slate-100 border-r border-[#2d3748]/30 font-bold text-[13px]" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{user.name}</td>
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 text-[13px] font-extralight" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{user.email}</td>
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{user.mobile}</td>
                  <td className="px-4 py-5 border-r border-[#2d3748]/30" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <div className="flex justify-start">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{user.createdAt}</td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white shadow-sm">
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
            Showing 1 to {users.length} of {users.length} entries
          </p>

          <div className="flex items-center gap-6">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={18} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <div className="bg-blue-600 px-4 py-1 rounded text-white text-[13px] font-bold shadow-lg shadow-blue-500/20">1</div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* User Modal (Categories.tsx Style) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div
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
                  {isModalOpen ? 'Create New User' : 'Edit User Privileges'}
                </h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
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
                    defaultValue={editingUser?.name || ''}
                    placeholder="John Doe"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    placeholder="john@example.com"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Contact Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    defaultValue={editingUser?.mobile || ''}
                    placeholder="+91 00000 00000"
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                    style={{ fontWeight: '200' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">Password {isModalOpen && <span className="text-red-500">*</span>}</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder={isEditModalOpen ? "Leave blank to keep current" : "Create secure password"}
                      className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                      style={{ fontWeight: '200' }}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-[10px] font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/10 rounded border border-blue-500/20">
                      GENERATE
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 tracking-widest uppercase block">System Role <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      defaultValue={editingUser?.role || ''}
                      className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                      style={{ fontWeight: '200' }}
                    >
                      <option value="">Select Administrative Role</option>
                      <option value="MANAGING DIRECTOR">MANAGING DIRECTOR</option>
                      <option value="OPERATIONS MANAGER">OPERATIONS MANAGER</option>
                      <option value="SUPPORT LEAD">SUPPORT LEAD</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                  </div>
                </div>

              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-6 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-5">
              <button 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }}
                className="px-6 py-3 text-[13px] font-bold text-slate-400 hover:text-white transition-all duration-300 uppercase tracking-[0.1em]"
              >
                Cancel
              </button>
              <button 
                className="flex items-center justify-center gap-3 px-10 py-3 transition-all duration-300 text-[14px] font-bold active:scale-95 text-white"
                style={{
                  borderRadius: '14px',
                  backgroundColor: '#007bff',
                  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)',
                  minWidth: '200px'
                }}
              >
                {isModalOpen ? 'Initialize Account' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
