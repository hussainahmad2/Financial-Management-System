import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface Vendor {
  id: string;
  name: string;
}

interface VendorTransactionModalProps {
  vendor: Vendor;
  onClose: () => void;
  onSuccess: () => void;
}

export function VendorTransactionModal({ vendor, onClose, onSuccess }: VendorTransactionModalProps) {
  const [type, setType] = useState<'debit' | 'credit'>('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('vendor_transactions')
        .insert({
          vendor_id: vendor.id,
          user_id: user.id,
          type,
          amount: parseFloat(amount),
          description,
          reference_number: referenceNumber,
        });

      if (error) throw error;
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-slate-700/50"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Add Transaction</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-sm text-purple-400">Vendor: <span className="font-semibold text-white">{vendor.name}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => setType('credit')}
              variant={type === 'credit' ? 'success' : 'secondary'}
              size="sm"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Credit
            </Button>
            <Button
              type="button"
              onClick={() => setType('debit')}
              variant={type === 'debit' ? 'danger' : 'secondary'}
              size="sm"
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
              Debit
            </Button>
          </div>

          <Input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <Input
            placeholder="Reference Number"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
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
              variant={type === 'credit' ? 'success' : 'danger'}
            >
              {loading ? 'Processing...' : `Add ${type === 'credit' ? 'Credit' : 'Debit'}`}
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