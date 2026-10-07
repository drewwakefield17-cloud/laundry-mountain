# Reference fidelity review — 8 October 2026

## Current gate: visual refinement

**Not yet owner-approved.** The owner says all three LEFT reference screens remain
stronger than implementation. This is the acceptance target, not a reason to lower
the standard. Aim for at least 90% fidelity in a bounded pass; no measured percentage
or automatic visual pass is claimed.

Reference: `docs/design/source-art/approved-app-visual-direction.png`.
Evidence: `docs/design/review/visual-refinement/` (actual app captures, comparison,
browser error record and isolated saved-progress/summit fixtures).

- Welcome: larger approved companion, detailed Ben Nevis art, clean white curved
  entry panel, legible flat actions. Small landscape has a separate usable layout.
- Home: taller mountain artwork, stronger mascot and 96 px progress ring, coherent
  four-stat tiles, flat primary action and white next-checkpoint card.
- Overview: stronger foreground framing, clearer dotted mapped trail and sock
  milestone; dedicated wide camera prevents a squeezed portrait composition.
  The terrain illustration is still the hardest reference-fidelity gap. Keep
  geographic geometry and mapped route even where the concept invents a shortcut.
- Preserved: approved active climb, achievements, camera flow, local ledger and
  explicitly labelled demo profiles. Landing and wordmark are deferred.
- Software: 30 unit tests/build passed; all 18 existing browser checks passed earlier
  in this pass; final rotation, saved-position and new landscape-welcome checks
  passed (3/3). Captures at 390x844, 844x390 and 667x375.
- Physical detection and real-phone performance remain unverified. The last real
  folding attempt counted zero; synthetic fixtures do not change that result.

Previous QA records follow for traceability and do not supersede this gate.

## Latest app-only correction

Landing is explicitly parked following the owner's rejection. The actual app
determines its future direction. Original reference is now preserved at
`docs/design/source-art/original-ui-board.png`; the current app gallery is
`docs/design/review/coherent-baseline/index.html`.

- Home: restored earlier dimensional basket with natural trees, rocks and softer
  daylight. The mountain card, four stats, primary action and bottom navigation
  retain screen 2's hierarchy. Active climb remains the approved outlined basket.
- Full overview: new detailed ground material sampled from real world coordinates,
  replacing the extra texture bake that softened the painting. Geometry and mapped
  features are retained. Lighter route, smaller labelled demo portraits, orange
  sock milestones and the basket's actual saved position reduce visual competition.
  Separate header framing keeps the summit marker visible. Landscape portraits
  are smaller and offset so the short route remains legible.
- Applied Mohawk's consistency, hierarchy and truthful-progress guidance. Existing
  action conventions and progress data remain intact. Mobile portrait/landscape
  and a refreshed browser were inspected; no new console errors after refresh.
- Verification: 29 unit checks and production build passed; all 18 browser checks
  passed after the home change. Ten affected checks passed after overview changes,
  followed by the final rotation and saved-position checks (2/2). Final build passed.
- Generated detail uses built-in image_gen; source and prompt are recorded in
  `docs/design/overview-detail-prompt.txt`. It is a material, not geographic evidence.

**Visual status:** home and revised overview await owner review. The original
mockup's finish has not been declared matched. Landing remains rejected/parked;
wordmark refinement is deferred. Initial JS remains about 437 kB gzip, and the
new material adds a 2.95 MB PNG fetched only for the natural full overview.
Phone performance and physical folding remain unverified. These payloads are
performance follow-ups before release, not evidence of real-device readiness.

The following records describe the preceding integration pass.

Current result: implemented and browser-verified; integrated visual acceptance and
physical camera acceptance remain separate. Do not treat earlier blocked passes
or a passing test suite as owner approval of the new art integration.

**Owner review during this pass:** the basket climb view is good. Preserve that
direction. The landing page and full-mountain view need substantial improvement;
the wider screens are drifting from the original mockups. Those visual surfaces
remain **not passed**, with a further review expected after the first pass.

## Current evidence

Selected target: `docs/design/source-art/approved-basket-graphic-direction.png`.
This refines the mascot/scenery direction; the original ten-screen board controls
the wider UI. `docs/design/review/basket-integration/comparison.html` places that
reference beside actual 390 × 844 phone captures. The reference is artwork without
UI; comparison keeps its aspect ratio and explicitly shows the game controls.
Desktop landing was inspected at 1440 × 900, phone at 390 × 844, and session/view
controls in landscape at 844 × 390 and 667 × 375. Tests also check 320 px overflow.

| Surface | Verified | Remaining difference / boundary |
| --- | --- | --- |
| Typography | Clear navy headings, restrained hierarchy, readable labels; flat CTAs | Owner requested a more adult wordmark later. Icon stays. |
| Layout | Landing → onboarding → home → setup works; scene, front camera and controls fit live portrait/landscape | Camera preview intentionally changes the mock board's live layout. |
| Colour | Cream, deep green, navy and restrained sock-orange throughout | Real terrain materials vary from the reference painting. |
| Artwork | Selected basket identity rigged with coherent washing; photographic-style gloss avoided; circular session crop corrected | Foreground has a faint tan edge halo. Real Ben Nevis geometry and mapped woodland differ from the free illustration; final visual sign-off is pending. |
| Content | Adult audience recorded; local storage/privacy limitations, zero counters, demo community and future expeditions are explicit | No fabricated environmental savings, accuracy or real community users. |

Actual live/results screenshots use one isolated **synthetic** camera event (10 m),
not physical laundry evidence. The shared browser remains at zero. Inspection found
and fixed a checkpoint HUD covering the basket, too much sky, a square layer leaking
out of the live circle, a visible accessibility-only label and low-contrast camera
placement instructions. Mascot source assets were inspected in detail for outline,
washing containment and limb attachment; live/results captures were inspected at
their actual phone size. The scope is one integrated direction, not another style
exploration loop.

29 unit tests, TypeScript/build and 18 browser checks passed. Seven affected checks
passed again after final circular-crop/contrast corrections. A hot reload interrupted
one camera fixture during the first full run; a stable-source full rerun passed.
Physical 18/20 folding accuracy, zero duplicates, two-minute negative control and
real-device performance are still unverified. No Netlify deployment occurred.

Final follow-up: the generated matte sock marker replaced the temporary marker.
It retains a faint low-alpha halo and a larger stone foot than the master; inspect
it at its actual small in-game size, not as an exact standalone reproduction.
Near-to-far depth-buffer drawing cut one desktop first paint from 3,762 to 2,044 ms
without changing source geography. The 29 unit/build checks and seven affected
browser checks passed again after these changes. A local production-bundle smoke
test on port 4173 verified landing → home → climb and no new console errors.

## Earlier review (historical, superseded by the selected basket direction)

# Reference fidelity review — bounded correction pass

final result: blocked

## Latest implemented comparison

`docs/design/review/illustrated-pass/reference-current.jpg` compares all ten source
screens with actual current app captures; `focused-comparison.jpg` enlarges home,
route, live and badges. Empty first-paint captures were rejected and replaced.
Live/results counters in this evidence come from an isolated synthetic camera
fixture and are labelled synthetic. The shared browser's real ledger remains zero.

Five surface checks:

| Surface | Improvement verified | Remaining design gap / intentional difference |
| --- | --- | --- |
| Welcome / home | Wider heavy navy headings, flat green controls, real Ben Nevis scenery, higher welcome framing | Source uses a fictional sharper mountain; Ben Nevis retains its broad plateau. Terrain texture/light balance still needs owner review. |
| Mountain route | Blue/cream painted planes attached to real geometry, fixed-size climber pins, softer tan sign | Sign lettering is heavier than the source; the route environment still has a different detail distribution. No full-scene image substitutes for the geographic mesh. |
| Live / results | Icon only, native timer/progress, pine framing, camera and controls visible in portrait/landscape | Required front-camera workspace changes the source composition. Forest surround is still simpler than the board; no fake timer, item count or bonus state is used. |
| Achievements | Enamel hexagons, cream icon details, native labels/filter/detail and locked states | Native icon illustrations are simpler than the reference. Criteria reflect implemented local achievements rather than invented environmental savings. |
| Mountains / community | Six separate sourced landforms, locked previews, wider typography, readable rows | Six mountains require more list height than the four in the board. Fictional profiles remain labelled Demo; cloud competition is deferred. |

26 unit tests, TypeScript and production build passed; eight affected game/expedition
browser tests passed. Targeted follow-ups passed after live framing, capture
readiness and preview cache corrections. Browser checks verify software behaviour, not physical
folding accuracy or real Pixel performance. No deployment occurred.

**The original reference remains the acceptance target. This pass does not change
the blocked visual result or claim buildathon-ready quality.**

## Active owner feedback — 6 October, latest illustrated pass

The owner says the newer terrain is better but **the design style still does not
match**. This is a binding rejection, not an invitation to mark the current assets
passed. The latest world-registered painting improves fine detail, but reads too
yellow/impressionistic next to the source's blue rock planes, cooler greens and
more defined illustrated shapes. Typography, signs and live surroundings also need
a focused comparison. See source crops `docs/design/source-art/board-card-style-sample.png`,
`board-mountain-style-sample.png` and `board-sign-style-sample.png`.

Keep the sourced geometry, functional routes and current state. Correct the art
family rather than adding more noise/detail or relabelling the reference's fantasy
Snowdon silhouette as Ben Nevis. New terrain guides/paintings are material inputs;
they cannot substitute for actual app captures in the visual acceptance review.

The owner rejected a2b85c1 as a different design family. Its previous visual
pass was incorrect and remains superseded. The exact target is the supplied
ten-screen board, most recently reattached 6 October 2026. The agreed mountain
sequence is Ben Nevis, Fuji, Matterhorn, Kilimanjaro, Denali and Everest.

## This pass

One coordinated implementation pass followed by one combined comparison and
correction pass, per the owner's request to avoid an endless design loop.

Completed corrections:
- Cream/navy typography, condensed headings, emerald highlighted controls,
  flat buttons (owner preference) and mint forest edging across screens.
- Thin hexagonal badge frames, colour families and working badge/filter/detail states.
- Five community rows with explicit fictional demo identity and local player data.
- Labelled camera-off workspace illustration; camera permission remains real.
- Portrait live layout now places the three statistics below the large circular
  mountain, retaining a smaller full-frame front-camera preview. Landscape
  retains the existing side-by-side layout.
- Ben Nevis generic cone replaced by real elevation and mapped path/water/woodland.
  Aspect changes use uniform scale. Demo climber portraits use real route positions.
- Six-mountain selection with five independent elevation-based locked previews.

## Latest detail pass

The reference remains the first milestone, not the final buildathon ambition.
This is one further bounded pass requested by the owner after reviewing 9e83db8.

- Replaced one-colour terrain faces with perspective-correct material sampling.
- New painted crag material: angular slate-blue facets and warm sunlit planes.
- Accurate mapped shoreline/woodland boundaries replace visibly triangular patches.
- Fine canopy detail and depth-tested trees; soft contour follows real terrain occlusion.
- Closer landscape framing for home/welcome/live; full route and progress remain on map.
- Asset loads are coalesced; a four-entry backdrop cache avoids repeated surface paints.
- Phone-size home, map, climb view, onboarding, selection and synthetic live inspected.
- Initial full-map surface paint measured about 0.6 s on this desktop; returning to
  the map confirmed a cache hit with 0.0 ms repaint time. Physical phone performance
  remains unverified. This is a cached surface, not a per-frame render cost.
- 23 unit tests, TypeScript/build and seven affected game/expedition browser tests pass.
- Flat buttons, badge styling and community layout were retained from the prior pass.

`docs/design/review/detail-before-after.jpg` compares the reference, previous pass
and current implementation. `detail-pass.jpg` shows current home/map/live screens.

## Evidence

`docs/design/review/current-screens.jpg` contains actual captures of all ten
primary screens. `reference-vs-current.jpg` combines six reference/current pairs
at the same content width, preserving their original aspect ratios. Individual
pairs and raw screenshots are retained in that folder. Live/results screenshots
use an isolated synthetic camera fixture and are labelled accordingly; they are
not evidence of successful physical laundry detection.

## Remaining visual findings

P1 — Mountain art direction. The geographic mesh establishes the correct landform,
path and relative dimensions. The new surface pass adds crag detail, clean forest
boundaries and clearer water, but still reads more as shaded terrain than the
reference's richly composed illustrated world. Larger expressive vegetation and
more intentional light/rock groupings remain the main difference. This affects home, welcome, map and live.
Do not solve this by stretching the mountain or replacing it with a flat scene PNG.

P2 — Locked previews use correct separate elevation data but approximate seasonal
snow/vegetation colouring. They are not complete playable environments or surveyed
land-cover maps. Source resolution also smooths small sharp summits.

P2 — Some reference proportions differ across the ten-phone board itself. Current
screens preserve readable phone layouts; setup, badges and results have longer
honest copy and additional local-state/diagnostic information. A subsequent art
pass should focus on the mountain renderer, not repeatedly rework every control.

## Checks

- 23 unit tests passed, including sampled summit/base plausibility, mapped-route
  endpoint and aspect-ratio invariants.
- TypeScript and production build passed.
- All 15 Playwright tests passed after the coordinated pass.
- All 15 browser tests passed again after the perspective, flat-button and live-ring changes.
  Badge rim alignment/colour received a final browser visual correction afterward.
  Camera preview, scene and controls remain inside the tested phone bounds.
- Physical Pixel 9 Pro / Edge folding acceptance is still unresolved (prior test:
  zero detections). No new physical success is claimed.
- No Netlify deployment. Only new, normally timestamped Git commits are permitted.

Design acceptance is deliberately not inferred from these software checks.

## Dial and sign feedback pass — 6 October 2026

Implemented icon-only live medallion and slimmer warm painted trail signs. Retained
real terrain, route and front camera; adjusted timer proportions in landscape.
24 unit tests and the production build passed; seven affected browser tests passed,
then both camera-flow checks passed after the timer adjustment. Actual app screenshots
were inspected in phone portrait and landscape. See `docs/design/dial-and-sign-pass.md`.
Figma edits saved, but its Starter-plan MCP limit blocked the final render check.
The overall illustrated mountain acceptance remains **NOT PASSED**.
