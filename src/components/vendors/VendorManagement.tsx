import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VendorForm } from './VendorForm';
import { VendorTransactionModal } from './VendorTransactionModal';
import { useAuth } from '../../hooks/useAuth';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  current_balance: number;
  total_debit: number;
  total_credit: number;
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [vendors, searchTerm]);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (vendor: Vendor) => {
    setSelectedVendor(vendor);
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
          className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Vendor Management</h2>
          <p className="text-slate-300">Manage your vendor relationships and payment records</p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search vendors..."
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

      {/* Vendor List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                {/* Vendor Info */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-2">{vendor.name}</h3>
                  <div className="space-y-1 text-sm text-slate-300">
                    {vendor.email && <p>📧 {vendor.email}</p>}
                    {vendor.phone && <p>📞 {vendor.phone}</p>}
                    {vendor.company && <p>🏢 {vendor.company}</p>}
                  </div>
                </div>

                {/* Financial Summary - Vendor logic: balance = credit - debit */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-red-500/20 rounded-lg p-3">
                      <p className="text-xs text-red-400 font-medium">DEBIT</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(vendor.total_debit)}</p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3">
                      <p className="text-xs text-green-400 font-medium">CREDIT</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(vendor.total_credit)}</p>
                    </div>
                    <div className={`${vendor.current_balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-lg p-3`}>
                      <p className={`text-xs font-medium ${vendor.current_balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>BALANCE</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(vendor.current_balance)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddTransaction(vendor)}
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
          <VendorForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchVendors();
            }}
          />
        )}
        
        {showTransaction && selectedVendor && (
          <VendorTransactionModal
            vendor={selectedVendor}
            onClose={() => {
              setShowTransaction(false);
              setSelectedVendor(null);
            }}
            onSuccess={() => {
              setShowTransaction(false);
              setSelectedVendor(null);
              fetchVendors();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}