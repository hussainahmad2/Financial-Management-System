import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface InventoryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryForm({ onClose, onSuccess }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    unit_price: '',
    quantity_in_stock: '',
    reorder_level: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          ...formData,
          user_id: user.id,
          unit_price: parseFloat(formData.unit_price),
          quantity_in_stock: parseInt(formData.quantity_in_stock),
          reorder_level: parseInt(formData.reorder_level),
        });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Add Inventory Item</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <Input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics" className="bg-slate-800">Electronics</option>
                <option value="Office Supplies" className="bg-slate-800">Office Supplies</option>
                <option value="Furniture" className="bg-slate-800">Furniture</option>
                <option value="Software" className="bg-slate-800">Software</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
            </div>
            
            <Input
              name="unit_price"
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={formData.unit_price}
              onChange={handleChange}
              required
            />
            
            <Input
              name="quantity_in_stock"
              type="number"
              placeholder="Quantity in Stock"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              required
            />
          </div>

          <Input
            name="reorder_level"
            type="number"
            placeholder="Reorder Level"
            value={formData.reorder_level}
            onChange={handleChange}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}