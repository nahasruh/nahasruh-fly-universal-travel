import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '../db.js';
import { users, tickets, customers, suppliers, payments, services, expenses } from '../db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  return next({ ctx: { ...ctx, userId: 1 } });
});

const authedProcedure = t.procedure.use(authMiddleware);

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  user: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(users);
    }),
    
    byId: authedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.select().from(users).where(eq(users.id, input.id));
        return result[0] || null;
      }),
  }),

  ticket: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    }),
    
    byId: authedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.select().from(tickets).where(eq(tickets.id, input.id));
        return result[0] || null;
      }),
    
    byPnr: authedProcedure
      .input(z.object({ pnr: z.string() }))
      .query(async ({ input }) => {
        return await db.select().from(tickets).where(eq(tickets.pnr, input.pnr));
      }),
    
    create: authedProcedure
      .input(z.object({
        ticketNumber: z.string(),
        pnr: z.string(),
        passengerName: z.string(),
        customerId: z.number().optional(),
        subAgentId: z.number().optional(),
        supplierId: z.number().optional(),
        airline: z.string(),
        flightNumber: z.string().optional(),
        fromAirport: z.string(),
        toAirport: z.string(),
        departureDate: z.string().transform((str) => new Date(str)),
        arrivalDate: z.string().transform((str) => new Date(str)).optional(),
        class: z.enum(['economy', 'business', 'first']).default('economy'),
        baseFare: z.number().default(0),
        tax: z.number().default(0),
        serviceCharge: z.number().default(0),
        totalAmount: z.number(),
        currency: z.enum(['SAR', 'AED', 'INR', 'USD']).default('SAR'),
        status: z.enum(['confirmed', 'pending', 'cancelled', 'refunded']).default('confirmed'),
        paymentStatus: z.enum(['paid', 'partial', 'unpaid', 'refunded']).default('unpaid'),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.insert(tickets).values({
          ...input,
          createdBy: ctx.userId,
        });
        return { id: Number(result[0].insertId), ...input };
      }),
    
    updateStatus: authedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['confirmed', 'pending', 'cancelled', 'refunded']),
      }))
      .mutation(async ({ input }) => {
        await db.update(tickets)
          .set({ status: input.status })
          .where(eq(tickets.id, input.id));
        return { success: true };
      }),
  }),

  customer: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(customers).orderBy(desc(customers.createdAt));
    }),
    
    byId: authedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.select().from(customers).where(eq(customers.id, input.id));
        return result[0] || null;
      }),
    
    create: authedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        passportNumber: z.string().optional(),
        nationality: z.string().optional(),
        dateOfBirth: z.string().transform((str) => new Date(str)).optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.insert(customers).values(input);
        return { id: Number(result[0].insertId), ...input };
      }),
  }),

  supplier: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
    }),
    
    byId: authedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await db.select().from(suppliers).where(eq(suppliers.id, input.id));
        return result[0] || null;
      }),
    
    updateWallet: authedProcedure
      .input(z.object({
        id: z.number(),
        amount: z.number(),
        operation: z.enum(['add', 'subtract']),
      }))
      .mutation(async ({ input }) => {
        const current = await db.select().from(suppliers).where(eq(suppliers.id, input.id));
        if (!current[0]) throw new Error('Supplier not found');
        
        const currentBalance = Number(current[0].walletBalance);
        const newBalance = input.operation === 'add' 
          ? currentBalance + input.amount 
          : currentBalance - input.amount;
        
        await db.update(suppliers)
          .set({ walletBalance: String(newBalance) })
          .where(eq(suppliers.id, input.id));
        
        return { success: true, newBalance };
      }),
  }),

  payment: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(payments).orderBy(desc(payments.createdAt));
    }),
    
    create: authedProcedure
      .input(z.object({
        type: z.enum(['incoming', 'outgoing']),
        referenceId: z.number(),
        referenceType: z.enum(['ticket', 'supplier', 'sub_agent', 'expense']),
        amount: z.number(),
        currency: z.enum(['SAR', 'AED', 'INR', 'USD']).default('SAR'),
        paymentMethod: z.enum(['cash', 'bank_transfer', 'credit_card', 'cheque', 'wallet']),
        transactionId: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.insert(payments).values({
          ...input,
          receivedBy: ctx.userId,
        });
        return { id: Number(result[0].insertId), ...input };
      }),
  }),

  service: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(services).orderBy(desc(services.createdAt));
    }),
    
    create: authedProcedure
      .input(z.object({
        type: z.enum(['visa', 'insurance', 'hotel', 'tour', 'transfer']),
        customerId: z.number().optional(),
        referenceNumber: z.string().optional(),
        provider: z.string().optional(),
        destination: z.string().optional(),
        startDate: z.string().transform((str) => new Date(str)).optional(),
        endDate: z.string().transform((str) => new Date(str)).optional(),
        cost: z.number().default(0),
        sellingPrice: z.number().default(0),
        currency: z.enum(['SAR', 'AED', 'INR', 'USD']).default('SAR'),
        status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const profit = input.sellingPrice - input.cost;
        const result = await db.insert(services).values({
          ...input,
          profit: String(profit),
        });
        return { id: Number(result[0].insertId), ...input, profit };
      }),
  }),

  expense: router({
    list: authedProcedure.query(async () => {
      return await db.select().from(expenses).orderBy(desc(expenses.createdAt));
    }),
    
    create: authedProcedure
      .input(z.object({
        category: z.enum(['office', 'rent', 'salary', 'utilities', 'marketing', 'travel', 'other']),
        description: z.string(),
        amount: z.number(),
        currency: z.enum(['SAR', 'AED', 'INR', 'USD']).default('SAR'),
        paymentMethod: z.enum(['cash', 'bank_transfer', 'credit_card', 'cheque']),
        receiptNumber: z.string().optional(),
        expenseDate: z.string().transform((str) => new Date(str)).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.insert(expenses).values({
          ...input,
          createdBy: ctx.userId,
        });
        return { id: Number(result[0].insertId), ...input };
      }),
  }),

  dashboard: router({
    stats: authedProcedure.query(async () => {
      const totalTickets = await db.select({ count: sql<number>`count(*)` }).from(tickets);
      const totalCustomers = await db.select({ count: sql<number>`count(*)` }).from(customers);
      const totalSuppliers = await db.select({ count: sql<number>`count(*)` }).from(suppliers);
      const totalRevenue = await db.select({ 
        total: sql<number>`COALESCE(SUM(total_amount), 0)` 
      }).from(tickets).where(eq(tickets.status, 'confirmed'));
      
      const pendingPayments = await db.select({ 
        total: sql<number>`COALESCE(SUM(total_amount), 0)` 
      }).from(tickets).where(eq(tickets.paymentStatus, 'unpaid'));

      return {
        totalTickets: totalTickets[0]?.count || 0,
        totalCustomers: totalCustomers[0]?.count || 0,
        totalSuppliers: totalSuppliers[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingPayments: pendingPayments[0]?.total || 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;