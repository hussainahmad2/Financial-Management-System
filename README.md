# 🏦 FinanceFlow - Professional Financial Management System

> **Advanced Financial Management System** - A comprehensive, modern web application for managing business finances, customers, vendors, invoices, and inventory with real-time analytics and reporting.

![FinanceFlow Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-orange)
![Vite](https://img.shields.io/badge/Vite-7.1.3-purple)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🎯 Overview

FinanceFlow is a modern, full-stack financial management system designed for businesses of all sizes. Built with React, TypeScript, and Supabase, it provides a comprehensive solution for managing financial operations with a beautiful, responsive interface and real-time data synchronization.

### Key Benefits
- **Real-time Financial Tracking** - Monitor cash flow, receivables, and payables instantly
- **Professional Invoicing** - Create and manage professional invoices with tax calculations
- **Customer & Vendor Management** - Complete CRM and vendor relationship management
- **Inventory Control** - Track inventory levels with low stock alerts
- **Advanced Analytics** - Comprehensive reporting and business intelligence
- **Secure & Scalable** - Built on Supabase with enterprise-grade security

## ✨ Features

### 🔐 Authentication & Security
- **Secure User Authentication** with Supabase Auth
- **Role-based Access Control** (Admin, Accountant, User)
- **Row Level Security** (RLS) for data protection
- **Session Management** with automatic token refresh

### 👥 Customer Management
- **Customer Profiles** with contact information and company details
- **Financial Tracking** with debit/credit transaction history
- **Balance Calculations** with automatic updates
- **Search & Filter** capabilities for easy customer lookup
- **Transaction Management** with detailed audit trails

### 🏢 Vendor Management
- **Vendor Profiles** with complete business information
- **Payment Tracking** with credit/debit transaction system
- **Balance Monitoring** with real-time calculations
- **Transaction History** with reference numbers and descriptions

### 📄 Invoice Management
- **Professional Invoice Creation** with line items and tax calculations
- **Customer Integration** with automatic customer selection
- **Status Tracking** (Pending, Paid, Overdue, Cancelled)
- **PDF Export** capability (ready for implementation)
- **Due Date Management** with automated reminders

### 📦 Inventory Management
- **Product Catalog** with SKU tracking and categorization
- **Stock Level Monitoring** with low stock alerts
- **Value Calculations** with real-time inventory valuation
- **Category Management** (Electronics, Office Supplies, Furniture, Software)
- **Reorder Level Alerts** for inventory optimization

### 📊 Analytics & Reporting
- **Dashboard Analytics** with key performance indicators
- **Revenue Trends** with interactive charts
- **Customer Balance Distribution** with pie charts
- **Profit Analysis** with expense tracking
- **Inventory Valuation** by category
- **Balance Sheet Generation** with real-time calculations

### 🎨 User Interface
- **Modern Dark Theme** with glassmorphism effects
- **Responsive Design** for all device sizes
- **Smooth Animations** with Framer Motion
- **Interactive Charts** with Recharts
- **Professional Typography** and color scheme

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development
- **Vite 7.1.3** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Smooth animations and transitions
- **Recharts 3.1.2** - Interactive charts and data visualization
- **React Hook Form 7.62.0** - Form handling with validation
- **Zod 4.1.5** - Schema validation
- **Lucide React 0.344.0** - Beautiful icons
- **Date-fns 4.1.0** - Date manipulation utilities

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with advanced features
- **Row Level Security (RLS)** - Data protection at the database level
- **Real-time Subscriptions** - Live data updates
- **Authentication** - Built-in user management

### Development Tools
- **ESLint 9.34.0** - Code linting and formatting
- **TypeScript ESLint 8.3.0** - TypeScript-specific linting rules
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - CSS vendor prefixing

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1e293b/ffffff?text=FinanceFlow+Dashboard)

### Customer Management
![Customer Management](https://via.placeholder.com/800x400/1e293b/ffffff?text=Customer+Management)

### Invoice Creation
![Invoice Creation](https://via.placeholder.com/800x400/1e293b/ffffff?text=Invoice+Creation)

### Analytics
![Analytics](https://via.placeholder.com/800x400/1e293b/ffffff?text=Analytics+Charts)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/financeflow.git
cd financeflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment variables
cp .env.example .env

# Edit .env file with your Supabase credentials
nano .env
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to `http://localhost:5173`

## 📦 Installation

### Step-by-Step Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd managementsystem
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Run Supabase migrations
   npx supabase db push
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   ```bash
   npx supabase db push
   ```

3. **Configure Authentication**
   - Enable email authentication in Supabase dashboard
   - Configure email templates if needed

## 🗄️ Database Schema

### Core Tables

#### `profiles`
- User profile information linked to Supabase auth
- Fields: id, email, full_name, role, company_name

#### `customers`
- Customer management with financial tracking
- Fields: id, user_id, name, email, phone, address, company, current_balance, total_debit, total_credit

#### `vendors`
- Vendor management with payment tracking
- Fields: id, user_id, name, email, phone, address, company, current_balance, total_debit, total_credit

#### `customer_transactions`
- Customer debit/credit transactions
- Fields: id, user_id, customer_id, type, amount, description, reference_number

#### `vendor_transactions`
- Vendor debit/credit transactions
- Fields: id, user_id, vendor_id, type, amount, description, reference_number

#### `inventory_items`
- Product inventory tracking
- Fields: id, user_id, name, description, sku, category, unit_price, quantity_in_stock, reorder_level

#### `invoices`
- Invoice management
- Fields: id, user_id, customer_id, invoice_number, due_date, subtotal, tax_amount, total_amount, status

#### `invoice_items`
- Invoice line items
- Fields: id, invoice_id, description, quantity, unit_price, total_price

#### `balance_sheets`
- Generated balance sheet records
- Fields: id, user_id, period_start, period_end, total_assets, total_liabilities, total_equity

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **User-specific data isolation**
- **Comprehensive access policies**
- **Automatic balance calculations** via database triggers

## 📁 Project Structure

```
managementsystem/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── balance/        # Balance sheet components
│   │   ├── customers/      # Customer management
│   │   ├── dashboard/      # Dashboard and analytics
│   │   ├── inventory/      # Inventory management
│   │   ├── invoices/       # Invoice management
│   │   ├── layout/         # Layout components
│   │   ├── reports/        # Reports and analytics
│   │   ├── ui/            # Reusable UI components
│   │   └── vendors/       # Vendor management
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔌 API Documentation

### Authentication Endpoints

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: string,
  password: string
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Database Operations

#### Customers
```typescript
// Fetch customers
const { data, error } = await supabase
  .from('customers')
  .select('*')
  .order('created_at', { ascending: false });

// Insert customer
const { data, error } = await supabase
  .from('customers')
  .insert(customerData);
```

#### Transactions
```typescript
// Add customer transaction
const { data, error } = await supabase
  .from('customer_transactions')
  .insert(transactionData);
```

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
npx supabase db push # Push migrations to database
npx supabase db reset # Reset database
```

### Development Guidelines

1. **Code Style**
   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Use functional components with hooks

2. **Component Structure**
   - Keep components small and focused
   - Use proper TypeScript interfaces
   - Implement error boundaries where needed

3. **State Management**
   - Use React hooks for local state
   - Use Supabase for server state
   - Implement proper loading states

4. **Testing**
   - Write unit tests for utilities
   - Test component interactions
   - Mock Supabase calls in tests

### Adding New Features

1. **Create Component**
   ```bash
   # Create new component directory
   mkdir src/components/new-feature
   
   # Create component files
   touch src/components/new-feature/NewFeature.tsx
   touch src/components/new-feature/NewFeatureForm.tsx
   ```

2. **Add to Navigation**
   - Update `Sidebar.tsx` with new menu item
   - Add route in `App.tsx`

3. **Database Schema**
   - Create migration in `supabase/migrations/`
   - Update TypeScript types in `src/lib/supabase.ts`

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add Supabase environment variables in Vercel dashboard
   - Configure production database

### Netlify Deployment

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   dist
   ```

3. **Environment Variables**
   - Add Supabase credentials in Netlify dashboard

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Update documentation as needed
- Test your changes thoroughly
- Provide clear commit messages

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Contact Information

- **Developer**: HA Developers
- **Email**: hussainahmadbilal@gmail.com
- **Project**: FinanceFlow Professional Edition

### Common Issues

1. **Environment Variables Not Set**
   - Ensure `.env` file exists with Supabase credentials
   - Restart development server after changes

2. **Database Connection Issues**
   - Verify Supabase project is active
   - Check network connectivity
   - Validate API keys

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript compilation
   - Verify all dependencies are installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Recharts** for beautiful data visualization

---

**Made with ❤️ by HA Developers**

*Professional Financial Management System - FinanceFlow*
