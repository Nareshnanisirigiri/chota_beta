import React from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from '../Navbar';

interface StoreDetailsProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  storeData?: any; // In a real app, this would be fetched or passed
}

export default function StoreDetails({ onLogout, onNavigate, storeData }: StoreDetailsProps) {
  // Mock data based on the screenshot since we're just doing UI
  const data = storeData || {
    name: 'Meat Mart',
    visibilityStatus: 'Visible',
    verificationStatus: 'Approved',
    fulfillmentType: 'Hyperlocal',
    contactEmail: 'soori.916@gmail.com',
    contactNumber: '08886660031',
    address: '55V5+4PV, Rajampet, Andhra Pradesh 516115, India',
    city: 'Rajampet',
    state: 'Andhra Pradesh',
    landmark: 'Rs road',
    zipcode: '516115',
    country: 'India',
    countryCode: '91',
    latitude: '14.19286040',
    longitude: '79.15929970',
    deliveryZoneId: '',
    timing: '',
    storeStatus: 'ONLINE'
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ backgroundColor: '#1a2233', borderRadius: '8px', border: '1px solid #2d3748', overflow: 'hidden', height: 'fit-content' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ fontSize: '15px', color: 'white', margin: 0, fontWeight: '600' }}>{title}</h3>
      </div>
      <div style={{ padding: '24px 20px' }}>
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, isBadge, badgeType }: { label: string; value: string; isBadge?: boolean; badgeType?: 'success' | 'info' }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
      <div style={{ width: '140px', color: 'white', fontWeight: "400" }}>{label}</div>
      <div style={{ flex: 1 }}>
        {isBadge ? (
          <span style={{
            backgroundColor: badgeType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(52, 152, 219, 0.1)',
            color: badgeType === 'success' ? '#10b981' : '#3498db',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: "400",
            border: `1px solid ${badgeType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(52, 152, 219, 0.2)'}`
          }}>
            {value.toUpperCase()}
          </span>
        ) : (
          <span style={{ color: '#94a3b8' }}>{value || '—'}</span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', position: 'relative', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      {/* Header Card */}
      <div style={{
        marginTop: '32px',
        backgroundColor: '#1a2233',
        borderRadius: '8px',
        border: '1px solid #2d3748',
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '24px'
      }}>
        <h1 style={{ fontSize: '18px', color: 'white', margin: 0 }}>{data.name} Stores</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '13px' }}>
          <span style={{ color: '#007bff', fontWeight: "400", cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#007bff', fontWeight: "400", cursor: 'pointer' }} onClick={() => onNavigate('stores')}>Stores</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>{data.name}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Section title="About">
            <InfoRow label="Name" value={data.name} />
            <InfoRow label="Visibility Status" value={data.visibilityStatus} isBadge badgeType="info" />
            <InfoRow label="Verification Status" value={data.verificationStatus} isBadge badgeType="success" />
            <InfoRow label="Fulfillment Type" value={data.fulfillmentType} />
          </Section>

          <Section title="Contact Information">
            <InfoRow label="Contact Email" value={data.contactEmail} />
            <InfoRow label="Contact Number" value={data.contactNumber} />
          </Section>
        </div>

        {/* Middle Column */}
        <Section title="Location Details">
          <InfoRow label="Address" value={data.address} />
          <InfoRow label="City" value={data.city} />
          <InfoRow label="State" value={data.state} />
          <InfoRow label="Landmark" value={data.landmark} />
          <InfoRow label="Zipcode" value={data.zipcode} />
          <InfoRow label="Country" value={data.country} />
          <InfoRow label="Country Code" value={data.countryCode} />
          <InfoRow label="Latitude" value={data.latitude} />
          <InfoRow label="Longitude" value={data.longitude} />
          <InfoRow label="Delivery Zone ID" value={data.deliveryZoneId} />
        </Section>

        {/* Right Column */}
        <Section title="Operational & Timing">
          <InfoRow label="Timing" value={data.timing} />
          <InfoRow label="Store Status" value={data.storeStatus} isBadge badgeType="success" />
        </Section>
      </div>

      {/* Row 2: Financial, Logo, Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <Section title="Financial & Bank Details">
          <InfoRow label="Currency Code" value={data.currencyCode || 'INR'} />
          <InfoRow label="Tax Name" value={data.taxName || 'Gst'} />
          <InfoRow label="Tax Number" value={data.taxNumber || '57888999987'} />
          <InfoRow label="Bank Name" value={data.bankName || 'Hdfc'} />
          <InfoRow label="Bank Branch Code" value={data.bankBranchCode || 'Rajampet'} />
          <InfoRow label="Account Holder Name" value={data.accountHolderName || 'Saidabe'} />
          <InfoRow label="Account Number" value={data.accountNumber || '58566338055'} />
          <InfoRow label="Routing Number" value={data.routingNumber || '565253'} />
          <InfoRow label="Bank Account Type" value={data.bankAccountType || 'savings'} />
        </Section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Section title="Logo">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: '#0c111d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2d3748' }}>
                <img
                  src="https://via.placeholder.com/100?text=LOGO"
                  alt="Logo"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </div>
          </Section>
          <Section title="Address Proof">
            <div style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2d3748' }}>
              <img
                src="https://via.placeholder.com/200x100?text=Address+Proof"
                alt="Address Proof"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Section title="Banner">
            <div style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2d3748' }}>
              <img
                src="https://via.placeholder.com/300x100?text=Banner"
                alt="Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Section>
          <Section title="Voided Check">
            <div style={{ width: '100%', height: '100px', backgroundColor: '#0c111d', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2d3748' }}>
              <img
                src="https://via.placeholder.com/300x100?text=Voided+Check"
                alt="Voided Check"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </Section>
        </div>
      </div>

      {/* Row 3: Verify Account */}
      <div style={{ marginTop: '24px' }}>
        <Section title="Verify Account">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                Verification Status <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', appearance: 'none' }}>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>
                Visibility Status <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', backgroundColor: '#0c111d', border: '1px solid #2d3748', borderRadius: '4px', padding: '10px 12px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', appearance: 'none' }}>
                  <option>Visible</option>
                  <option>Hidden</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: "400" }}>
              Submit
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
