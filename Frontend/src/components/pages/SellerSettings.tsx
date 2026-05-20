import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Store,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  RotateCcw,
  RotateCw,
  Baseline,
  Eraser,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface SellerSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const EditorToolbar = () => (
  <div style={{ display: 'flex', gap: '8px', padding: '8px', borderBottom: '1px solid #2d3748', backgroundColor: '#0c111d' }}>
    <div style={{ display: 'flex', gap: '2px', borderRight: '1px solid #2d3748', paddingRight: '8px' }}>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><RotateCcw size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><RotateCw size={14} /></button>
    </div>
    <div style={{ display: 'flex', gap: '2px', borderRight: '1px solid #2d3748', paddingRight: '8px' }}>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><Bold size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><Italic size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><Baseline size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#007bff' }}></div>
          <ChevronDown size={8} />
        </div>
      </button>
    </div>
    <div style={{ display: 'flex', gap: '2px', borderRight: '1px solid #2d3748', paddingRight: '8px' }}>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><AlignLeft size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><AlignCenter size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><AlignRight size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><AlignJustify size={14} /></button>
    </div>
    <div style={{ display: 'flex', gap: '2px', borderRight: '1px solid #2d3748', paddingRight: '8px' }}>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><List size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><ListOrdered size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><Link size={14} /></button>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <ChevronDown size={8} />
        </div>
      </button>
    </div>
    <div style={{ display: 'flex', gap: '2px' }}>
      <button style={{ padding: '4px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><Eraser size={14} /></button>
    </div>
  </div>
);

const Editor = ({ placeholder, value, onChange }: { placeholder: string, value: string, onChange: (v: string) => void }) => (
  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
    <EditorToolbar />
    <textarea 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: 'white', 
        border: 'none', 
        padding: '16px', 
        fontSize: '14px', 
        color: '#333', 
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box'
      }}
    />
  </div>
);

export default function SellerSettings({ onLogout, onNavigate }: SellerSettingsProps) {
  const [activeTab, setActiveTab] = useState('Seller Policies');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    seller_terms: '',
    seller_privacy: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/settings`);
      if (res.data.success && res.data.data) {
        setSettings(prev => ({
          ...prev,
          ...res.data.data
        }));
      }
    } catch (err) {
      console.error("Error fetching seller settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/settings`, settings);
      if (res.data.success) {
        alert('Seller Settings saved successfully!');
      }
    } catch (err) {
      console.error("Error saving seller settings:", err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen flex items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
          <p className="text-slate-400 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }} className="font-sans">
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ margin: '0 0 4px 0', color: 'white', fontSize: '18px', fontWeight: "400" }}>Seller Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Seller Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                onClick={() => setActiveTab('Seller Policies')}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: activeTab === 'Seller Policies' ? '#007bff' : '#64748b', 
                  backgroundColor: activeTab === 'Seller Policies' ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                  cursor: 'pointer'
                }}
              >
                Seller Policies
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Seller Policies</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Seller Terms & Conditions</label>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #007bff', color: '#007bff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
                </div>
                <Editor 
                  placeholder="Enter seller terms & conditions" 
                  value={settings.seller_terms}
                  onChange={(v) => updateSetting('seller_terms', v)}
                />

                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Seller Privacy Policy</label>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #007bff', color: '#007bff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
                </div>
                <Editor 
                  placeholder="Enter seller privacy policy" 
                  value={settings.seller_privacy}
                  onChange={(v) => updateSetting('seller_privacy', v)}
                />
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                onClick={handleSave}
                disabled={saving}
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 32px', 
                  borderRadius: '6px', 
                  fontSize: '14px', 
                  fontWeight: "600", 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
