# Project handoff — 6 October 2026

## Current task boundary

The owner paused application changes to request a repository/capability audit and
persistent operating instructions. Finish that audit; do not resume design or app
implementation until the owner asks to continue. `AGENTS.md` records the enduring rules.

## Implemented foundation

Existing React/TypeScript/Vite mobile game with Canvas 2D mountain rendering.
Game screens include onboarding, home, setup, camera, live session, results, route,
mountain selection, badges, demo community, local profile and session history.
The original camera diagnostic flow remains at `/`; game home is `/?view=home`.
Events drive a deduplicated local ledger and saved progress. Cloud identity,
cross-device sync and real asynchronous competition are not connected.
Ben Nevis is the current route; five other mountains are locked terrain previews.

## Known gates and constraints

- Visual acceptance remains **not passed** in `design-qa.md`. The reference is a
  richer illustrated game world than the current terrain presentation.
- Pixel 9 Pro / Microsoft Edge physical testing previously counted zero items;
  the human item count and physical accuracy are unverified. Never call this passed.
- Supabase was deferred because the owner has no free-plan project capacity.
- Netlify remains selected. An older camera spike was deployed, but the current
  local screen work must not be deployed until the owner resumes deployment.
- GitHub repository: `drewwakefield17-cloud/laundry-mountain`, branch `main`.
  New meaningful commits/pushes allowed; no history rewriting.

## Worktree preserved at audit start

Last committed application milestone: `b1c2d8e` (painted terrain/cache detail).
Seven unfinished scenery-related files were already modified when the audit began:

- `src/components/MountainScene.tsx`
- `src/components/mountainTerrain.ts`
- `src/domain/terrain.ts`
- `src/domain/terrain.test.ts`
- `scripts/build-geography.py`
- `public/data/ben-nevis.json`
- `docs/design/geography-sources.json`

These changes introduce a lower north-face scenic camera and an additional public
OSM extract around Torlundy. They were interrupted before final visual/regression
verification. Preserve them without claiming completion or including them in the
instruction-only commit. Last-minute camera/lighting/foliage edits need inspection
when application work resumes. Do not discard them or assume their tests pass.

## Documentation precedence

Some historical milestone text is stale: `docs/phase-1.md` includes early “NOT RUN”
and no-demo statements followed by later field results; `docs/design/README.md`
contains an older bevelled-control direction. Current owner instructions and
`AGENTS.md` govern: flat buttons, labelled demo profiles, failed physical test still
unresolved. Preserve historical evidence and reconcile documentation as relevant
work resumes; do not use outdated statements as implementation requirements.

## Capability audit

Inspected the session's actual callable tool catalog and relevant specialist guides.
Exposed integrations include Figma, Supabase, Vercel, Netlify and GitHub. Browser
automation, shell/Git, image generation, web research, Vitest and Playwright are also
available. No external account/project authorization or quota was tested in this
audit; exposed tools are not proof that a project is provisioned or integrated.

| Capability | Current use | Material benefit |
| --- | --- | --- |
| Shared browser, Vitest, Playwright | Used for rendered screens, interactions, responsive checks and synthetic camera regressions | Keep these, with a binding visual gate and targeted performance evidence |
| Product-design guidance, image generation, web research | Used for reference comparison, individual art/materials and mountain geography | Stronger art direction and truthful reference/data provenance |
| Git/GitHub | Normal commits and pushes in use | Traceability; PR/CI tools when collaboration or automation warrants them |
| Figma tools and design/component/token skills | Available; no project Figma design artifact found in inspected repository/docs | Resolve composition and shared components before repeated renderer/CSS edits |
| Supabase database/auth/storage/Edge Function/advisor tools | Available; not integrated; localStorage in use | Accounts, cross-device persistence and genuine asynchronous competition when capacity is resolved |
| Netlify tools/configuration | Host configured; older spike exists; current deployments paused | Authorized final deployment, environment/log checks and production verification |
| Vercel deployment/environment/log tools | Available; no current project integration found | Useful if the owner explicitly selects Vercel; not a reason to migrate this app |
| Performance/security specialist skills | Available; not a systematic gate yet | Canvas startup/mobile cost now; ownership/RLS/abuse review when a backend is added |

First workflow recommendation: make reference-based acceptance binding before
more implementation. Use a Figma comparison/composition artifact for the existing
home and mountain screens, define concrete visual and interaction criteria, then
implement in this repository and verify against the same target. Tests passing
must not override a known visual failure. This is a recommendation only; no Figma
file, backend, deployment or new application design was created during the audit.
