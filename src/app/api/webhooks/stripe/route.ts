import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update the user stripe info in our database
    await db.customer.upsert({
      where: {
        userId: session.metadata.userId,
      },
      create: {
        userId: session.metadata.userId,
        stripeCustomerId: session.customer as string,
        subscriptionId: subscription.id,
        subscriptionStatus: processSubscriptionStatus(subscription.status),
      },
      update: {
        stripeCustomerId: session.customer as string,
        subscriptionId: subscription.id,
        subscriptionStatus: processSubscriptionStatus(subscription.status),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the subscription status in our database
    await db.customer.updateMany({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        subscriptionStatus: processSubscriptionStatus(subscription.status),
      },
    });
  }

  // Handle subscription status changes
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.customer.updateMany({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        subscriptionStatus: processSubscriptionStatus(subscription.status),
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.customer.updateMany({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        subscriptionStatus: "CANCELED",
      },
    });
  }

  return NextResponse.json({ received: true });
}

// Converte o status do Stripe para o formato do nosso enum
function processSubscriptionStatus(status: string): string {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "incomplete_expired":
      return "INCOMPLETE_EXPIRED";
    case "past_due":
      return "PAST_DUE";
    case "unpaid":
      return "UNPAID";
    default:
      return "INCOMPLETE";
  }
} 