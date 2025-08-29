import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AnalyticsCharts } from '../dashboard/AnalyticsCharts';

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const reportCards = [
    {
      title: 'Revenue Report',
      description: 'Detailed revenue analysis and trends',
      icon: DollarSign,
      color: 'bg-green-500',
      value: '$124,500',
      change: '+23.1%',
    },
    {
      title: 'Customer Analysis',
      description: 'Customer behavior and payment patterns',
      icon: Users,
      color: 'bg-blue-500',
      value: '248',
      change: '+12.5%',
    },
    {
      title: 'Growth Metrics',
      description: 'Business growth indicators and forecasts',
      icon: TrendingUp,
      color: 'bg-purple-500',
      value: '24.8%',
      change: '+4.2%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-slate-300">Comprehensive business intelligence and insights</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{card.change}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{card.value}</h3>
              <h4 className="text-lg font-semibold text-white mb-2">{card.title}</h4>
              <p className="text-slate-300 text-sm">{card.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Detailed Reports Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Generate Detailed Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Customer Ledger',
            'Vendor Payments', 
            'Profit & Loss',
            'Cash Flow',
            'Aging Report',
            'Tax Summary',
            'Inventory Valuation',
            'Balance Sheet'
          ].map((report, index) => (
            <motion.button
              key={report}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-left transition-all duration-200"
            >
              <h4 className="font-semibold text-white mb-1">{report}</h4>
              <p className="text-xs text-slate-400">Generate & download</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}