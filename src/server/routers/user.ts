import { z } from "zod";

import { db } from "@/lib/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    // Para desenvolvimento
    if (process.env.NODE_ENV !== "production") {
      return {
        id: ctx.session.user.id,
        name: ctx.session.user.name,
        email: ctx.session.user.email,
        image: ctx.session.user.image,
        role: ctx.session.user.role,
      };
    }

    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),
  
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    // Para desenvolvimento, simula um status de assinatura ativo
    if (process.env.NODE_ENV !== "production") {
      return "ACTIVE";
    }

    const customer = await db.customer.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return customer?.subscriptionStatus || null;
  }),
}); 