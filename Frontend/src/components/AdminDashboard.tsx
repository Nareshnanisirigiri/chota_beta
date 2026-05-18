import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Customers from './pages/Customers';
import SortCategories from './pages/SortCategories';
import BulkUploadCategories from './pages/BulkUploadCategories';
import BulkUploadBrands from './pages/BulkUploadBrands';
import WalletTransactions from './pages/WalletTransactions';
import PendingWalletDeposits from './pages/PendingWalletDeposits';
import Sellers from './pages/Sellers';
import AddSeller from './pages/AddSeller';
import EditSeller from './pages/EditSeller';
import SettlementOverview from './pages/SettlementOverview';
import SellerWithdrawals from './pages/SellerWithdrawals';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import Products from './pages/Products';
import PendingApprovalProducts from './pages/PendingApprovalProducts';
import ProductFaqs from './pages/ProductFaqs';
import TaxRates from './pages/TaxRates';
import DeliveryBoys from './pages/DeliveryBoys';
import DeliveryBoyEarnings from './pages/DeliveryBoyEarnings';
import EarningHistory from './pages/EarningHistory';
import DeliveryBoyCashCollections from './pages/DeliveryBoyCashCollections';
import CashCollectionHistory from './pages/CashCollectionHistory';
import DeliveryBoyWithdrawals from './pages/DeliveryBoyWithdrawals';
import WithdrawalHistory from './pages/WithdrawalHistory';
import Banners from './pages/Banners';
import FeaturedSections from './pages/FeaturedSections';
import SortFeaturedSections from './pages/SortFeaturedSections';
import Promos from './pages/Promos';

import FAQs from './pages/FAQs';
import DeliveryZones from './pages/DeliveryZones';
import Notifications from './pages/Notifications';
import Roles from './pages/Roles';
import SystemUsers from './pages/SystemUsers';
import SystemSettings from './pages/SystemSettings';
import WebSettings from './pages/WebSettings';
import AppSettings from './pages/AppSettings';
import HomeGeneralSettings from './pages/HomeGeneralSettings';
import StorageSettings from './pages/StorageSettings';
import AuthenticationSettings from './pages/AuthenticationSettings';
import EmailSettings from './pages/EmailSettings';
import PaymentSettings from './pages/PaymentSettings';
import NotificationSettings from './pages/NotificationSettings';
import DeliveryBoySettings from './pages/DeliveryBoySettings';
import SellerSettings from './pages/SellerSettings';
import SystemUpdates from './pages/SystemUpdates';
import Navbar from './Navbar';

// A simple placeholder for pages that don't have a dedicated component yet
const PlaceholderPage = ({ title, onLogout }: { title: string; onLogout: () => void }) => (
  <div className="p-8">
    <Navbar onLogout={onLogout} />
    <div className="dashboard-card p-12 flex flex-col items-center justify-center min-h-[500px] border-dashed border-2 border-foreground/20">
      <div className="w-24 h-24 mb-6 opacity-20">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-foreground w-full h-full">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </div>
      <h2 className="text-2xl font-normal text-foreground mb-2">{title}</h2>
      <p className="text-foreground/60 text-center max-w-md">
        The <span className="text-blue-500 font-normal">{title}</span> module is currently under development.
        It will feature advanced management tools and real-time analytics for your platform.
      </p>
    </div>
  </div>
);

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    // Map of specific pages that have components
    if (currentPage === 'dashboard') return <Dashboard onLogout={onLogout} />;
    if (currentPage === 'settings') return <Settings onLogout={onLogout} />;
    if (currentPage === 'orders') return <Orders onLogout={onLogout} />;
    if (currentPage === 'categories') return <Categories onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'brands') return <Brands onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'customers') return <Customers onLogout={onLogout} />;
    if (currentPage === 'sort') return <SortCategories onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'bulk-upload') return <BulkUploadCategories onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'bulk-upload-brands') return <BulkUploadBrands onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'wallet transactions') return <WalletTransactions onLogout={onLogout} />;
    if (currentPage === 'pending wallet deposits') return <PendingWalletDeposits onLogout={onLogout} />;
    if (currentPage === 'sellers') return <Sellers onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'add-seller') return <AddSeller onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage.startsWith('edit-seller-')) {
      const sellerId = currentPage.split('edit-seller-')[1];
      return <EditSeller onLogout={onLogout} onNavigate={setCurrentPage} sellerId={Number(sellerId)} />;
    }
    if (currentPage === 'settlement-overview') return <SettlementOverview onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'seller-withdrawals' || currentPage === 'withdrawal-history') return <SellerWithdrawals onLogout={onLogout} onNavigate={setCurrentPage} currentPage={currentPage} />;
    if (currentPage === 'stores') return <Stores onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'store-details') return <StoreDetails onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'products' || currentPage === 'newsletter') return <Products onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'pending-approval-products') return <PendingApprovalProducts onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'product-faqs') return <ProductFaqs onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'tax-rates') return <TaxRates onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys') return <DeliveryBoys onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys-earnings') return <DeliveryBoyEarnings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys-earnings-history') return <EarningHistory onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys-cash-collections') return <DeliveryBoyCashCollections onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'cash-collection-history') return <CashCollectionHistory onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys-withdrawals') return <DeliveryBoyWithdrawals onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boys-withdrawal-history') return <WithdrawalHistory onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'banners') return <Banners onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'manage-featured-section') return <FeaturedSections onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'sort-featured-section') return <SortFeaturedSections onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'promos') return <Promos onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'faqs') return <FAQs onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-zones') return <DeliveryZones onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'notifications') return <Notifications onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'roles') return <Roles onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'system-users') return <SystemUsers onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'system') return <SystemSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'web') return <WebSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'app') return <AppSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'home-general-settings') return <HomeGeneralSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'storage') return <StorageSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'authentication' || currentPage === 'custom-sms' || currentPage === 'google-keys' || currentPage === 'firebase' || currentPage === 'social-login') 
      return <AuthenticationSettings onLogout={onLogout} onNavigate={setCurrentPage} currentPage={currentPage} />;
    if (currentPage === 'email') return <EmailSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'payment') return <PaymentSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'notification') return <NotificationSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'delivery-boy') return <DeliveryBoySettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'seller') return <SellerSettings onLogout={onLogout} onNavigate={setCurrentPage} />;
    if (currentPage === 'system-updates') return <SystemUpdates onLogout={onLogout} onNavigate={setCurrentPage} />;

    // For all other routes in the sidebar, show the placeholder with the formatted title
    const formattedTitle = currentPage
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return <PlaceholderPage title={formattedTitle} onLogout={onLogout} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} onLogout={onLogout} />
      <div className="flex-1 overflow-auto bg-transparent">
        {renderPage()}
      </div>
    </div>
  );
}
