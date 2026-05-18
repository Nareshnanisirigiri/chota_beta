import React from 'react';
import {
  Truck,
  Type,
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
  Eraser
} from 'lucide-react';
import Navbar from '../Navbar';

interface DeliveryBoySettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

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

const Editor = ({ placeholder }: { placeholder: string }) => (
  <div style={{ border: '1px solid #2d3748', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
    <EditorToolbar />
    <textarea 
      placeholder={placeholder}
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

const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default function DeliveryBoySettings({ onLogout, onNavigate }: DeliveryBoySettingsProps) {
  const [activeTab, setActiveTab] = React.useState('Delivery Boy Policies');

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ margin: '0 0 4px 0' }}>Delivery Boy Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Delivery Boy Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div 
                onClick={() => setActiveTab('Delivery Boy Policies')}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  color: activeTab === 'Delivery Boy Policies' ? '#007bff' : '#64748b', 
                  backgroundColor: activeTab === 'Delivery Boy Policies' ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                  cursor: 'pointer'
                }}
              >
                Delivery Boy Policies
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Delivery Boy Policies</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Terms & Conditions</label>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #007bff', color: '#007bff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
                </div>
                <Editor placeholder="Enter delivery boy terms and conditions" />

                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ color: 'white', fontSize: '13px', fontWeight: "400" }}>Privacy Policy</label>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #007bff', color: '#007bff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
                </div>
                <Editor placeholder="Enter delivery boy privacy policy" />
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '6px', fontSize: '14px', fontWeight: "400", cursor: 'pointer' }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
