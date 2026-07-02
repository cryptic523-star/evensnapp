"use client";
import Image from "next/image";
import { Loader2, AlertCircle, Download, Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export interface GeneratedImage {
  id: string;
  url: string;
  status: "pending" | "completed" | "failed";
  label: string;
  error?: string;
}

export function ResultsGrid({
  images, onRegenerate, onAddVariant,
}: { images: GeneratedImage[]; onRegenerate: () => void; onAddVariant: (note: string) => void }) {
  const { show } = useToast();
  const anyDone = images.some((i) => i.status === "completed");

  return (
    <div>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-t3">Your images</div>
      <div className="mb-2.5 grid grid-cols-3 gap-2.5">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-md border border-b1 bg-s1">
            <div className="relative flex aspect-square items-center justify-center bg-s2">
              {img.status === "pending" && (
                <div className="flex flex-col items-center gap-2 text-xs text-t3">
                  <Loader2 size={18} className="animate-spin text-accent" />
                  Generating…
                </div>
              )}
              {img.status === "failed" && (
                <div className="flex flex-col items-center gap-1.5 px-3 text-center text-xs text-red">
                  <AlertCircle size={16} />
                  {img.error || "Generation failed"}
                </div>
              )}
              {img.status === "completed" && img.url && (
                <Image src={img.url} alt={img.label} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="flex items-center justify-between border-t border-b1 px-2.5 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-t3">{img.label}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => img.url && window.open(img.url, "_blank")}
                  className="rounded border border-b1 bg-s2 p-1 text-t2 hover:bg-accent hover:text-white"
                ><Download size={12} /></button>
                <button
                  onClick={() => show("Saved to library", "success")}
                  className="rounded border border-b1 bg-s2 p-1 text-t2 hover:bg-accent hover:text-white"
                ><Bookmark size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {anyDone && (
        <div className="flex gap-2">
          <button onClick={onRegenerate} className="flex-1 rounded-md border border-b1 bg-s1 py-2 text-xs font-medium text-t2 hover:border-b2 hover:text-t1">↺ Regenerate</button>
          <button onClick={() => onAddVariant("portrait format, tall composition")} className="flex-1 rounded-md border border-b1 bg-s1 py-2 text-xs font-medium text-t2 hover:border-b2 hover:text-t1">+ Portrait</button>
          <button onClick={() => onAddVariant("wide landscape banner format")} className="flex-1 rounded-md border border-b1 bg-s1 py-2 text-xs font-medium text-t2 hover:border-b2 hover:text-t1">+ Banner</button>
        </div>
      )}
    </div>
  );
}
