import {
  BarChart3,
  Clock,
  Eye,
  Gauge,
  Network,
  ShieldCheck,
  Star,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { businessChallenges, engineeringValue, integrations } from "@/data/impactScenarios";

const challengeIcons: LucideIcon[] = [Network, Clock, Eye, Users];
const valueIcons: LucideIcon[] = [Gauge, Eye, ShieldCheck, Target, Users];

export function ChallengeRail() {
  return (
    <aside className="rounded-xl border border-border/70 bg-surface-slate p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-navy text-primary-foreground">
          <Target className="size-4.5" />
        </span>
        <h2 className="text-lg font-bold text-navy">Business challenge</h2>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Common obstacles that make code change assessment risky and time-consuming.
      </p>
      <ul className="mt-4 space-y-4">
        {businessChallenges.map((c, i) => {
          const Icon = challengeIcons[i] ?? Network;
          return (
            <li
              key={c.title}
              className="flex gap-3 border-t border-border/70 pt-4 first:border-0 first:pt-0"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-navy-soft">
                <Icon className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-foreground">{c.title}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        From complexity to confidence
      </p>
    </aside>
  );
}

export function ValueRail() {
  return (
    <aside className="rounded-xl border border-border/70 bg-surface-slate p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-navy text-primary-foreground">
          <BarChart3 className="size-4.5" />
        </span>
        <h2 className="text-lg font-bold text-navy">Engineering value</h2>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Measurable benefits for development teams and the business.
      </p>
      <ul className="mt-4 space-y-4">
        {engineeringValue.map((v, i) => {
          const Icon = valueIcons[i] ?? Gauge;
          return (
            <li
              key={v.title}
              className="flex gap-3 border-t border-border/70 pt-4 first:border-0 first:pt-0"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-navy-soft">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{v.title}</p>
                <p className="text-sm text-muted-foreground">{v.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        Higher quality software. Stronger communities.
      </p>
    </aside>
  );
}

export function IntegrationsStrip() {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <h3 className="text-center text-[0.7rem] font-bold tracking-[0.18em] text-navy uppercase">
        Integrations &amp; ecosystem
      </h3>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:grid-cols-7">
        {integrations.map((i) => (
          <li key={i.name} className="text-center">
            <p className="text-sm font-semibold text-navy">{i.name}</p>
            <p className="text-xs text-muted-foreground">{i.sub}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Shown as ecosystem context — this demo runs on built-in sample data.
      </p>
    </div>
  );
}

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
