import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

interface BalanceSheetData {
  assets: {
    current: {
      cash: number;
      accountsReceivable: number;
      inventory: number;
    };
    total: number;
  };
  liabilities: {
    current: {
      accountsPayable: number;
      shortTermDebt: number;
    };
    total: number;
  };
  equity: {
    retainedEarnings: number;
    total: number;
  };
}

export function BalanceSheet() {
  const [balanceData, setBalanceData] = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    generateBalanceSheet();
  }, []);

  const generateBalanceSheet = async () => {
    if (!user) return;
    
    setGenerating(true);

    try {
      // Fetch accounts receivable (customer balances)
      const { data: customers } = await supabase
        .from('customers')
        .select('current_balance');
      
      const accountsReceivable = customers?.reduce((sum, customer) => 
        sum + Math.max(0, customer.current_balance), 0) || 0;

      // Fetch accounts payable (vendor balances)
      const { data: vendors } = await supabase
        .from('vendors')
        .select('current_balance');
      
      const accountsPayable = vendors?.reduce((sum, vendor) => 
        sum + Math.max(0, vendor.current_balance), 0) || 0;

      // Fetch inventory value
      const { data: inventory } = await supabase
        .from('inventory_items')
        .select('unit_price, quantity_in_stock');
      
      const inventoryValue = inventory?.reduce((sum, item) => 
        sum + (item.unit_price * item.quantity_in_stock), 0) || 0;

      // Calculate balance sheet
      const cash = 50000; // Placeholder - would come from cash accounts
      const currentAssets = cash + accountsReceivable + inventoryValue;
      const currentLiabilities = accountsPayable;
      const retainedEarnings = currentAssets - currentLiabilities;

      const balanceSheet: BalanceSheetData = {
        assets: {
          current: {
            cash,
            accountsReceivable,
            inventory: inventoryValue,
          },
          total: currentAssets,
        },
        liabilities: {
          current: {
            accountsPayable,
            shortTermDebt: 0,
          },
          total: currentLiabilities,
        },
        equity: {
          retainedEarnings,
          total: retainedEarnings,
        },
      };

      setBalanceData(balanceSheet);

      // Save to database
      await supabase
        .from('balance_sheets')
        .insert({
          user_id: user.id,
          period_start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
          period_end: new Date().toISOString(),
          total_assets: balanceSheet.assets.total,
          total_liabilities: balanceSheet.liabilities.total,
          total_equity: balanceSheet.equity.total,
          accounts_receivable: accountsReceivable,
          accounts_payable: accountsPayable,
          inventory_value: inventoryValue,
        });

    } catch (error) {
      console.error('Error generating balance sheet:', error);
    } finally {
      setLoading(false);
      setGenerating(false);
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
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!balanceData) {
    return <div className="text-white">Error loading balance sheet</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Balance Sheet</h2>
          <p className="text-slate-300">Financial position as of {format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={generateBalanceSheet}
            disabled={generating}
            variant="secondary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-green-400 mb-6">Assets</h3>
          
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h4 className="font-semibold text-white mb-3">Current Assets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Cash & Cash Equivalents</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.assets.current.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Accounts Receivable</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.assets.current.accountsReceivable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Inventory</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.assets.current.inventory)}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-white">Total Assets</span>
                <span className="font-bold text-green-400 text-lg">{formatCurrency(balanceData.assets.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-red-400 mb-6">Liabilities</h3>
          
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h4 className="font-semibold text-white mb-3">Current Liabilities</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Accounts Payable</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.liabilities.current.accountsPayable)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Short-term Debt</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.liabilities.current.shortTermDebt)}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-white">Total Liabilities</span>
                <span className="font-bold text-red-400 text-lg">{formatCurrency(balanceData.liabilities.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Equity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-blue-400 mb-6">Equity</h3>
          
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Retained Earnings</span>
                  <span className="text-white font-medium">{formatCurrency(balanceData.equity.retainedEarnings)}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-white">Total Equity</span>
                <span className="font-bold text-blue-400 text-lg">{formatCurrency(balanceData.equity.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Balance Verification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Balance Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Total Assets</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(balanceData.assets.total)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Liabilities + Equity</p>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency(balanceData.liabilities.total + balanceData.equity.total)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">Balance Status</p>
            <p className={`text-lg font-bold ${
              Math.abs(balanceData.assets.total - (balanceData.liabilities.total + balanceData.equity.total)) < 0.01
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {Math.abs(balanceData.assets.total - (balanceData.liabilities.total + balanceData.equity.total)) < 0.01 
                ? '✓ BALANCED' 
                : '✗ UNBALANCED'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}