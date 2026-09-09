import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImpactedFile, Scenario } from "@/data/impactScenarios";
import { riskLabel, riskOrder } from "@/data/impactScenarios";
import { ActionPill, RiskBadge } from "./shared";

interface Props {
  scenario: Scenario;
  activeId: string | null;
  sortByRisk: boolean;
  onToggleSort: () => void;
  onHover: (id: string | null) => void;
  onSelect: (file: ImpactedFile) => void;
}

export function ImpactedFilesTable({
  scenario,
  activeId,
  sortByRisk,
  onToggleSort,
  onHover,
  onSelect,
}: Props) {
  const rows = sortByRisk
    ? [...scenario.files].sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])
    : scenario.files;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
            <th className="py-2 pr-2 font-semibold">#</th>
            <th className="py-2 pr-2 font-semibold">File / Component</th>
            <th className="py-2 pr-2 font-semibold">Type</th>
            <th className="py-2 pr-2 font-semibold">
              <button
                type="button"
                onClick={onToggleSort}
                className="inline-flex items-center gap-1 uppercase hover:text-navy"
              >
                Risk
                <ArrowUpDown className={cn("size-3", sortByRisk && "text-teal")} />
              </button>
            </th>
            <th className="py-2 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((file, i) => (
            <tr
              key={file.id}
              onMouseEnter={() => onHover(file.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(file)}
              className={cn(
                "cursor-pointer border-b border-border/60 transition-colors last:border-0",
                activeId === file.id ? "bg-teal-soft" : "hover:bg-secondary",
              )}
            >
              <td className="py-2.5 pr-2 text-muted-foreground">{i + 1}</td>
              <td className="py-2.5 pr-2 font-mono text-[0.8rem] font-medium text-navy">
                {file.name}
              </td>
              <td className="py-2.5 pr-2 text-muted-foreground">{file.type}</td>
              <td className="py-2.5 pr-2">
                <RiskBadge risk={file.risk} label={riskLabel[file.risk]} />
              </td>
              <td className="py-2.5">
                <ActionPill action={file.action} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted-foreground">
        Select a row for the full change recommendation.
      </p>
    </div>
  );
}
