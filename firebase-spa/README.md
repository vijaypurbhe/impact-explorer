# Codeo — Impact Analysis Tool · Firebase / Vite SPA bundle

This folder contains everything needed to run the demo as a plain
Vite + React Router single-page app that deploys to Firebase Hosting.

## Why a bundle instead of an in-place change

This project was created on the TanStack Start template. That choice is fixed at
creation time and produces a server-rendered bundle, not the static files
Firebase Hosting serves. The fix is to start a new project on the classic
Vite template and drop these files in.

## Steps

1. Create a new Lovable project using the classic Vite + React + Tailwind + shadcn template.
2. Copy from the current project, unchanged:
   - `src/components/impact/*`
   - `src/components/ui/*` (or keep the new project's copies)
   - `src/data/impactScenarios.ts`
   - `src/lib/utils.ts`
   - `src/styles.css` (rename to `src/index.css` if the new template uses that name)
3. Copy from this folder, overwriting:
   - `index.html`
   - `vite.config.ts`
   - `firebase.json`, `.firebaserc`
   - `src/main.tsx`, `src/App.tsx`
   - `src/pages/Index.tsx`, `src/pages/NotFound.tsx`
4. Install deps: `react-router-dom`, plus the ones the impact components use
   (`lucide-react`, `sonner`, `clsx`, `tailwind-merge`, `class-variance-authority`,
   `@radix-ui/react-dialog`, `@radix-ui/react-separator`, `@radix-ui/react-scroll-area`).
5. Delete anything TanStack: `src/routes/`, `src/router.tsx`, `src/start.ts`,
   `src/server.ts`, `src/routeTree.gen.ts`, and the `@tanstack/react-router`,
   `@tanstack/react-start`, `@tanstack/router-plugin`, `nitro`,
   `@lovable.dev/vite-tanstack-config` packages.

## Deploy

```bash
npm run build          # emits dist/
npx firebase login
npx firebase use --add # pick your project, alias "default"
npx firebase deploy --only hosting
```

Edit `.firebaserc` to your real Firebase project id first.
