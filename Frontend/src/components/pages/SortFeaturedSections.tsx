import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Loader2,
  Database,
  RefreshCcw,
  GripVertical
} from 'lucide-react';
import Navbar from '../Navbar';

interface SortFeaturedSectionsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

interface FeaturedSection {
  id: number;
  title: string;
  section_type: string;
  scope_type: 'global' | 'category';
  scope_id: number | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

export default function SortFeaturedSections({ onLogout, onNavigate }: SortFeaturedSectionsProps) {
  const [sections, setSections] = useState<FeaturedSection[]>([]);
  const [originalSections, setOriginalSections] = useState<FeaturedSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/featured-sections?limit=100`);
      if (res.data.success) {
        // Sort initially by sort_order
        const sorted = [...res.data.data].sort((a, b) => a.sort_order - b.sort_order);
        setSections(sorted);
        setOriginalSections(JSON.parse(JSON.stringify(sorted)));
      }
    } catch (err) {
      console.error("Error fetching featured sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setSections(updated);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...sections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, movedItem);
    setDraggedIndex(index);
    setSections(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleReset = () => {
    setSections(JSON.parse(JSON.stringify(originalSections)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Generate the new orders based on index position
      const orders = sections.map((sec, index) => ({
        id: sec.id,
        sort_order: index + 1 // Assign new sequential sort order starting from 1
      }));

      const res = await axios.put(`${BASE_URL}/api/featured-sections/reorder`, { orders });
      if (res.data.success) {
        alert("Sort order updated successfully!");
        setOriginalSections(JSON.parse(JSON.stringify(sections)));
        fetchSections();
      }
    } catch (err) {
      console.error("Error saving sort order:", err);
      alert("Failed to save sort order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-card p-6 rounded-lg border border-[#1e293b] bg-[#111827] shadow-xl overflow-hidden mt-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-normal text-white tracking-tight" style={{ fontSize: '18px' }}>
            Sort Featured Sections ({sections.length})
          </h1>
          <button
            onClick={() => onNavigate?.('manage-featured-section')}
            className="px-4 py-2 rounded-md font-normal text-[#e2e8f0] bg-[#64748b]/80 hover:bg-[#64748b] transition-all"
            style={{ fontSize: '13px' }}
          >
            Back to List
          </button>
        </div>

        {/* Sorting Instructions Section */}
        <div
          className="p-6 mb-8 relative rounded-md bg-[#1e2736]/40 border-l-4 border-blue-500"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold uppercase tracking-wider text-[11px] text-blue-400">
              Sorting Instructions
            </h3>
            <p className="text-[13px] text-slate-300 mt-1">
              Drag and drop the sections below using the grip handle, or use the up/down arrows to change their display order. Click "Save Order" to apply changes.
            </p>
          </div>
        </div>

        {/* Sections List */}
        <div className="bg-[#0c101a] border border-[#2d3748] rounded-lg p-6 shadow-sm mb-10 overflow-hidden">
          <div className="mb-6 flex justify-between items-center">
            <span style={{ fontSize: '15px', color: '#3b82f6', fontWeight: "500" }}>Global & Category Sections ({sections.length})</span>
            <button onClick={fetchSections} className="text-slate-400 hover:text-white transition-colors">
              <RefreshCcw size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <RefreshCcw size={32} className="text-blue-500 animate-spin" />
              <span className="text-[14px] text-slate-400">Loading sections...</span>
            </div>
          ) : sections.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <Database size={40} className="text-slate-600 opacity-60" />
              <span className="text-[14px] text-slate-500">No featured sections found.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sections.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-3.5 bg-[#161f30]/60 border rounded-lg transition-all duration-150 ${
                    draggedIndex === index 
                      ? 'border-blue-500 bg-blue-500/10 opacity-70 scale-[0.98]' 
                      : 'border-[#2d3748] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing p-1"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full flex items-center justify-center font-mono"
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #3b82f6'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: "500" }}>{index + 1}</span>
                      </div>
                      <span className="text-[14px] text-white font-medium">{item.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                      {item.section_type.replace('_', ' ')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide capitalize ${
                      item.scope_type === 'category' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {item.scope_type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium tracking-wide capitalize ${
                      item.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {item.status}
                    </span>

                    {/* Up/Down Action Arrows */}
                    <div className="flex items-center gap-1 ml-4 border-l border-[#2d3748] pl-4">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded hover:bg-[#1f293d] transition-colors ${index === 0 ? 'text-slate-600 opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === sections.length - 1}
                        className={`p-1 rounded hover:bg-[#1f293d] transition-colors ${index === sections.length - 1 ? 'text-slate-600 opacity-30 cursor-not-allowed' : 'text-slate-300'}`}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded-md font-normal text-slate-400 border border-[#2d3748] hover:bg-[#1e293b] transition-all" 
            style={{ fontSize: '13px' }}
          >
            <RotateCcw size={14} /> Reset Order
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || sections.length === 0}
            className="flex items-center gap-2 hover:opacity-90 text-white px-8 py-2 rounded-md font-normal transition-all shadow-lg bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)' }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}
