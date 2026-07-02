import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const p = profile as any;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        userName={p?.full_name || user.email?.split("@")[0] || "there"}
        userEmail={user.email || ""}
        plan={p?.plan || "free"}
        credits={p?.credits_remaining ?? 0}
        creditsLimit={p?.credits_monthly_limit ?? 50}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
