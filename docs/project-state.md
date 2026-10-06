# Project handoff — 6 October 2026

## Current active visual work

The owner has reviewed the latest terrain paintings and says they are better but
still outside the mockup's design family. **Visual acceptance remains blocked.**
Do not call the screen set finished or mistake the generated material guides for
implemented app screenshots. Continue within the existing app.

The latest implementation adds a sourced 25 m Ben Nevis cliff patch,
individual woodland sprites, world-registered painted slope materials, independent
painted materials for all five locked previews, enamel badges, icon-only results,
fixed-size trail markers during zoom and usable route controls in phone landscape.
The artwork is physically attached to the geographic mesh, not a scene background.
The source geometry, mapped route, local ledger, front camera and test report remain.

Latest correction target: cooler green ground and blue rock shadows, stronger
grouped illustrated planes/edges, less yellow impressionistic brush noise, and
closer typography/sign/live-surroundings treatment. The supplied board controls
the style; `docs/design/source-art/board-*-style-sample.png` are source crops for
comparison, not new product artwork. Keep real mountain silhouettes/proportions.

The world-material guide/bake scripts are `build-view-material.py` (Ben Nevis) and
`build-preview-material.py` (locked previews). Python/Pillow/NumPy are offline art
tooling, not new browser dependencies. Portrait and landscape must both be checked:
a wider viewport exposed a material boundary; view-edge alpha feathering and proper
alpha composition have now been added and visually verified in phone landscape.

26 unit checks and TypeScript/build passed after the material integration; eight
affected browser checks passed. Targeted checks also verified the adjusted live
forest framing and waiting for a fully painted home capture. Pixel physical folding and hardware performance remain
unverified. Do not deploy to Netlify; retain `[skip netlify]` on pushed commits.

The source board crops now drive stronger grouped blue rock/cream edge materials
on all six geographic meshes. Headings use the existing Nunito Sans family instead
of Roboto Condensed. Welcome scenery is framed higher, the live icon-only dial has
individual pine framing, and the sign uses a softer illustrated timber asset.
These are improvements, not owner approval. Sign lettering, terrain colour/detail
balance and the richness of the surrounding scene remain visual review items.
See `docs/design/illustrated-scene-pass.md` and the current combined comparisons.

## Current task boundary

The repository/capability audit is complete in commit `63cc029`. The owner has now
asked the agent to handle Figma and lead the design process. A connected, editable
Figma reference/specification file exists; see `docs/design/figma-workflow.md` and
`docs/design/figma-state.json`. The first three core layouts were rendered and checked.
Mountain illustration acceptance remains unresolved. This design step did not
replace or redesign the running application. `AGENTS.md` records the enduring rules.

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
| Figma tools and design/component/token skills | Connected; project reference board, three editable working layouts and shared controls created | Resolve composition and shared components before repeated renderer/CSS edits |
| Supabase database/auth/storage/Edge Function/advisor tools | Available; not integrated; localStorage in use | Accounts, cross-device persistence and genuine asynchronous competition when capacity is resolved |
| Netlify tools/configuration | Host configured; older spike exists; current deployments paused | Authorized final deployment, environment/log checks and production verification |
| Vercel deployment/environment/log tools | Available; no current project integration found | Useful if the owner explicitly selects Vercel; not a reason to migrate this app |
| Performance/security specialist skills | Available; not a systematic gate yet | Canvas startup/mobile cost now; ownership/RLS/abuse review when a backend is added |

Current workflow: reference-based acceptance is binding before implementation.
The Figma artifact establishes editable composition, controls and reference evidence;
it does not resolve the remaining mountain-art gap. Next focus is illustrated terrain
detail on Ben Nevis, checked at phone scale against the supplied reference. Adapt
accepted details to the existing renderer and then verify real interactions. Tests
passing must not override a known visual failure. No backend or deployment was created.

## Latest app refinement — 6 October 2026

The preserved scenic camera/north OSM work has now been inspected and regression
checked alongside the live dial and sign refinement. Icon-only live emblem, curved
timer plate and slimmer warm painted sign are implemented in the current app.
24 unit tests/build and seven affected browser tests passed; both camera-flow checks
passed again after the final landscape timer adjustment. Source briefs and remaining
gaps: `docs/design/dial-and-sign-pass.md`.

Figma live/map edits saved, but the Starter-plan MCP tool limit was reached before
the final screenshot verification. Continue directly in the existing app and browser;
no upgrade is required for implementation/testing. Figma's latest render is unverified.
Overall mountain illustration acceptance and physical camera validation remain open.
