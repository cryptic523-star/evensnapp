import { cn } from "@/lib/utils";

const variants = {
  green: "bg-green/10 text-green border-green/20",
  blue: "bg-accent/10 text-accent border-accent/25",
  amber: "bg-amber/10 text-amber border-amber/20",
  gray: "bg-s3 text-t2 border-b2",
};

export function Badge({
  variant = "gray",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
