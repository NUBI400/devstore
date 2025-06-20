import { router } from "../trpc";
import { userRouter } from "./user";
import { stripeRouter } from "./stripe";

export const appRouter = router({
  user: userRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter; 