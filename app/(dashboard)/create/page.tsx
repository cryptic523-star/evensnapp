import { createClient } from "@/lib/supabase/server";
import { CreateForm } from "@/components/create/create-form";

export default async function CreatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brandKit } = await supabase
    .from("brand_kits")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-7">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">Create image</h1>
        <p className="text-[13px] text-t2">Describe your event and your Brand Kit handles the rest.</p>
      </div>
      <CreateForm brandKit={brandKit} />
    </div>
  );
}
