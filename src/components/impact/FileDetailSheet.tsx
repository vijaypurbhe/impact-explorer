import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { ImpactedFile } from "@/data/impactScenarios";
import { riskLabel } from "@/data/impactScenarios";
import { ActionPill, BulletList, RiskBadge } from "./shared";

interface Props {
  file: ImpactedFile | null;
  onOpenChange: (open: boolean) => void;
}

export function FileDetailSheet({ file, onOpenChange }: Props) {
  return (
    <Sheet open={file !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {file && (
          <>
            <SheetHeader>
              <SheetTitle className="font-mono text-base text-navy">{file.name}</SheetTitle>
              <SheetDescription>{file.relation}</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <div className="flex flex-wrap items-center gap-4">
                <RiskBadge risk={file.risk} label={`${riskLabel[file.risk]} risk`} />
                <span className="text-sm text-muted-foreground">{file.type}</span>
                <ActionPill action={file.action} />
              </div>

              <Section title="Required updates">
                <BulletList items={file.requiredUpdates} />
              </Section>
              <Section title="Potential breakpoints">
                <BulletList items={file.breakpoints} />
              </Section>
              <Section title="Test coverage gaps">
                <BulletList items={file.coverageGaps} />
              </Section>
              <Section title="Refactoring suggestions">
                <BulletList items={file.refactors} />
              </Section>
              <Section title="Risk assessment">
                <p className="text-sm leading-relaxed text-foreground">{file.assessment}</p>
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold tracking-[0.12em] text-navy uppercase">{title}</h3>
      {children}
    </div>
  );
}
