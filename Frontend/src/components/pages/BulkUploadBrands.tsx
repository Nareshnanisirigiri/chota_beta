import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  ArrowLeft,
  FileText,
  Loader2
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface BulkUploadBrandsProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function BulkUploadBrands({ onLogout, onNavigate }: BulkUploadBrandsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a valid CSV file');
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      const response = await axios.get(`${BASE_URL}/api/brands/bulk-upload/template`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'brands_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${BASE_URL}/api/brands/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Brands uploaded successfully');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error uploading brands:', error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to upload brands';
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      <div className="dashboard-card p-0 rounded-lg border border-[#1e293b] bg-[#1a2233] shadow-xl overflow-hidden">
        {/* Integrated Header Section */}
        <div className="px-6 py-6 border-b border-[#1e293b]/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-normal text-white mb-0.5 tracking-tight" style={{ fontSize: '20px' }}>Bulk Upload Brands</h1>
              <nav className="flex items-center gap-2" style={{ fontSize: '12px' }}>
                <span
                  className="text-blue-500 font-medium cursor-pointer hover:underline"
                  onClick={() => onNavigate?.('dashboard')}
                >
                  Home
                </span>
                <span className="text-slate-500">/</span>
                <span
                  className="text-blue-500 font-medium cursor-pointer hover:underline"
                  onClick={() => onNavigate?.('brands')}
                >
                  Brands
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-blue-200/80">Bulk Upload</span>
              </nav>
            </div>

            <button
              onClick={() => onNavigate?.('brands')}
              className="px-6 py-2 rounded-md font-normal text-slate-400 border border-[#1e293b] hover:bg-[#1e293b] transition-all"
              style={{ fontSize: '13px' }}
            >
              Back
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Instructions Section */}
          <div className="bg-[#161f30] border border-[#2d3748] rounded-md p-6 mb-8 relative">
            <div className="flex flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex gap-4">
                  <span className="text-slate-300 tracking-widest whitespace-nowrap" style={{ fontSize: '14px', fontWeight: '200' }}>Instructions</span>
                  <div className="space-y-3 tracking-wide" style={{ fontSize: '14px', fontWeight: '200' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-white mt-[2px] leading-none">•</span>
                      <span className="text-slate-400">Upload a CSV up to 10MB. First row should include headers.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-white mt-[2px] leading-none">•</span>
                      <span className="text-slate-400">Required fields: <span className="text-slate-200 font-normal">title</span></span>
                    </div>
                    <div className="flex items-start gap-2 leading-relaxed">
                      <span className="text-white mt-[2px] leading-none">•</span>
                      <span className="text-slate-400">Optional fields: <span className="text-slate-300">description, status, scope_type, scope_id, category_title</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-normal transition-colors border border-blue-500/20 px-4 py-3 rounded-md bg-blue-500/5 disabled:opacity-50"
                style={{ fontSize: '13px' }}
              >
                {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Download Template
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-white font-normal mb-4" style={{ fontSize: '15px' }}>Drag & drop CSV here, or click to browse</label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-md p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all cursor-pointer group min-h-[180px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-500 underline text-center px-4">
                  {file ? `File Selected: ${file.name}` : 'Drag & Drop your CSV or Browse'}
                </span>
              </div>
            </div>

            <p className="text-slate-500 mt-3" style={{ fontSize: '13px' }}>.csv, max 10MB</p>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-start gap-3 mt-8 pt-6 border-t border-[#1e293b]/50">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="hover:opacity-90 text-white px-6 py-2.5 rounded-md font-normal transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              style={{ fontSize: '14px', backgroundColor: '#007bff', boxShadow: '0 10px 15px -3px rgba(0, 123, 255, 0.3)' }}
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload
            </button>
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="px-6 py-2.5 rounded-md font-normal text-slate-400 border border-[#1e293b] hover:bg-[#1e293b] transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ fontSize: '14px' }}
            >
              <Download size={16} />
              Download Template
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}
