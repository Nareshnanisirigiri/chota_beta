import React from 'react';
import Navbar from '../Navbar';
import { TrendingUp, Calendar, ChevronDown, Bell, Sun, Languages, Store, ShoppingCart, Bike, Box } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Mock Data for the mini charts
const revenueChartData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 35 }, { value: 20 }, { value: 45 }, { value: 30 }
];

const registrationChartData = [
  { value: 20 }, { value: 50 }, { value: 30 }, { value: 80 }, { value: 40 }, { value: 90 }, { value: 60 }
];

const commissionData = [
  { date: '03:00', value: 0 },
  { date: '06:00', value: 0 },
  { date: '09:00', value: 0 },
  { date: '12:00', value: 0 },
  { date: '15:00', value: 0 },
  { date: '18:00', value: 0 },
  { date: '21:00', value: 0 },
  { date: '07 Mar', value: 0 },
];

const enhancedCommissionData = [
  { date: '15 Feb', value: 0 },
  { date: '16 Feb', value: 0 },
  { date: '17 Feb', value: 0 },
  { date: '18 Feb', value: 0 },
];

const categoriesData = [
  { name: 'Dal & Pulses', count: 3, icon: 'https://cdn-icons-png.flaticon.com/512/2311/2311634.png' },
  { name: 'Pickles', count: 1, icon: 'https://cdn-icons-png.flaticon.com/512/123/123307.png' },
  { name: 'chicken pickle', count: 1, icon: 'https://cdn-icons-png.flaticon.com/512/2311/2311634.png' },
  { name: 'Biryani', count: 1, icon: 'https://cdn-icons-png.flaticon.com/512/2276/2276931.png' },
  { name: 'Oils & Ghee', count: 0, icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050854.png' },
];

const dailyOrdersData = [
  { date: '2026-02-14', count: 0 },
  { date: '2026-02-15', count: 0 },
  { date: '2026-02-16', count: 0 },
  { date: '2026-02-17', count: 0 },
  { date: '2026-02-18', count: 0 },
  { date: '2026-02-19', count: 0 },
  { date: '2026-02-20', count: 0 },
];

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [stats, setStats] = React.useState({
    ordersCount: 21,
    sellersCount: 2,
    productsCount: 6,
    revenue: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/stats`);
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-screen text-foreground font-sans selection:bg-blue-500/30" style={{ backgroundColor: 'transparent' }}>
      <Navbar onLogout={onLogout} />

      {/* Hero row - Side-by-Side matching User Reference Image */}
      <div
        className="mb-8"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          alignItems: 'stretch',
          width: '100%'
        }}
      >

        {/* 1. Welcome Card */}
        <div
          className="dashboard-card p-4 relative overflow-hidden flex flex-col justify-between min-h-[150px]"
          style={{ flex: 2, minWidth: '250px' }}
        >
          <div className="relative z-10 flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold leading-[1.2] mb-4 text-foreground">
              Welcome Back,<br />
              Bharath
            </h2>

            <div className="mt-auto space-y-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-foreground/60 font-normal tracking-wide">SALES</span>
                  <button className="text-[12px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
                    Last 30 days <ChevronDown size={14} />
                  </button>
                </div>
                <span className="text-4xl font-semibold text-foreground block">0%</span>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-10 mb-2">
                  <span className="text-sm font-normal text-foreground/80">Conversion rate</span>
                  <span className="text-sm font-normal text-emerald-500 flex items-center gap-2">
                    0% <TrendingUp size={16} />
                  </span>
                </div>
                <p className="text-[14px] text-foreground/60 leading-snug">
                  0 delivered out of total orders {stats.ordersCount}
                </p>
                <div className="w-full h-1 bg-foreground/10 rounded-full mt-2 overflow-hidden">
                  <div className="w-[5%] h-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Illustration */}
          <div className="absolute right-0 top-0 bottom-0 w-[240px] pointer-events-none">
            <img
              src="https://superadmin.chotabeta.com/assets/theme/img/dashboard.svg"
              alt="Welcome Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* 2. Revenue Card */}
        <div
          className="dashboard-card py-4 px-6 flex flex-col justify-between group border-b-[3px] border-b-[#10b981] min-h-[180px]"
          style={{ flex: 1, minWidth: '220px' }}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[2px] text-foreground/60 uppercase tracking-wider">REVENUE</span>
              <button className="text-[11px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
                Last 30 days <ChevronDown size={12} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="text-3xl font-normal text-foreground tracking-tight">₹{Number(stats.revenue).toLocaleString()}</h3>
              <div className="text-emerald-500 text-[12px] font-normal flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                31 Days <Calendar size={14} />
              </div>
            </div>
          </div>

          <div className="h-20 w-full mt-auto -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. New User Registrations Card */}
        <div
          className="dashboard-card py-4 px-6 flex flex-col justify-between group border-b-[3px] border-b-[#f97316] min-h-[180px]"
          style={{ flex: 1, minWidth: '220px' }}
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[2px] text-foreground/60 uppercase tracking-wider max-w-[80px] leading-tight">NEW USER REGISTRATIONS</span>
              <button className="text-[11px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors mt-0.5">
                Last 30 days <ChevronDown size={12} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <h3 className="text-3xl font-normal text-foreground tracking-tight">5</h3>
              <div className="text-emerald-500 text-[12px] font-normal flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                100% <TrendingUp size={16} />
              </div>
            </div>
          </div>

          <div className="h-20 w-full mt-auto pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={registrationChartData}>
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} barSize={10} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* 1. Sellers Stat */}
        <div className="dashboard-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20">
            <Store className="text-foreground" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-normal text-foreground leading-tight">{stats.sellersCount} Sellers</h4>
            <p className="text-[12px] text-foreground/60">Active Stores</p>
          </div>
        </div>

        {/* 2. Orders Stat */}
        <div className="dashboard-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/20">
            <ShoppingCart className="text-foreground" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-normal text-foreground leading-tight">{stats.ordersCount} Orders</h4>
            <p className="text-[12px] text-foreground/60">Total Orders</p>
          </div>
        </div>

        {/* 3. Delivery Boys Stat */}
        <div className="dashboard-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-900/20">
            <Bike className="text-foreground" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-normal text-foreground leading-tight">Delivery Boys</h4>
            <p className="text-[12px] text-foreground/60">Active Status</p>
          </div>
        </div>

        {/* 4. Products Stat */}
        <div className="dashboard-card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-900/20">
            <Box className="text-foreground" size={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-normal text-foreground leading-tight">{stats.productsCount} Products</h4>
            <p className="text-[12px] text-foreground/60">In Inventory</p>
          </div>
        </div>
      </div>

      {/* Commission Charts Row - Matching User Reference Image 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 uppercase-headings">

        {/* 1. Order Commission Chart */}
        <div className="dashboard-card p-6 min-h-[420px] flex flex-col">
          <h3 className="text-[17px] font-normal text-foreground mb-8">Order Commission (Last 30 Days)</h3>

          <div className="flex-1 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commissionData} margin={{ left: -15, right: 10, bottom: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="currentColor" strokeOpacity={0.2} />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: 'currentColor', strokeWidth: 1.5 }}
                  tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                   axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(value) => `₹${value}`}
                  domain={[0, 2]}
                  ticks={[0, 0.5, 1, 1.5, 2]}
                  width={45}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Enhanced Commissions Chart */}
        <div className="dashboard-card p-6 min-h-[420px] flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <h3 className="text-[17px] font-normal text-foreground">Enhanced Commissions</h3>
            <button className="text-[12px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Last 30 days <ChevronDown size={14} />
            </button>
          </div>

          {/* Tri-Metric Summary Strip - Replicated from image */}
          <div className="grid grid-cols-3 gap-0 mb-10 text-center border-b border-foreground/10 pb-8">
            <div className="flex flex-col gap-1.5">
               <span className="text-[24px] font-normal text-foreground tracking-tight leading-none">₹0.00</span>
              <span className="text-[13px] text-foreground/60 font-medium tracking-tight">Total Commission</span>
            </div>
            <div className="flex flex-col gap-1.5 border-x border-foreground/10">
               <span className="text-[24px] font-normal text-foreground tracking-tight leading-none">0</span>
              <span className="text-[13px] text-foreground/60 font-medium tracking-tight">Total Orders</span>
            </div>
            <div className="flex flex-col gap-1.5">
               <span className="text-[24px] font-normal text-foreground tracking-tight leading-none">₹0.00</span>
              <span className="text-[13px] text-foreground/60 font-medium tracking-tight">Avg. Commission</span>
            </div>
          </div>

          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enhancedCommissionData} margin={{ left: -10, right: 10, bottom: 0, top: 10 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.1} />
                <XAxis
                  dataKey="date"
                  axisLine={{ stroke: 'currentColor', strokeWidth: 1.5 }}
                  tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
                  domain={[0, 2]}
                  ticks={[0, 0.5, 1, 1.5, 2]}
                  width={40}
                />
                <Tooltip
                   contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fillOpacity={0}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Lists Row - Matching User Reference Image 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* 1. Top Sellers */}
        <div className="dashboard-card p-6 min-h-[400px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-normal text-foreground">Top Sellers</h3>
            <button className="text-[12px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Last 30 days <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-4">
            <div className="w-64 h-64 opacity-80 dark:mix-blend-screen">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-illustration-download-in-svg-png-gif-file-formats--no-data-not-found-web-development-pack-business-illustrations-4545524.png"
                alt="No Data"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* 2. Top Selling Products */}
        <div className="dashboard-card p-6 min-h-[400px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-normal text-foreground">Top Selling Products</h3>
            <button className="text-[12px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Last 30 days <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-4">
            <div className="w-64 h-64 opacity-80 dark:mix-blend-screen">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-illustration-download-in-svg-png-gif-file-formats--no-data-not-found-web-development-pack-business-illustrations-4545524.png"
                alt="No Data"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* 3. Top Delivery Boys */}
        <div className="dashboard-card p-6 min-h-[400px] flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-normal text-foreground">Top Delivery Boys</h3>
            <button className="text-[12px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Last 30 days <ChevronDown size={14} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-4">
            <div className="w-64 h-64 opacity-80 dark:mix-blend-screen">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-illustration-download-in-svg-png-gif-file-formats--no-data-not-found-web-development-pack-business-illustrations-4545524.png"
                alt="No Data"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Categories Section - Matching User Reference Image 5 */}
      <div className="dashboard-card p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-8">
           <h3 className="text-[17px] font-normal text-foreground">Categories</h3>
          <div className="flex items-center gap-4 ml-4">
            <button className="text-[13px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              All Categories <ChevronDown size={14} />
            </button>
            <button className="text-[13px] text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Sort by Products Count <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categoriesData.map((cat, idx) => (
             <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-xl p-6 flex flex-col items-center justify-center group hover:border-foreground/20 transition-all cursor-pointer">
              <div className="w-16 h-16 mb-4 p-2 bg-foreground/5 rounded-lg group-hover:scale-110 transition-transform">
                <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain dark:mix-blend-lighten" />
              </div>
              <h4 className="text-sm font-normal text-foreground mb-2 text-center">{cat.name}</h4>
              <p className="text-[12px] text-foreground/60">{cat.count} Products</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Orders History Section - Matching User Reference Image 6 */}
      <div className="dashboard-card p-6 mb-8 min-h-[400px]">
         <h3 className="text-[17px] font-normal text-foreground mb-8">Daily Orders History</h3>

        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-foreground/60 text-[14px] font-medium">Today's Earning :</span>
            <span className="text-foreground text-[14px] font-normal">₹0.00</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500 text-[13px] mt-1 font-medium">
            <TrendingUp size={14} />
            <span>0 % more than yesterday</span>
          </div>
        </div>

        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyOrdersData} margin={{ left: 0, right: 0, bottom: 0, top: 0 }}>
              <CartesianGrid vertical={false} stroke="#1e293b" strokeOpacity={0.5} strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, 10]} />
              <Tooltip
                cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card p-3 rounded-lg shadow-2xl border border-foreground/10" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <p className="text-[12px] font-normal text-foreground mb-2">{label}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <p className="text-[12px] font-normal text-foreground/80">
                            Order Count: <span className="text-foreground">{payload[0].value} Items</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#37a0ff"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#37a0ff',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  className: "shadow-lg shadow-blue-500/50"
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Baseline matching Reference Image */}
          <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#37a0ff] opacity-80"></div>
        </div>
      </div>

    </div>
  );
}
