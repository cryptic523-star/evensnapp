"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Database } from "@/types/database";

type SocialAccount = Database["public"]["Tables"]["social_accounts"]["Row"];

const PROVIDERS = [
  { key: "instagram", name: "Instagram", color: "#e1306c", available: true },
  { key: "facebook", name: "Facebook", color: "#1877f2", available: true },
  { key: "linkedin", name: "LinkedIn", color: "#0a66c2", available: true },
  { key: "x", name: "X (Twitter)", color: "#9898aa", available: true },
  { key: "tiktok", name: "TikTok", color: "#ff0044", available: false },
  { key: "google_business", name: "Google Business", color: "#4285f4", available: false },
];

export function SocialGrid({ connected }: { connected: SocialAccount[] }) {
  const { show } = useToast();
  const byProvider = Object.fromEntries(connected.map((a) => [a.provider, a]));

  function connect(provider: string) {
    // Wire to /api/social/connect/[provider] (Meta / LinkedIn OAuth) once app credentials are configured.
    show(`${provider} OAuth flow not yet configured — add META_APP_ID / LINKEDIN_CLIENT_ID`, "info");
  }

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {PROVIDERS.map((p) => {
        const acct = byProvider[p.key];
        return (
          <div key={p.key} className="flex items-center gap-3.5 rounded-lg border border-b1 bg-s1 px-4.5 py-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md" style={{ background: `${p.color}22` }}>
              <div className="h-4 w-4 rounded-full" style={{ background: p.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">{p.name}</div>
              <div className="text-xs text-t3">
                {acct ? <span className="text-green">● Connected {acct.display_name ? "— " + acct.display_name : ""}</span> : p.available ? "Not connected" : "Coming soon"}
              </div>
            </div>
            {p.available ? (
              acct ? <Button size="sm" variant="ghost" onClick={() => show(`Disconnected from ${p.name}`, "info")}>Disconnect</Button>
                   : <Button size="sm" onClick={() => connect(p.key)}>Connect</Button>
            ) : <Badge variant="gray">Coming soon</Badge>}
          </div>
        );
      })}
    </div>
  );
}
