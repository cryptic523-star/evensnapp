import { createClient } from "@/lib/supabase/server";
import { LibraryGrid } from "@/components/library/library-grid";

export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[1100px] px-9 pb-20 pt-8">
      <div className="mb-7">
        <h1 className="mb-1 text-[22px] font-semibold tracking-tight">Image Library</h1>
        <p className="text-[13px] text-t2">All images generated in your workspace.</p>
      </div>
      <LibraryGrid images={images || []} />
    </div>
  );
}
