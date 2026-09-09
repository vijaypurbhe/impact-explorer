import { Star } from "lucide-react";

export function OutcomeBanner() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-teal-soft px-5 py-4">
      <Star className="size-5 shrink-0 text-teal" />
      <p className="text-sm text-foreground">
        <span className="font-bold text-navy">Outcome:</span> quicker change analysis, fewer
        surprises in dependent classes, and safer releases.
      </p>
    </div>
  );
}
