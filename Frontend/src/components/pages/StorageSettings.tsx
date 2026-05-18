import React from 'react';
import Navbar from '../Navbar';

interface StorageSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const FormField = ({ label, value, placeholder, required = false, type = "text" }: any) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input 
      type={type} 
      defaultValue={value}
      placeholder={placeholder} 
      style={{ 
        width: '100%', 
        backgroundColor: '#0c111d', 
        border: '1px solid #2d3748', 
        borderRadius: '4px', 
        padding: '12px 16px', 
        fontSize: '13px', 
        color: 'white', 
        outline: 'none', 
        boxSizing: 'border-box' 
      }} 
    />
  </div>
);

export default function StorageSettings({ onLogout, onNavigate }: StorageSettingsProps) {
  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Storage Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Storage Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: '#007bff', 
                  backgroundColor: 'rgba(0, 123, 255, 0.05)', 
                  cursor: 'pointer'
                }}
              >
                AWS S3
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>AWS S3</h3>
              </div>
              
              <div style={{ padding: '24px' }}>
                <FormField label="AWS Access Key ID" required placeholder="Enter AWS Access Key ID" />
                <FormField label="AWS Secret Access Key" required placeholder="Enter AWS Secret Access Key" />
                <FormField label="AWS Region" required placeholder="Enter AWS Region (e.g., us-east-1)" />
                <FormField label="AWS Bucket" required placeholder="Enter AWS Bucket name" />
                <FormField label="AWS Asset URL" required placeholder="Enter AWS Asset URL" />
              </div>
            </div>

            {/* Global Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '6px', fontSize: '14px', fontWeight: "400", cursor: 'pointer', transition: 'all 0.2s' }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
