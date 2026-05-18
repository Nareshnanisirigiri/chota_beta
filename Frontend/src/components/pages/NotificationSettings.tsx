import React from 'react';
import {
  Bell,
  ChevronDown,
  Upload
} from 'lucide-react';
import Navbar from '../Navbar';

interface NotificationSettingsProps {
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

export default function NotificationSettings({ onLogout, onNavigate }: NotificationSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('General');

  const jsonSample = `{
  "project_info": {
    "project_number": "569340863234",
    "firebase_url": "https://chota-beta-customer-default-rtdb.firebaseio.com",
    "project_id": "chota-beta-customer",
    "storage_bucket": "chota-beta-customer.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:569340863234:android:a6e1aa3d5c08939fe9581b",
        "android_client_info": {
           "package_name": "com.goexperts.chotabeta"
        }
      },
      "oauth_client": [
        {
          "client_id": "569340863234-a6s3c3i16jgrs9iaiolm76pfbqj34og7.apps.googleusercontent.com",
          "client_type": 1
        }
      ]
    }
  ]
}`;

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', width: '100%', padding: '32px', boxSizing: 'border-box' }}>
      <Navbar onLogout={onLogout} />

      <div style={{ marginTop: '32px' }}>
        <h1 style={{ margin: '0 0 4px 0' }}>Notification Settings</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '32px' }}>
          <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => onNavigate?.('dashboard')}>Home</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: '#64748b' }}>Settings</span>
          <span style={{ color: '#64748b' }}>/</span>
          <span style={{ color: 'white' }}>Notification Settings</span>
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
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ backgroundColor: '#1a2233', border: '1px solid #2d3748', borderRadius: '8px', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d3748' }}>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: "400", margin: 0 }}>General</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <FormField label="Firebase Project ID" value="chota-beta-customer" />
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>Service Account File</label>
                  <div style={{ 
                    backgroundColor: '#0c111d', 
                    border: '1px solid #2d3748', 
                    borderRadius: '4px', 
                    padding: '16px', 
                    color: '#94a3b8', 
                    fontFamily: 'monospace', 
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    maxHeight: '300px',
                    lineHeight: '1.6'
                  }}>
                    {jsonSample}
                  </div>
                </div>

                {/* File Upload Area */}
                <div style={{ 
                  border: '2px dashed #2d3748', 
                  borderRadius: '8px', 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#64748b', 
                  fontSize: '14px',
                  backgroundColor: 'white',
                  marginBottom: '24px'
                }}>
                  <p style={{ margin: 0, color: '#000' }}>Drag & Drop your files or <span style={{ color: '#007bff', fontWeight: "400", cursor: 'pointer', textDecoration: 'underline' }}>Browse</span></p>
                </div>

                <div style={{ marginTop: '32px' }}>
                  <h4 style={{ color: 'white', fontSize: '13px', fontWeight: "400", marginBottom: '8px' }}>Cron Job (Queue Worker)</h4>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 16px 0' }}>
                    Add the following cron entry on your server to process queued notifications. Output is redirected to a log file so you can verify whether the cron is running.
                  </p>

                  <div 
                    style={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '4px', 
                      padding: '16px', 
                      color: 'white', 
                      fontFamily: 'monospace', 
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      overflowX: 'auto',
                      marginBottom: '12px',
                      border: '1px solid #2d3748',
                      width: '100%',
                      boxSizing: 'border-box',
                      display: 'block'
                    }}
                  >
                    <span style={{ display: 'inline-block' }}>* * * * * /usr/bin/php /home/chotabetasuresh/superadmin.chotabeta.com/artisan queue:work --stop-when-empty {">"}{">"} /home/chotabetasuresh/superadmin.chotabeta.com/storage/logs/cron-log.txt 2&gt;&1</span>
                  </div>

                  <p style={{ color: '#64748b', fontSize: '11px', margin: '4px 0 24px 0' }}>
                    Note: If your PHP binary path differs from /usr/bin/php, adjust it accordingly.
                  </p>

                  <div style={{ 
                    border: '1px solid #7c5e10', 
                    borderRadius: '8px', 
                    padding: '24px', 
                    backgroundColor: 'rgba(124, 94, 16, 0.05)',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ fontWeight: "400", margin: '0 0 16px 0' }}>
                      Notifications are currently not functioning because the required cron job has not been configured on the server.
                    </p>
                    <p style={{ margin: '0 0 12px 0' }}>
                      Cron status: <span style={{ fontWeight: "400" }}>Not detected. The log file was not found at</span>
                    </p>
                    <div style={{ 
                      backgroundColor: '#0c111d', 
                      padding: '12px 16px', 
                      borderRadius: '4px', 
                      color: '#007bff', 
                      fontFamily: 'monospace', 
                      fontSize: '12px',
                      marginBottom: '16px'
                    }}>
                      /home/chotabetasuresh/superadmin.chotabeta.com/storage/logs/cron-log.txt
                    </div>
                    <p style={{ margin: '0 0 12px 0' }}>
                      This likely means the cron job has not been added or has not executed yet.
                    </p>
                    <p style={{ margin: 0 }}>
                      For more details on configuring notifications, please refer to our documentation.: <span style={{ color: '#ff9800', cursor: 'pointer' }}>please refer to our documentation .</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '6px', fontSize: '14px', fontWeight: "400", cursor: 'pointer' }}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
