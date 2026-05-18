import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  Sparkles
} from 'lucide-react';
import Navbar from '../Navbar';

interface AddSellerProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export default function AddSeller({ onLogout, onNavigate }: AddSellerProps) {
  const [activeTab, setActiveTab] = useState('Basic Details');

  const menuItems = [
    'Basic Details',
    'Location Details',
    'Business Documents',
    'Status and Metadata'
  ];

  const headerStyle = {
    fontSize: '13px',
    fontWeight: '200',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'white',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '12px',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    color: 'white',
    fontSize: '13px',
    fontWeight: '200',
    // textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0c111d',
    border: '1px solid #2d3748',
    borderRadius: '4px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: '200',
    color: '#94a3b8',
    outline: 'none'
  };

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', position: 'relative', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: "500", color: 'white', margin: 0, letterSpacing: '-0.025em' }}>Add Seller</h1>
        <div>
          <nav className="flex items-center gap-2 text-[12px] mt-1">
            <span className="text-blue-500 font-medium cursor-pointer hover:underline">Home</span>
            <span className="text-white">/</span>
            <span className="text-white font-medium cursor-pointer hover:underline">Sellers</span>
            <span className="text-white">/</span>
            <span className="text-white font-medium cursor-pointer hover:underline">Add Seller</span>
          </nav>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {/* Left Side Menu */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <h3 style={{ ...labelStyle, marginBottom: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Menu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: activeTab === item ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: activeTab === item ? '#3b82f6' : '#94a3b8',
                  border: activeTab === item ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontWeight: activeTab === item ? '400' : '200'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Form Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Basic Details Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={headerStyle}>
              Basic Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={labelStyle}>
                  Seller Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Seller Name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Country <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                    <option>Search for a country</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Mobile <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter mobile number"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    defaultValue="experts@chotabeta.com"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0px' }}>
                    <input
                      type="password"
                      defaultValue="............"
                      style={{ ...inputStyle, borderRadius: '4px 0 0 4px', borderRight: 'none' }}
                    />
                    <button style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderLeft: 'none', color: '#3b82f6', padding: '0 16px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                      SHOW
                    </button>
                    <button style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderLeft: 'none', borderRadius: '0 4px 4px 0', color: '#64748b', padding: '0 12px', cursor: 'pointer' }}>
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={headerStyle}>
              Location Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>
                  Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter address"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    City <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Landmark <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter landmark"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    State <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>
                    Zipcode <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter zipcode"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Documents Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={headerStyle}>
              Business Documents
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Business License', hint: 'Upload a clear copy of your business license. Accepted formats: JPEG, PNG, PDF. Max size: 2MB.' },
                { label: 'Articles of Incorporation', hint: "Provide your company's articles of incorporation or certificate of incorporation. File must be clear and readable." },
                { label: 'National Identity Card', hint: 'Upload a government-issued photo ID (passport, driver\'s license, or national ID card).' },
                { label: 'Authorized Signature', hint: 'Upload a document with authorized signature samples or signature authorization letter.' }
              ].map((doc) => (
                <div key={doc.label}>
                  <label style={labelStyle}>
                    {doc.label} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ width: '100%', height: '80px', borderRadius: '12px', backgroundColor: '#eeeeee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <p style={{ color: '#555555', fontSize: '15px', fontWeight: '400' }}>Drag & Drop your files or <span style={{ color: '#555555', textDecoration: 'underline' }}>Browse</span></p>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '12px', fontWeight: '200' }}>{doc.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status and Metadata Card */}
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={headerStyle}>
              Status and Metadata
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={labelStyle}>
                  Verification Status <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                    <option>Approved</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Metadata <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  placeholder="Enter metadata (JSON format)"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Visibility Status <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                    <option>Visible</option>
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginBottom: '32px' }}>
            <button
              onClick={() => onNavigate('sellers')}
              style={{
                padding: '12px 32px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: "600",
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Add Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
