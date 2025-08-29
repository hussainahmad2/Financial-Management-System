import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Download, Eye, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { InvoiceForm } from './InvoiceForm';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customers: { name: string };
  invoice_date: string;
  due_date: string;
  total_amount: number;
  status: string;
}

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const filtered = invoices.filter(invoice =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customers?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm]);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Invoice Management</h2>
          <p className="text-slate-300">Create and manage professional invoices</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoice List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Invoice #</p>
                  <p className="font-bold text-white">{invoice.invoice_number}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Customer</p>
                  <p className="font-medium text-white">{invoice.customers?.name}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Date</p>
                  <p className="text-sm text-slate-300">{format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Due Date</p>
                  <p className="text-sm text-slate-300">{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Amount</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(invoice.total_amount)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="h-3 w-3" />
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
          <InvoiceForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchInvoices();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}