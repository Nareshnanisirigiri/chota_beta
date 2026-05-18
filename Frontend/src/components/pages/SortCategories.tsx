import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, GripVertical, X } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface SortCategoriesProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function SortCategories({ onLogout, onNavigate }: SortCategoriesProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Drag and Drop state
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      const data = res.data?.data || [];
      setCategories(data);
      
      if (data.length > 0) {
        setSelectedCategories(data.slice(0, Math.min(10, data.length)));
      } else {
        const exactNames = [
          'Juice & Shakes', 'Fruits & Vegetables', 'Biryani & Rice', 'Handbags', 'Soups & Salads', 'Staters',
          'Fresh Chicken & Eggs', 'Dry Fruits & Nuts', 'Baby Care', 'Foodgrains, Oil & Masala',
          'Household Care', 'Personal Care', 'North Indian', 'Dairy, Bread & Eggs', 'Bakery & Biscuits',
          'Beverages', 'Snacks & Branded Foods', 'Frozen & Ready Food', 'Meat & Seafood',
          'Organic & Gourmet', 'Pooja Needs', 'Pet Care', 'South Indian'
        ];
        
        const mockData = exactNames.map((title, index) => ({
          id: index + 1,
          title: title,
          status: 'active'
        }));
        
        setSelectedCategories(mockData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleSelectCategory = (cat: any) => {
    if (!selectedCategories.find(c => c.id === cat.id)) {
      setSelectedCategories([...selectedCategories, cat]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveCategory = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedCategories(selectedCategories.filter(c => c.id !== id));
  };

  const handleSaveHomeCategories = () => {
    toast.success('Home categories saved successfully');
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItemIndex(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); 
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...selectedCategories];
    const draggedItem = newItems[draggedItemIndex];
    
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setSelectedCategories(newItems);
  };

  return (
    <div className="font-sans min-h-screen" style={{ backgroundColor: '#fff', color: '#333' }}>
      <Navbar onLogout={onLogout} />

      <div className="p-8">
        <div className="rounded-md border shadow-sm pb-10" style={{ backgroundColor: '#fff', borderColor: '#e2e8f0' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h1 className="text-xl text-slate-800" style={{ fontSize: '18px', fontWeight: '500', marginBottom: '4px' }}>
                Sort Categories ({selectedCategories.length})
              </h1>
              <nav className="flex items-center gap-2" style={{ fontSize: '14px' }}>
                <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
                <span className="text-slate-400">/</span>
                <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => onNavigate?.('categories')}>Categories</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">Sort Categories</span>
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
            
            {/* Section 1: Home Parent Categories */}
            <div className="mb-10">
              <label className="block mb-3" style={{ fontSize: '14px', color: '#475569' }}>
                Home Parent Categories
              </label>

              {/* Fake Multi-Select Input */}
              <div 
                ref={dropdownRef}
                className="relative min-h-[42px] border rounded-md p-1.5 flex flex-wrap gap-1.5 items-center cursor-text transition-colors"
                style={{ borderColor: '#cbd5e1', backgroundColor: '#fff' }}
                onClick={() => setIsDropdownOpen(true)}
              >
                {selectedCategories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="flex items-center rounded-sm px-2.5 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', fontSize: '15px', color: '#334155', fontWeight: '400' }}
                    onClick={(e) => handleRemoveCategory(e, cat.id)}
                    title="Click to remove"
                  >
                    <span>{cat.title}</span>
                  </div>
                ))}
                
                <input 
                  type="text" 
                  placeholder={selectedCategories.length === 0 ? "Search Category" : ""} 
                  className="flex-1 min-w-[120px] outline-none px-2 bg-transparent"
                  style={{ color: '#94a3b8', fontSize: '15px' }}
                />
                
                <div className="ml-auto px-2" style={{ color: '#cbd5e1' }}>
                  <ChevronDown size={16} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto" style={{ borderColor: '#cbd5e1' }}>
                    {categories.filter(c => !selectedCategories.find(s => s.id === c.id)).map(cat => (
                      <div 
                        key={cat.id} 
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                        style={{ fontSize: '14px', color: '#334155' }}
                        onClick={() => handleSelectCategory(cat)}
                      >
                        {cat.title}
                      </div>
                    ))}
                    {categories.length === 0 && (
                       <div className="px-4 py-2 text-sm text-slate-500">No more categories</div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <p style={{ fontSize: '14px', color: '#64748b' }}>Choose parent categories to be shown on home page</p>
                <button
                  onClick={handleSaveHomeCategories}
                  className="px-5 py-2 rounded-md text-white transition-colors"
                  style={{ backgroundColor: '#0265d3', fontSize: '14px' }}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Section 2: Sorting Instructions */}
            <div className="rounded p-4 mb-6" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', marginBottom: '6px' }}>Sorting Instructions</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Drag and drop the sections below to change their display order. Click "Save Order" to apply changes.
              </div>
            </div>

            {/* Section 3: Sortable List */}
            <div className="border rounded-md overflow-hidden mb-6" style={{ borderColor: '#e2e8f0' }}>
              {selectedCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className="flex items-center justify-between p-4 bg-white border-b cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <div className="flex items-center gap-4">
                    <GripVertical size={16} style={{ color: '#94a3b8' }} />
                    <div 
                      className="flex items-center justify-center rounded-full text-white font-medium"
                      style={{ backgroundColor: '#0265d3', width: '24px', height: '24px', fontSize: '12px' }}
                    >
                      {index + 1}
                    </div>
                    <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                      {cat.title}
                    </span>
                  </div>
                  
                  <div 
                    className="px-3 py-1 rounded-md"
                    style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9', fontSize: '12px', fontWeight: '500', border: '1px solid #bae6fd' }}
                  >
                    {cat.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
