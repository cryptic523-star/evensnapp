"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type ImageRow = Database["public"]["Tables"]["images"]["Row"];

export function LibraryGrid({ images }: { images: ImageRow[] }) {
  const { show } = useToast();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "favourites">("all");

  const filtered = useMemo(() => {
    return images.filter((img) => {
      if (filter === "favourites" && !img.is_favourite) return false;
      if (query && !img.business_name?.toLowerCase().includes(query.toLowerCase()) && !img.event_type?.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [images, query, filter]);

  return (
    <div>
      <div className="mb-4.5 flex flex-wrap items-center gap-2.5">
        <div className="relative max-w-[300px] flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-t3" />
          <Input className="pl-8" placeholder="Search images…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button onClick={() => setFilter("all")} className={cn("rounded-md border px-3 py-1.5 text-xs", filter === "all" ? "border-accent/30 bg-accent/10 text-accent" : "border-b1 bg-s1 text-t2")}>All</button>
        <button onClick={() => setFilter("favourites")} className={cn("rounded-md border px-3 py-1.5 text-xs", filter === "favourites" ? "border-accent/30 bg-accent/10 text-accent" : "border-b1 bg-s1 text-t2")}>Favourites</button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-t3">
          <ImageOff className="mx-auto mb-3.5 opacity-40" size={32} />
          <div className="mb-1.5 text-[15px] font-semibold text-t1">No images yet</div>
          <p className="mb-5 text-[13px] leading-relaxed">Images you generate will appear here.</p>
          <Button asChild><a href="/create">Create your first image</a></Button>
        </div>
      ) : (
        <div className="columns-3 gap-2.5">
          {filtered.map((img) => (
            <div key={img.id} className="group relative mb-2.5 break-inside-avoid overflow-hidden rounded-md border border-b1 bg-s1">
              <div className="relative aspect-square w-full bg-s2">
                {img.public_url && <Image src={img.public_url} alt={img.business_name || ""} fill className="object-cover" unoptimized />}
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="mb-1.5 text-[10px] text-white/50">{img.business_name} · {img.content_type} · {new Date(img.created_at).toLocaleDateString()}</div>
                <div className="flex gap-1.5">
                  <button onClick={() => img.public_url && window.open(img.public_url, "_blank")} className="rounded bg-black/65 px-2 py-1 text-[11px] text-white backdrop-blur">Download</button>
                  <button onClick={() => show("Added to favourites", "success")} className="rounded bg-black/65 px-2 py-1 text-[11px] text-white backdrop-blur">♡ Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
