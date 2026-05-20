import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Smartphone,
  Key,
  Flame,
  UserPlus,
  ChevronDown,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface AuthenticationSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const FormField = ({ label, value, onChange, placeholder, required = false, type = "text" }: any) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input 
      type={type} 
      value={value}
      onChange={onChange}
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

const ToggleField = ({ label, enabled, onToggle }: { label: string; enabled: boolean, onToggle?: () => void }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>{label}</label>
    <div 
      onClick={onToggle}
      style={{ 
        width: '40px', 
        height: '20px', 
        backgroundColor: enabled ? '#007bff' : '#2d3748', 
        borderRadius: '10px', 
        position: 'relative', 
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ 
        width: '16px', 
        height: '16px', 
        backgroundColor: 'white', 
        borderRadius: '50%', 
        position: 'absolute', 
        top: '2px', 
        left: enabled ? '22px' : '2px',
        transition: 'all 0.3s'
      }}></div>
    </div>
  </div>
);

export default function AuthenticationSettings({ onLogout, onNavigate, currentPage }: AuthenticationSettingsProps) {
  const [activeTab, setActiveTab] = useState('Custom SMS');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    auth_custom_sms_enabled: true,
    auth_custom_sms_url: '',
    auth_custom_sms_method: 'GET',
    auth_custom_sms_token: '',
    auth_custom_sms_auth_token: '',
    auth_custom_sms_format_data: '',
    auth_google_recaptcha_site_key: '',
    auth_google_api_key: 'AIzaSyAtUbjynFZTIWEnfN-4olvSqYQzvILrkjM',
    auth_firebase_enabled: true,
    auth_firebase_api_key: 'AIzaSyCnVjgVEerONZ-Ak1muSOeG3uFB61yOsm4',
    auth_firebase_auth_domain: 'chota-beta-customer.firebaseapp.com',
    auth_firebase_database_url: 'https://chota-beta-customer-default-rtdb.firebaseio.com/',
    auth_firebase_project_id: 'chota-beta-customer',
    auth_firebase_storage_bucket: 'chota-beta-customer.firebasestorage.app',
    auth_firebase_messaging_sender_id: '569340863234',
    auth_firebase_app_id: '1:569340863234:web:cea68b4607a2104fe9581b',
    auth_firebase_measurement_id: '1:569340863234:web:cea68b4607a2104fe9581b',
    auth_social_apple_enabled: true,
    auth_social_google_enabled: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/settings`);
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setSettings(prev => ({
          ...prev,
          ...d,
          auth_custom_sms_enabled: d.auth_custom_sms_enabled === 'true' || d.auth_custom_sms_enabled === true,
          auth_firebase_enabled: d.auth_firebase_enabled === 'true' || d.auth_firebase_enabled === true,
          auth_social_apple_enabled: d.auth_social_apple_enabled === 'true' || d.auth_social_apple_enabled === true,
          auth_social_google_enabled: d.auth_social_google_enabled === 'true' || d.auth_social_google_enabled === true,
        }));
      }
    } catch (err) {
      console.error("Error fetching authentication settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        auth_custom_sms_enabled: String(settings.auth_custom_sms_enabled),
        auth_firebase_enabled: String(settings.auth_firebase_enabled),
        auth_social_apple_enabled: String(settings.auth_social_apple_enabled),
        auth_social_google_enabled: String(settings.auth_social_google_enabled),
      };
      const res = await axios.post(`${BASE_URL}/api/settings`, payload);
      if (res.data.success) {
        alert('Authentication Settings saved successfully!');
      }
    } catch (err) {
      console.error("Error saving authentication settings:", err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (currentPage) {
      const tabMap: Record<string, string> = {
        'google-keys': 'Google Keys',
        'firebase': 'Firebase',
        'social-login': 'Social Login',
        'custom-sms': 'Custom SMS'
      };
      const foundTab = tabMap[currentPage];
      if (foundTab) {
        scrollToSection(foundTab);
      }
    }
  }, [currentPage]);

  const scrollToSection = (sectionName: string) => {
    setActiveTab(sectionName);
    const element = document.getElementById(sectionName.toLowerCase().replace(/\s+/g, '-'));
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { name: 'Custom SMS', icon: Smartphone },
    { name: 'Google Keys', icon: Key },
    { name: 'Firebase', icon: Flame },
    { name: 'Social Login', icon: UserPlus },
  ];

  if (loading) {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen flex items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
          <p className="text-slate-400 font-medium">Loading auth settings...</p>
        </div>
      </div>
    );
  }

  const AddButton = ({ label }: { label: string }) => (
    <button style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      backgroundColor: '#007bff', 
      color: 'white', 
      border: 'none', 
      padding: '8px 16px', 
      borderRadius: '4px', 
      fontSize: '13px', 
      fontWeight: "400", 
      cursor: 'pointer',
      marginTop: '8px',
      marginBottom: '16px'
    }}>
      <span style={{ fontSize: '18px', fontWeight: 'normal' }}>+</span> {label}
    </button>
  );

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }} className="font-sans">
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Authentication Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Authentication Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '32px' }}>
              <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                  <div 
                    key={item.name}
                    onClick={() => scrollToSection(item.name)}
                    style={{ 
                      padding: '12px 16px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      color: activeTab === item.name ? '#007bff' : '#64748b', 
                      backgroundColor: activeTab === item.name ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            {/* Custom SMS Section */}
            <div id="custom-sms" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Custom SMS</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField 
                  label="Enable Custom SMS" 
                  enabled={settings.auth_custom_sms_enabled} 
                  onToggle={() => updateSetting('auth_custom_sms_enabled', !settings.auth_custom_sms_enabled)} 
                />
                
                {settings.auth_custom_sms_enabled && (
                  <div style={{ marginTop: '20px' }}>
                    <FormField label="Custom SMS URL" required value={settings.auth_custom_sms_url} onChange={(e: any) => updateSetting('auth_custom_sms_url', e.target.value)} placeholder="Enter custom SMS URL" />
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Custom SMS Method <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select 
                          value={settings.auth_custom_sms_method}
                          onChange={(e) => updateSetting('auth_custom_sms_method', e.target.value)}
                          style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#64748b', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                      </div>
                    </div>
                    <FormField label="Custom SMS Token Account SID" required value={settings.auth_custom_sms_token} onChange={(e: any) => updateSetting('auth_custom_sms_token', e.target.value)} placeholder="Enter token account SID" />
                    <FormField label="Custom SMS Auth Token" required value={settings.auth_custom_sms_auth_token} onChange={(e: any) => updateSetting('auth_custom_sms_auth_token', e.target.value)} placeholder="Enter auth token" />
                    <FormField label="Custom SMS Text Format Data" required value={settings.auth_custom_sms_format_data} onChange={(e: any) => updateSetting('auth_custom_sms_format_data', e.target.value)} placeholder="Enter text format data" />
                    
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Custom SMS Header <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <AddButton label="Add Header" />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Custom SMS Parameters <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <AddButton label="Add Parameter" />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Custom SMS Body <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <AddButton label="Add Body" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Keys Section */}
            <div id="google-keys" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Google reCAPTCHA</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Google reCAPTCHA Site Key" value={settings.auth_google_recaptcha_site_key} onChange={(e: any) => updateSetting('auth_google_recaptcha_site_key', e.target.value)} placeholder="Enter reCAPTCHA site key" />
                <FormField label="Google API Key" value={settings.auth_google_api_key} onChange={(e: any) => updateSetting('auth_google_api_key', e.target.value)} />
              </div>
            </div>

            {/* Firebase Section */}
            <div id="firebase" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Firebase</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField 
                  label="Enable Firebase" 
                  enabled={settings.auth_firebase_enabled} 
                  onToggle={() => updateSetting('auth_firebase_enabled', !settings.auth_firebase_enabled)} 
                />
                <FormField label="Firebase API Key" required value={settings.auth_firebase_api_key} onChange={(e: any) => updateSetting('auth_firebase_api_key', e.target.value)} />
                <FormField label="Firebase Auth Domain" required value={settings.auth_firebase_auth_domain} onChange={(e: any) => updateSetting('auth_firebase_auth_domain', e.target.value)} />
                <FormField label="Firebase Database URL" required value={settings.auth_firebase_database_url} onChange={(e: any) => updateSetting('auth_firebase_database_url', e.target.value)} />
                <FormField label="Firebase Project ID" required value={settings.auth_firebase_project_id} onChange={(e: any) => updateSetting('auth_firebase_project_id', e.target.value)} />
                <FormField label="Firebase Storage Bucket" required value={settings.auth_firebase_storage_bucket} onChange={(e: any) => updateSetting('auth_firebase_storage_bucket', e.target.value)} />
                <FormField label="Firebase Messaging Sender ID" required value={settings.auth_firebase_messaging_sender_id} onChange={(e: any) => updateSetting('auth_firebase_messaging_sender_id', e.target.value)} />
                <FormField label="Firebase App ID" required value={settings.auth_firebase_app_id} onChange={(e: any) => updateSetting('auth_firebase_app_id', e.target.value)} />
                <FormField label="Firebase Measurement ID" required value={settings.auth_firebase_measurement_id} onChange={(e: any) => updateSetting('auth_firebase_measurement_id', e.target.value)} />
              </div>
            </div>

            {/* Social Login Section */}
            <div id="social-login" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Social Login</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField 
                  label="Enable Apple Login" 
                  enabled={settings.auth_social_apple_enabled} 
                  onToggle={() => updateSetting('auth_social_apple_enabled', !settings.auth_social_apple_enabled)} 
                />
                <ToggleField 
                  label="Enable Google Login" 
                  enabled={settings.auth_social_google_enabled} 
                  onToggle={() => updateSetting('auth_social_google_enabled', !settings.auth_social_google_enabled)} 
                />
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', marginBottom: '64px' }}>
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
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? 'Saving...' : 'Submit All Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
