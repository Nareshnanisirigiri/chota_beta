import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe,
  Settings,
  ChevronDown,
  Info,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  FileText,
  Code,
  MapPin,
  CheckCircle2,
  Share2,
  Search,
  Layout,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface WebSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

const FormField = ({ label, value, onChange, placeholder, required = false, type = "text", width = "100%" }: any) => (
  <div style={{ marginBottom: '20px', width }}>
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

const LogoUploader = ({ label, fileName, size, height = "120px", required = false }: any) => (
  <div style={{ flex: 1 }}>
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
         <span style={{ color: '#2d3748', fontSize: '16px', fontWeight: "400" }}>Logo Preview</span>
      </div>
    </div>
  </div>
);

export default function WebSettings({ onLogout, onNavigate }: WebSettingsProps) {
  const [activeTab, setActiveTab] = useState('General');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State mapped to DB variables
  const [settings, setSettings] = useState({
    web_site_name: 'Chota Beta - More Sellers. More Choices. Better Deals.',
    web_site_copyright: 'All Rights Reserved.',
    web_address: 'Hyderabad, Telangana',
    web_short_desc: 'More Sellers. More Choices. Better Deals.',
    web_lat: '17.4300933',
    web_lng: '78.4512141',
    web_country_validation: false,
    web_allowed_countries: '',
    web_meta_keywords: '',
    web_meta_description: '',
    web_support_email: 'info@chotabeta.com',
    web_support_phone: '8886660031',
    web_google_map_key: 'AIzaSyAtUbjynFZTIWEnfN-4olvSqYQzvILrkjM',
    web_map_iframe: '',
    web_facebook: '',
    web_instagram: '',
    web_x: '',
    web_youtube: '',
    web_app_section_title: '',
    web_app_section_tagline: '',
    web_play_store_link: '',
    web_app_store_link: '',
    web_app_section_desc: '',
    web_ship_feat: '',
    web_ship_feat_title: '',
    web_ship_feat_desc: '',
    web_ret_feat: '',
    web_ret_feat_title: '',
    web_ret_feat_desc: '',
    web_safe_feat: '',
    web_safe_feat_title: '',
    web_safe_feat_desc: '',
    web_sup_feat: '',
    web_sup_feat_title: '',
    web_sup_feat_desc: '',
    web_return_policy: '',
    web_shipping_policy: '',
    web_privacy_policy: '',
    web_terms_conditions: '',
    web_about_us: '',
    web_pwa_name: 'Chota Beta',
    web_pwa_desc: 'Chota Beta PWA',
    web_header_script: '',
    web_footer_script: ''
  });

  const menuItems = [
    { name: 'General', icon: Settings },
    { name: 'Default Location', icon: MapPin },
    { name: 'Country Validation', icon: CheckCircle2 },
    { name: 'Support Information', icon: Info },
    { name: 'SEO Settings', icon: Search },
    { name: 'Social Media', icon: Share2 },
    { name: 'App Download Section', icon: Smartphone },
    { name: 'Feature Sections', icon: Layout },
    { name: 'Policy Settings', icon: ShieldCheck },
    { name: 'PWA Manifest Settings', icon: Smartphone },
    { name: 'Scripts', icon: Code },
  ];

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
          web_country_validation: d.web_country_validation === 'true'
        }));
      }
    } catch (err) {
      console.error("Error fetching web settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        web_country_validation: String(settings.web_country_validation)
      };
      const res = await axios.post(`${BASE_URL}/api/settings`, payload);
      if (res.data.success) {
        alert('Web Settings saved successfully!');
      }
    } catch (err) {
      console.error("Error saving web settings:", err);
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
          <p className="text-slate-400 font-medium">Loading web settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }} className="font-sans">
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Web Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Web Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {menuItems.map((item) => (
                <div 
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
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

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            
            <div style={{ display: activeTab === 'General' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>General</h3>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <FormField label="Site Name" required value={settings.web_site_name} onChange={(e: any) => updateSetting('web_site_name', e.target.value)} />
                  <FormField label="Site Copyright" required value={settings.web_site_copyright} onChange={(e: any) => updateSetting('web_site_copyright', e.target.value)} />
                  <FormField label="Address" required value={settings.web_address} onChange={(e: any) => updateSetting('web_address', e.target.value)} />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Short Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea 
                      value={settings.web_short_desc}
                      onChange={(e) => updateSetting('web_short_desc', e.target.value)}
                      style={{ width: '100%', height: '80px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap' }}>
                    <LogoUploader label="Site Header Logo" fileName="site-header-logo.png" size="158 KB" required />
                    <LogoUploader label="Site Header dark mode Logo" fileName="site-header-dark-logo.png" size="158 KB" required />
                    <LogoUploader label="Site Footer Logo" fileName="site-footer-logo.png" size="158 KB" required />
                    <LogoUploader label="Site Favicon" fileName="site-favicon.png" size="92 KB" height="240px" required />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Default Location' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Default Location</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '12px' }}>
                    Default Location <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  
                  <div style={{ width: '100%', height: '400px', backgroundColor: '#0c111d', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '1px solid #2d3748', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundColor: '#1c2438', backgroundImage: 'radial-gradient(#2d3748 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input type="text" placeholder="search location" style={{ width: '280px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '10px 12px 10px 36px', fontSize: '13px', color: 'white', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ zIndex: 5, textAlign: 'center' }}>
                      <p style={{ color: 'white', fontSize: '18px', fontWeight: "400", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Use ctrl + scroll to zoom the map</p>
                    </div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 10 }}>
                      <MapPin size={32} color="#ef4444" fill="#ef4444" style={{ strokeWidth: 1 }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px' }}>
                    <FormField label="Latitude" required value={settings.web_lat} onChange={(e: any) => updateSetting('web_lat', e.target.value)} width="50%" />
                    <FormField label="Longitude" required value={settings.web_lng} onChange={(e: any) => updateSetting('web_lng', e.target.value)} width="50%" />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Country Validation' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Country Validation</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Enable Country Validation</label>
                    <div 
                      onClick={() => updateSetting('web_country_validation', !settings.web_country_validation)}
                      style={{ width: '40px', height: '20px', backgroundColor: settings.web_country_validation ? '#007bff' : '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                      <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.web_country_validation ? '22px' : '2px', transition: 'all 0.3s' }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Allowed Countries <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={settings.web_allowed_countries}
                        onChange={(e) => updateSetting('web_allowed_countries', e.target.value)}
                        style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#64748b', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="">Search for a country</option>
                        <option value="IN">India</option>
                        <option value="US">USA</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Support Information' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Support Information</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="Support Email" required value={settings.web_support_email} onChange={(e: any) => updateSetting('web_support_email', e.target.value)} />
                  <FormField label="Support Number" required value={settings.web_support_phone} onChange={(e: any) => updateSetting('web_support_phone', e.target.value)} />
                  <FormField label="Google Map Key" value={settings.web_google_map_key} onChange={(e: any) => updateSetting('web_google_map_key', e.target.value)} />
                  
                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Map Iframe
                    </label>
                    <textarea 
                      value={settings.web_map_iframe}
                      onChange={(e) => updateSetting('web_map_iframe', e.target.value)}
                      placeholder="Enter map iframe code"
                      style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'SEO Settings' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>SEO Settings</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="Meta Keywords" placeholder="Enter meta keywords" value={settings.web_meta_keywords} onChange={(e: any) => updateSetting('web_meta_keywords', e.target.value)} />
                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Meta Description
                    </label>
                    <textarea 
                      value={settings.web_meta_description}
                      onChange={(e) => updateSetting('web_meta_description', e.target.value)}
                      placeholder="Enter meta description"
                      style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Social Media' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Social Media</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="Facebook Link" placeholder="Enter Facebook link" value={settings.web_facebook} onChange={(e: any) => updateSetting('web_facebook', e.target.value)} />
                  <FormField label="Instagram Link" placeholder="Enter Instagram link" value={settings.web_instagram} onChange={(e: any) => updateSetting('web_instagram', e.target.value)} />
                  <FormField label="X Link" placeholder="Enter X link" value={settings.web_x} onChange={(e: any) => updateSetting('web_x', e.target.value)} />
                  <FormField label="YouTube Link" placeholder="Enter YouTube link" value={settings.web_youtube} onChange={(e: any) => updateSetting('web_youtube', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'App Download Section' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>App Download Section</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="App Section Title" placeholder="Enter title" value={settings.web_app_section_title} onChange={(e: any) => updateSetting('web_app_section_title', e.target.value)} />
                  <FormField label="App Section Tagline" placeholder="Enter tagline" value={settings.web_app_section_tagline} onChange={(e: any) => updateSetting('web_app_section_tagline', e.target.value)} />
                  <FormField label="Play Store Link" placeholder="Enter Play Store link" value={settings.web_play_store_link} onChange={(e: any) => updateSetting('web_play_store_link', e.target.value)} />
                  <FormField label="App Store Link" placeholder="Enter App Store link" value={settings.web_app_store_link} onChange={(e: any) => updateSetting('web_app_store_link', e.target.value)} />
                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      App Section Short Description
                    </label>
                    <textarea 
                      value={settings.web_app_section_desc}
                      onChange={(e) => updateSetting('web_app_section_desc', e.target.value)}
                      style={{ width: '100%', height: '80px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Feature Sections' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Feature Sections</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="Shipping Feature Section" value={settings.web_ship_feat} onChange={(e: any) => updateSetting('web_ship_feat', e.target.value)} />
                  <FormField label="Shipping Feature Section Title" value={settings.web_ship_feat_title} onChange={(e: any) => updateSetting('web_ship_feat_title', e.target.value)} />
                  <textarea value={settings.web_ship_feat_desc} onChange={(e) => updateSetting('web_ship_feat_desc', e.target.value)} style={{ width: '100%', height: '60px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white', outline: 'none', marginBottom: '24px' }} />

                  <FormField label="Return Feature Section" value={settings.web_ret_feat} onChange={(e: any) => updateSetting('web_ret_feat', e.target.value)} />
                  <FormField label="Return Feature Section Title" value={settings.web_ret_feat_title} onChange={(e: any) => updateSetting('web_ret_feat_title', e.target.value)} />
                  <textarea value={settings.web_ret_feat_desc} onChange={(e) => updateSetting('web_ret_feat_desc', e.target.value)} style={{ width: '100%', height: '60px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white', outline: 'none', marginBottom: '24px' }} />

                  <FormField label="Safety & Security Feature Section" value={settings.web_safe_feat} onChange={(e: any) => updateSetting('web_safe_feat', e.target.value)} />
                  <FormField label="Safety & Security Feature Section Title" value={settings.web_safe_feat_title} onChange={(e: any) => updateSetting('web_safe_feat_title', e.target.value)} />
                  <textarea value={settings.web_safe_feat_desc} onChange={(e) => updateSetting('web_safe_feat_desc', e.target.value)} style={{ width: '100%', height: '60px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white', outline: 'none', marginBottom: '24px' }} />

                  <FormField label="Support Feature Section" value={settings.web_sup_feat} onChange={(e: any) => updateSetting('web_sup_feat', e.target.value)} />
                  <FormField label="Support Feature Section Title" value={settings.web_sup_feat_title} onChange={(e: any) => updateSetting('web_sup_feat_title', e.target.value)} />
                  <textarea value={settings.web_sup_feat_desc} onChange={(e) => updateSetting('web_sup_feat_desc', e.target.value)} style={{ width: '100%', height: '60px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white', outline: 'none', marginBottom: '0' }} />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Policy Settings' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Policy Settings</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Return & Refund Policy</label>
                    <textarea value={settings.web_return_policy} onChange={(e) => updateSetting('web_return_policy', e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white' }} />
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Shipping & Delivery Policy</label>
                    <textarea value={settings.web_shipping_policy} onChange={(e) => updateSetting('web_shipping_policy', e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white' }} />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Privacy Policy</label>
                    <textarea value={settings.web_privacy_policy} onChange={(e) => updateSetting('web_privacy_policy', e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white' }} />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Terms & Conditions</label>
                    <textarea value={settings.web_terms_conditions} onChange={(e) => updateSetting('web_terms_conditions', e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white' }} />
                  </div>

                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ color: 'white', fontSize: '13px', display: 'block', marginBottom: '8px' }}>About Us</label>
                    <textarea value={settings.web_about_us} onChange={(e) => updateSetting('web_about_us', e.target.value)} style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px', fontSize: '13px', color: 'white' }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'PWA Manifest Settings' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>PWA Manifest Settings</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField label="PWA Name" required value={settings.web_pwa_name} onChange={(e: any) => updateSetting('web_pwa_name', e.target.value)} />
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      PWA Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea 
                      value={settings.web_pwa_desc}
                      onChange={(e) => updateSetting('web_pwa_desc', e.target.value)}
                      style={{ width: '100%', height: '80px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Scripts' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Scripts</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Header Script
                    </label>
                    <textarea 
                      value={settings.web_header_script}
                      onChange={(e) => updateSetting('web_header_script', e.target.value)}
                      style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#00ff00', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Footer Script
                    </label>
                    <textarea 
                      value={settings.web_footer_script}
                      onChange={(e) => updateSetting('web_footer_script', e.target.value)}
                      style={{ width: '100%', height: '150px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#00ff00', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>
                </div>
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
