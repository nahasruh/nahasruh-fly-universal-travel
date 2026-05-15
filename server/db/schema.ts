import { 
  mysqlTable, 
  varchar, 
  int, 
  decimal, 
  timestamp, 
  text, 
  boolean, 
  mysqlEnum,
  index
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'staff', 'accountant']).default('staff').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const suppliers = mysqlTable('suppliers', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).unique(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  walletBalance: decimal('wallet_balance', { precision: 15, scale: 2 }).default('0.00').notNull(),
  creditLimit: decimal('credit_limit', { precision: 15, scale: 2 }).default('0.00').notNull(),
  creditUsed: decimal('credit_used', { precision: 15, scale: 2 }).default('0.00').notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const subAgents = mysqlTable('sub_agents', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).unique(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  creditLimit: decimal('credit_limit', { precision: 15, scale: 2 }).default('0.00').notNull(),
  creditUsed: decimal('credit_used', { precision: 15, scale: 2 }).default('0.00').notNull(),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('0.00').notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const customers = mysqlTable('customers', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  passportNumber: varchar('passport_number', { length: 100 }),
  nationality: varchar('nationality', { length: 100 }),
  dateOfBirth: timestamp('date_of_birth'),
  address: text('address'),
  travelHistory: text('travel_history'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const tickets = mysqlTable('tickets', {
  id: int('id').primaryKey().autoincrement(),
  ticketNumber: varchar('ticket_number', { length: 100 }).notNull().unique(),
  pnr: varchar('pnr', { length: 20 }).notNull(),
  passengerName: varchar('passenger_name', { length: 255 }).notNull(),
  customerId: int('customer_id'),
  subAgentId: int('sub_agent_id'),
  supplierId: int('supplier_id'),
  airline: varchar('airline', { length: 100 }).notNull(),
  flightNumber: varchar('flight_number', { length: 50 }),
  fromAirport: varchar('from_airport', { length: 10 }).notNull(),
  toAirport: varchar('to_airport', { length: 10 }).notNull(),
  departureDate: timestamp('departure_date').notNull(),
  arrivalDate: timestamp('arrival_date'),
  class: mysqlEnum('class', ['economy', 'business', 'first']).default('economy').notNull(),
  baseFare: decimal('base_fare', { precision: 15, scale: 2 }).default('0.00').notNull(),
  tax: decimal('tax', { precision: 15, scale: 2 }).default('0.00').notNull(),
  serviceCharge: decimal('service_charge', { precision: 15, scale: 2 }).default('0.00').notNull(),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).default('0.00').notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  status: mysqlEnum('status', ['confirmed', 'pending', 'cancelled', 'refunded']).default('confirmed').notNull(),
  paymentStatus: mysqlEnum('payment_status', ['paid', 'partial', 'unpaid', 'refunded']).default('unpaid').notNull(),
  notes: text('notes'),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index('ticket_number_idx').on(table.ticketNumber),
  index('ticket_pnr_idx').on(table.pnr),
  index('ticket_status_idx').on(table.status),
]);

export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  type: mysqlEnum('type', ['incoming', 'outgoing']).notNull(),
  referenceId: int('reference_id').notNull(),
  referenceType: mysqlEnum('reference_type', ['ticket', 'supplier', 'sub_agent', 'expense']).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  paymentMethod: mysqlEnum('payment_method', ['cash', 'bank_transfer', 'credit_card', 'cheque', 'wallet']).notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  description: text('description'),
  receivedBy: int('received_by'),
  paymentDate: timestamp('payment_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const refunds = mysqlTable('refunds', {
  id: int('id').primaryKey().autoincrement(),
  ticketId: int('ticket_id').notNull(),
  originalAmount: decimal('original_amount', { precision: 15, scale: 2 }).notNull(),
  refundAmount: decimal('refund_amount', { precision: 15, scale: 2 }).notNull(),
  penaltyAmount: decimal('penalty_amount', { precision: 15, scale: 2 }).default('0.00').notNull(),
  reason: text('reason'),
  status: mysqlEnum('status', ['requested', 'approved', 'processed', 'rejected']).default('requested').notNull(),
  processedBy: int('processed_by'),
  processedAt: timestamp('processed_at'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const ledgerEntries = mysqlTable('ledger_entries', {
  id: int('id').primaryKey().autoincrement(),
  date: timestamp('date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  accountType: mysqlEnum('account_type', ['asset', 'liability', 'equity', 'revenue', 'expense']).notNull(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
  description: text('description'),
  debit: decimal('debit', { precision: 15, scale: 2 }).default('0.00').notNull(),
  credit: decimal('credit', { precision: 15, scale: 2 }).default('0.00').notNull(),
  referenceId: int('reference_id'),
  referenceType: varchar('reference_type', { length: 50 }),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const cashBox = mysqlTable('cash_box', {
  id: int('id').primaryKey().autoincrement(),
  openingBalance: decimal('opening_balance', { precision: 15, scale: 2 }).notNull(),
  closingBalance: decimal('closing_balance', { precision: 15, scale: 2 }),
  cashIn: decimal('cash_in', { precision: 15, scale: 2 }).default('0.00').notNull(),
  cashOut: decimal('cash_out', { precision: 15, scale: 2 }).default('0.00').notNull(),
  date: timestamp('date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  openedBy: int('opened_by'),
  closedBy: int('closed_by'),
  closedAt: timestamp('closed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const services = mysqlTable('services', {
  id: int('id').primaryKey().autoincrement(),
  type: mysqlEnum('type', ['visa', 'insurance', 'hotel', 'tour', 'transfer']).notNull(),
  customerId: int('customer_id'),
  referenceNumber: varchar('reference_number', { length: 100 }),
  provider: varchar('provider', { length: 255 }),
  destination: varchar('destination', { length: 255 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  cost: decimal('cost', { precision: 15, scale: 2 }).default('0.00').notNull(),
  sellingPrice: decimal('selling_price', { precision: 15, scale: 2 }).default('0.00').notNull(),
  profit: decimal('profit', { precision: 15, scale: 2 }).default('0.00').notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  status: mysqlEnum('status', ['pending', 'confirmed', 'completed', 'cancelled']).default('pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const expenses = mysqlTable('expenses', {
  id: int('id').primaryKey().autoincrement(),
  category: mysqlEnum('category', ['office', 'rent', 'salary', 'utilities', 'marketing', 'travel', 'other']).notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: mysqlEnum('currency', ['SAR', 'AED', 'INR', 'USD']).default('SAR').notNull(),
  paymentMethod: mysqlEnum('payment_method', ['cash', 'bank_transfer', 'credit_card', 'cheque']).notNull(),
  receiptNumber: varchar('receipt_number', { length: 100 }),
  expenseDate: timestamp('expense_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdBy: int('created_by'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const auditLogs = mysqlTable('audit_logs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id'),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: int('entity_id'),
  oldValues: text('old_values'),
  newValues: text('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: mysqlEnum('type', ['info', 'warning', 'error', 'success']).default('info').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  link: varchar('link', { length: 500 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const supplierStatements = mysqlTable('supplier_statements', {
  id: int('id').primaryKey().autoincrement(),
  supplierId: int('supplier_id').notNull(),
  statementPeriod: varchar('statement_period', { length: 50 }).notNull(),
  openingBalance: decimal('opening_balance', { precision: 15, scale: 2 }).default('0.00').notNull(),
  totalSales: decimal('total_sales', { precision: 15, scale: 2 }).default('0.00').notNull(),
  totalPayments: decimal('total_payments', { precision: 15, scale: 2 }).default('0.00').notNull(),
  closingBalance: decimal('closing_balance', { precision: 15, scale: 2 }).default('0.00').notNull(),
  matchedAmount: decimal('matched_amount', { precision: 15, scale: 2 }).default('0.00').notNull(),
  unmatchedAmount: decimal('unmatched_amount', { precision: 15, scale: 2 }).default('0.00').notNull(),
  isReconciled: boolean('is_reconciled').default(false).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull(),
});

export const exchangeRates = mysqlTable('exchange_rates', {
  id: int('id').primaryKey().autoincrement(),
  fromCurrency: mysqlEnum('from_currency', ['SAR', 'AED', 'INR', 'USD']).notNull(),
  toCurrency: mysqlEnum('to_currency', ['SAR', 'AED', 'INR', 'USD']).notNull(),
  rate: decimal('rate', { precision: 15, scale: 6 }).notNull(),
  effectiveDate: timestamp('effective_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const whatsappLogs = mysqlTable('whatsapp_logs', {
  id: int('id').primaryKey().autoincrement(),
  ticketId: int('ticket_id'),
  customerId: int('customer_id'),
  phoneNumber: varchar('phone_number', { length: 50 }).notNull(),
  message: text('message').notNull(),
  mediaUrl: varchar('media_url', { length: 500 }),
  status: mysqlEnum('status', ['sent', 'delivered', 'read', 'failed']).default('sent').notNull(),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const reportsCache = mysqlTable('reports_cache', {
  id: int('id').primaryKey().autoincrement(),
  reportType: varchar('report_type', { length: 100 }).notNull(),
  parameters: text('parameters'),
  data: text('data').notNull(),
  generatedAt: timestamp('generated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  expiresAt: timestamp('expires_at'),
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: int('user_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Expense = typeof expenses.$inferSelect;