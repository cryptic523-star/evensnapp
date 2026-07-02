"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function UpgradeButton({ isPro }: { isPro: boolean }) {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  async function upgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Could not start checkout");
    } catch (err) {
      show((err as Error).message, "error");
      setLoading(false);
    }
  }

  if (isPro) return <Button variant="ghost" size="sm" className="w-full">Manage plan</Button>;
  return <Button size="sm" className="w-full" onClick={upgrade} disabled={loading}>{loading ? "Redirecting…" : "Upgrade to Pro"}</Button>;
}
