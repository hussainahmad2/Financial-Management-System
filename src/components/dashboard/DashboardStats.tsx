import React from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, Receipt, TrendingUp, DollarSign, Package } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  delay: number;
}

function StatCard({ title, value, change, icon: Icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-green-400 text-sm font-medium">{change}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-slate-300 text-sm">{title}</p>
    </motion.div>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Customers',
      value: '248',
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
      delay: 0.1,
    },
    {
      title: 'Active Vendors',
      value: '64',
      change: '+8.2%',
      icon: Truck,
      color: 'bg-purple-500',
      delay: 0.2,
    },
    {
      title: 'Monthly Revenue',
      value: '$124,500',
      change: '+23.1%',
      icon: DollarSign,
      color: 'bg-green-500',
      delay: 0.3,
    },
    {
      title: 'Pending Invoices',
      value: '18',
      change: '-5.4%',
      icon: Receipt,
      color: 'bg-orange-500',
      delay: 0.4,
    },
    {
      title: 'Inventory Value',
      value: '$89,320',
      change: '+15.7%',
      icon: Package,
      color: 'bg-teal-500',
      delay: 0.5,
    },
    {
      title: 'Growth Rate',
      value: '24.8%',
      change: '+4.2%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      delay: 0.6,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}