import React from 'react';
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
  RefreshCcw
} from 'lucide-react';
import Navbar from '../Navbar';

interface WebSettingsProps {
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
  const [activeTab, setActiveTab] = React.useState('General');

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

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
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
              
              {/* ... (Existing General Content) ... */}
              <div style={{ padding: '24px' }}>
                <FormField label="Site Name" required value="Chota Beta - More Sellers. More Choices. Better Deals." />
                <FormField label="Site Copyright" required value="All Rights Reserved." />
                <FormField label="Address" required value="Hyderabad, Telangana" />

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Short Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea 
                    defaultValue="More Sellers. More Choices. Better Deals."
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'nowrap' }}>
                  <LogoUploader 
                    label="Site Header Logo" 
                    fileName="site-header-logo-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                  <LogoUploader 
                    label="Site Header dark mode Logo" 
                    fileName="site-header-dark-logo-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                  <LogoUploader 
                    label="Site Footer Logo" 
                    fileName="site-footer-logo-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                  <LogoUploader 
                    label="Site Favicon" 
                    fileName="site-favicon-1773489735.png" 
                    size="92 KB" 
                    height="240px"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Default Location Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Default Location</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '12px' }}>
                  Default Location <span style={{ color: '#ef4444' }}>*</span>
                </label>
                
                <div style={{ 
                  width: '100%', 
                  height: '400px', 
                  backgroundColor: '#0c111d', 
                  borderRadius: '8px', 
                  position: 'relative', 
                  overflow: 'hidden',
                  border: '1px solid #2d3748',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Mock Map Background */}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundColor: '#1c2438', backgroundImage: 'radial-gradient(#2d3748 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Map Search Bar */}
                  <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input 
                        type="text" 
                        placeholder="search location" 
                        style={{ width: '280px', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '10px 12px 10px 36px', fontSize: '13px', color: 'white', outline: 'none' }} 
                      />
                    </div>
                  </div>

                  {/* Zoom Hint */}
                  <div style={{ zIndex: 5, textAlign: 'center' }}>
                    <p style={{ color: 'white', fontSize: '18px', fontWeight: "400", textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Use ctrl + scroll to zoom the map</p>
                  </div>

                  {/* Marker Placeholder */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 10 }}>
                    <MapPin size={32} color="#ef4444" fill="#ef4444" style={{ strokeWidth: 1 }} />
                  </div>
                  
                  {/* Map Controls Mock */}
                  <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ width: '32px', height: '32px', backgroundColor: '#1a2233', borderRadius: '4px', border: '1px solid #2d3748', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                       <Layout size={16} />
                     </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                  <FormField label="Latitude" required value="17.4300933" width="50%" />
                  <FormField label="Longitude" required value="78.4512141" width="50%" />
                </div>
              </div>
            </div>

            {/* Country Validation Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Country Validation</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Enable Country Validation</label>
                  <div style={{ width: '40px', height: '20px', backgroundColor: '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Allowed Countries <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#64748b', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option>Search for a country</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* SEO Settings Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>SEO Settings</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Meta Keywords" placeholder="Enter meta keywords" />
                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Meta Description
                  </label>
                  <textarea 
                    placeholder="Enter meta description"
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
              </div>
            </div>

            {/* Support Information (Web) Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Support Information</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Support Email" required value="info@chotabeta.com" />
                <FormField label="Support Number" required value="8886660031" />
                <FormField label="Google Map Key" value="AIzaSyAtUbjynFZTIWEnfN-4olvSqYQzvILrkjM" />
                
                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Map Iframe
                  </label>
                  <textarea 
                    placeholder="Enter map iframe code"
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
              </div>
            </div>
            {/* Social Media Section */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Social Media</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Facebook Link" placeholder="Enter Facebook link" />
                <FormField label="Instagram Link" placeholder="Enter Instagram link" />
                <FormField label="X Link" placeholder="Enter X link" />
                <FormField label="YouTube Link" placeholder="Enter YouTube link" />
              </div>
            </div>
            {/* App Download Section Block */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>App Download Section</h3>
                <div style={{ width: '40px', height: '20px', backgroundColor: '#2d3748', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="App Section Title" placeholder="Enter app section title" />
                <FormField label="App Section Tagline" placeholder="Enter app section tagline" />
                <FormField label="Play Store Link" placeholder="Enter Play Store link" />
                <FormField label="App Store Link" placeholder="Enter App Store link" />
                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    App Section Short Description
                  </label>
                  <textarea 
                    placeholder="Enter app section short description"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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
              </div>
            </div>

            {/* Feature Sections Block */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Feature Sections</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Shipping Feature Section" placeholder="Enter shipping feature section" />
                <FormField label="Shipping Feature Section Title" placeholder="Enter shipping feature section title" />
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Shipping Feature Section Description
                  </label>
                  <textarea 
                    placeholder="Enter shipping feature section description"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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

                <FormField label="Return Feature Section" placeholder="Enter return feature section" />
                <FormField label="Return Feature Section Title" placeholder="Enter return feature section title" />
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Return Feature Section Description
                  </label>
                  <textarea 
                    placeholder="Enter return feature section description"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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

                <FormField label="Safety & Security Feature Section" placeholder="Enter safety & security feature section" />
                <FormField label="Safety & Security Feature Section Title" placeholder="Enter safety & security feature section title" />
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Safety & Security Feature Section Description
                  </label>
                  <textarea 
                    placeholder="Enter safety & security feature section description"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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

                <FormField label="Support Feature Section" placeholder="Enter support feature section" />
                <FormField label="Support Feature Section Title" placeholder="Enter support feature section title" />
                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Support Feature Section Description
                  </label>
                  <textarea 
                    placeholder="Enter support feature section description"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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
              </div>
            </div>
            {/* Policy Settings Block */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Policy Settings</h3>
              </div>
              <div style={{ padding: '24px' }}>
                
                {/* Return & Refund Policy */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Return & Refund Policy</label>
                    <RefreshCcw size={14} style={{ color: '#007bff', cursor: 'pointer' }} />
                  </div>
                  
                  {/* Mock Editor UI */}
                  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ backgroundColor: '#0c111d', padding: '8px', borderBottom: '1px solid #2d3748', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BA;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BB;</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontWeight: "400", fontSize: '12px' }}>B</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontStyle: 'italic', fontSize: '12px' }}>I</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', textDecoration: 'underline', fontSize: '12px' }}>U</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2261;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2262;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2263;</button>
                      </div>
                    </div>
                    {/* Content Area */}
                    <div style={{ backgroundColor: 'white', padding: '24px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                      <h2 style={{ color: '#000', margin: '0 0 16px 0', fontSize: '20px' }}>Return & Refund Policy</h2>
                      <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        Welcome to <strong>Chota Beta – More Sellers. More Choices. Better Deals.</strong><br/>
                        This Return & Refund Policy outlines the conditions under which returns, replacements, and refunds are handled on the Chota Beta marketplace.
                      </p>
                      <h3 style={{ color: '#000', margin: '24px 0 16px 0', fontSize: '18px' }}>1. Return Eligibility</h3>
                      <p style={{ color: '#333', fontSize: '14px', margin: '0 0 12px 0' }}>Customers may request a return under the following circumstances:</p>
                      <ul style={{ color: '#333', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                        <li>The product received is <strong>damaged or defective</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Shipping Policy */}
                <div style={{ marginBottom: '0px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Shipping Policy</label>
                    <RefreshCcw size={14} style={{ color: '#007bff', cursor: 'pointer' }} />
                  </div>
                  
                  {/* Mock Editor UI */}
                  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ backgroundColor: '#0c111d', padding: '8px', borderBottom: '1px solid #2d3748', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BA;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BB;</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontWeight: "400", fontSize: '12px' }}>B</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontStyle: 'italic', fontSize: '12px' }}>I</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', textDecoration: 'underline', fontSize: '12px' }}>U</button>
                      </div>
                    </div>
                    {/* Content Area */}
                    <div style={{ backgroundColor: 'white', padding: '24px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                      <h2 style={{ color: '#000', margin: '0 0 16px 0', fontSize: '20px' }}>Shipping & Delivery Policy</h2>
                      <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        Welcome to <strong>Chota Beta – More Sellers. More Choices. Better Deals.</strong><br/>
                        This Shipping & Delivery Policy explains how orders are processed and delivered through the Chota Beta marketplace.
                      </p>
                      <h3 style={{ color: '#000', margin: '24px 0 16px 0', fontSize: '18px' }}>1. Order Processing</h3>
                      <p style={{ color: '#333', fontSize: '14px', margin: '0 0 12px 0' }}>Once an order is placed on the Chota Beta platform:</p>
                      <ul style={{ color: '#333', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                        <li>Orders are reviewed and confirmed by the seller.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Privacy Policy</label>
                    <RefreshCcw size={14} style={{ color: '#007bff', cursor: 'pointer' }} />
                  </div>
                  
                  {/* Mock Editor UI */}
                  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ backgroundColor: '#0c111d', padding: '8px', borderBottom: '1px solid #2d3748', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BA;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BB;</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontWeight: "400", fontSize: '12px' }}>B</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontStyle: 'italic', fontSize: '12px' }}>I</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', textDecoration: 'underline', fontSize: '12px' }}>U</button>
                      </div>
                    </div>
                    {/* Content Area */}
                    <div style={{ backgroundColor: 'white', padding: '24px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                      <h2 style={{ color: '#000', margin: '0 0 16px 0', fontSize: '20px' }}>Privacy Policy</h2>
                      <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        Welcome to <strong>Chota Beta</strong>. Your privacy is important to us.
                      </p>
                      <h3 style={{ color: '#000', margin: '24px 0 16px 0', fontSize: '18px' }}>1. Information We Collect</h3>
                      <p style={{ color: '#333', fontSize: '14px', margin: '0 0 12px 0' }}>When you use Chota Beta, we may collect the following types of information:</p>
                      <ul style={{ color: '#333', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Personal Information:</strong> Full name, contact details, and location.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div style={{ marginBottom: '0px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Terms & Conditions</label>
                    <RefreshCcw size={14} style={{ color: '#007bff', cursor: 'pointer' }} />
                  </div>
                  
                  {/* Mock Editor UI */}
                  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ backgroundColor: '#0c111d', padding: '8px', borderBottom: '1px solid #2d3748', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BA;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BB;</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontWeight: "400", fontSize: '12px' }}>B</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontStyle: 'italic', fontSize: '12px' }}>I</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', textDecoration: 'underline', fontSize: '12px' }}>U</button>
                      </div>
                    </div>
                    {/* Content Area */}
                    <div style={{ backgroundColor: 'white', padding: '24px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                      <h2 style={{ color: '#000', margin: '0 0 16px 0', fontSize: '20px' }}>Terms & Conditions</h2>
                      <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        Welcome to <strong>Chota Beta – More Sellers. More Choices. Better Deals.</strong><br/>
                        By accessing or using our website, services, or marketplace platform, you agree to comply with and be bound by the following Terms & Conditions.
                      </p>
                      <h3 style={{ color: '#000', margin: '24px 0 16px 0', fontSize: '18px' }}>1. Acceptance of Terms</h3>
                      <p style={{ color: '#333', fontSize: '14px', margin: '0 0 12px 0' }}>By using the Chota Beta platform, you confirm that you agree to these terms.</p>
                    </div>
                  </div>
                </div>
                {/* About Us */}
                <div style={{ marginBottom: '0px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>About Us</label>
                    <RefreshCcw size={14} style={{ color: '#007bff', cursor: 'pointer' }} />
                  </div>
                  
                  {/* Mock Editor UI */}
                  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ backgroundColor: '#0c111d', padding: '8px', borderBottom: '1px solid #2d3748', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BA;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x21BB;</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid #2d3748', paddingRight: '12px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontWeight: "400", fontSize: '12px' }}>B</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontStyle: 'italic', fontSize: '12px' }}>I</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', textDecoration: 'underline', fontSize: '12px' }}>U</button>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2261;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2262;</button>
                        <button style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', color: 'white', padding: '4px 8px', borderRadius: '2px', fontSize: '12px' }}>&#x2263;</button>
                      </div>
                    </div>
                    {/* Content Area */}
                    <div style={{ backgroundColor: 'white', padding: '24px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                      <p style={{ color: '#333', fontSize: '14px', margin: '0 0 16px 0' }}>Our values include:</p>
                      <ul style={{ color: '#333', fontSize: '14px', margin: '0 0 24px 0', paddingLeft: '20px' }}>
                        <li>Providing a smooth and secure shopping experience</li>
                        <li>Supporting small and emerging sellers</li>
                        <li>Delivering value and convenience to customers</li>
                      </ul>
                      <h3 style={{ color: '#000', margin: '24px 0 16px 0', fontSize: '18px' }}>Join Our Journey</h3>
                      <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                        Whether you’re a customer looking for great deals or a seller wanting to reach more buyers, Chota Beta welcomes you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PWA Manifest Settings Block */}
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>PWA Manifest Settings</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="PWA Name" required value="Chota Beta" />
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    PWA Description <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea 
                    defaultValue="Chota Beta"
                    style={{ 
                      width: '100%', 
                      height: '60px', 
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

                <div style={{ display: 'flex', gap: '16px' }}>
                  <LogoUploader 
                    label="PWA Logo (192x192)" 
                    fileName="pwa-logo-192x192-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                  <LogoUploader 
                    label="PWA Logo (512x512)" 
                    fileName="pwa-logo-512x512-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                  <LogoUploader 
                    label="PWA Logo (144x144)" 
                    fileName="pwa-logo-144x144-1773489735.png" 
                    size="158 KB" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Scripts Block */}
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
                    placeholder="Enter header script"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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
                    Footer Script
                  </label>
                  <textarea 
                    placeholder="Enter footer script"
                    style={{ 
                      width: '100%', 
                      height: '80px', 
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
              </div>
            </div>

            {/* Global Submit Button */}
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
