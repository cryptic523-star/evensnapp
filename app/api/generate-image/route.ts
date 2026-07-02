import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, buildImagePrompt } from "@/lib/openai";
import type { GenerateImageRequest } from "@/types";

const CREDIT_COST = 1; // per image

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as GenerateImageRequest;
  if (!body.businessName?.trim()) {
    return NextResponse.json({ error: "businessName is required" }, { status: 400 });
  }

  // Check & deduct credits atomically
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("credits_remaining")
    .eq("id", user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: "Could not load account" }, { status: 500 });
  }
  if (profile.credits_remaining < CREDIT_COST) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const prompt = buildImagePrompt(body);

  try {
    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = result.data[0]?.b64_json;
    if (!b64) throw new Error("No image returned from OpenAI");

    const buffer = Buffer.from(b64, "base64");
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.png`;

    const { error: uploadErr } = await supabase.storage
      .from("generated-images")
      .upload(path, buffer, { contentType: "image/png", upsert: false });
    if (uploadErr) throw uploadErr;

    const { data: publicUrlData } = supabase.storage
      .from("generated-images")
      .getPublicUrl(path);

    const { data: imageRow, error: insertErr } = await supabase
      .from("images")
      .insert({
        user_id: user.id,
        storage_path: path,
        public_url: publicUrlData.publicUrl,
        prompt,
        event_type: body.eventType,
        content_type: body.contentType,
        business_name: body.businessName,
        brand_color: body.brandColor,
        status: "completed",
      })
      .select()
      .single();
    if (insertErr) throw insertErr;

    await supabase
      .from("profiles")
      .update({ credits_remaining: profile.credits_remaining - CREDIT_COST })
      .eq("id", user.id);

    return NextResponse.json({
      id: imageRow.id,
      url: publicUrlData.publicUrl,
      storagePath: path,
    });
  } catch (err) {
    console.error("generate-image error", err);
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
