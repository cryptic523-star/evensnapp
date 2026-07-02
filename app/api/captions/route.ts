import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { businessName, eventType, milestone, tagline, imageId } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You write concise, on-brand social captions. Return strictly valid JSON with keys instagram, facebook, linkedin (strings) and hashtags (array of 5 lowercase words, no # symbol).",
      },
      {
        role: "user",
        content: `Business: "${businessName}". Event: "${eventType}${milestone ? " — " + milestone : ""}". Message: "${tagline || "join us"}".`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(text);

  if (imageId) {
    await supabase.from("captions").insert({
      image_id: imageId,
      user_id: user.id,
      instagram: parsed.instagram,
      facebook: parsed.facebook,
      linkedin: parsed.linkedin,
      hashtags: parsed.hashtags || [],
    });
  }

  return NextResponse.json(parsed);
}
