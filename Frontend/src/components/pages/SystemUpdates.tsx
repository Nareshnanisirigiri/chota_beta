import React from 'react';
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
  ChevronsRight
} from 'lucide-react';
import Navbar from '../Navbar';

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
          <button style={{ backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: "400", cursor: 'pointer' }}>
            Refresh
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  placeholder="Search..."
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
                <select style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '8px', color: 'white', fontSize: '13px' }}>
                  <option>10</option>
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
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Database size={24} />
                      <span style={{ fontSize: '13px' }}>No data available.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ color: '#64748b', fontSize: '12px' }}>Showing 0 to 0 of 0 entries</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ padding: '8px', background: 'transparent', border: 'none', color: '#2d3748', cursor: 'not-allowed' }}><ChevronsLeft size={16} /></button>
              <button style={{ padding: '8px', background: 'transparent', border: 'none', color: '#2d3748', cursor: 'not-allowed' }}><ChevronLeft size={16} /></button>
              <button style={{ padding: '8px', background: 'transparent', border: 'none', color: '#2d3748', cursor: 'not-allowed' }}><ChevronRight size={16} /></button>
              <button style={{ padding: '8px', background: 'transparent', border: 'none', color: '#2d3748', cursor: 'not-allowed' }}><ChevronsRight size={16} /></button>
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
