"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { CaptionResult } from "@/types";

const TABS: { key: keyof Omit<CaptionResult, "hashtags">; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
];

export function CaptionPanel({
  imageId, businessName, eventType, milestone, tagline,
}: { imageId: string; businessName: string; eventType: string; milestone: string; tagline: string }) {
  const { show } = useToast();
  const [data, setData] = useState<CaptionResult | null>(null);
  const [tab, setTab] = useState<keyof Omit<CaptionResult, "hashtags">>("instagram");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, eventType, milestone, tagline, imageId }),
      });
      const json = await res.json();
      setData(json);
    } catch {
      show("Could not generate captions", "error");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!data) return;
    const text = `${data[tab]}\n\n${data.hashtags.map((h) => "#" + h).join(" ")}`;
    navigator.clipboard.writeText(text);
    show("Caption copied", "success");
  }

  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-b1 bg-s1">
      <div className="flex items-center justify-between border-b border-b1 px-[18px] py-3.5">
        <span className="text-[13px] font-semibold">Caption Generator</span>
        <Button size="sm" onClick={generate} disabled={loading} className="gap-1.5">
          <Sparkles size={12} />
          {loading ? "Writing…" : data ? "Regenerate" : "Write captions"}
        </Button>
      </div>
      <div className="flex gap-0.5 border-b border-b1 px-[18px] py-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn("rounded px-3 py-1 text-xs font-medium transition-colors", tab === t.key ? "bg-accent/10 text-accent" : "text-t3 hover:bg-s2 hover:text-t1")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="px-[18px] py-4">
        <div className="mb-2.5 min-h-[80px] rounded-md border border-b1 bg-s2 px-3.5 py-3 text-[13px] leading-relaxed text-t2">
          {data ? data[tab] : 'Click "Write captions" to generate copy for your image.'}
        </div>
        {data && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {data.hashtags.map((h) => (
              <span key={h} className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">#{h}</span>
            ))}
          </div>
        )}
        {data && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copy}>Copy text</Button>
            <Button variant="ghost" size="sm">Publish to social →</Button>
          </div>
        )}
      </div>
    </div>
  );
}
