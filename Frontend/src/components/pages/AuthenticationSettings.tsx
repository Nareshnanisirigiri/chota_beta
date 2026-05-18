import React from 'react';
import {
  Smartphone,
  Key,
  Flame,
  UserPlus,
  ChevronDown
} from 'lucide-react';
import Navbar from '../Navbar';

interface AuthenticationSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
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

const ToggleField = ({ label, enabled }: { label: string; enabled: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>{label}</label>
    <div style={{ 
      width: '40px', 
      height: '20px', 
      backgroundColor: enabled ? '#007bff' : '#2d3748', 
      borderRadius: '10px', 
      position: 'relative', 
      cursor: 'pointer' 
    }}>
      <div style={{ 
        width: '16px', 
        height: '16px', 
        backgroundColor: 'white', 
        borderRadius: '50%', 
        position: 'absolute', 
        top: '2px', 
        left: enabled ? '22px' : '2px',
        transition: 'left 0.2s'
      }}></div>
    </div>
  </div>
);

export default function AuthenticationSettings({ onLogout, onNavigate, currentPage }: AuthenticationSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('Custom SMS');
  const [customSmsEnabled, setCustomSmsEnabled] = React.useState(true);

  React.useEffect(() => {
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
      const offset = 100; // Offset for navbar/header
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
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
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
                <div 
                  onClick={() => setCustomSmsEnabled(!customSmsEnabled)}
                  style={{ cursor: 'pointer' }}
                >
                  <ToggleField label="Enable Custom SMS" enabled={customSmsEnabled} />
                </div>
                
                {customSmsEnabled && (
                  <div style={{ marginTop: '20px' }}>
                    <FormField label="Custom SMS URL" required placeholder="Enter custom SMS URL" />
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                        Custom SMS Method <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '12px 16px', fontSize: '13px', color: '#64748b', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                          <option>Select HTTP method</option>
                          <option>GET</option>
                          <option>POST</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                      </div>
                    </div>
                    <FormField label="Custom SMS Token Account SID" required placeholder="Enter token account SID" />
                    <FormField label="Custom SMS Auth Token" required placeholder="Enter auth token" />
                    <FormField label="Custom SMS Text Format Data" required placeholder="Enter text format data" />
                    
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
                <FormField label="Google reCAPTCHA Site Key" placeholder="Enter reCAPTCHA site key" />
                <FormField label="Google API Key" value="AIzaSyAtUbjynFZTIWEnfN-4olvSqYQzvILrkjM" />
              </div>
            </div>

            {/* Firebase Section */}
            <div id="firebase" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Firebase</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Firebase" enabled={true} />
                <FormField label="Firebase API Key" required value="AIzaSyCnVjgVEerONZ-Ak1muSOeG3uFB61yOsm4" />
                <FormField label="Firebase Auth Domain" required value="chota-beta-customer.firebaseapp.com" />
                <FormField label="Firebase Database URL" required value="https://chota-beta-customer-default-rtdb.firebaseio.com/" />
                <FormField label="Firebase Project ID" required value="chota-beta-customer" />
                <FormField label="Firebase Storage Bucket" required value="chota-beta-customer.firebasestorage.app" />
                <FormField label="Firebase Messaging Sender ID" required value="569340863234" />
                <FormField label="Firebase App ID" required value="1:569340863234:web:cea68b4607a2104fe9581b" />
                <FormField label="Firebase Measurement ID" required value="1:569340863234:web:cea68b4607a2104fe9581b" />
              </div>
            </div>

            {/* Social Login Section */}
            <div id="social-login" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Social Login</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Apple Login" enabled={true} />
                <ToggleField label="Enable Google Login" enabled={true} />
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', marginBottom: '64px' }}>
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
