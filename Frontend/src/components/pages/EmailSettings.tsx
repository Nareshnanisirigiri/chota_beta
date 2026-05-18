import React from 'react';
import {
  Mail,
  ChevronDown
} from 'lucide-react';
import Navbar from '../Navbar';

interface EmailSettingsProps {
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

export default function EmailSettings({ onLogout, onNavigate }: EmailSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('SMTP');

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Email Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Email Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                onClick={() => setActiveTab('SMTP')}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: activeTab === 'SMTP' ? '#007bff' : '#64748b', 
                  backgroundColor: activeTab === 'SMTP' ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                SMTP
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>SMTP</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="SMTP Host" required value="mail.chotabeta.com" />
                <FormField label="SMTP Port" required value="587" />
                <FormField label="SMTP Email" required value="info@chotabeta.com" />
                <FormField label="SMTP Password" required value="............" type="password" />
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    SMTP Encryption <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select value="TLS" style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option>TLS</option>
                      <option>SSL</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    SMTP Content Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select value="Text" style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option>Text</option>
                      <option>HTML</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
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
