import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CustomerForm } from './CustomerForm';
import { TransactionModal } from './TransactionModal';
import { useAuth } from '../../hooks/useAuth';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  current_balance: number;
  total_debit: number;
  total_credit: number;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowTransaction(true);
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
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Management</h2>
          <p className="text-slate-300">Manage your customer relationships and financial records</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button variant="secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Customer List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Customer Info */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-2">{customer.name}</h3>
                  <div className="space-y-1 text-sm text-slate-300">
                    {customer.email && <p>📧 {customer.email}</p>}
                    {customer.phone && <p>📞 {customer.phone}</p>}
                    {customer.company && <p>🏢 {customer.company}</p>}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-500/20 rounded-lg p-3">
                      <p className="text-xs text-green-400 font-medium">DEBIT</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(customer.total_debit)}</p>
                    </div>
                    <div className="bg-red-500/20 rounded-lg p-3">
                      <p className="text-xs text-red-400 font-medium">CREDIT</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(customer.total_credit)}</p>
                    </div>
                    <div className={`${customer.current_balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-lg p-3`}>
                      <p className={`text-xs font-medium ${customer.current_balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>BALANCE</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(customer.current_balance)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddTransaction(customer)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Transaction
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
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
          <CustomerForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchCustomers();
            }}
          />
        )}
        
        {showTransaction && selectedCustomer && (
          <TransactionModal
            customer={selectedCustomer}
            onClose={() => {
              setShowTransaction(false);
              setSelectedCustomer(null);
            }}
            onSuccess={() => {
              setShowTransaction(false);
              setSelectedCustomer(null);
              fetchCustomers();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}