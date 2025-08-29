/*
  # Financial Management System - Initial Schema

  1. New Tables
    - `profiles` - User profile information linked to Supabase auth
    - `customers` - Customer management with contact details
    - `vendors` - Vendor management with contact details  
    - `customer_transactions` - All debit/credit transactions for customers
    - `vendor_transactions` - All debit/credit transactions for vendors
    - `inventory_items` - Product/service inventory tracking
    - `invoices` - Invoice generation and management
    - `invoice_items` - Line items for invoices
    - `balance_sheets` - Generated balance sheet records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Separate policies for different user roles

  3. Financial Logic
    - Proper foreign key relationships
    - Automated balance calculations through triggers
    - Transaction integrity constraints
*/

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'accountant', 'user')),
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  company text,
  tax_id text,
  current_balance decimal(15,2) DEFAULT 0,
  total_debit decimal(15,2) DEFAULT 0,
  total_credit decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vendors table  
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  company text,
  tax_id text,
  current_balance decimal(15,2) DEFAULT 0,
  total_debit decimal(15,2) DEFAULT 0,
  total_credit decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer transactions
CREATE TABLE IF NOT EXISTS customer_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('debit', 'credit')),
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  description text,
  reference_number text,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Vendor transactions
CREATE TABLE IF NOT EXISTS vendor_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vendor_id uuid REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('debit', 'credit')),
  amount decimal(15,2) NOT NULL CHECK (amount > 0),
  description text,
  reference_number text,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  sku text UNIQUE,
  category text,
  unit_price decimal(15,2) NOT NULL DEFAULT 0,
  quantity_in_stock integer DEFAULT 0,
  reorder_level integer DEFAULT 0,
  supplier_id uuid REFERENCES vendors(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  invoice_number text UNIQUE NOT NULL,
  invoice_date timestamptz DEFAULT now(),
  due_date timestamptz,
  subtotal decimal(15,2) DEFAULT 0,
  tax_amount decimal(15,2) DEFAULT 0,
  total_amount decimal(15,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoice items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id uuid REFERENCES inventory_items(id),
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(15,2) NOT NULL,
  total_price decimal(15,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Balance sheets
CREATE TABLE IF NOT EXISTS balance_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  total_assets decimal(15,2) DEFAULT 0,
  total_liabilities decimal(15,2) DEFAULT 0,
  total_equity decimal(15,2) DEFAULT 0,
  accounts_receivable decimal(15,2) DEFAULT 0,
  accounts_payable decimal(15,2) DEFAULT 0,
  inventory_value decimal(15,2) DEFAULT 0,
  generated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_sheets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can manage own customers" ON customers FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own vendors" ON vendors FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own customer transactions" ON customer_transactions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own vendor transactions" ON vendor_transactions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own inventory" ON inventory_items FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own invoices" ON invoices FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can view invoice items for own invoices" ON invoice_items FOR SELECT TO authenticated USING (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage invoice items for own invoices" ON invoice_items FOR INSERT TO authenticated WITH CHECK (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update invoice items for own invoices" ON invoice_items FOR UPDATE TO authenticated USING (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete invoice items for own invoices" ON invoice_items FOR DELETE TO authenticated USING (
  invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own balance sheets" ON balance_sheets FOR ALL TO authenticated USING (user_id = auth.uid());

-- Function to update customer balance
CREATE OR REPLACE FUNCTION update_customer_balance()
RETURNS trigger AS $$
BEGIN
  UPDATE customers SET
    total_debit = COALESCE((
      SELECT SUM(amount) FROM customer_transactions 
      WHERE customer_id = NEW.customer_id AND type = 'debit'
    ), 0),
    total_credit = COALESCE((
      SELECT SUM(amount) FROM customer_transactions 
      WHERE customer_id = NEW.customer_id AND type = 'credit'  
    ), 0),
    updated_at = now()
  WHERE id = NEW.customer_id;
  
  UPDATE customers SET
    current_balance = total_debit - total_credit
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Function to update vendor balance
CREATE OR REPLACE FUNCTION update_vendor_balance()
RETURNS trigger AS $$
BEGIN
  UPDATE vendors SET
    total_debit = COALESCE((
      SELECT SUM(amount) FROM vendor_transactions 
      WHERE vendor_id = NEW.vendor_id AND type = 'debit'
    ), 0),
    total_credit = COALESCE((
      SELECT SUM(amount) FROM vendor_transactions 
      WHERE vendor_id = NEW.vendor_id AND type = 'credit'
    ), 0),
    updated_at = now()
  WHERE id = NEW.vendor_id;
  
  UPDATE vendors SET
    current_balance = total_credit - total_debit
  WHERE id = NEW.vendor_id;
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Triggers for automatic balance updates
CREATE TRIGGER customer_transaction_balance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON customer_transactions
  FOR EACH ROW EXECUTE FUNCTION update_customer_balance();

CREATE TRIGGER vendor_transaction_balance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON vendor_transactions  
  FOR EACH ROW EXECUTE FUNCTION update_vendor_balance();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_transactions_customer_id ON customer_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_transactions_vendor_id ON vendor_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);