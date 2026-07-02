import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const p = profile as any;

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-7">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">Settings</h1>
        <p className="text-[13px] text-t2">Manage your account and preferences.</p>
      </div>
      <div className="flex flex-col gap-3.5">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardBody className="flex flex-col gap-3">
            <Row label="Full name" value={p?.full_name || "—"} />
            <Row label="Email" value={user?.email || "—"} />
            <Row label="Plan" value={p?.plan || "free"} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardBody>
            <form action={signOut} className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium">Sign out</div>
                <div className="text-xs text-t3">Returns you to the sign-in screen.</div>
              </div>
              <Button variant="danger" size="sm" type="submit">Sign out</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-b1 pb-3 last:border-0 last:pb-0">
      <div className="text-[13px] font-medium capitalize">{label}</div>
      <div className="text-xs text-t3">{value}</div>
    </div>
  );
}
