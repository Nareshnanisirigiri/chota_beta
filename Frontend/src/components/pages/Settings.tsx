import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Globe, Palette, Mail, Download, RefreshCw, Server, ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '../Navbar';

interface SettingsProps {
  onLogout: () => void;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://chotabeta-backend.onrender.com');

export default function Settings({ onLogout }: SettingsProps) {
  const [settings, setSettings] = useState({
    websiteStatus: 'Live',
    siteName: 'Chota Beta – Super Admin',
    tagline: 'Precision Platform Management',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    emailHost: 'smtp.chotabeta.com',
    emailPort: '587',
    emailUser: 'admin@chotabeta.com',
    maintenanceMode: false,
  });

  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/settings`);
      if (res.data.success && res.data.data) {
        setSettings(prev => ({
          ...prev,
          ...res.data.data,
          // ensure boolean is correctly parsed from strings like 'true'
          maintenanceMode: res.data.data.maintenanceMode === 'true' || res.data.data.maintenanceMode === true
        }));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        maintenanceMode: String(settings.maintenanceMode) // convert boolean to string for DB
      };
      
      const res = await axios.post(`${BASE_URL}/api/settings`, payload);
      if (res.data.success) {
        setToast('Settings saved successfully!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = () => {
    setToast('System backup started...');
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) {
    return (
      <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen flex items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
          <p className="text-slate-400 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />
      <div className="mb-10 mt-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Platform Settings</h1>
        <p className="text-slate-400 font-medium uppercase tracking-wider text-[11px]">Control your global environment and system configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panels */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Settings */}
          <div className="dashboard-card p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl">
            <h2 className="text-lg font-normal text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Globe className="w-4 h-4" />
              </div>
              General Configuration
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Website Status</label>
                  <select
                    value={settings.websiteStatus}
                    onChange={(e) => setSettings({ ...settings, websiteStatus: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white appearance-none cursor-pointer transition-all"
                  >
                    <option value="Live">Live</option>
                    <option value="Maintenance">Maintenance Mode</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white transition-all"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${settings.maintenanceMode ? 'bg-blue-600' : 'bg-[#1e2d45]'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-normal text-slate-300 group-hover:text-white transition-colors uppercase tracking-wider">Enable Maintenance Mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Theme & Branding */}
          <div className="dashboard-card p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl">
            <h2 className="text-lg font-normal text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Palette className="w-4 h-4" />
              </div>
              Branding & Aesthetics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Primary Accents</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-14 h-14 bg-[#0d1520] border border-[#1e2d45] rounded-xl cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl text-white font-mono text-sm leading-[2.5]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Secondary Accents</label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-14 h-14 bg-[#0d1520] border border-[#1e2d45] rounded-xl cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl text-white font-mono text-sm leading-[2.5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[#0a0f18]/50 border border-[#1e293b] rounded-2xl flex items-center justify-center gap-6">
              <div className="text-center group">
                <div 
                  className="w-20 h-20 rounded-2xl shadow-xl transition-all duration-500 ring-4 ring-offset-4 ring-offset-[#070b14] group-hover:scale-105"
                  style={{ 
                    backgroundColor: settings.primaryColor, 
                    boxShadow: `0 0 0 4px ${settings.primaryColor}33, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` 
                  }}
                ></div>
                <p className="mt-3 text-[10px] font-normal text-slate-500 uppercase tracking-[0.2em]">Primary</p>
              </div>
              <div className="text-center group">
                <div 
                  className="w-20 h-20 rounded-2xl shadow-xl transition-all duration-500 ring-4 ring-offset-4 ring-offset-[#070b14] group-hover:scale-105"
                  style={{ 
                    backgroundColor: settings.secondaryColor, 
                    boxShadow: `0 0 0 4px ${settings.secondaryColor}33, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` 
                  }}
                ></div>
                <p className="mt-3 text-[10px] font-normal text-slate-500 uppercase tracking-[0.2em]">Secondary</p>
              </div>
            </div>
          </div>

          {/* Technical Config */}
          <div className="dashboard-card p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl">
            <h2 className="text-lg font-normal text-white mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
              System & Communication
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">SMTP Gateway</label>
                  <input
                    type="text"
                    value={settings.emailHost}
                    onChange={(e) => setSettings({ ...settings, emailHost: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Secure Port</label>
                  <input
                    type="text"
                    value={settings.emailPort}
                    onChange={(e) => setSettings({ ...settings, emailPort: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-normal text-slate-500 uppercase tracking-widest ml-1">Platform Admin User</label>
                <input
                  type="email"
                  value={settings.emailUser}
                  onChange={(e) => setSettings({ ...settings, emailUser: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#0d1520] border border-[#1e2d45] rounded-xl focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 outline-none text-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Actions Panel */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="dashboard-card p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:bg-blue-600/10"></div>
            <h3 className="text-sm font-normal text-white mb-8 uppercase tracking-[0.2em]">Deployment Control</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-normal text-sm transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.97]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Commit Changes
              </button>

              <button
                onClick={handleBackup}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1e293b] hover:bg-slate-700 text-white rounded-2xl font-normal text-sm transition-all duration-300 active:scale-[0.97]"
              >
                <Download className="w-4 h-4" />
                System Snapshot
              </button>

              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0a0f18] border border-[#1e293b] text-slate-400 hover:text-white hover:border-slate-700 rounded-2xl font-normal text-sm transition-all duration-300">
                <RefreshCw className="w-4 h-4" />
                Invalidate Cache
              </button>
            </div>
          </div>

          <div className="dashboard-card p-8 bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl">
            <h3 className="text-sm font-normal text-white mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
              <Server className="w-4 h-4 text-slate-500" />
              Instance Details
            </h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2 border-b border-[#1e293b]">
                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">Platform Core</span>
                <span className="text-sm font-mono text-white">v3.1.2-beta</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#1e293b]">
                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">API Health</span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-normal text-emerald-400">Stable</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#1e293b]">
                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">Network Load</span>
                <span className="text-sm font-normal text-white">12%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">Server Uptime</span>
                <span className="text-sm font-normal text-white">1,412h</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {toast && (
        <div className="fixed bottom-10 right-10 bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-blue-900/40 font-normal text-sm animate-bounce z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
