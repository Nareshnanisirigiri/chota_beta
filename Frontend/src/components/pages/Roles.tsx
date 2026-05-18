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
  ShieldCheck,
  X,
} from 'lucide-react';
import Navbar from '../Navbar';

interface RolesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Roles({ onLogout, onNavigate }: RolesProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<any>(null);
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = React.useState<string | null>(null);

  const roles = [
    {
      id: 4,
      name: 'Managing Director',
      guardName: 'admin',
      createdAt: '2026-02-27',
    },
  ];

  const handleEdit = (role: any) => {
    setEditingRole(role);
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
            <h1 className="text-white text-[18px] font-medium tracking-tight">System Roles</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Roles</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search roles..."
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[8px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200" style={{ borderRadius: '12px' }}>
              Columns <ChevronDown size={14} className="inline opacity-60" />
            </button>
            <button
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
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
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
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50 cursor-pointer">
                  <td className="px-4 py-5 text-slate-300 border-r border-[#2d3748]/30 font-extralight text-[13px] text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{role.id}</td>
                  <td className="px-5 py-5 text-slate-100 border-r border-[#2d3748]/30 font-bold text-[13px] text-left uppercase tracking-tight italic bg-white/5" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{role.name}</td>
                  <td className="px-5 py-5 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{role.guardName}</td>
                  <td className="px-4 py-5 text-slate-400 border-r border-[#2d3748]/30 text-[13px] font-extralight text-center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>{role.createdAt}</td>
                  <td className="px-4 py-5 border-r border-[#2d3748]/30">
                    <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-[11px] uppercase tracking-widest hover:text-blue-300 transition-colors">
                      <ShieldCheck size={14} /> Permissions
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        onMouseEnter={() => setHoveredAction(`${role.id}-edit`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          backgroundColor: hoveredAction === `${role.id}-edit` ? '#3b82f6' : 'transparent',
                          color: hoveredAction === `${role.id}-edit` ? 'white' : '#3b82f6'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onMouseEnter={() => setHoveredAction(`${role.id}-delete`)}
                        onMouseLeave={() => setHoveredAction(null)}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 active:scale-90"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #ef4444',
                          backgroundColor: hoveredAction === `${role.id}-delete` ? '#ef4444' : 'transparent',
                          color: hoveredAction === `${role.id}-delete` ? 'white' : '#ef4444'
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
          <p className="text-[6px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '100' }}>
            Showing 1 to {roles.length} of {roles.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={12} />
            </button>
            <div className="bg-blue-600 px-2 py-0.25 rounded text-white text-[10px] font-extralight" style={{ fontWeight: '200' }}>1</div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={12} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Role Modal (Categories.tsx Style) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div
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
                  {isModalOpen ? 'Create New Role' : 'Edit Role Configuration'}
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
            <div className="flex-1 overflow-y-auto p-8 space-y-7 no-scrollbar" style={{ backgroundColor: '#111827' }}>
               <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white text-[13px] font-bold tracking-normal block">
                    Role Designation <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    defaultValue={editingRole?.name || ''} 
                    placeholder="e.g. Content Manager" 
                    className="w-full bg-[#070b14] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-blue-500/50 transition-all font-extralight" 
                    style={{ fontWeight: '200' }}
                  />
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
                {isModalOpen ? 'Create Role' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
