import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Settings,
  Info,
  ShoppingCart,
  Wallet,
  Wrench,
  Terminal,
  ChevronDown,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';

interface SystemSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
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

export default function SystemSettings({ onLogout, onNavigate }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = useState('General');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State mapped to DB variables
  const [settings, setSettings] = useState({
    sys_app_name: 'Chota Beta | More Sellers. More Choices. Better Deals.',
    sys_timezone: 'India/Chennai',
    sys_copyright: '© 2026 Chota Beta | All Rights Reserved.',
    sys_currency: 'INR',
    sys_company_address: '',
    sys_seller_support_email: 'sellers@chotabeta.com',
    sys_seller_support_phone: '8886660031',
    sys_checkout_type: 'multi',
    sys_min_cart_amount: '199',
    sys_max_cart_items: '9999',
    sys_low_stock_limit: '10',
    sys_welcome_wallet_balance: '25',
    sys_seller_maintenance: false,
    sys_seller_maintenance_msg: '',
    sys_web_maintenance: false,
    sys_web_maintenance_msg: '',
    sys_demo_mode: false,
    sys_demo_admin_msg: '',
    sys_demo_seller_msg: '',
    sys_demo_customer_msg: '',
    sys_demo_customer_loc_msg: '',
    sys_demo_delivery_msg: ''
  });

  const menuItems = [
    { name: 'General', icon: Settings },
    { name: 'Support Information', icon: Info },
    { name: 'Cart & Inventory Settings', icon: ShoppingCart },
    { name: 'Wallet Settings', icon: Wallet },
    { name: 'Maintenance Mode', icon: Wrench },
    { name: 'Demo Mode', icon: Terminal },
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
          // Convert string booleans back to true booleans
          sys_seller_maintenance: d.sys_seller_maintenance === 'true',
          sys_web_maintenance: d.sys_web_maintenance === 'true',
          sys_demo_mode: d.sys_demo_mode === 'true',
        }));
      }
    } catch (err) {
      console.error("Error fetching system settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert boolean values to strings for consistent DB storage
      const payload = {
        ...settings,
        sys_seller_maintenance: String(settings.sys_seller_maintenance),
        sys_web_maintenance: String(settings.sys_web_maintenance),
        sys_demo_mode: String(settings.sys_demo_mode),
      };
      
      const res = await axios.post(`${BASE_URL}/api/settings`, payload);
      if (res.data.success) {
        alert('System Settings saved successfully!');
      }
    } catch (err) {
      console.error("Error saving system settings:", err);
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
          <p className="text-slate-400 font-medium">Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }} className="font-sans">
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>System Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>System Settings</span>
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
            
            {/* Conditional Rendering of Sections based on ActiveTab */}
            <div style={{ display: activeTab === 'General' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>General Settings</h3>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <FormField 
                    label="App Name" 
                    required 
                    value={settings.sys_app_name}
                    onChange={(e: any) => updateSetting('sys_app_name', e.target.value)}
                  />
                  
                  <FormField 
                    label="System Timezone" 
                    required 
                    value={settings.sys_timezone}
                    onChange={(e: any) => updateSetting('sys_timezone', e.target.value)}
                  />
                  
                  <FormField 
                    label="Copyright Details" 
                    required 
                    value={settings.sys_copyright}
                    onChange={(e: any) => updateSetting('sys_copyright', e.target.value)}
                  />

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Currency <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select 
                        value={settings.sys_currency}
                        onChange={(e) => updateSetting('sys_currency', e.target.value)}
                        style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                      >
                        <option value="INR">🇮🇳 INR - ₹</option>
                        <option value="USD">🇺🇸 USD - $</option>
                        <option value="EUR">🇪🇺 EUR - €</option>
                      </select>
                      <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Logo <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ height: '200px', backgroundColor: '#0c111d', border: '2px dashed #2d3748', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ color: '#64748b', fontSize: '12px', display: 'flex', position: 'absolute', top: '10px', left: '10px', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px' }}>logo-1772619897.png</span>
                          <span style={{ fontSize: '10px', opacity: 0.5 }}>150 KB</span>
                        </div>
                        <div style={{ width: '80%', height: '60%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ color: '#2d3748', fontSize: '24px', fontWeight: "400" }}>Logo Preview</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Favicon <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ height: '200px', backgroundColor: '#0c111d', border: '2px dashed #2d3748', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                         <div style={{ color: '#64748b', fontSize: '12px', display: 'flex', position: 'absolute', top: '10px', left: '10px', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px' }}>favicon-1772619897.png</span>
                          <span style={{ fontSize: '10px', opacity: 0.5 }}>50 KB</span>
                        </div>
                        <div style={{ width: '100px', height: '100px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ color: '#2d3748', fontSize: '12px', fontWeight: "400" }}>Favicon</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Company Address
                    </label>
                    <textarea 
                      value={settings.sys_company_address}
                      onChange={(e) => updateSetting('sys_company_address', e.target.value)}
                      placeholder="Enter company address shown on invoice"
                      style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '0px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Admin Signature (Authorized Signatory)
                    </label>
                    <div style={{ height: '150px', backgroundColor: '#0c111d', border: '2px dashed #2d3748', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ color: '#64748b', fontSize: '12px', display: 'flex', position: 'absolute', top: '10px', left: '10px', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px' }}>admin-signature-1774319897.png</span>
                        <span style={{ fontSize: '10px', opacity: 0.5 }}>120 KB</span>
                      </div>
                      <div style={{ width: '60%', height: '50%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ color: '#2d3748', fontSize: '18px', fontWeight: "400" }}>Signature Preview</span>
                      </div>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px' }}>Upload a signature image to display on invoices.</p>
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
                  <FormField 
                    label="Seller Support Email" 
                    value={settings.sys_seller_support_email} 
                    onChange={(e: any) => updateSetting('sys_seller_support_email', e.target.value)}
                  />
                  <FormField 
                    label="Seller Support Number" 
                    value={settings.sys_seller_support_phone} 
                    onChange={(e: any) => updateSetting('sys_seller_support_phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Cart & Inventory Settings' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Cart & Inventory Settings</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '12px' }}>
                      Select Checkout Type <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="checkoutType" 
                          checked={settings.sys_checkout_type === 'single'}
                          onChange={() => updateSetting('sys_checkout_type', 'single')}
                          style={{ cursor: 'pointer' }} 
                        /> Single Store
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="checkoutType" 
                          checked={settings.sys_checkout_type === 'multi'}
                          onChange={() => updateSetting('sys_checkout_type', 'multi')}
                          style={{ cursor: 'pointer' }} 
                        /> Multi Store
                      </label>
                    </div>
                  </div>

                  <FormField 
                    label="Minimum Cart Amount" 
                    required 
                    type="number"
                    value={settings.sys_min_cart_amount} 
                    onChange={(e: any) => updateSetting('sys_min_cart_amount', e.target.value)}
                  />
                  <FormField 
                    label="Maximum Items Allowed in Cart" 
                    required 
                    type="number"
                    value={settings.sys_max_cart_items} 
                    onChange={(e: any) => updateSetting('sys_max_cart_items', e.target.value)}
                  />
                  <FormField 
                    label="Low Stock Limit" 
                    required 
                    type="number"
                    value={settings.sys_low_stock_limit} 
                    onChange={(e: any) => updateSetting('sys_low_stock_limit', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Wallet Settings' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Wallet Settings</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <FormField 
                    label="Welcome Wallet Balance Amount" 
                    type="number"
                    value={settings.sys_welcome_wallet_balance} 
                    onChange={(e: any) => updateSetting('sys_welcome_wallet_balance', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Maintenance Mode' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Maintenance Mode</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Seller App Maintenance Mode</label>
                      <div 
                        onClick={() => updateSetting('sys_seller_maintenance', !settings.sys_seller_maintenance)}
                        style={{ width: '40px', height: '20px', backgroundColor: settings.sys_seller_maintenance ? '#007bff' : '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.sys_seller_maintenance ? '22px' : '2px', transition: 'all 0.3s' }}></div>
                      </div>
                    </div>
                    <FormField 
                      label="Seller App Maintenance Message" 
                      placeholder="Enter maintenance message" 
                      value={settings.sys_seller_maintenance_msg}
                      onChange={(e: any) => updateSetting('sys_seller_maintenance_msg', e.target.value)}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid #2d3748', paddingTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Web Maintenance Mode</label>
                      <div 
                        onClick={() => updateSetting('sys_web_maintenance', !settings.sys_web_maintenance)}
                        style={{ width: '40px', height: '20px', backgroundColor: settings.sys_web_maintenance ? '#007bff' : '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.sys_web_maintenance ? '22px' : '2px', transition: 'all 0.3s' }}></div>
                      </div>
                    </div>
                    <FormField 
                      label="Web Maintenance Message" 
                      placeholder="Enter maintenance message"
                      value={settings.sys_web_maintenance_msg}
                      onChange={(e: any) => updateSetting('sys_web_maintenance_msg', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === 'Demo Mode' ? 'block' : 'none' }}>
              <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Demo Mode</h3>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Enable Demo Mode</label>
                    <div 
                      onClick={() => updateSetting('sys_demo_mode', !settings.sys_demo_mode)}
                      style={{ width: '40px', height: '20px', backgroundColor: settings.sys_demo_mode ? '#007bff' : '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                      <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: settings.sys_demo_mode ? '22px' : '2px', transition: 'all 0.3s' }}></div>
                    </div>
                  </div>

                  <FormField 
                    label="Admin Demo Mode Message" 
                    placeholder="Shown to admins when demo mode is enabled" 
                    value={settings.sys_demo_admin_msg}
                    onChange={(e: any) => updateSetting('sys_demo_admin_msg', e.target.value)}
                  />
                  <FormField 
                    label="Seller Demo Mode Message" 
                    placeholder="Shown to sellers when demo mode is enabled" 
                    value={settings.sys_demo_seller_msg}
                    onChange={(e: any) => updateSetting('sys_demo_seller_msg', e.target.value)}
                  />
                  <FormField 
                    label="Customer Demo Mode Message" 
                    placeholder="Shown to customers when demo mode is enabled" 
                    value={settings.sys_demo_customer_msg}
                    onChange={(e: any) => updateSetting('sys_demo_customer_msg', e.target.value)}
                  />
                  <FormField 
                    label="Customer Location Demo Message" 
                    placeholder="Shown when customer location features are limited in demo mode" 
                    value={settings.sys_demo_customer_loc_msg}
                    onChange={(e: any) => updateSetting('sys_demo_customer_loc_msg', e.target.value)}
                  />
                  <FormField 
                    label="Delivery Partner Demo Mode Message" 
                    placeholder="Shown to delivery partners when demo mode is enabled" 
                    value={settings.sys_demo_delivery_msg}
                    onChange={(e: any) => updateSetting('sys_demo_delivery_msg', e.target.value)}
                  />
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
