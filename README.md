# CyberDog Creative

CyberDog Creative is an innovative technology company that builds software, web apps, websites, databases, APIs, automations, and digital systems for people and organizations ready to turn a rough signal into a working system.

## What is here

- Public studio site and portfolio
- Public Services page with a hosted Tally client-intake form
- Database-backed Journal with editorial controls
- Authenticated Community rooms and member profiles
- Shareable case studies with social destinations and exportable project briefs
- Public developer update log at `/developer`
- Clerk-powered sign-in and member portal

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/cyberdog-creative run dev
```

Useful checks:

```bash
pnpm --filter @workspace/cyberdog-creative run typecheck
pnpm --filter @workspace/cyberdog-creative run build
pnpm run typecheck
pnpm run build
```

## Update protocol

Every approved change to product behavior, public content, or project information must leave a clear trace:

1. Add a dated, human-readable entry to [`CHANGELOG.md`](./CHANGELOG.md).
2. Add the same update to the public Developer section at [`/developer`](./artifacts/cyberdog-creative/src/developer.tsx).
3. Update this README when setup, capabilities, architecture, or the public project story changes.
4. Prepare a Git commit with a descriptive message.
5. Open a GitHub pull request for review and include release notes for substantial updates.
6. Create or update a GitHub issue when the work represents a tracked request, follow-up, or known limitation.

Repository activity is reviewable work, not a silent side effect. GitHub publishing requires the repository connection and approval for the target repository and branch.

## Project map

- `artifacts/cyberdog-creative/src/App.tsx` — app shell, routes, global navigation, and shared wayfinding
- `artifacts/cyberdog-creative/src/services.tsx` — service capability matrix and Tally project intake
- `artifacts/cyberdog-creative/src/developer.tsx` — public update log and release protocol
- `artifacts/cyberdog-creative/src/journal.tsx` — Journal archive, article pages, and Studio editor
- `artifacts/cyberdog-creative/src/community/` — Community landing, rooms, and profiles
- `artifacts/api-server/src/` — Express API routes and security middleware
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Brand direction

The interface uses a dark cyberpunk system: near-black surfaces, crimson signal accents, chrome display type, monospaced technical labels, and motion that respects reduced-motion preferences.