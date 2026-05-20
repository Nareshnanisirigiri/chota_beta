import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Search,
  RefreshCw,
  ChevronDown,
  Download,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  FileText
} from 'lucide-react';
import Navbar from '../Navbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface SystemUpdatesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const TableColumnHeader = ({ label }: { label: string }) => (
  <th style={{
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: "200",
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderRight: '1px solid rgba(255, 255, 255, 0.4)',
    borderBottom: '2px solid white'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {label}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
        <ChevronDown size={12} style={{ transform: 'rotate(180deg)', display: 'block' }} />
        <ChevronDown size={12} style={{ display: 'block' }} />
      </div>
    </div>
  </th>
);

export default function SystemUpdates({ onLogout, onNavigate }: SystemUpdatesProps) {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/system-updates`);
      if (response.data.success) {
        setUpdates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching system updates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const filteredUpdates = updates.filter(item => {
    const term = search.toLowerCase();
    return (
      (item.id?.toString() || '').toLowerCase().includes(term) ||
      (item.version || '').toLowerCase().includes(term) ||
      (item.package_name || '').toLowerCase().includes(term) ||
      (item.status || '').toLowerCase().includes(term) ||
      (item.applied_by_email || '').toLowerCase().includes(term)
    );
  });

  const pageCount = Math.ceil(filteredUpdates.length / entriesPerPage);
  const displayedUpdates = filteredUpdates.slice(
    currentPageIndex * entriesPerPage,
    (currentPageIndex + 1) * entriesPerPage
  );

  const startEntry = filteredUpdates.length === 0 ? 0 : currentPageIndex * entriesPerPage + 1;
  const endEntry = Math.min((currentPageIndex + 1) * entriesPerPage, filteredUpdates.length);

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box', position: 'relative' }}>
      <Navbar onLogout={onLogout} />

      {/* Header Section Outside Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '32px' }}>
        <div>
          <h1 style={{ margin: 0, color: 'white' }}>System Updates</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginTop: '4px' }}>
            <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
            <span style={{ color: '#64748b' }}>/</span>
            <span style={{ color: 'white' }}>System Updates</span>
          </div>
        </div>
        <span style={{ color: '#64748b', fontSize: '12px' }}>Current Version: <span style={{ color: 'white' }}>v1.1.1</span></span>
      </div>

      {/* Card 1: Update ZIP File Section */}
      <div style={{
        backgroundColor: '#1a2233',
        borderRadius: '8px',
        border: '1px solid #2d3748',
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Update ZIP File</h3>

        <div style={{
          border: '2px dashed #2d3748',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          color: '#000',
          fontSize: '14px',
          backgroundColor: 'white',
          marginBottom: '12px'
        }}>
          <p style={{ margin: 0 }}>Drag & Drop your files or <span style={{ color: '#007bff', fontWeight: "400", cursor: 'pointer', textDecoration: 'underline' }}>Browse</span></p>
        </div>
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '20px' }}>Upload the update package in .zip format to apply system updates.</p>

        <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: "400", cursor: 'pointer' }}>
          Apply Update
        </button>
      </div>

      {/* Card 2: Update History Section */}
      <div style={{
        backgroundColor: '#1a2233',
        borderRadius: '8px',
        border: '1px solid #2d3748',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: '0 0 4px 0' }}>Update History</h3>
          </div>
          <button 
            onClick={fetchUpdates}
            style={{ backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: "400", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPageIndex(0);
                  }}
                  style={{
                    backgroundColor: '#0c111d',
                    border: '1px solid #2d3748',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    paddingRight: '32px',
                    color: 'white',
                    fontSize: '13px',
                    width: '240px'
                  }}
                />
                <Search size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px' }}>
                <select 
                  value={entriesPerPage} 
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPageIndex(0);
                  }}
                  style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '13px' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>entries per page</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '8px 16px', color: 'white', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Columns <ChevronDown size={14} />
              </button>
              <button style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '8px 16px', color: '#007bff', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={14} /> Export <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #2d3748' }}>
              <thead>
                <tr style={{ backgroundColor: '#0c111d' }}>
                  <TableColumnHeader label="ID" />
                  <TableColumnHeader label="VERSION" />
                  <TableColumnHeader label="PACKAGE" />
                  <TableColumnHeader label="STATUS" />
                  <TableColumnHeader label="APPLIED BY" />
                  <TableColumnHeader label="APPLIED AT" />
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: '200', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.08em', borderBottom: '2px solid white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      ACTION
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
                        <ChevronDown size={12} style={{ transform: 'rotate(180deg)', display: 'block' }} />
                        <ChevronDown size={12} style={{ display: 'block' }} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                      <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Loader2 className="animate-spin" size={24} />
                        <span style={{ fontSize: '13px' }}>Loading system updates...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedUpdates.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                      <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Database size={24} />
                        <span style={{ fontSize: '13px' }}>No data available.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedUpdates.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #2d3748' }}>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '13px' }}>{item.id}</td>
                      <td style={{ padding: '12px 16px', color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.version}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>{item.package_name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          backgroundColor: item.status === 'success' || item.status === 'applied' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: item.status === 'success' || item.status === 'applied' ? '#10b981' : '#ef4444',
                          border: item.status === 'success' || item.status === 'applied' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '13px' }}>{item.applied_by_email || 'System'}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>
                        {item.applied_at ? new Date(item.applied_at).toLocaleString() : new Date(item.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                        <button 
                          onClick={() => {
                            if (item.log || item.notes) {
                              alert(`Notes:\n${item.notes || 'No notes'}\n\nLog:\n${item.log || 'No logs'}`);
                            } else {
                              alert('No logs or notes available for this update.');
                            }
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: 0
                          }}
                        >
                          <FileText size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ color: '#64748b', fontSize: '12px' }}>
              Showing {startEntry} to {endEntry} of {filteredUpdates.length} entries
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => setCurrentPageIndex(0)}
                disabled={currentPageIndex === 0}
                style={{ padding: '8px', background: 'transparent', border: 'none', color: currentPageIndex === 0 ? '#2d3748' : '#007bff', cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                style={{ padding: '8px', background: 'transparent', border: 'none', color: currentPageIndex === 0 ? '#2d3748' : '#007bff', cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPageIndex(prev => Math.min(pageCount - 1, prev + 1))}
                disabled={currentPageIndex >= pageCount - 1}
                style={{ padding: '8px', background: 'transparent', border: 'none', color: currentPageIndex >= pageCount - 1 ? '#2d3748' : '#007bff', cursor: currentPageIndex >= pageCount - 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setCurrentPageIndex(pageCount - 1)}
                disabled={currentPageIndex >= pageCount - 1}
                style={{ padding: '8px', background: 'transparent', border: 'none', color: currentPageIndex >= pageCount - 1 ? '#2d3748' : '#007bff', cursor: currentPageIndex >= pageCount - 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <div style={{ marginTop: '64px', paddingBottom: '32px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
          Copyright © 2026 Chota Beta | More Sellers. More Choices. Better Deals.. All rights reserved.
        </p>
      </div>
    </div>
  );
}
