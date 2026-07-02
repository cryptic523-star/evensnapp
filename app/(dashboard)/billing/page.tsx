import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const p = profile as any;
  const credits = p?.credits_remaining ?? 0;
  const limit = p?.credits_monthly_limit ?? 50;
  const pct = Math.round((credits / limit) * 100);
  const plan = p?.plan ?? "free";

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-7">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">Billing</h1>
        <p className="text-[13px] text-t2">Manage your plan and credits.</p>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <Card>
          <CardHeader><CardTitle>Current plan</CardTitle></CardHeader>
          <CardBody>
            <div className="mb-1 text-[22px] font-bold capitalize">{plan}</div>
            <div className="mb-3.5 text-[13px] text-t2">{plan === "pro" ? "$49 / month" : "No active subscription"}</div>
            <Badge variant={plan === "pro" ? "green" : "gray"} className="mb-4">{p?.stripe_subscription_status || "inactive"}</Badge>
            <UpgradeButton isPro={plan === "pro"} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Credits</CardTitle></CardHeader>
          <CardBody>
            <div className="mb-0.5 text-[22px] font-bold">{credits} <span className="text-sm font-normal text-t2">remaining</span></div>
            <div className="mb-3 text-xs text-t3">of {limit} monthly</div>
            <div className="mb-3.5 h-1.5 overflow-hidden rounded-full bg-b1">
              <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
