# AI-Assisted Code Impact Analysis — Interactive Demo

A single-page demo tool for the development function, styled to match the slide (navy headings, teal accent, soft tinted cards, light neutral background). It walks a Salesforce Apex change through impact analysis and shows the recommended follow-on updates.

## What the user experiences

1. **Change event panel** — pick one of 3 sample Apex changes (e.g. `OrderService.calculateTotal()` updated, `PaymentService` field added, `AccountTrigger` refactor). A small code viewer shows the edited snippet with the changed lines highlighted.
2. **Run analysis** — a "Analyze impact" button steps through the three workflow stages (Understand → AI Analyze & Recommend → Enable) with a short staged progress animation, then reveals results.
3. **Dependency visualization** — the changed class at the centre with impacted artifacts radiating out, each colour-coded High / Medium / Low / Related, with connecting arrows. Hovering or clicking a node highlights its row in the table and shows why it's impacted.
4. **Impacted files, ranked by risk** — table with #, File/Component, Type (Apex Class, Apex Trigger, Test Class, Lightning Page), Risk badge, and an Action pill (Update / Review / Update Tests). Sortable by risk; clicking a row opens a detail drawer.
5. **Change recommendation detail** — per file: required updates, potential breakpoints, test coverage gaps, refactoring suggestions, risk assessment.
6. **Developer workbench summary** — generated impact summary, change checklist (tickable), test suggestions, and auto-drafted PR notes with a copy button.
7. **Supporting rails** — left "Business challenge" column and right "Engineering value" column with the icon+text items from the slide; bottom strip of integration logos (GitHub, GitLab, Bitbucket, Salesforce, Jira, SonarQube, IDE plugins) shown as ecosystem context, plus the outcome banner.

## Data

All analysis results are hand-authored sample data in the app — realistic Apex file names, dependency edges, risk scores and recommendation text. No repo connection, no login, nothing saved between visits.

## Technical notes

- Single route at `/` replacing the placeholder page, built from section components under `src/components/impact/`.
- Sample dataset in `src/data/impactScenarios.ts`: scenarios → nodes, edges, impacted files, per-file recommendations, summary/checklist/PR notes.
- Design tokens added to `src/styles.css` (navy, teal, risk high/medium/low, tinted card surfaces); no hardcoded colours in components.
- Dependency graph drawn as inline SVG with absolutely positioned nodes — no charting library.
- Stage progression and reveal handled with local React state plus small CSS transitions.
- Page metadata (title, description, og/twitter) set in the route `head()`.

## Not in this version

Real repository connection, GitHub/GitLab auth, live AI calls, saved history, multi-user accounts. The integration strip is presentational. These can be added later — the AI-backed version would be the natural next step.
