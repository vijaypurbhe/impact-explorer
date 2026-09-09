import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const stages = [
  { id: 1, title: "Understand", sub: "Analyze change & context" },
  { id: 2, title: "AI Analyze & Recommend", sub: "Find impacts & suggest actions" },
  { id: 3, title: "Enable", sub: "Review, test & release" },
];

export function WorkflowStages({ current }: { current: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {stages.map((stage) => {
        const done = current > stage.id;
        const active = current === stage.id;
        return (
          <li
            key={stage.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
              done && "border-teal/50 bg-teal-soft",
              active && "border-navy bg-navy text-primary-foreground",
              !done && !active && "border-border/70 bg-surface-slate",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                done && "bg-teal text-navy",
                active && "bg-primary-foreground text-navy",
                !done && !active && "bg-card text-navy-soft",
              )}
            >
              {done ? <Check className="size-3.5" /> : stage.id}
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-sm font-bold",
                  active ? "text-primary-foreground" : "text-navy",
                )}
              >
                {stage.title}
              </span>
              <span
                className={cn(
                  "block truncate text-[0.7rem] tracking-wide uppercase",
                  active ? "text-primary-foreground/75" : "text-muted-foreground",
                )}
              >
                {stage.sub}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
