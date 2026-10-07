# Project handoff — 8 October 2026

## Current: approved-board refinement on `visual-refinement`

- Branch created from `main` at `bd064c0`; main is the unchanged fallback. No
  history rewriting or deployment. Landing is parked, approved active climb and
  achievements retained. The owner requests a bounded but substantial pass aiming
  at least 90% toward the approved board. The LEFT reference remains the standard;
  current implementation has not received visual acceptance.
- Target: `docs/design/source-art/approved-app-visual-direction.png`, supported by
  the original ten-screen board. White functional surfaces, navy type, flat emerald
  controls. Welcome/home use purpose-composed Ben Nevis art and the graphic basket.
  Home now has a stronger mountain/mascot/progress hierarchy. Icons use a restrained
  dimensional family, with the mountain simplified after two rejected directions.
- Full overview retains DEM terrain, geographic land-cover masks and mapped path.
  Portrait and landscape use appropriate camera compositions with uniform scale;
  route, actual player and checkpoints share world coordinates. Illustrated surface
  materials and separate transparent rock/heather framing supply the finish.
  Two labelled demo portraits in portrait, one in landscape. No progress is invented.
- Evidence: `docs/design/review/visual-refinement/`; capture script uses an isolated
  browser and explicitly labelled 250 m/summit fixtures. Shared browser ledger is
  untouched. Review the reference comparison rather than assuming assets alone
  reproduce the approved design. Overview material/composition remains the most
  sensitive visual gap; no numerical similarity score is claimed.
- Inspection caught and fixed a real checkpoint-distance rounding bug: normalising
  250 metres to a fraction and back could show 251 remaining. Remaining distance
  now uses the original clamped metre value, covered by regression assertions.
- Verification: 30 unit checks and TypeScript/build passed. All 18 existing browser
  tests passed earlier in this pass; the new landscape-welcome regression and final
  rotation/saved-progress checks passed (3/3). Captures cover 390x844, 844x390 and
  667x375. Physical Pixel/Edge folding remains UNVERIFIED (last test counted zero).
- Runtime art uses compressed WebP; source PNGs/provenance are under docs. Existing
  JS bundle warning remains (~438 kB gzip). Actual phone performance is not proven.

The following sections retain previous milestone context; current decisions above
take precedence.

## Current follow-up: coherent baseline

- Home now uses the earlier dimensional basket atlas and natural scenery finish.
  Overview, Ben Nevis thumbnail, onboarding and landing share its softer daylight
  and earlier detailed woodland/rock assets. The active illustrated climb is retained.
  Real geographic geometry, counters and storage are unchanged; scenery caches
  include the finish so navigating between styles cannot reuse the wrong backdrop.
- Mohawk is now in use. Applied consistency, visual hierarchy and truthful progress:
  keep existing controls, reduce competing home decoration, verify stored metres
  while navigating home → climb → overview and reload.
- 29 unit tests, TypeScript/build and all 18 browser tests passed on stable sources.
  The saved-progress browser check now crosses both scenery treatments at 250 m.
  Existing synthetic camera events remain isolated; no physical success is claimed.
- Original board saved locally. Current screen gallery is being assembled in
  `docs/design/review/coherent-baseline/`. The owner just explicitly rejected the
  split landing hero, then explicitly parked landing work to focus on the app.
- The full-mountain overview was also rejected. The current correction samples a
  new detailed ground material directly using measured world coordinates, avoiding
  the extra north-up texture bake. Ground geometry, water/wood masks and route are
  retained. Thinner trail, smaller labelled demo portraits, orange socks and the
  existing graphic basket replace oversized markers/emblem. Header framing now
  leaves the summit marker visible. This is a revision for review, not visual approval.
- After the overview correction: 29 unit tests/build and ten affected browser
  checks passed; final rotation/restoration checks passed again (2/2). Refreshed
  browser inspection showed no new errors. Portrait and landscape screenshots
  are in the gallery. The new overview-only PNG is 2.95 MB; initial JS is about
  437 kB gzip, so real-phone performance and asset optimisation remain release work.
- Finish the coherent baseline first, then use a separate branch for later visual
  experiments. Keep the approved climb; no Netlify deploy. Wordmark remains deferred.

## Latest implemented milestone: basket game and landing page

**Latest owner feedback:** the implemented climb view is good and should be
preserved. The landing page and full-mountain view need substantial improvement;
the wider UI is drifting from the original mockups. Finish this integration/testing
pass, then expect a focused review of those surfaces against the original board.
Do not call the landing or full-mountain visual design finished or approved.

- `/` now serves the responsive landing page. Onboarding and the game remain at
  `/?view=welcome` and `/?view=home`; the original field test is `/?view=test`.
- `BasketAvatar` rigs the selected matte outlined character from separate body,
  arms and boots. The washing stays attached to the torso. `ClimbScene` layers a
  transparent foreground trail, progress-driven companion and sock checkpoint over
  the actual Ben Nevis elevation renderer. Full mountain retains geographic route
  exploration. The presentation trail is illustrative, not surveyed.
- Accepted ledger metres drive movement and new-checkpoint hops. Reload restores
  position without replaying celebrations. Reduced motion is respected. No demo
  events were written to the shared browser; it remains at zero.
- Onboarding, home, live session, results and profile use the same companion/style.
  Setup, mountains, badges and demo community preserve their working controls.
  Buttons stay flat, the front camera stays visible during sessions, and old reports
  and persistence keys are retained.
- Audience is explicitly adults. Keep the mascot playful while typography, copy,
  landscape and rewards feel restrained and mature. A more adult logo wordmark is
  requested **later**; preserve the approved icon and defer that typography task.
- Verification: 29 unit tests + TypeScript/production build; all 18 browser tests
  on stable sources; seven affected game/landing checks repeated after final live
  circular crop and instruction contrast fixes. The first full run had one camera
  interruption during hot reload; the stable full rerun passed. Screenshots and
  reference comparison are in `docs/design/review/basket-integration/`.
- Still outstanding: actual Pixel 9 Pro/Edge folding acceptance (last physical test
  counted zero), device performance and a secure phone testing URL. Cloud accounts,
  syncing and live competition are not connected; five future mountains stay previews.
  Netlify remains paused. Git history must only gain new commits.
- Known limits: generated trail has a faint edge halo; terrain detail differs from
  the selected painting because the backdrop retains real geometry. Initial JS is
  about 436 kB gzip, and source art still has a mobile payload cost. Real hardware
  performance and final integrated visual approval are not claimed.
- A near-to-far depth-buffer pass now skips hidden material work. One desktop
  844 × 326 first-paint measurement improved from 3,762 ms to 2,044 ms; this is a
  local observation, not a phone benchmark. All seven affected browser tests and
  the 29 unit tests/build passed after this final change. The production bundle
  was also opened locally on port 4173: landing → home → climb rendered correctly
  with no new console errors. No remote deploy was used.

The records below describe the preceding art exploration and retained architecture.

## Current decision and implementation

The owner selected the graphic outlined mascot treatment by attaching the exact
preferred image and saying "lets go with this one". The latest master reference is
`docs/design/source-art/approved-basket-graphic-direction.png`. It supersedes the
glossier finish in the earlier `approved-basket-climb-concept.png`. See
`docs/design/approved-direction.md`. The character has small hiking boots, washing
piled inside and an orange sock. Climb view should follow its journey to sock
checkpoints through smooth illustrated scenery based on our actual mountains.
Keep its rounded depth, clean navy/teal contours and simpler matte shading.

The owner also approved the standalone eight-second Remotion movement study on
7 October, with the washing in the basket still needing refinement. The preserved
reference is `docs/design/source-art/approved-basket-motion.mp4`. Keep the walk,
body sway and checkpoint hop; improve how the washing sits and moves inside the
rim. This concept was produced outside the app; integration is now authorized.

**Implementation resumed on 7 October 2026.** After selecting the graphic mascot,
the owner asked to get the whole app, landing page and testing done. Preserve the
existing repository and unfinished source/material changes while integrating.
Netlify deployment remains paused. Physical camera validation remains outstanding.

The three recent style studies and the final basket concept were image studies,
not game screenshots. Snailwalk inspired physical activity moving a visible avatar;
its pixel-art style and survival/chase mechanics were not selected.

## Previous implementation evidence

The following describes earlier passes. Their test results do not establish that
the unfinished working tree or new mascot design is verified.

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

## Earlier design-workflow milestone

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
