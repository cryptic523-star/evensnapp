import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const { count: imageCount } = await supabase
    .from("images").select("*", { count: "exact", head: true }).eq("user_id", user!.id);

  const p = profile as any;
  const name = p?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-5 flex items-center justify-between gap-5 rounded-lg border border-b1 bg-s1 px-7 py-6">
        <div>
          <h1 className="mb-1 text-[19px] font-semibold tracking-tight">Good {greeting}, {name}</h1>
          <p className="text-[13px] text-t2">
            You&apos;ve generated <strong className="text-t1">{imageCount ?? 0} images</strong>. {p?.credits_remaining ?? 0} credits remaining.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button asChild><Link href="/create">New image</Link></Button>
          <Button variant="ghost" asChild><Link href="/library">View library</Link></Button>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-4 gap-2.5">
        <Stat label="Images generated" value={String(imageCount ?? 0)} />
        <Stat label="Credits remaining" value={String(p?.credits_remaining ?? 0)} sub={`of ${p?.credits_monthly_limit ?? 50} monthly`} />
        <Stat label="Plan" value={p?.plan ?? "free"} />
        <Stat label="Brand kit" value="Active" valueClass="text-green text-lg" sub="Auto-applied" />
      </div>
      <Card>
        <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
        <CardBody className="grid grid-cols-2 gap-2">
          <Button variant="ghost" className="justify-start" asChild><Link href="/create">Generate image</Link></Button>
          <Button variant="ghost" className="justify-start" asChild><Link href="/brand-kit">Update Brand Kit</Link></Button>
          <Button variant="ghost" className="justify-start" asChild><Link href="/social">Connect social</Link></Button>
          <Button variant="ghost" className="justify-start" asChild><Link href="/library">Browse library</Link></Button>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="rounded-lg border border-b1 bg-s1 px-5 py-4 transition-colors hover:border-b2">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-t3">{label}</div>
      <div className={`mb-1 text-[26px] font-semibold leading-none tracking-tight ${valueClass || ""}`}>{value}</div>
      {sub && <div className="text-xs text-t3">{sub}</div>}
    </div>
  );
}
