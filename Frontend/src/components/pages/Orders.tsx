import React, { useState, useEffect } from 'react';
import {
  RefreshCcw,
  Download,
  ChevronDown,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Trash2,
  Loader2,
  X,
  Plus
} from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chotabeta-backend.onrender.com';

interface OrderItem {
  id?: string | number;
  _id?: string | number;
  orderDate?: string;
  createdAt?: string;
  orderId?: string;
  customerName?: string;
  productName?: string;
  quantity?: number;
  status: string;
  price?: number;
  orderDetails?: string;
  productDetails?: string;
}

interface OrdersProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

const SortIcons = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: 0.3 }}>
    <ChevronDown size={11} style={{ transform: 'rotate(180deg)', display: 'block' }} />
    <ChevronDown size={11} style={{ display: 'block' }} />
  </div>
);

export default function Orders({ onLogout, onNavigate }: OrdersProps) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    productName: '',
    quantity: 1,
    status: 'PENDING',
    price: 0
  });

  const resetForm = () => {
    setFormData({
      orderId: '',
      customerName: '',
      productName: '',
      quantity: 1,
      status: 'PENDING',
      price: 0
    });
    setSelectedOrder(null);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentType, setFilterPaymentType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // In a real scenario, you'd pass filters to the backend
      // const params = { search: searchQuery, status: filterStatus, payment: filterPaymentType, range: filterDateRange };
      const response = await axios.get(`${BASE_URL}/api/order-items`);
      const data = response.data?.data || response.data;
      setOrdersData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = React.useMemo(() => {
    return ordersData.filter(order => {
      const matchesSearch = searchQuery === '' ||
        (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.productName || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === '' || order.status === filterStatus;

      // Note: Backend might not return paymentType yet, assuming it exists or adding placeholders
      const matchesPayment = filterPaymentType === '' || (order as any).paymentType === filterPaymentType;

      // Date Range logic (client side approximation)
      let matchesDate = true;
      if (filterDateRange && order.createdAt) {
        const orderDate = new Date(order.createdAt).getTime();
        const now = Date.now();
        const diff = now - orderDate;

        if (filterDateRange === 'last 30 minutes') matchesDate = diff <= 30 * 60 * 1000;
        else if (filterDateRange === 'last 1 hour') matchesDate = diff <= 60 * 60 * 1000;
        else if (filterDateRange === 'last 5 hours') matchesDate = diff <= 5 * 60 * 60 * 1000;
        else if (filterDateRange === 'last 1 day') matchesDate = diff <= 24 * 60 * 60 * 1000;
        else if (filterDateRange === 'last 7 days') matchesDate = diff <= 7 * 24 * 60 * 60 * 1000;
        else if (filterDateRange === 'last 30 days') matchesDate = diff <= 30 * 24 * 60 * 60 * 1000;
        else if (filterDateRange === 'last 365 days') matchesDate = diff <= 365 * 24 * 60 * 60 * 1000;
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [ordersData, searchQuery, filterStatus, filterPaymentType, filterDateRange]);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this order item?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/order-items/${id}`);
      toast.success('Order item deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order item');
    }
  };

  const handleEditClick = (order: OrderItem) => {
    setSelectedOrder(order);
    setFormData({
      status: order.status || 'PENDING'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const orderId = selectedOrder?._id || selectedOrder?.id;
    if (!orderId) return;

    setIsSubmitting(true);
    try {
      await axios.put(`${BASE_URL}/api/order-items/${orderId}`, formData);
      toast.success('Order updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = (format: 'csv' | 'excel') => {
    if (filteredOrders.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Order Date', 'Order Details', 'Product Details', 'Status'];
    const rows = filteredOrders.map((order, idx) => [
      idx + 1,
      order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.orderDate || 'N/A'),
      order.orderDetails || 'N/A',
      order.productDetails || 'Product N/A',
      order.status || 'PENDING'
    ]);

    let content = '';
    let fileName = `Orders_Export_${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    if (format === 'csv') {
      content = [headers, ...rows].map(r => r.join(',')).join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      fileName += '.csv';
    } else {
      // Simple HTML Table for Excel
      const table = `
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      `;
      content = `<html><head><meta charset="utf-8"></head><body>${table}</body></html>`;
      mimeType = 'application/vnd.ms-excel';
      fileName += '.xls';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleCreate = async () => {
    if (!formData.orderId || !formData.customerName) {
      toast.error('Order ID and Customer Name are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/order-items/create`, formData);
      toast.success('Order item created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 font-sans selection:bg-blue-500/30 text-white min-h-screen bg-[#070b14]">
      <Navbar onLogout={onLogout} />

      {/* Main Container */}
      <div className="dashboard-card p-6 shadow-2xl overflow-hidden bg-[#111827] border-[#1e293b]">

        {/* Row 1: Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-[18px] font-medium tracking-tight">Order Items ({filteredOrders.length} Items)</h1>
            <nav className="flex items-center gap-2 text-[12px] mt-1">
              {/* @ts-ignore */}
              <span className="text-blue-500 font-medium cursor-pointer hover:underline" onClick={() => onNavigate?.('dashboard')}>Home</span>
              <span className="text-slate-500">/</span>
              <span className="text-blue-200/80">Orders</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">


            <div className="relative min-w-[160px]">
              <select
                value={filterPaymentType}
                onChange={(e) => setFilterPaymentType(e.target.value)}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="">Payment Type</option>
                <option value="Cod">Cod</option>
                <option value="Wallet">Wallet</option>
                <option value="RazorpayPayment">RazorpayPayment</option>
                <option value="StripePayment">StripePayment</option>
                <option value="PaystackPayment">PaystackPayment</option>
                <option value="FlutterwavePayment">FlutterwavePayment</option>
              </select>
            </div>

            <div className="relative min-w-[150px]">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="">Status</option>
                <option value="Pending">Pending</option>
                <option value="Awaiting Store Response">Awaiting Store Response</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Preparing">Preparing</option>
                <option value="Collected">Collected</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="Refunded">Refunded</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="relative min-w-[140px]">
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full bg-[#0a0f18] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="">Date Range</option>
                <option value="last 30 minutes">last 30 minutes</option>
                <option value="last 1 hour">last 1 hour</option>
                <option value="last 5 hours">last 5 hours</option>
                <option value="last 1 day">last 1 day</option>
                <option value="last 7 days">last 7 days</option>
                <option value="last 30 days">last 30 days</option>
                <option value="last 365 days">last 365 days</option>
              </select>
            </div>

            <button
              onClick={fetchOrders}
              onMouseEnter={() => setHoveredBtn('refresh')}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center gap-2 px-4 py-1.5 transition-all duration-300 text-[13px] font-medium active:scale-95"
              style={{
                borderRadius: '12px',
                border: '2px solid #3b82f6',
                backgroundColor: hoveredBtn === 'refresh' ? '#3b82f6' : 'transparent',
                color: hoveredBtn === 'refresh' ? 'white' : '#3b82f6'
              }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
              Refresh
            </button>
          </div>
        </div>

        {/* Row 2: Search/Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-[200px] bg-[#1e2736] border border-[#2d3748] rounded-md px-4 py-1.5 text-[13px] text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
            />
            <div className="flex items-center gap-3">
              <select className="bg-[#1e2736] border border-[#2d3748] rounded-md pl-3 pr-8 py-1.5 text-[8px] text-slate-300 appearance-none focus:outline-none cursor-pointer">
                <option>10</option>
              </select>
              <span className="text-[13px] text-slate-100">entries per page</span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button className="bg-[#0a0f18] border border-[#2d3748] px-4 py-1.5 text-[13px] text-slate-200" style={{ borderRadius: '12px' }}>
              Columns <ChevronDown size={14} className="inline opacity-60" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                onMouseEnter={() => setHoveredBtn('export')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-2 px-4 py-1.5 text-[13px] font-medium transition-all duration-300 active:scale-95"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'export' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'export' ? 'white' : '#3b82f6'
                }}
              >
                <Download size={16} />
                Export <ChevronDown size={14} className="inline opacity-60" />
              </button>

              {isExportOpen && (
                <div 
                  className="absolute right-0 bottom-full mb-2 shadow-2xl overflow-hidden min-w-[120px] z-[99999]"
                  style={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #3b82f6', 
                    borderRadius: '8px'
                  }}
                >
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-slate-200 hover:bg-blue-600 hover:text-white transition-colors border-b border-white/10"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-slate-200 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Table with SOLID WHITE HEADER BORDER */}
        <div className="border border-[#2d3748] rounded-t-sm overflow-x-auto" style={{ overflowY: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #1e2736' }}>
          <table className="w-full text-center text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#1e2736', borderTop: '2px solid white', borderLeft: '1px solid white', borderRight: '1px solid white' }}>
                {[
                  "ID", "ORDER DATE", "ORDER DETAILS", "PRODUCT DETAILS", "STATUS", "ACTIONS"
                ].map((header, idx) => (
                  <th
                    key={header}
                    style={{
                      padding: '10px 16px',
                      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
                      borderBottom: '2px solid white',
                      fontSize: '14px',
                      color: 'white',
                      fontWeight: '200',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {header}
                      {["ID", "ORDER DATE", "ORDER DETAILS", "PRODUCT DETAILS"].includes(header) && <SortIcons />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#0c101a' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 size={40} className="animate-spin mx-auto text-blue-500 opacity-50" />
                    <p className="mt-4 text-slate-400 font-extralight uppercase tracking-widest text-[12px]">Loading Orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr style={{ backgroundColor: '#0c101a' }}>
                  <td colSpan={6} className="px-6 py-28 text-center bg-[#0c101a]">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Database size={52} className="text-slate-600 opacity-60" />
                      <p className="text-[16px] text-slate-500 font-medium">No results found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={`${order.id}-${index}`} className="hover:bg-slate-800/10 transition-colors border-b border-[#2d3748]/50">
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-300" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>{order.id}</td>
                    <td className="border-r border-[#2d3748]/30 uppercase text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[12px] mb-1">
                          {order.createdAt ? (() => {
                            const diff = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                            if (diff < 60) return `${diff} minutes ago`;
                            if (diff < 1440) return `${Math.floor(diff/60)} hours ago`;
                            return `${Math.floor(diff/1440)} days ago`;
                          })() : 'N/A'}
                        </span>
                        <span className="text-slate-100 text-[13px] font-medium">
                          {order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' ') : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '13px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                      <div className="flex items-start gap-4">
                        {order.productImage ? (
                          <img 
                            src={`https://superadmin.chotabeta.com/storage/${(order as any).mediaId}/${order.productImage}`} 
                            alt={order.productName}
                            className="w-16 h-16 rounded-md object-cover border border-[#2d3748]"
                            onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/64'; }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-[#1e2736] flex items-center justify-center border border-[#2d3748]">
                            <Database size={24} className="text-slate-600 opacity-40" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="text-blue-400 font-medium text-[14px]">Order ID: {order.orderIdNumber || order.id}</span>
                          <span className="text-slate-300">Buyer Name: <span className="text-slate-100">{order.customerName || 'N/A'}</span></span>
                          <span className="text-slate-300">Payment Method: <span className="text-slate-100">{order.paymentMethod || 'N/A'}</span></span>
                          <span className="text-slate-300">Is Rush Delivery: <span className="text-slate-100">{order.isRushOrder ? 'Yes' : 'No'}</span></span>
                          <span className="text-slate-300">Order Status: <span className="text-blue-400">{order.orderStatus || 'N/A'}</span></span>
                        </div>
                      </div>
                    </td>
                    <td className="border-r border-[#2d3748]/30 text-slate-100" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px', fontSize: '14px', fontWeight: '200', textAlign: 'left', letterSpacing: '0.1em' }}>
                      <div className="flex flex-col gap-1">
                        <span className="text-blue-400 font-medium">Product Name: {order.productName || 'N/A'}</span>
                        <span className="text-slate-300">Variant Name: <span className="text-slate-100">{(order as any).variantName || 'N/A'}</span></span>
                        <span className="text-slate-300">Store Name: <span className="text-slate-100">{(order as any).storeName || 'N/A'}</span></span>
                        <span className="text-slate-300">SKU: <span className="text-slate-100">{order.sku || 'N/A'}</span></span>
                        <span className="text-slate-300">Quantity: <span className="text-slate-100">{order.quantity || 0}</span></span>
                        <span className="text-slate-300">Item Sub Total: <span className="text-slate-100">₹{(order as any).subtotal || 0}</span></span>
                      </div>
                    </td>
                    <td className="border-r border-[#2d3748]/30" style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '20px', paddingBottom: '20px' }}>
                      <div className="flex justify-start">
                        <span
                          className={`uppercase px-2 py-1 rounded-sm text-[10px] tracking-wider font-bold ${
                            (order.status || '').toUpperCase() === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            (order.status || '').toUpperCase() === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            (order.status || '').toUpperCase() === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {order.status || 'PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-start gap-2">
                        <button
                          onClick={() => handleEditClick(order)}
                          onMouseEnter={() => setHoveredAction(`${order._id || order.id || index}-edit`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #3b82f6',
                            backgroundColor: hoveredAction === `${order._id || order.id || index}-edit` ? '#3b82f6' : 'transparent',
                            color: hoveredAction === `${order._id || order.id || index}-edit` ? 'white' : '#3b82f6'
                          }}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id || order.id!)}
                          onMouseEnter={() => setHoveredAction(`${order._id || order.id || index}-delete`)}
                          onMouseLeave={() => setHoveredAction(null)}
                          className="w-8 h-8 flex items-center justify-center transition-all duration-300 active:scale-90"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid #ef4444',
                            backgroundColor: hoveredAction === `${order._id || order.id || index}-delete` ? '#ef4444' : 'transparent',
                            color: hoveredAction === `${order._id || order.id || index}-delete` ? 'white' : '#ef4444'
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature White Box Line */}
        <div className="h-[2px] bg-white opacity-100 w-full mb-8"></div>

        {/* Row 4: Footer */}
        <div className="flex justify-between items-center px-1">
          <p className="text-[13px] text-slate-400 font-extralight tracking-tight opacity-70" style={{ fontWeight: '200' }}>
            Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries
          </p>

          <div className="flex items-center gap-4">
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronLeft size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronRight size={12} />
            </button>
            <button className="text-slate-600 opacity-40 cursor-not-allowed">
              <ChevronsRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px]">
          <div className="bg-[#111827] border border-[#1e293b] rounded-2xl shadow-2xl w-[500px] max-w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-5 border-b border-[#1e293b] flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-white tracking-tight">Update Order Status</h2>
                <div className="h-0.5 w-12 bg-blue-500 rounded-full mt-1"></div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-white transition-all hover:scale-110"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold uppercase opacity-70">Order ID</label>
                <div className="bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-slate-400">
                  {selectedOrder.orderId || 'N/A'}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-white text-[13px] font-bold uppercase opacity-70">Update Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#0c111d] border border-[#2d3748] rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-extralight"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Awaiting Store Response">Awaiting Store Response</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Collected">Collected</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-[#0a0f18] border-t border-[#1e293b] flex items-center justify-end gap-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                CANCEL
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                onMouseEnter={() => setHoveredBtn('save')}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center gap-3 px-8 py-3 transition-all duration-300 text-[13px] font-bold active:scale-95 disabled:opacity-50"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  backgroundColor: hoveredBtn === 'save' ? '#3b82f6' : 'transparent',
                  color: hoveredBtn === 'save' ? 'white' : '#3b82f6',
                }}
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
