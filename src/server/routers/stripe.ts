import { z } from "zod";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";
import { protectedProcedure, router } from "../trpc";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    // Em desenvolvimento, retorna uma URL fictícia
    if (process.env.NODE_ENV !== "production") {
      return { url: `${getBaseUrl()}/dashboard?success=true&dev=true` };
    }

    let customer = await db.customer.findUnique({
      where: { userId: user.id },
    });

    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      customer = await db.customer.create({
        data: {
          userId: user.id,
          stripeCustomerId: stripeCustomer.id,
        },
      });
    }

    const session = await createStripeCustomerSubscriptionPaymentCheckout({
      customerId: customer.stripeCustomerId!,
      userId: user.id,
    });

    return { url: session.url };
  }),

  getSubscriptionPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;

    // Em desenvolvimento, retorna uma URL fictícia
    if (process.env.NODE_ENV !== "production") {
      return { url: `${getBaseUrl()}/dashboard?dev=true` };
    }

    const customer = await db.customer.findUnique({
      where: { userId: user.id },
    });

    if (!customer || !customer.stripeCustomerId) {
      throw new Error("No customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: `${getBaseUrl()}/dashboard`,
    });

    return { url: session.url };
  }),
});

const createStripeCustomerSubscriptionPaymentCheckout = async ({
  customerId,
  userId,
}: {
  customerId: string;
  userId: string;
}) => {
  // Em desenvolvimento, retorna um objeto mock
  if (process.env.NODE_ENV !== "production") {
    return {
      url: `${getBaseUrl()}/dashboard?success=true&dev=true`,
      id: 'mock-session-id',
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRODUCT_ID,
        quantity: 1,
      },
    ],
    success_url: `${getBaseUrl()}/dashboard?success=true`,
    cancel_url: `${getBaseUrl()}/dashboard?canceled=true`,
    metadata: {
      userId,
    },
  });

  return checkoutSession;
}; 