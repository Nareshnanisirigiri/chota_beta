import React from 'react';
import {
  Settings,
  ShieldCheck,
  ChevronDown,
  Info,
  ShoppingCart,
  Wallet,
  Wrench,
  Terminal,
} from 'lucide-react';
import Navbar from '../Navbar';

interface SystemSettingsProps {
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

export default function SystemSettings({ onLogout, onNavigate }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('General');

  const menuItems = [
    { name: 'General', icon: Settings },
    { name: 'Support Information', icon: Info },
    { name: 'Cart & Inventory Settings', icon: ShoppingCart },
    { name: 'Wallet Settings', icon: Wallet },
    { name: 'Maintenance Mode', icon: Wrench },
    { name: 'Demo Mode', icon: Terminal },
  ];

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
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
                    transition: 'all 0.2s'
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>General</h3>
              </div>
              
              <div style={{ padding: '24px' }}>
                <FormField 
                  label="App Name" 
                  required 
                  value="Chota Beta | More Sellers. More Choices. Better Deals." 
                />
                
                <FormField 
                  label="System Timezone" 
                  required 
                  value="India/Chennai" 
                />
                
                <FormField 
                  label="Copyright Details" 
                  required 
                  value="© 2026 Chota Beta | All Rights Reserved." 
                />

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Currency <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option>🇮🇳 INR - ₹</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                      Logo <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ 
                      height: '200px', 
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
                    <div style={{ 
                      height: '200px', 
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
                    placeholder="Enter company address shown on invoice"
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      backgroundColor: '#0c111d', 
                      border: '1px solid #2d3748', 
                      borderRadius: '4px', 
                      padding: '12px 16px', 
                      fontSize: '13px', 
                      color: 'white', 
                      outline: 'none', 
                      boxSizing: 'border-box',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Admin Signature (Authorized Signatory)
                  </label>
                  <div style={{ 
                    height: '150px', 
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

            {/* Support Information Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Support Information</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Seller Support Email" value="sellers@chotabeta.com" />
                <FormField label="Seller Support Number" value="8886660031" />
              </div>
            </div>

            {/* Cart & Inventory Settings Section */}
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
                      <input type="radio" name="checkoutType" style={{ cursor: 'pointer' }} /> Single Store
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                      <input type="radio" name="checkoutType" defaultChecked style={{ cursor: 'pointer' }} /> Multi Store
                    </label>
                  </div>
                </div>

                <FormField label="Minimum Cart Amount" required value="199" />
                <FormField label="Maximum Items Allowed in Cart" required value="9999" />
                <FormField label="Low Stock Limit" required value="10" />
              </div>
            </div>

            {/* Wallet Settings Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Wallet Settings</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Welcome Wallet Balance Amount" value="25" />
              </div>
            </div>

            {/* Maintenance Mode Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Maintenance Mode</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Seller App Maintenance Mode</label>
                    <div style={{ width: '40px', height: '20px', backgroundColor: '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                    </div>
                  </div>
                  <FormField label="Seller App Maintenance Message" placeholder="Enter maintenance message" />
                </div>

                <div style={{ borderTop: '1px solid #2d3748', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Web Maintenance Mode</label>
                    <div style={{ width: '40px', height: '20px', backgroundColor: '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                      <div style={{ width: '16px', height: '16px', backgroundColor: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                    </div>
                  </div>
                  <FormField label="Web Maintenance Message" placeholder="Enter maintenance message" />
                </div>
              </div>
            </div>

            {/* Demo Mode Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Demo Mode</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Enable Demo Mode</label>
                  <div style={{ width: '40px', height: '20px', backgroundColor: '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                  </div>
                </div>

                <FormField label="Admin Demo Mode Message" placeholder="Shown to admins when demo mode is enabled" />
                <FormField label="Seller Demo Mode Message" placeholder="Shown to sellers when demo mode is enabled" />
                <FormField label="Customer Demo Mode Message" placeholder="Shown to customers when demo mode is enabled" />
                <FormField label="Customer Location Demo Message" placeholder="Shown when customer location features are limited in demo mode" />
                <FormField label="Delivery Partner Demo Mode Message" placeholder="Shown to delivery partners when demo mode is enabled" />
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
