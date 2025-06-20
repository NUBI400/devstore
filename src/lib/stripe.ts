import Stripe from "stripe";

// Criamos um mock do Stripe para desenvolvimento
const createMockStripe = () => {
  return {
    customers: {
      create: async (options: any) => ({
        id: 'mock-customer-id',
        email: options.email,
        name: options.name,
      }),
    },
    checkout: {
      sessions: {
        create: async (options: any) => ({
          id: 'mock-session-id',
          url: `http://localhost:3000/dashboard?success=true&dev=true`,
          customer: options.customer,
          metadata: options.metadata,
        }),
      },
    },
    billingPortal: {
      sessions: {
        create: async (options: any) => ({
          url: `http://localhost:3000/dashboard?dev=true`,
        }),
      },
    },
    webhooks: {
      constructEvent: (body: string, signature: string, secret: string) => ({
        type: 'mock.event',
        data: { object: {} },
      }),
    },
    subscriptions: {
      retrieve: async (id: string) => ({
        id,
        status: 'active',
        customer: 'mock-customer-id',
      }),
    },
  } as any;
};

// Em produção, usamos o Stripe real, em desenvolvimento, usamos o mock
export const stripe = process.env.NODE_ENV === "production"
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-05-28.basil" as any,
    })
  : createMockStripe(); 