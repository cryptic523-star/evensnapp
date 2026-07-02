import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Publishes a generated image to a connected social account.
 *
 * This is a scaffolded integration point. To go live:
 *  - Instagram/Facebook: use the Meta Graph API (Content Publishing API) with a
 *    long-lived Page access token obtained via the OAuth flow in /api/social/connect/meta.
 *  - LinkedIn: use the UGC Posts API with a member access token from the
 *    LinkedIn OAuth flow in /api/social/connect/linkedin.
 * Tokens should be fetched from `social_accounts`, refreshed if expired, then
 * used to call the provider's publish endpoint with the image's public_url + caption.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { imageId, provider, caption, scheduledFor } = await req.json();

  const { data: account } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .single();

  if (!account) {
    return NextResponse.json(
      { error: `${provider} is not connected. Connect it in Social Accounts first.` },
      { status: 400 }
    );
  }

  const { data: job, error } = await supabase
    .from("publish_jobs")
    .insert({
      user_id: user.id,
      image_id: imageId,
      social_account_id: account.id,
      caption,
      status: scheduledFor ? "scheduled" : "publishing",
      scheduled_for: scheduledFor ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // TODO: call provider API here for immediate publishes, then update job status.
  // For now, immediate publishes are marked published optimistically so the UI
  // can be wired end-to-end ahead of real provider credentials.
  if (!scheduledFor) {
    await supabase
      .from("publish_jobs")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", job.id);
  }

  return NextResponse.json({ job });
}
