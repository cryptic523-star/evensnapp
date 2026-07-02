"use client";
import { cn } from "@/lib/utils";

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 flex-shrink-0 rounded-full border transition-colors",
        checked ? "bg-accent border-accent" : "bg-s3 border-b2"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4"
        )}
      />
    </button>
  );
}
