import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router.js';

export const t = initTRPC.create();

export const createTRPCMiddleware = () => {
  return createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      return { req, res, userId: 1 };
    },
  });
};

export { appRouter };
export type AppRouter = typeof appRouter;