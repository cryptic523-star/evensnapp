"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { saveBrandKit } from "@/app/(dashboard)/brand-kit/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { SWATCHES, INDUSTRIES, STYLES, CONTENT_TYPES } from "@/hooks/use-create-form";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type BrandKit = Database["public"]["Tables"]["brand_kits"]["Row"] | null;

export function BrandKitForm({ brandKit }: { brandKit: BrandKit }) {
  const { show } = useToast();
  const [color, setColor] = useState(brandKit?.primary_color || SWATCHES[0].hex);
  const [colorName, setColorName] = useState(brandKit?.color_name || SWATCHES[0].name);
  const isComplete = !!(brandKit?.business_name && brandKit?.industry);

  async function action(formData: FormData) {
    formData.set("primary_color", color);
    formData.set("color_name", colorName);
    const res = await saveBrandKit(formData);
    if (res?.error) show(res.error, "error");
    else show("Brand Kit saved", "success");
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className={cn("flex items-center gap-2.5 rounded-md border px-4 py-3 text-[13px]", isComplete ? "border-green/20 bg-green/10 text-green" : "border-amber/20 bg-amber/10 text-amber")}>
        <CheckCircle2 size={16} />
        {isComplete ? "Brand Kit active — all fields complete" : "Complete your Brand Kit so it can be auto-applied"}
      </div>

      <form action={action} className="flex flex-col gap-3.5">
        <Card>
          <CardHeader><CardTitle>Business identity</CardTitle><Button size="sm" variant="ghost" type="submit">Save changes</Button></CardHeader>
          <CardBody className="grid grid-cols-2 gap-3">
            <FieldText label="Business name" name="business_name" defaultValue={brandKit?.business_name || ""} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-t2">Industry</label>
              <select name="industry" defaultValue={brandKit?.industry || ""} className="h-10 rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60">
                <option value="">Select…</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-t2">Business description</label>
              <Textarea name="description" defaultValue={brandKit?.description || ""} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Brand colours</CardTitle></CardHeader>
          <CardBody>
            <div className="flex flex-wrap items-center gap-1.5">
              {SWATCHES.map((s) => (
                <button key={s.hex} type="button" onClick={() => { setColor(s.hex); setColorName(s.name); }}
                  className={cn("h-6 w-6 rounded-md transition-transform hover:scale-110", color === s.hex && "ring-2 ring-accent ring-offset-2 ring-offset-s1")}
                  style={{ background: s.hex }} />
              ))}
            </div>
            <div className="mt-1.5 text-xs text-t3">{colorName}</div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Visual preferences</CardTitle></CardHeader>
          <CardBody className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-t2">Preferred style</label>
              <select name="preferred_style" defaultValue={brandKit?.preferred_style || STYLES[0].value} className="h-10 rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60">
                {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-t2">Default content type</label>
              <select name="default_content_type" defaultValue={brandKit?.default_content_type || CONTENT_TYPES[0]} className="h-10 rounded-md border border-b1 bg-s2 px-3 text-sm text-t1 outline-none focus:border-accent/60">
                {CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <FieldText label="Negative prompt (things to avoid)" name="negative_prompt" defaultValue={brandKit?.negative_prompt || "text errors, blurry, low quality, watermark, generic stock photo style"} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tone of voice</CardTitle></CardHeader>
          <CardBody>
            <Textarea name="tone_of_voice" defaultValue={brandKit?.tone_of_voice || ""} placeholder="Warm, friendly and community-focused…" />
          </CardBody>
        </Card>

        <Button type="submit" className="w-auto self-start">Save Brand Kit</Button>
      </form>

      <Card>
        <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
        <CardBody>
          <div className="rounded-md border border-dashed border-b2 px-8 py-8 text-center text-t3">
            <div className="mb-2 text-xl">🖼️</div>
            <div className="mb-1 text-[13px] font-medium text-t1">Upload your logo</div>
            <div className="text-xs">PNG, SVG or JPG — uploads to Supabase Storage (brand-assets bucket)</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function FieldText({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-t2">{label}</label>
      <Input name={name} defaultValue={defaultValue} />
    </div>
  );
}
