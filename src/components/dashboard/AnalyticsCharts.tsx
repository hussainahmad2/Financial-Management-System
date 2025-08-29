import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 65000, expenses: 45000, profit: 20000 },
  { month: 'Feb', revenue: 78000, expenses: 52000, profit: 26000 },
  { month: 'Mar', revenue: 92000, expenses: 61000, profit: 31000 },
  { month: 'Apr', revenue: 85000, expenses: 58000, profit: 27000 },
  { month: 'May', revenue: 105000, expenses: 68000, profit: 37000 },
  { month: 'Jun', revenue: 124500, expenses: 75000, profit: 49500 },
];

const customerBalance = [
  { name: 'Paid', value: 75, color: '#10B981' },
  { name: 'Pending', value: 20, color: '#F59E0B' },
  { name: 'Overdue', value: 5, color: '#EF4444' },
];

const inventoryData = [
  { category: 'Electronics', value: 45000 },
  { category: 'Office Supplies', value: 23000 },
  { category: 'Furniture', value: 12000 },
  { category: 'Software', value: 9320 },
];

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trends */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'white'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Customer Balance Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Customer Balance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={customerBalance}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {customerBalance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'white'
              }} 
            />
            <Legend 
              wrapperStyle={{ color: 'white' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Profit Analysis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Profit Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'white'
              }} 
            />
            <Legend wrapperStyle={{ color: 'white' }} />
            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Inventory Value */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-6">Inventory by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                color: 'white'
              }} 
            />
            <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}