import { createClient } from "@/lib/supabase/server";
import { SocialGrid } from "@/components/social/social-grid";

export default async function SocialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: accounts } = await supabase.from("social_accounts").select("*").eq("user_id", user!.id);

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-7">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">Social Accounts</h1>
        <p className="text-[13px] text-t2">Connect your accounts to publish images directly from EventSnap.</p>
      </div>
      <SocialGrid connected={accounts || []} />
    </div>
  );
}
