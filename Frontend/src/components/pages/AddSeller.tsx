import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  Sparkles,
  X
} from 'lucide-react';
import Navbar from '../Navbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface AddSellerProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export default function AddSeller({ onLogout, onNavigate }: AddSellerProps) {
  const [activeTab, setActiveTab] = useState('Basic Details');

  // Input Fields State
  const [sellerName, setSellerName] = useState('');
  const [country, setCountry] = useState('India');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('approved');
  const [visibilityStatus, setVisibilityStatus] = useState('visible');

  const [documents, setDocuments] = useState<Record<string, { file: File, preview: string, size: string }>>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      const size = (file.size / 1024).toFixed(1) + ' KB';
      setDocuments(prev => ({ ...prev, [id]: { file, preview, size } }));
    }
  };

  const removeFile = (id: string) => {
    setDocuments(prev => {
      const newDocs = { ...prev };
      if (newDocs[id]) {
        URL.revokeObjectURL(newDocs[id].preview);
        delete newDocs[id];
      }
      return newDocs;
    });
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleSubmit = async () => {
    if (!sellerName.trim() || !email.trim() || !mobile.trim() || !password) {
      toast.error('Seller name, email, mobile, and password are required');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('seller', sellerName);
      formData.append('email', email);
      formData.append('mobile', mobile);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('landmark', landmark);
      formData.append('state', state);
      formData.append('zipcode', zipcode);
      formData.append('country', country);
      formData.append('verificationStatus', verificationStatus);
      formData.append('visibilityStatus', visibilityStatus);

      // Add documents files
      Object.keys(documents).forEach(key => {
        const doc = documents[key];
        if (doc && doc.file instanceof File) {
          formData.append(key, doc.file);
        }
      });

      const response = await axios.post(`${BASE_URL}/api/sellers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Seller added successfully');
        onNavigate('sellers');
      } else {
        toast.error(response.data.message || 'Failed to add seller');
      }
    } catch (error: any) {
      console.error('Error adding seller:', error);
      const msg = error.response?.data?.message || 'Failed to add seller';
      toast.error(msg);
    }
  };

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
            <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
            <span className="text-white">/</span>
            <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate('sellers')}>Sellers</span>
            <span className="text-white">/</span>
            <span className="text-white/80">Add Seller</span>
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
          {activeTab === 'Basic Details' && (
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
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    Country <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
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
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>
                      Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      style={inputStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>
                      Password <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0px' }}>
                      <input
                        type="password"
                        placeholder="Set password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ ...inputStyle, borderRadius: '4px 0 0 4px', borderRight: 'none' }}
                      />
                      <button onClick={generatePassword} style={{ backgroundColor: '#0c111d', border: '1px solid #2d3748', borderLeft: 'none', borderRadius: '0 4px 4px 0', color: '#64748b', padding: '0 12px', cursor: 'pointer' }}>
                        <Sparkles size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Details Card */}
          {activeTab === 'Location Details' && (
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
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
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
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
                      value={state}
                      onChange={(e) => setState(e.target.value)}
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
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Documents Card */}
          {activeTab === 'Business Documents' && (
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
                  { label: 'Business License', hint: 'Upload a clear copy of your business license. Accepted formats: JPEG, PNG, PDF. Max size: 2MB.', id: 'license' },
                  { label: 'Articles of Incorporation', hint: "Provide your company's articles of incorporation or certificate of incorporation. File must be clear and readable.", id: 'incorporation' },
                  { label: 'National Identity Card', hint: 'Upload a government-issued photo ID (passport, driver\'s license, or national ID card).', id: 'idcard' },
                  { label: 'Authorized Signature', hint: 'Upload a document with authorized signature samples or signature authorization letter.', id: 'signature' }
                ].map((doc) => (
                  <div key={doc.label}>
                    <label style={labelStyle}>
                      {doc.label} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    
                    {documents[doc.id] ? (
                      <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <button 
                            onClick={() => removeFile(doc.id)} 
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                          >
                            <X size={14} />
                          </button>
                          <div style={{ color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                            <div style={{ fontSize: '13px', fontWeight: '500' }}>{documents[doc.id].file.name}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{documents[doc.id].size}</div>
                          </div>
                        </div>
                        {documents[doc.id].file.type.startsWith('image/') ? (
                          <img src={documents[doc.id].preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px' }}>
                            PDF Document
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '12px', backgroundColor: '#eeeeee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                        <input type="file" id={doc.id} accept="image/*,.pdf" onChange={(e) => handleFileChange(doc.id, e)} style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <p style={{ color: '#555555', fontSize: '15px', fontWeight: '400', pointerEvents: 'none' }}>Drag & Drop your files or <span style={{ color: '#555555', textDecoration: 'underline' }}>Browse</span></p>
                      </div>
                    )}
                    
                    <p style={{ color: '#64748b', fontSize: '12px', marginTop: '12px', fontWeight: '200' }}>{doc.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status and Metadata Card */}
          {activeTab === 'Status and Metadata' && (
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
                    <select 
                      style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value)}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Visibility Status <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                      value={visibilityStatus}
                      onChange={(e) => setVisibilityStatus(e.target.value)}
                    >
                      <option value="visible">Visible</option>
                      <option value="draft">Draft / Hidden</option>
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginBottom: '32px' }}>
            <button
              onClick={handleSubmit}
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
