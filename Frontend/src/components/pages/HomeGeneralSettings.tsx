import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { ChevronDown, Plus, Loader2 } from 'lucide-react';

interface HomeGeneralSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const LogoUploader = ({ label, fileName, size, height = "120px", required = false }: any) => (
  <div>
    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <div style={{ 
      height: height, 
      backgroundColor: '#0c111d', 
      border: '2px dashed #2d3748', 
      borderRadius: '8px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ color: '#64748b', fontSize: '10px', display: 'flex', position: 'absolute', top: '8px', left: '8px', alignItems: 'center', gap: '6px' }}>
        <span>{fileName}</span>
        <span style={{ opacity: 0.5 }}>{size}</span>
      </div>
      <div style={{ width: '80%', height: '50%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <span style={{ color: '#2d3748', fontSize: '24px', fontWeight: "400" }}>Icon Preview</span>
      </div>
    </div>
  </div>
);

export default function HomeGeneralSettings({ onLogout, onNavigate }: HomeGeneralSettingsProps) {
  const [activeTab, setActiveTab] = useState('General');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    home_category_title: 'Explore All Categories',
    home_search_labels: 'Grocery,Restuarant,Food', // comma separated in DB for now
    home_bg_type: 'Image',
    home_font_color: '#000000'
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
      console.error("Error fetching home general settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/settings`, settings);
      if (res.data.success) {
        alert('Home General Settings saved successfully!');
      }
    } catch (err) {
      console.error("Error saving home general settings:", err);
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
          <p className="text-slate-400 font-medium">Loading home settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }} className="font-sans">
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Home General Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Home General Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                onClick={() => setActiveTab('General')}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: activeTab === 'General' ? '#007bff' : '#64748b', 
                  backgroundColor: activeTab === 'General' ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                  cursor: 'pointer'
                }}
              >
                General
              </div>
              <div 
                onClick={() => setActiveTab('Appearance')}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: activeTab === 'Appearance' ? '#007bff' : '#64748b', 
                  backgroundColor: activeTab === 'Appearance' ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                  cursor: 'pointer'
                }}
              >
                Appearance
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            
            <div style={{ display: activeTab === 'General' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>General</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Category Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings.home_category_title}
                      onChange={(e) => updateSetting('home_category_title', e.target.value)}
                      style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>This will be used as the default title for all categories configuration</p>
                  </div>

                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Search labels (comma separated)
                    </label>
                    <input 
                      type="text"
                      value={settings.home_search_labels}
                      onChange={(e) => updateSetting('home_search_labels', e.target.value)}
                      placeholder="Grocery, Restaurant, Food"
                      style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box' }} 
                    />
                    <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Search labels will show in search bar.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Appearance' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Appearance</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Background Type
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={settings.home_bg_type}
                        onChange={(e) => updateSetting('home_bg_type', e.target.value)}
                        style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none' }}
                      >
                        <option value="Image">Image</option>
                        <option value="Color">Color</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                    <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Choose how the background should be displayed</p>
                  </div>

                  <LogoUploader label="Icon" fileName="website-logo-Chota Beta.png" size="158 KB" height="280px" />
                  <div style={{ marginTop: '24px' }}><LogoUploader label="Active Icon" fileName="App Icons - Chota Beta.png" size="158 KB" height="280px" /></div>
                  <div style={{ marginTop: '24px' }}><LogoUploader label="Background Image" fileName="website logo-Chota Beta.png" size="158 KB" height="280px" /></div>

                  <div style={{ marginTop: '24px', position: 'relative' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Font Color (Hex Code)
                    </label>
                    <input 
                      type="text"
                      value={settings.home_font_color}
                      onChange={(e) => updateSetting('home_font_color', e.target.value)}
                      placeholder="#000000"
                      style={{ width: '100%', height: '36px', backgroundColor: '#000', border: '1px solid #2d3748', borderRadius: '4px', padding: '0 12px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Select the font color for category text</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                onClick={handleSave}
                disabled={saving}
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: '6px', 
                  fontSize: '14px', 
                  fontWeight: "600", 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  transition: 'all 0.2s'
                }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : (
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                )}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
