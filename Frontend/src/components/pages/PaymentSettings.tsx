import React from 'react';
import {
  CreditCard,
  ChevronDown,
  DollarSign,
  Wallet,
  Coins
} from 'lucide-react';
import Navbar from '../Navbar';

interface PaymentSettingsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const ToggleField = ({ label, enabled, subtitle = "" }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <div>
      <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400" }}>{label}</label>
      {subtitle && <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 0 0' }}>{subtitle}</p>}
    </div>
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

export default function PaymentSettings({ onLogout, onNavigate }: PaymentSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('Flutterwave Payment');

  const scrollToSection = (sectionId: string, label: string) => {
    setActiveTab(label);
    const element = document.getElementById(sectionId);
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
    { id: 'stripe', label: 'Stripe Payment' },
    { id: 'razorpay', label: 'Razorpay Payment' },
    { id: 'paystack', label: 'Paystack Payment' },
    { id: 'flutterwave', label: 'Flutterwave Payment' },
    { id: 'wallet', label: 'Wallet Payment' },
    { id: 'cod', label: 'Cash on Delivery' },
  ];

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '18px', fontWeight: "400", margin: '0 0 4px 0' }}>Payment Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Payment Settings</span>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Left Menu Sidebar */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '32px' }}>
              <h2 style={{ color: 'white', fontSize: '14px', fontWeight: "400", marginBottom: '16px' }}>Menu</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => scrollToSection(item.id, item.label)}
                    style={{ 
                      padding: '12px 16px', 
                      borderRadius: '6px', 
                      fontSize: '13px', 
                      color: activeTab === item.label ? '#007bff' : '#64748b', 
                      backgroundColor: activeTab === item.label ? 'rgba(0, 123, 255, 0.05)' : 'transparent', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1 }}>
            {/* Stripe Section */}
            <div id="stripe" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Stripe Payment</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Stripe Payment" enabled={false} />
              </div>
            </div>

            {/* Razorpay Section */}
            <div id="razorpay" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Razorpay Payment</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Razorpay Payment" enabled={false} />
              </div>
            </div>

            {/* Paystack Section */}
            <div id="paystack" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Paystack Payment</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Paystack Payment" enabled={false} />
              </div>
            </div>

            {/* Flutterwave Section */}
            <div id="flutterwave" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Flutterwave Payment</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Flutterwave Payment" enabled={false} />
              </div>
            </div>

            {/* Wallet Section */}
            <div id="wallet" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Wallet Payment</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Wallet Payment" subtitle="Enable wallet payment for users to pay for orders using their wallet balance." enabled={false} />
              </div>
            </div>

            {/* COD Section */}
            <div id="cod" style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>Cash on Delivery</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <ToggleField label="Enable Cash on Delivery" enabled={false} />
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
