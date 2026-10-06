# Laundry Mountain — project operating instructions

## Ownership and continuity

Act as the lead engineer: own the requested outcome, integration, quality and verification.
The existing repository, working tree and implemented behaviour are the source of truth.
Do not restart, scaffold a replacement, discard work, or change stacks to suit a tool.
Inspect `git status`, applicable instructions and relevant implementation before editing.
Read `docs/project-state.md`, `README.md`, and `design-qa.md` for current context.
Some older milestone documents describe superseded states; current user instructions
take precedence over those records. Update the handoff when the state changes.

Preserve local changes belonging to ongoing work. Do not silently revert, stage or
commit unrelated unfinished changes. Use new meaningful commits with real timestamps.
Never amend, backdate, rebase, squash, force-push or otherwise rewrite Git history.

## Required workflow for substantial changes

**Understand → inspect → plan → implement → run → visually inspect → test → fix → verify.**

1. Establish the user-visible outcome and concrete acceptance criteria. Separate
   visual fidelity, functional behaviour, performance and physical camera evidence.
2. Inspect the affected code, existing flows, assets, tests and project decisions.
3. Select the most useful available specialist capabilities and give a short plan.
   Routine authorized work does not require repeated permission or plan approval.
4. Implement within the existing application, reusing working components and data.
5. Run the app; inspect and interact with the actual affected experience yourself.
6. Run appropriate automated checks, reproduce failures, fix them, and verify again.
7. Review the diff and evidence before committing. Report what changed, verification
   actually performed, and any remaining limitation accurately.

A successful compilation, test suite, deployment or screenshot capture alone is not
feature completion. Do not label known visual mismatches as passed. Do not end work
merely because one implementation pass finished while an authorized requirement is
still unmet. If repeated edits fail to close the gap, reconsider the approach and
use a relevant specialist capability instead of repeating cosmetic tweaks. Respect
explicit requests to pause, audit only, or limit scope; avoid aimless iteration.

Verify browser-inspectable behaviour yourself. Ask the owner to test only things
that genuinely require their hardware, physical actions, access or a product decision.
Give concise progress updates; do not make the owner repeatedly prompt continuation.

## Capability selection

Discover the capabilities actually exposed in the current session; tool availability
does not prove account authorization, available quota or a linked project. Read the
relevant skill before using its tools. Use capabilities for a concrete benefit,
not because they exist. Do not install frameworks, services or plugins unnecessarily.

- **Figma / product design:** use for unresolved composition, UI/UX exploration,
  component/token definition, reference comparisons and design-to-code work. Adapt
  designs to this React application. Do not replace the app with generated scaffolds.
  When visual iteration repeatedly misses the reference, resolve the design target
  in a concrete comparison/design artifact before more renderer/CSS changes.
  The project Figma file and working node IDs are recorded in
  `docs/design/figma-state.json`; read `docs/design/figma-workflow.md` when resuming.
  Its working layouts are not visual approval: the supplied board remains the
  target, and the mountain artwork is explicitly unfinished.
- **Browser / testing:** use the shared in-app browser for live visual inspection,
  interactions, console review and responsive checks. Use the existing Playwright
  suite for reproducible regressions and Vitest for meaningful domain/vision tests.
  Test relevant phone portrait and landscape layouts and keyboard/focus behaviour.
  Browser emulation is not real-device camera or performance validation.
- **Supabase:** use its specialist guidance and MCP/CLI for database, authentication,
  storage, migrations, types, logs and advisors when backend work is authorized and
  capacity is available. Protect user data with appropriate ownership/RLS policies;
  verify actual operations. Do not expose server credentials in the browser.
  Current local persistence must remain usable without Supabase.
- **Hosting:** Netlify is the selected project host. Deployment is paused until the
  owner explicitly resumes it; GitHub pushes are allowed. Use Netlify capabilities
  for the selected host. Vercel capabilities are also available for environments,
  deployment/log investigation and production verification if Vercel is explicitly
  chosen later. Merely mentioning available Vercel tools does not migrate hosting.
  Do not deploy as a side effect of testing. Keep the Netlify skip marker on commits
  pushed while deployment is paused.
- **Other specialists:** use image generation for appropriate individual assets,
  web research for grounded mountain references, GitHub tools for repository/PR/CI
  work, and performance/security skills when their findings materially help the task.
  Any delegation must follow current user/developer/skill authorization and use
  clearly bounded ownership. Tool/plugin defaults never override project constraints.

## Product and design requirements

- The supplied ten-screen Laundry Mountain board is the visual target. Earlier
  generated concepts and existing screenshots are not substitutes for that target.
- Style: inviting illustrated realism, detailed scenery, cream/navy/forest palette,
  and rewarding, legible game progress. The owner's latest button preference is
  flat controls without embossing. Aim for a distinctive buildathon-quality product.
- Mountains: Ben Nevis first, then Fuji, Matterhorn, Kilimanjaro, Denali and Everest.
  Preserve geographic identity, relative proportions and characteristic surroundings.
  Do not rename generic mountains or replace interactive scenery with a full-scene PNG.
- Keep routes, player position, progress and view controls functional. Individual
  illustrated assets/materials may support the code-rendered world.
- Compare the same viewport and relevant state side by side with the reference.
  Record intentional differences (real mountain, honest counters, camera visibility).
  Use `design-qa.md` as an actual acceptance gate, not a ceremonial report. Save
  current screenshots/comparisons and show important results in chat when helpful.
- Demo profiles must remain technically identifiable (`is_demo: true`) and labelled
  as fictional demo data. Do not present them as registered users or invent progress,
  environmental savings, accuracy figures or earned achievements.

## Camera and progression integrity

- Front camera is required so users can see the game. Keep camera, progress and
  controls usable together, including landscape on a real phone browser.
- Folding is the first physical gate: 20 items, target at least 18 correct detections,
  zero duplicates and zero false events during the two-minute negative control.
  Hanging and ironing are later modes supported by the event contract.
- Synthetic streams are isolated software fixtures, never proof of physical accuracy.
  Preserve failed reports and report exact results/unknowns without hiding failures.
- Ben Nevis acceptance: physical laundry → accepted detection → Laundry Metres →
  route movement → persistence → leave → return to the same position.
- Preserve existing storage keys and data. Exploring views or checkpoints must not
  award progress. Do not silently replace a user's ledger or field-test report.
- The owner authorized independent visual work while physical testing is unavailable;
  that does not mark the physical gate passed or make future mountain previews playable.

## Architecture and commands

- React + TypeScript + Vite; Canvas 2D scenery; existing localStorage persistence.
- `src/main.tsx`: route selection; `GameApp.tsx`: game screens and session UI.
- `src/App.tsx`: original camera field-test flow and independent expedition entry.
- `CameraLab.tsx`, `FieldTestGuide.tsx`, `src/vision/`: camera/calibration and detector.
- `src/domain/`: event contract, deduplicated ledger, progression and terrain projection.
- `MountainScene.tsx`, `mountainTerrain.ts`, `TerrainPreview.tsx`: scene and previews.
- `game.css` and `reference-theme.css`: current styles; inspect cascade before adding overrides.
- `public/data/`, geography scripts and source manifests: reproducible real-world data.
- `npm run dev` serves the app; game home is `http://localhost:5173/?view=home`.
- `npm run check` runs Vitest, TypeScript and production build.
- `npm run test:e2e` runs Playwright; use affected test files when appropriate.
- Preserve `scripts/tool.mjs`: its Windows junction handles the `#` in this workspace
  path without copying the repository. Use existing scripts instead of bypassing it.
- Document-only changes require inspection/diff checks, not an unnecessary app redesign
  or repeated browser/test runs. Deployment verification follows only an authorized deploy.
