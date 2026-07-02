"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ImagePlus, Images, Palette, Share2, Settings, CreditCard, Plus } from "lucide-react";
import { ApertureLogo } from "./aperture-logo";
import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/create", label: "Create", icon: ImagePlus },
  { href: "/library", label: "Image Library", icon: Images },
  { href: "/brand-kit", label: "Brand Kit", icon: Palette },
  { href: "/social", label: "Social Accounts", icon: Share2 },
];
const ACCOUNT_NAV = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar({
  userName, userEmail, plan, credits, creditsLimit,
}: { userName: string; userEmail: string; plan: string; credits: number; creditsLimit: number }) {
  const pathname = usePathname();
  const initials = userName.slice(0, 2).toUpperCase();
  const pct = Math.max(4, Math.round((credits / creditsLimit) * 100));

  return (
    <aside className="flex w-[220px] flex-shrink-0 flex-col border-r border-b1 bg-s1">
      <div className="border-b border-b1 px-4 pb-3.5 pt-[18px]">
        <div className="mb-4.5 flex items-center gap-2.5">
          <ApertureLogo />
          <span className="text-sm font-semibold tracking-tight">EventSnap</span>
        </div>
        <Link
          href="/create"
          className="flex w-full items-center gap-1.5 rounded-md bg-accent px-2.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-dark"
        >
          <Plus size={13} />
          Create image
        </Link>
      </div>

      <nav className="flex-1 px-2 py-2.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
              pathname === href ? "bg-accent/10 text-accent" : "text-t3 hover:bg-s3 hover:text-t1"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
        <div className="mb-1 mt-3 px-2 text-[10px] font-semibold uppercase tracking-wide text-t4">Account</div>
        {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
              pathname === href ? "bg-accent/10 text-accent" : "text-t3 hover:bg-s3 hover:text-t1"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-b1 px-2 py-3">
        <div className="mb-1.5 rounded-md border border-b1 bg-s2 px-2.5 py-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] text-t3">Credits this month</span>
            <span className="text-[13px] font-semibold">{credits}</span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-full bg-b1">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Link href="/settings" className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-s3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-600 text-[11px] font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{userName}</div>
            <div className="text-[11px] capitalize text-t3">{plan} plan</div>
          </div>
        </Link>
        <form action={signOut}>
          <button className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-[11px] text-t3 hover:bg-s3 hover:text-red">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
