import { Code2, Database, Loader2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Scenario } from "@/data/impactScenarios";
import { scenarios } from "@/data/impactScenarios";

interface Props {
  scenario: Scenario;
  onSelect: (id: string) => void;
  onRun: () => void;
  onReset: () => void;
  status: "idle" | "running" | "done";
}

export function ChangeEventPanel({ scenario, onSelect, onRun, onReset, status }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-xl border border-border/70 bg-surface-indigo p-5">
        <div className="flex items-center gap-2 text-navy">
          <Code2 className="size-5 text-navy-soft" />
          <h3 className="text-base font-bold">Developer change event</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a sample change a developer just made in the IDE.
        </p>

        <div className="mt-4 space-y-2">
          {scenarios.map((s) => {
            const active = s.id === scenario.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={active}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "border-teal bg-card font-semibold text-navy shadow-[0_1px_3px_rgba(15,35,80,0.08)]"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:border-navy-soft/50 hover:text-navy",
                )}
              >
                <span className="font-mono text-xs text-teal">{s.fileName}</span>
                <span className="mt-0.5 block">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRun}
            disabled={status === "running"}
            className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "running" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            {status === "running" ? "Analyzing…" : "Analyze impact"}
          </button>
          {status === "done" && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-5">
        <div className="flex items-center gap-2 text-navy">
          <Database className="size-5 text-navy-soft" />
          <h3 className="text-base font-bold">Repository &amp; metadata scan</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{scenario.changeSummary}</p>

        <pre className="mt-4 overflow-x-auto rounded-lg border border-border/70 bg-panel p-3 font-mono text-xs leading-6">
          {scenario.code.map((line) => (
            <div
              key={line.n}
              className={cn(
                "-mx-1 flex gap-3 rounded px-1",
                line.changed && "bg-teal-soft font-semibold text-navy",
              )}
            >
              <span className="w-4 shrink-0 text-right text-muted-foreground">{line.n}</span>
              <span className="whitespace-pre">{line.text}</span>
            </div>
          ))}
        </pre>

        <ul className="mt-4 flex flex-wrap gap-2">
          {scenario.scanned.map((s) => (
            <li
              key={s}
              className="rounded-md bg-surface-slate px-2.5 py-1 text-xs font-medium text-navy-soft"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
