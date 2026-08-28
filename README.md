# CyberDog Creative

CyberDog Creative is a high-signal studio ecosystem for identity, digital work, culture, community, and the systems behind memorable experiences.

## What is here

- Public studio site and portfolio
- Database-backed Journal with editorial controls
- Authenticated Community rooms and member profiles
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
- `artifacts/cyberdog-creative/src/developer.tsx` — public update log and release protocol
- `artifacts/cyberdog-creative/src/journal.tsx` — Journal archive, article pages, and Studio editor
- `artifacts/cyberdog-creative/src/community/` — Community landing, rooms, and profiles
- `artifacts/api-server/src/` — Express API routes and security middleware
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Brand direction

The interface uses a dark cyberpunk system: near-black surfaces, crimson signal accents, chrome display type, monospaced technical labels, and motion that respects reduced-motion preferences.