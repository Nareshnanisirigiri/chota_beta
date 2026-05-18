import React from 'react';
import Navbar from '../Navbar';
import { ChevronDown, Plus } from 'lucide-react';

interface HomeGeneralSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

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
  const [activeTab, setActiveTab] = React.useState('General');
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
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
            {/* General Card */}
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
                    defaultValue="Explore All Categories"
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
                  <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>This will be used as the default title for all categories configuration</p>
                </div>

                <div style={{ marginBottom: '0px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Search labels
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '8px', 
                    minHeight: '44px',
                    backgroundColor: '#0c111d', 
                    border: '1px solid #2d3748', 
                    borderRadius: '4px', 
                    padding: '8px 12px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Grocery', 'Restuarant', 'Food'].map(tag => (
                        <div key={tag} style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '4px', padding: '4px 10px', fontSize: '12px', color: 'white' }}>
                          {tag}
                        </div>
                      ))}
                    </div>
                    <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '4px' }}>Eg. Search "coke", Search "shirt"</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <ChevronDown size={14} style={{ color: '#64748b' }} />
                       <div style={{ borderLeft: '1px solid #2d3748', paddingLeft: '12px' }}>
                         <Plus size={14} style={{ color: '#64748b' }} />
                       </div>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Search labels will show in search bar.</p>
                </div>
              </div>
            </div>

            {/* Appearance Card */}
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
                    <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: 'white', outline: 'none', appearance: 'none' }}>
                      <option>Image</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                  <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Choose how the background should be displayed</p>
                </div>

                <LogoUploader 
                  label="Icon" 
                  fileName="69c29461e6bbf-website-logo-Chota Beta.png" 
                  size="158 KB" 
                  height="280px" 
                />

                <div style={{ marginTop: '24px' }}>
                  <LogoUploader 
                    label="Active Icon" 
                    fileName="69c29461e6cfb-App Icons - Chota Beta.png" 
                    size="158 KB" 
                    height="280px" 
                  />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <LogoUploader 
                    label="Background Image" 
                    fileName="69c29461e5820-website logo-Chota Beta.png" 
                    size="158 KB" 
                    height="280px" 
                  />
                </div>

                <div style={{ marginTop: '24px', position: 'relative' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                    Font Color
                  </label>
                  <div 
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{ width: '100%', height: '36px', backgroundColor: '#000', border: '1px solid #2d3748', borderRadius: '4px', cursor: 'pointer' }}
                  ></div>
                  
                  {showColorPicker && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '48px', 
                      left: 0, 
                      width: '240px', 
                      backgroundColor: '#2d2d2d', 
                      borderRadius: '4px', 
                      boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                      zIndex: 100,
                      overflow: 'hidden'
                    }}>
                      {/* Palette Area */}
                      <div style={{ width: '100%', height: '140px', background: 'linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, red)' }}></div>
                      
                      {/* Controls Area */}
                      <div style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                          <div style={{ cursor: 'pointer', color: 'white' }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                              <path d="M12 2L2 12V22H12L22 12L12 2ZM12 2L2 12V22H12L22 12L12 2ZM12 2L2 12V22H12L22 12L12 2Z"></path>
                              <line x1="2" y1="22" x2="12" y2="12"></line>
                            </svg>
                          </div>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#000', border: '1px solid #444' }}></div>
                          <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)' }}></div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {['R', 'G', 'B'].map((l) => (
                            <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ backgroundColor: 'transparent', border: '1px solid #444', borderRadius: '2px', padding: '4px', color: 'white', fontSize: '12px', marginBottom: '4px' }}>0</div>
                              <div style={{ color: '#888', fontSize: '10px' }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <p style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>Select the font color for category text</p>
                </div>
              </div>
            </div>

            {/* Global Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '10px 24px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: "400", 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                transition: 'all 0.2s'
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
