import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ChangeEventPanel } from "@/components/impact/ChangeEventPanel";
import { DependencyGraph } from "@/components/impact/DependencyGraph";
import { FileDetailSheet } from "@/components/impact/FileDetailSheet";
import { ImpactedFilesTable } from "@/components/impact/ImpactedFilesTable";

import { Panel } from "@/components/impact/shared";
import { WorkflowStages } from "@/components/impact/WorkflowStages";
import { Workbench } from "@/components/impact/Workbench";
import type { ImpactedFile } from "@/data/impactScenarios";
import { scenarios } from "@/data/impactScenarios";

const TITLE = "Codeo — Impact Analysis Tool";
const DESCRIPTION =
  "Select a change to see dependent components, ranked risk, and recommended follow-on updates across the codebase.";

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
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Codeo — Impact Analysis Tool
          </h1>
          <p className="mt-2 max-w-4xl text-base text-navy-soft sm:text-lg">
            Select a change to see dependent components, ranked risk, and recommended follow-on
            updates across the codebase.
          </p>
        </header>

        <div className="grid gap-5">
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
                <div className="grid gap-5 2xl:grid-cols-2">
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
        </div>
      </div>

      <FileDetailSheet file={openFile} onOpenChange={(open) => !open && setOpenFile(null)} />
    </main>
  );
}
