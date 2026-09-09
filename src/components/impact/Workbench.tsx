import { useState } from "react";
import { Check, ClipboardCheck, Copy, FlaskConical, GitPullRequest } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Scenario } from "@/data/impactScenarios";
import { BulletList } from "./shared";

export function Workbench({ scenario }: { scenario: Scenario }) {
  const [ticked, setTicked] = useState<string[]>([]);

  const toggle = (item: string) =>
    setTicked((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(scenario.workbench.prNotes);
      toast.success("PR notes copied to clipboard");
    } catch {
      toast.error("Couldn't copy — select the text instead");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-xl border border-border/70 bg-surface-peach p-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-navy">
          <ClipboardCheck className="size-5 text-navy-soft" />
          Impact summary
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          {scenario.workbench.summary}
        </p>

        <h4 className="mt-5 mb-2 text-xs font-bold tracking-[0.12em] text-navy uppercase">
          Change checklist
        </h4>
        <ul className="space-y-2">
          {scenario.workbench.checklist.map((item) => {
            const done = ticked.includes(item);
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => toggle(item)}
                  className="flex w-full items-start gap-2 text-left text-sm"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                      done ? "border-teal bg-teal text-navy" : "border-border bg-card",
                    )}
                  >
                    {done && <Check className="size-3" />}
                  </span>
                  <span className={cn(done && "text-muted-foreground line-through")}>{item}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {ticked.length} of {scenario.workbench.checklist.length} complete
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-surface-mint p-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-navy">
          <FlaskConical className="size-5 text-navy-soft" />
          Suggested tests
        </h3>
        <div className="mt-3">
          <BulletList items={scenario.workbench.tests} />
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-surface-sky p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-bold text-navy">
            <GitPullRequest className="size-5 text-navy-soft" />
            PR notes
          </h3>
          <button
            type="button"
            onClick={copyNotes}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-navy hover:bg-secondary"
          >
            <Copy className="size-3.5" />
            Copy
          </button>
        </div>
        <pre className="mt-3 rounded-lg border border-border/70 bg-card p-3 font-mono text-[0.7rem] leading-5 whitespace-pre-wrap text-foreground">
          {scenario.workbench.prNotes}
        </pre>
      </div>
    </div>
  );
}
