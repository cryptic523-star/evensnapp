"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveBrandKit(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const payload = {
    user_id: user.id,
    business_name: String(formData.get("business_name") || ""),
    industry: String(formData.get("industry") || ""),
    description: String(formData.get("description") || ""),
    tone_of_voice: String(formData.get("tone_of_voice") || ""),
    primary_color: String(formData.get("primary_color") || "#2563eb"),
    color_name: String(formData.get("color_name") || ""),
    preferred_style: String(formData.get("preferred_style") || "promotional poster"),
    default_content_type: String(formData.get("default_content_type") || "Instagram Post"),
    negative_prompt: String(formData.get("negative_prompt") || ""),
  };

  const { error } = await supabase.from("brand_kits").upsert(payload as any, { onConflict: "user_id" });
  if (error) return { error: error.message };
  revalidatePath("/brand-kit");
  return { success: true };
}
