import { FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphNode, Risk, Scenario } from "@/data/impactScenarios";
import { riskDot, riskLabelText, riskShort } from "./graphUtils";

interface Props {
  scenario: Scenario;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

const legend: Risk[] = ["high", "medium", "low", "related"];

export function DependencyGraph({ scenario, activeId, onHover, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-[7rem_1fr]">
      <ul className="flex flex-row flex-wrap gap-3 sm:flex-col sm:gap-2">
        {legend.map((r) => (
          <li key={r} className="flex items-center gap-2 text-xs font-medium text-navy-soft">
            <span className={cn("size-2.5 rounded-full", riskDot[r])} />
            {riskLabelText[r]}
          </li>
        ))}
      </ul>

      <div className="relative aspect-[16/10] w-full min-h-[20rem]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {scenario.nodes.map((n: GraphNode) => (
            <line
              key={n.id}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              strokeWidth={activeId === n.id ? 0.7 : 0.35}
              className={cn(
                "transition-all",
                activeId === n.id ? "text-teal" : "text-border",
              )}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-navy text-primary-foreground shadow-md">
            <FileCode2 className="size-6" />
          </span>
          <span className="mt-1.5 rounded bg-card/90 px-1.5 text-sm font-bold text-navy">
            {scenario.className}
          </span>
        </div>

        {scenario.nodes.map((n) => {
          const active = activeId === n.id;
          return (
            <button
              key={n.id}
              type="button"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onMouseEnter={() => onHover(n.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(n.id)}
              onBlur={() => onHover(null)}
              onClick={() => onSelect(n.id)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 focus:outline-none"
            >
              <span
                className={cn(
                  "size-6 rounded-full ring-4 ring-background transition-transform",
                  riskDot[n.risk],
                  active && "scale-125",
                )}
              />
              <span
                className={cn(
                  "rounded bg-card/90 px-1.5 text-center text-xs leading-tight font-semibold whitespace-nowrap text-navy transition-colors",
                  active && "text-teal",
                )}
              >
                {n.name}
                <span className="block text-[0.65rem] font-normal text-muted-foreground">
                  ({riskShort[n.risk]})
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
