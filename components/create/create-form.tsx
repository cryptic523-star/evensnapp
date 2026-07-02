"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useCreateForm, SWATCHES, EVENT_TYPES, INDUSTRIES, CONTENT_TYPES, STYLES,
} from "@/hooks/use-create-form";
import { ResultsGrid, type GeneratedImage } from "./results-grid";
import { CaptionPanel } from "./caption-panel";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type BrandKit = Database["public"]["Tables"]["brand_kits"]["Row"] | null;

export function CreateForm({ brandKit }: { brandKit: BrandKit }) {
  const { show } = useToast();
  const form = useCreateForm({
    businessName: brandKit?.business_name || "",
    industry: brandKit?.industry || "",
    style: brandKit?.preferred_style || undefined,
    contentType: brandKit?.default_content_type || undefined,
    color: brandKit?.primary_color || undefined,
    colorName: brandKit?.color_name || undefined,
  });

  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [lastImageId, setLastImageId] = useState<string | null>(null);

  async function generate(variantNote?: string, prepend = false) {
    if (!form.businessName.trim()) {
      show("Enter your business name first", "error");
      return;
    }
    setGenerating(true);
    const tempId = `pending-${Date.now()}`;
    const pending: GeneratedImage = { id: tempId, url: "", status: "pending", label: variantNote ? "New" : "A" };
    setImages((prev) => (prepend ? [pending, ...prev] : [...prev, pending]));

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          industry: form.industry,
          contentType: form.contentType,
          eventType: form.eventType,
          milestone: form.milestone,
          eventDate: form.eventDate,
          tagline: form.tagline,
          style: form.style,
          brandColor: form.color,
          colorName: form.colorName,
          variantNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setImages((prev) =>
        prev.map((img) => (img.id === tempId ? { id: data.id, url: data.url, status: "completed", label: pending.label } : img))
      );
      setLastImageId(data.id);
      show("Image generated", "success");
    } catch (err) {
      setImages((prev) =>
        prev.map((img) => (img.id === tempId ? { ...img, status: "failed", error: (err as Error).message } : img))
      );
      show((err as Error).message, "error");
    } finally {
      setGenerating(false);
    }
  }

  async function generateBatch() {
    if (!form.businessName.trim()) {
      show("Enter your business name first", "error");
      return;
    }
    setImages([]);
    setGenerating(true);
    const variants: { label: string; note?: string }[] = [
      { label: "A" },
      { label: "B", note: "Alternative layout and composition." },
      { label: "C", note: "Bold typography variation." },
    ];
    const pendingImages = variants.map((v) => ({ id: `pending-${v.label}`, url: "", status: "pending" as const, label: v.label }));
    setImages(pendingImages);

    await Promise.all(
      variants.map(async (v) => {
        try {
          const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessName: form.businessName, industry: form.industry, contentType: form.contentType,
              eventType: form.eventType, milestone: form.milestone, eventDate: form.eventDate,
              tagline: form.tagline, style: form.style, brandColor: form.color, colorName: form.colorName,
              variantNote: v.note,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Generation failed");
          setImages((prev) => prev.map((img) => (img.id === `pending-${v.label}` ? { id: data.id, url: data.url, status: "completed", label: v.label } : img)));
          setLastImageId(data.id);
        } catch (err) {
          setImages((prev) => prev.map((img) => (img.id === `pending-${v.label}` ? { ...img, status: "failed", error: (err as Error).message } : img)));
        }
      })
    );
    setGenerating(false);
    show("Generation complete", "success");
  }

  function copyPrompt() {
    if (!form.prompt) {
      show("Enter your business name first", "error");
      return;
    }
    navigator.clipboard.writeText(form.prompt);
    show("Prompt copied", "success");
  }

  return (
    <div className="grid grid-cols-[1fr_360px] items-start gap-5">
      <div>
        <Section title="Business">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Business name" className="col-span-2">
              <Input value={form.businessName} onChange={(e) => form.setBusinessName(e.target.value)} placeholder="e.g. The Local Café" />
            </Field>
            <Field label="Industry">
              <select className="h-10 w-full rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60" value={form.industry} onChange={(e) => form.setIndustry(e.target.value)}>
                <option value="">Select…</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Content type">
              <select className="h-10 w-full rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60" value={form.contentType} onChange={(e) => form.setContentType(e.target.value)}>
                {CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Brand colours">
          <div className="flex flex-wrap items-center gap-1.5">
            {SWATCHES.map((s) => (
              <button
                key={s.hex}
                title={s.name}
                onClick={() => { form.setColor(s.hex); form.setColorName(s.name); }}
                className={cn("h-6 w-6 rounded-md transition-transform hover:scale-110", form.color === s.hex && "ring-2 ring-accent ring-offset-2 ring-offset-s1")}
                style={{ background: s.hex }}
              />
            ))}
          </div>
          <div className="mt-1.5 text-xs text-t3">{form.colorName}</div>
        </Section>

        <Section title="Event">
          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {EVENT_TYPES.map((e) => (
              <button
                key={e}
                onClick={() => form.setEventType(e)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  form.eventType === e ? "border-accent/30 bg-accent/10 text-accent" : "border-b1 bg-s2 text-t3 hover:text-t1"
                )}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Milestone / detail">
              <Input value={form.milestone} onChange={(e) => form.setMilestone(e.target.value)} placeholder="e.g. 10th Anniversary" />
            </Field>
            <Field label="Event date">
              <Input value={form.eventDate} onChange={(e) => form.setEventDate(e.target.value)} placeholder="e.g. Sat 14 June" />
            </Field>
            <Field label="Message or tagline" className="col-span-2">
              <Textarea value={form.tagline} onChange={(e) => form.setTagline(e.target.value)} placeholder="e.g. Join us for a night to remember!" />
            </Field>
          </div>
        </Section>

        <Section title="Visual style">
          <Field label="Style">
            <select className="h-10 w-full rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60" value={form.style} onChange={(e) => form.setStyle(e.target.value)}>
              {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </Section>

        <Button onClick={generateBatch} disabled={generating} className="mt-1 w-full gap-2 py-3 text-sm font-semibold">
          <Sparkles size={14} />
          {generating ? "Generating…" : "Generate images · 3 credits"}
        </Button>
        <div className="mt-2 text-center text-[11px] text-t3">3 variations · DALL·E 3 · ~30 seconds</div>

        <AnimatePresence>
          {images.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <ResultsGrid images={images} onRegenerate={generateBatch} onAddVariant={(note) => generate(note, true)} />
              {images.some((i) => i.status === "completed") && lastImageId && (
                <CaptionPanel
                  imageId={lastImageId}
                  businessName={form.businessName}
                  eventType={form.eventType}
                  milestone={form.milestone}
                  tagline={form.tagline}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <div className="sticky top-5 overflow-hidden rounded-lg border border-b1 bg-s1">
          <div className="flex items-center justify-between border-b border-b1 px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-t3">Prompt preview</span>
            <button onClick={copyPrompt} className="text-t3 hover:text-t1"><Copy size={13} /></button>
          </div>
          <div className="min-h-[64px] px-4 py-3.5 font-mono text-xs leading-7 text-t3">
            {form.prompt || "Enter your business name to preview the prompt…"}
          </div>
          <div className="flex items-center justify-between border-t border-b1 px-4 py-2.5 text-[11px] text-t3">
            <span>{form.prompt.length} chars</span>
            <span className="text-[10px] text-accent">DALL·E 3</span>
          </div>
        </div>

        <div className="mt-3.5 rounded-lg border border-b1 bg-s1 p-4">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-t3">Tips</div>
          <ul className="flex flex-col gap-2 text-xs leading-relaxed text-t2">
            <li className="flex gap-2"><span className="flex-shrink-0 text-accent">✓</span>Add your business name for it to appear in the image</li>
            <li className="flex gap-2"><span className="flex-shrink-0 text-accent">✓</span>The more specific your event detail, the better the result</li>
            <li className="flex gap-2"><span className="flex-shrink-0 text-accent">✓</span>Upload your logo in Brand Kit for automatic inclusion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4.5">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-t3">{title}</div>
      <Card><CardBody>{children}</CardBody></Card>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="text-[11px] font-medium text-t2">{label}</div>
      {children}
    </div>
  );
}
