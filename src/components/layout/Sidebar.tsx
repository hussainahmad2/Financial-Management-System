import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Truck, 
  Receipt, 
  BarChart3, 
  FileText, 
  Package,
  Building2,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Truck },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'balance-sheet', label: 'Balance Sheet', icon: FileText },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col h-full"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FinanceFlow</h1>
            <p className="text-xs text-slate-400">Professional Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </motion.button>

        <div className="mt-4 pt-4 border-t border-slate-700/50 text-center text-xs text-slate-500">
          <p>Developed by:</p>
          <p className="text-blue-400 font-semibold">HA Developers</p>
          <a href="mailto:hussainahmadbilal@gmail.com" className="text-slate-400 hover:text-blue-400 transition-colors">
            hussainahmadbilal@gmail.com
          </a>
        </div>
      </div>
    </motion.div>
  );
}