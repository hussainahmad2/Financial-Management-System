import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthGuard } from './components/auth/AuthGuard';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardStats } from './components/dashboard/DashboardStats';
import { AnalyticsCharts } from './components/dashboard/AnalyticsCharts';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { VendorManagement } from './components/vendors/VendorManagement';
import { InvoiceManagement } from './components/invoices/InvoiceManagement';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { BalanceSheet } from './components/balance/BalanceSheet';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Financial Dashboard</h1>
              <p className="text-xl text-slate-300">Welcome to your comprehensive financial management system</p>
            </div>
            <DashboardStats />
            <AnalyticsCharts />
          </div>
        );
      case 'customers':
        return <CustomerManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'balance-sheet':
        return <BalanceSheet />;
      default:
        return <div className="text-white">Page not found</div>;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20height%3D%2232%22%20fill%3D%22none%22%20stroke%3D%22rgb(148%20163%20184%20/%200.02)%22%3e%3cpath%20d%3D%22m0%20.5%2032%2032M32%20.5%200%2032%22/%3e%3c/svg%3e')] bg-top"></div>
        
        <div className="relative z-10 flex h-screen">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default App;