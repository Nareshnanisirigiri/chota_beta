import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface BulkUploadCategoriesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function BulkUploadCategories({ onLogout, onNavigate }: BulkUploadCategoriesProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleDownloadTemplate = () => {
    try {
      const csvContent = "title,parent_id,parent_title,description,status,requires_approval,commission,background_type,background_color,font_color\nSample Category,,,,,active,0,0,Color,#000000,#000000";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'category_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
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
      await axios.post(`${BASE_URL}/api/category/bulk-upload`, formData);
      toast.success('File uploaded successfully');
      setFile(null);
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen" style={{ backgroundColor: '#fff', color: '#333' }}>
      <Navbar onLogout={onLogout} />

      <div className="p-8">
        <div className="rounded-md border shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h1 className="text-xl text-slate-800" style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>
                Bulk Upload Categories
              </h1>
              <nav className="flex items-center gap-2" style={{ fontSize: '14px' }}>
                <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
                <span className="text-slate-400">/</span>
                <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => onNavigate?.('categories')}>Categories</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">Bulk Upload</span>
              </nav>
            </div>
            <button
              onClick={() => onNavigate?.('categories')}
              className="px-4 py-1.5 rounded-md border text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ fontSize: '14px', borderColor: '#cbd5e1' }}
            >
              Back
            </button>
          </div>

          <div className="p-6">
            {/* Instructions Box */}
            <div className="rounded-md p-6 mb-8 flex flex-row items-stretch justify-between" style={{ backgroundColor: '#f0f7ff', border: '1px solid #e0f2fe' }}>
              <div className="flex gap-8">
                <div style={{ color: '#64748b', fontSize: '14px' }}>Instructions</div>
                <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                  <div className="flex gap-2">
                    <span>•</span>
                    <span>Upload a CSV up to 10MB. First row should include headers.</span>
                  </div>
                  <div className="flex gap-2">
                    <span>•</span>
                    <span>Required fields: <span style={{ fontWeight: '500' }}>title</span></span>
                  </div>
                  <div className="flex gap-2">
                    <span>•</span>
                    <span>Optional fields: parent_id, parent_title, description, status, requires_approval, commission, background_type,<br/>background_color, font_color</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-8 rounded-md border bg-white text-blue-500 hover:bg-blue-50 transition-colors h-full flex items-center"
                  style={{ fontSize: '13px', borderColor: '#93c5fd' }}
                >
                  Download Template
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
              <label className="block mb-2 text-slate-700" style={{ fontSize: '14px' }}>
                Drag & drop CSV here, or click to browse
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: '#f8fafc', height: '120px' }}
              >
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {file ? (
                    <span style={{ color: '#3b82f6', fontWeight: '500' }}>Selected: {file.name}</span>
                  ) : (
                    <>Drag & Drop your CSV or <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>Browse</span></>
                  )}
                </div>
              </div>

              <p className="mt-2 text-slate-500" style={{ fontSize: '13px' }}>
                .csv, max 10MB
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="px-6 py-2 rounded-md text-white transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#2563eb', fontSize: '14px' }}
              >
                {isUploading && <Loader2 size={16} className="animate-spin" />}
                Upload
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="px-6 py-2 rounded-md bg-white border text-slate-700 hover:bg-slate-50 transition-colors"
                style={{ borderColor: '#cbd5e1', fontSize: '14px' }}
              >
                Download Template
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
