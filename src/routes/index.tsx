import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ChangeEventPanel } from "@/components/impact/ChangeEventPanel";
import { DependencyGraph } from "@/components/impact/DependencyGraph";
import { FileDetailSheet } from "@/components/impact/FileDetailSheet";
import { ImpactedFilesTable } from "@/components/impact/ImpactedFilesTable";
import { ChallengeRail, IntegrationsStrip, OutcomeBanner, ValueRail } from "@/components/impact/Rails";
import { Panel } from "@/components/impact/shared";
import { WorkflowStages } from "@/components/impact/WorkflowStages";
import { Workbench } from "@/components/impact/Workbench";
import type { ImpactedFile } from "@/data/impactScenarios";
import { scenarios } from "@/data/impactScenarios";

const TITLE = "AI-Assisted Code Impact Analysis | Forged Fiber 37";
const DESCRIPTION =
  "When one Apex class changes, see the dependent components, ranked risk, and the follow-on updates needed across the Salesforce codebase.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [scenarioId, setScenarioId] = useState(scenarios[0]!.id);
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [stage, setStage] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openFile, setOpenFile] = useState<ImpactedFile | null>(null);
  const [sortByRisk, setSortByRisk] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const reset = () => {
    clearTimers();
    setStatus("idle");
    setStage(0);
    setActiveId(null);
    setOpenFile(null);
  };

  const selectScenario = (id: string) => {
    reset();
    setScenarioId(id);
  };

  const run = () => {
    clearTimers();
    setOpenFile(null);
    setStatus("running");
    setStage(1);
    timers.current.push(setTimeout(() => setStage(2), 750));
    timers.current.push(setTimeout(() => setStage(3), 1600));
    timers.current.push(
      setTimeout(() => {
        setStatus("done");
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 2300),
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.2em] text-navy-soft uppercase">
            <span className="h-0.5 w-8 rounded-full bg-teal" />
            AI to accelerate. People to deliver.
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Development — AI-Assisted Code Impact Analysis
          </h1>
          <p className="mt-2 max-w-4xl text-base text-navy-soft sm:text-lg">
            When one class changes, AI identifies dependent components and recommends the follow-on
            updates needed across the codebase.
          </p>
        </header>

        <div className="grid gap-5 xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
          <div className="order-2 xl:order-1">
            <ChallengeRail />
          </div>

          <div className="order-1 space-y-5 xl:order-2">
            <Panel eyebrow="AI impact analysis workflow">
              <WorkflowStages current={stage} />
              <div className="mt-5">
                <ChangeEventPanel
                  scenario={scenario}
                  onSelect={selectScenario}
                  onRun={run}
                  onReset={reset}
                  status={status}
                />
              </div>
            </Panel>

            <div ref={resultsRef}>
              {status === "done" ? (
                <div className="space-y-5">
                  <div className="grid gap-5 xl:grid-cols-2">
                    <Panel eyebrow="Dependency visualization">
                      <DependencyGraph
                        scenario={scenario}
                        activeId={activeId}
                        onHover={setActiveId}
                        onSelect={(id) => {
                          const file = scenario.files.find((f) => f.id === id);
                          if (file) setOpenFile(file);
                        }}
                      />
                    </Panel>
                    <Panel eyebrow="Impacted files (ranked by risk)">
                      <ImpactedFilesTable
                        scenario={scenario}
                        activeId={activeId}
                        sortByRisk={sortByRisk}
                        onToggleSort={() => setSortByRisk((v) => !v)}
                        onHover={setActiveId}
                        onSelect={setOpenFile}
                      />
                    </Panel>
                  </div>

                  <Panel eyebrow="Developer workbench">
                    <Workbench key={scenario.id} scenario={scenario} />
                  </Panel>
                </div>
              ) : (
                <Panel eyebrow="Analysis results">
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    {status === "running"
                      ? "Scanning source code, metadata and the dependency graph…"
                      : "Run the analysis to see impacted components, risk ranking and recommended updates."}
                  </p>
                </Panel>
              )}
            </div>

            <IntegrationsStrip />
          </div>

          <div className="order-3">
            <ValueRail />
          </div>
        </div>

        <div className="mt-5">
          <OutcomeBanner />
        </div>
      </div>

      <FileDetailSheet file={openFile} onOpenChange={(open) => !open && setOpenFile(null)} />
    </main>
  );
}
