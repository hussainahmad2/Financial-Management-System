import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../lib/utils';

interface Customer {
  id: string;
  name: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface InvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function InvoiceForm({ onClose, onSuccess }: InvoiceFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unit_price: 0, total_price: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
    generateInvoiceNumber();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, name')
      .order('name');
    setCustomers(data || []);
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setInvoiceNumber(`INV-${timestamp}`);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].unit_price = unitPrice;
    newItems[index].total_price = quantity * unitPrice;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCustomerId) return;

    setLoading(true);
    setError('');

    try {
      const { subtotal, taxAmount, total } = calculateTotals();
      
      // Create invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          customer_id: selectedCustomerId,
          invoice_number: invoiceNumber,
          due_date: dueDate,
          subtotal,
          tax_amount: taxAmount,
          total_amount: total,
          notes,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const itemsToInsert = items.map(item => ({
        invoice_id: invoiceData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

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
        className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl border border-slate-700/50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Create Invoice</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id} className="bg-slate-800">
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
            
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-white">Invoice Items</h4>
              <Button
                type="button"
                onClick={addItem}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].description = e.target.value;
                    setItems(newItems);
                  }}
                  required
                />
                
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItemTotal(index, parseInt(e.target.value) || 0, item.unit_price)}
                  required
                />
                
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => updateItemTotal(index, item.quantity, parseFloat(e.target.value) || 0)}
                  required
                />
                
                <div className="bg-white/5 rounded-xl px-3 py-3 border border-white/10">
                  <p className="text-sm text-slate-300">Total: ${item.total_price.toFixed(2)}</p>
                </div>

                {items.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    variant="danger"
                    size="sm"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Invoice Totals */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Tax:</span>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-20 text-center"
                  />
                  <span className="text-slate-300">%</span>
                </div>
                <span className="text-white font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between">
                <span className="text-white font-bold">Total:</span>
                <span className="text-white font-bold text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none h-24"
            />
          </div>

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
              {loading ? 'Creating...' : 'Create Invoice'}
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