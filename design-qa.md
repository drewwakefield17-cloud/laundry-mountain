# Reference fidelity review — bounded correction pass

final result: not passed — mountain illustration finish remains open

The owner rejected a2b85c1 as a different design family. Its previous visual
pass was incorrect and remains superseded. The exact target is the supplied
ten-screen board, most recently reattached 6 October 2026. The agreed mountain
sequence is Ben Nevis, Fuji, Matterhorn, Kilimanjaro, Denali and Everest.

## This pass

One coordinated implementation pass followed by one combined comparison and
correction pass, per the owner's request to avoid an endless design loop.

Completed corrections:
- Cream/navy typography, condensed headings, emerald highlighted controls,
  raised centre navigation button and mint forest edging across screens.
- Bevelled illustrated badge plates and working badge/filter/detail states.
- Five community rows with explicit fictional demo identity and local player data.
- Labelled camera-off workspace illustration; camera permission remains real.
- Portrait live layout now places the three statistics below the large circular
  mountain, retaining a smaller full-frame front-camera preview. Landscape
  retains the existing side-by-side layout.
- Ben Nevis generic cone replaced by real elevation and mapped path/water/woodland.
  Aspect changes use uniform scale. Demo climber portraits use real route positions.
- Six-mountain selection with five independent elevation-based locked previews.

## Evidence

`docs/design/review/current-screens.jpg` contains actual captures of all ten
primary screens. `reference-vs-current.jpg` combines six reference/current pairs
at the same content width, preserving their original aspect ratios. Individual
pairs and raw screenshots are retained in that folder. Live/results screenshots
use an isolated synthetic camera fixture and are labelled accordingly; they are
not evidence of successful physical laundry detection.

## Remaining visual findings

P1 — Mountain art direction. The geographic mesh establishes the correct landform,
path and relative dimensions, but its surface treatment still reads as a terrain
visualisation. It lacks the reference's crisp illustrated rock edges, expressive
painted vegetation and layered lighting. This affects home, welcome, map and live.
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
- All four game tests passed again after the final portrait live layout change;
  the camera preview, scene and controls remain inside the tested phone bounds.
- Physical Pixel 9 Pro / Edge folding acceptance is still unresolved (prior test:
  zero detections). No new physical success is claimed.
- No Netlify deployment. Only new, normally timestamped Git commits are permitted.

Design acceptance is deliberately not inferred from these software checks.
