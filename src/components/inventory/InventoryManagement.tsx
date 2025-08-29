import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InventoryForm } from './InventoryForm';
import { useAuth } from '../../hooks/useAuth';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit_price: number;
  quantity_in_stock: number;
  reorder_level: number;
}

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + (item.unit_price * item.quantity_in_stock), 0);
  };

  const getLowStockItems = () => {
    return items.filter(item => item.quantity_in_stock <= item.reorder_level);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Inventory Management</h2>
          <p className="text-slate-300">Track and manage your inventory with smart analytics</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <Package className="h-8 w-8 text-teal-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">{items.length}</h3>
              <p className="text-slate-300 text-sm">Total Items</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(getTotalValue())}</h3>
              <p className="text-slate-300 text-sm">Total Value</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-8 w-8 text-orange-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">{getLowStockItems().length}</h3>
              <p className="text-slate-300 text-sm">Low Stock Alert</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div>
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-400">SKU: {item.sku}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Category</p>
                  <p className="text-sm text-slate-300">{item.category}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Unit Price</p>
                  <p className="font-medium text-white">{formatCurrency(item.unit_price)}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Stock</p>
                  <p className={`text-lg font-bold ${
                    item.quantity_in_stock <= item.reorder_level 
                      ? 'text-orange-400' 
                      : 'text-green-400'
                  }`}>
                    {item.quantity_in_stock}
                  </p>
                  {item.quantity_in_stock <= item.reorder_level && (
                    <p className="text-xs text-orange-400">Low Stock!</p>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Value</p>
                  <p className="font-bold text-white">
                    {formatCurrency(item.unit_price * item.quantity_in_stock)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary">
                    Adjust
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <InventoryForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchItems();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}