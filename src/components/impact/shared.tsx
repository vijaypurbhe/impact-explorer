import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ActionKind, Risk } from "@/data/impactScenarios";

export const riskDot: Record<Risk, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
  related: "bg-risk-related",
};

export const riskText: Record<Risk, string> = {
  high: "text-risk-high",
  medium: "text-risk-medium",
  low: "text-risk-low",
  related: "text-risk-related",
};

export const riskRing: Record<Risk, string> = {
  high: "ring-risk-high",
  medium: "ring-risk-medium",
  low: "ring-risk-low",
  related: "ring-risk-related",
};

export function RiskBadge({ risk, label }: { risk: Risk; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span className={cn("size-2.5 rounded-full", riskDot[risk])} />
      <span className={cn(riskText[risk])}>{label}</span>
    </span>
  );
}

const actionStyles: Record<ActionKind, string> = {
  Update: "bg-risk-high-soft text-risk-high",
  Review: "bg-risk-low-soft text-risk-low",
  "Update Tests": "bg-risk-medium-soft text-risk-medium",
};

export function ActionPill({ action }: { action: ActionKind }) {
  return (
    <span
      className={cn(
        "inline-flex w-full max-w-[7.5rem] items-center justify-center rounded-md px-3 py-1 text-xs font-semibold",
        actionStyles[action],
      )}
    >
      {action}
    </span>
  );
}

export function Panel({
  title,
  eyebrow,
  className,
  children,
}: {
  title?: string;
  eyebrow?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(15,35,80,0.05)]",
        className,
      )}
    >
      {(title || eyebrow) && (
        <header className="mb-4 flex items-center gap-3">
          <span className="h-0.5 w-6 rounded-full bg-teal" />
          <h2 className="text-xs font-bold tracking-[0.14em] text-navy uppercase">
            {eyebrow ?? title}
          </h2>
        </header>
      )}
      {children}
    </section>
  );
}

export function BulletList({
  items,
  tone = "navy",
}: {
  items: string[];
  tone?: "navy" | "muted";
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">None identified.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-teal" />
          <span className={tone === "navy" ? "text-foreground" : "text-muted-foreground"}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
