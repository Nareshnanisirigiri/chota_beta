import React from 'react';
import {
  ChevronDown,
} from 'lucide-react';
import Navbar from '../Navbar';

interface SortFeaturedSectionsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function SortFeaturedSections({ onLogout, onNavigate }: SortFeaturedSectionsProps) {
  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-card p-6 rounded-lg border border-[#1e293b] bg-[#1a2233] shadow-xl overflow-hidden mt-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-normal text-white tracking-tight" style={{ fontSize: '18px' }}>
            Sort Featured Sections (4)
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
          className="p-6 mb-8 relative"
          style={{
            backgroundColor: '#ffffff',
            borderLeft: '4px solid #007bff'
          }}
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-normal uppercase tracking-wide" style={{ fontSize: '11px', color: '#007bff' }}>
              Sorting Instructions
            </h3>
            <p style={{ fontSize: '14px', color: '#e2e8f0', opacity: 0.1, colorScheme: 'light', filter: 'invert(1)' }}>
              {/* This is a hacky way to match the translucent/light look if needed, but standard color is better */}
            </p>
            <p className="font-medium" style={{ fontSize: '14px', color: '#AEB9CC' }}>
              Drag and drop the sections below to change their display order. Click "Save Order" to apply changes.
            </p>
          </div>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-10 overflow-hidden">
          <div className="mb-6">
            <span style={{ fontSize: '15px', color: '#007bff', fontWeight: "400" }}>Global Sections (4)</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { id: 1, title: 'New Products', type: 'Newly Added' },
              { id: 2, title: 'Top Rated Products', type: 'Top Rated' },
              { id: 3, title: 'Best Sellers', type: 'Best Seller' },
              { id: 4, title: 'Daily Needs', type: 'Featured' },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white border border-[#e2e8f0] rounded-lg hover:border-blue-200 transition-colors group cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-4">
                  <div className="text-[#94a3b8] opacity-30 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2" cy="2" r="2" fill="currentColor" />
                      <circle cx="2" cy="9" r="2" fill="currentColor" />
                      <circle cx="2" cy="16" r="2" fill="currentColor" />
                      <circle cx="10" cy="2" r="2" fill="currentColor" />
                      <circle cx="10" cy="9" r="2" fill="currentColor" />
                      <circle cx="10" cy="16" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#0ea5e9'
                      }}
                    >
                      <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: "400" }}>0</span>
                    </div>
                    <span style={{ fontSize: '15px', color: '#334155', fontWeight: '600' }}>{item.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md font-medium" style={{ fontSize: '12px', color: '#3b82f6', backgroundColor: '#eef2ff' }}>
                    {item.type}
                  </span>
                  <span className="px-3 py-1 rounded-md font-medium" style={{ fontSize: '12px', color: '#22c55e', backgroundColor: '#f0fdf4' }}>
                    Global
                  </span>
                  <span className="px-3 py-1 rounded-md font-medium " style={{ fontSize: '12px', color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-end gap-3 mt-8">
          <button className="px-6 py-2.5 rounded-md font-normal text-slate-400 border border-[#2d3748] hover:bg-[#1e293b] transition-all" style={{ fontSize: '14px' }}>
            Reset Order
          </button>
          <button className="hover:opacity-90 text-white px-6 py-2.5 rounded-md font-normal transition-all shadow-lg" style={{ fontSize: '14px', backgroundColor: '#007bff', boxShadow: '0 4px 6px -1px rgba(0, 123, 255, 0.4)' }}>
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
}
