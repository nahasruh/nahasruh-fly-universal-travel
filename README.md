# Fly Universal Travel & Tourism ERP

A comprehensive Enterprise Resource Planning system for travel and tourism businesses with 20 fully integrated modules.

## Features

1. **Dashboard** - Real-time sales and profit overview
2. **Ticket Sales** - Full ticket lifecycle management
3. **Supplier Management** - Wallet and credit tracking
4. **Sub Agent Management** - Credit limits and statements
5. **Direct Customer Management** - Profiles and travel history
6. **Payments & Receipts** - Incoming/outgoing transaction tracking
7. **Refund & Cancellation** - Automated refund workflows
8. **Ledger & Accounting** - Double-entry bookkeeping
9. **Cash Box / Cash in Hand** - Real-time cash flow monitoring
10. **Service Management** - Visa, insurance, and hotel services
11. **WhatsApp Sharing** - Direct ticket sharing via WhatsApp API
12. **Reports & Profit Analysis** - Exportable PDF/Excel reports
13. **User & Role Management** - Admin, Staff, and Accountant roles
14. **Notifications** - Dashboard alerts for overdue payments
15. **Audit Logs** - Full tracking of all system changes
16. **Multi Currency** - Support for SAR, AED, INR, and USD
17. **Expense Management** - Office and operational cost tracking
18. **PNR Search** - Global search by PNR or ticket number
19. **Fast Ticket Entry** - Optimized popup for rapid data entry
20. **Cross Match Supplier Reports** - Reconciliation system for statement matching

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express.js + tRPC + Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Auth**: Manus OAuth
- **Hosting**: Render, Railway, or Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- MySQL database

### Installation

```bash
# Install dependencies
pnpm install

# Run migrations
pnpm db:push

# Start development server
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Deployment

### Render (Recommended - Free)
1. Connect your GitHub repository to Render
2. Set Build Command: `pnpm install && pnpm build`
3. Set Start Command: `pnpm start`
4. Deploy!

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Vercel
1. Connect your GitHub repository
2. Configure build settings
3. Deploy

## License

MIT
