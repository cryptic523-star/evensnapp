import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

// Stripe requires the raw body for signature verification — Next.js App Router
// route handlers give us the raw stream via req.text() by default (no bodyParser config needed).
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      await supabase
        .from("profiles")
        .update({
          stripe_subscription_id: sub.id,
          stripe_subscription_status: sub.status,
          plan: sub.status === "active" ? "pro" : "free",
          credits_monthly_limit: sub.status === "active" ? 2000 : 50,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("profiles")
        .update({ plan: "free", stripe_subscription_status: "canceled", credits_monthly_limit: 50 })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
