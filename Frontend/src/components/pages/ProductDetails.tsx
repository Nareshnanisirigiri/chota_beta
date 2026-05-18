import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

interface ProductDetailsProps {
  onLogout: () => void;
  onBack: () => void;
  product?: any;
}

export default function ProductDetails({ onLogout, onBack, product }: ProductDetailsProps) {
  const [hoveredBtn, setHoveredBtn] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string>(() => {
    const status = String(product?.approvalStatus || '').toLowerCase();
    if (status === 'approved' || status === 'active') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending_verification';
  });
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateStatus = async () => {
    if (!product?.id) {
      toast.error('Product ID not found');
      return;
    }
    setIsUpdating(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/products/${product.id}/status`, {
        status: selectedStatus
      });
      if (response.data.success) {
        toast.success('Product status updated successfully!');
        onBack();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update product status');
    } finally {
      setIsUpdating(false);
    }
  };
  const data = {
    name: product?.title || 'Mixed Mandi',
    type: product?.type || 'Simple',
    soldBy: product?.soldBy || 'Soori Food',
    status: product?.status || 'Active',
    verificationStatus: product?.approvalStatus || 'Approved',
    category: product?.category || 'Biryani',
    brand: product?.brand || 'N/A',
    createdAt: product?.createdAt || '2026-03-21 15:36:42',
    updatedAt: product?.updatedAt || '2026-03-21 15:36:42',
    isCancelable: product?.isCancelable || 'No',
    isReturnable: product?.isReturnable || 'No',
    madeIn: product?.madeIn || 'India',
    minOrderQty: product?.minOrderQty || '1',
    qtyStepSize: product?.qtyStepSize || '2',
    totalAllowedQty: product?.totalAllowedQty || '20',
    isInclusiveTax: product?.isInclusiveTax || 'No',
    isAttachmentRequired: product?.isAttachmentRequired || 'No',
    basePrepTime: product?.basePrepTime || '10 Minutes',
    requiresOtp: product?.requiresOtp || 'No',
    tags: product?.tags || 'mixed, mandi, rice, chicken, mutton'
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ backgroundColor: '#1a2233', borderRadius: '8px', border: '1px solid #2d3748', overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 12px 24px' }}>
        <h3 style={{ fontSize: '18px', color: 'white', margin: 0, fontWeight: '600' }}>{title}</h3>
      </div>
      <div style={{ padding: '12px 24px 24px 24px' }}>
        {children}
      </div>
    </div>
  );

  const LabelValue = ({ label, value, isBadge, badgeType }: { label: string; value: string; isBadge?: boolean; badgeType?: 'success' | 'danger' | 'info' }) => {
    const getBadgeStyle = () => {
      switch (badgeType) {
        case 'success':
          return { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
        case 'danger':
          return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
        case 'info':
        default:
          return { backgroundColor: 'rgba(52, 152, 219, 0.1)', color: '#3498db' };
      }
    };

    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: "400", textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ fontSize: '15px', color: 'white', fontWeight: '500' }}>
          {isBadge ? (
            <span style={{
              ...getBadgeStyle(),
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: "400",
              display: 'inline-block'
            }}>
              {value}
            </span>
          ) : (
            value || 'N/A'
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', position: 'relative', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', color: 'white', margin: 0, fontWeight: "700" }}>Product Details</h1>
        <button
          onClick={onBack}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: hoveredBtn === 'back' ? '#64748b' : 'transparent',
            color: hoveredBtn === 'back' ? 'white' : '#64748b',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '200',
            border: '2px solid #64748b',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowLeft size={18} /> Back to Products
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <Section title="Product Summary">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <LabelValue label="Product Name" value={data.name} />
            <LabelValue label="Product Type" value={data.type} />
            <LabelValue label="Sold By" value={data.soldBy} />
            <LabelValue label="Status" value={data.status === 'ACTIVE' ? 'Active' : data.status} isBadge badgeType="success" />
            <LabelValue label="Verification Status" value={data.verificationStatus === 'Verification Status' ? 'Approved' : data.verificationStatus} isBadge badgeType="success" />
            <LabelValue label="Category" value={data.category} />
            <LabelValue label="Brand" value={data.brand} />
            <LabelValue label="Created At" value={data.createdAt} />
            <LabelValue label="Updated At" value={data.updatedAt} />
          </div>
        </Section>

        <Section title="Product Specifications">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <LabelValue label="Is Cancelable" value={data.isCancelable} isBadge badgeType={data.isCancelable === 'Yes' ? 'success' : 'danger'} />
            <LabelValue label="Is Returnable" value={data.isReturnable} isBadge badgeType={data.isReturnable === 'Yes' ? 'success' : 'danger'} />
            <LabelValue label="Made In" value={data.madeIn} />
            <LabelValue label="Minimum Order Quantity" value={data.minOrderQty} />
            <LabelValue label="Quantity Step Size" value={data.qtyStepSize} />
            <LabelValue label="Total Allowed Quantity" value={data.totalAllowedQty} />
            <LabelValue label="Is Inclusive Tax" value={data.isInclusiveTax} isBadge badgeType={data.isInclusiveTax === 'Yes' ? 'success' : 'danger'} />
            <LabelValue label="Is Attachment Required" value={data.isAttachmentRequired} isBadge badgeType={data.isAttachmentRequired === 'Yes' ? 'success' : 'danger'} />
            <LabelValue label="Base Preparation Time" value={data.basePrepTime} />
            <LabelValue label="Requires OTP" value={data.requiresOtp} isBadge badgeType={data.requiresOtp === 'Yes' ? 'success' : 'danger'} />
          </div>
          <div style={{ marginTop: '0px' }}>
            <LabelValue label="Tags" value={data.tags} />
          </div>
        </Section>

        {/* New Sections */}
        <Section title="Admin Approval">
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: "400", textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Verification Status
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0c111d',
                  border: '1px solid #2d3748',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '14px',
                  color: 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                <option value="approved">Approved</option>
                <option value="pending_verification">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            onMouseEnter={() => setHoveredBtn('update')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={{
              backgroundColor: hoveredBtn === 'update' ? '#3b82f6' : 'transparent',
              color: hoveredBtn === 'update' ? 'white' : '#3b82f6',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: "200",
              border: '2px solid #3b82f6',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isUpdating ? 0.7 : 1
            }}
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </Section>

        <Section title="Product Image">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '250px',
              height: '250px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={product?.image || "https://via.placeholder.com/150?text=Product"}
                alt="Product"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Product';
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: "400", textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>
            Additional Images
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={product?.image || "https://images.unsplash.com/photo-1541518139221-31c99a2f2432?q=80&w=1470&auto=format&fit=crop"}
                alt="Product Thumbnail"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Full Width Sections */}
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Section title="Product Description">
          <p style={{ color: 'white', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            A Mixed Mandi is a lavish Yemeni-inspired platter featuring a combination of smoked meats—typically chicken, mutton, and sometimes fish—served over a bed of fragrant, long-grain basmati rice. It is known for its tender, spice-marinated meats, smoky aroma from underground tandoor cooking (or charcoal smoking), and is usually topped with raisins and cashews.
          </p>
        </Section>

        <Section title="Store-wise Pricing">
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '15px', color: 'white', fontWeight: "400" }}>Product Name : </span>
            <span style={{ fontSize: '15px', color: 'white' }}>{data.name}</span>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3748' }}>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }}>Store</th>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }}>Sku</th>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }}>Price</th>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }}>Special Price</th>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }}>Cost</th>
                  <th style={{ padding: '10px 16px', fontSize: '14px', color: 'white', fontWeight: "200", textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '2px solid white' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>Athidi Grand Inn Family Restaurant</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>52672</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>₹900.00</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>₹800.00</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>₹500.00</td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: 'white' }}>20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
