# Phase 1 acceptance record

## Scope

Foundation and folding/calibration spike. React, TypeScript, Vite, Canvas 2D, Vitest and Playwright. Hosting changed to Netlify by the product owner. Supabase remains the approved later backend. No hanging/ironing accuracy requirement blocks this first gate.

## Architecture

`vision/signals.ts` measures per-zone movement and change relative to an empty calibrated work surface. `vision/detector.ts` requires an ordered temporal sequence and rearms only after a cooldown with quiet zones. `domain/events.ts` supports folding, hanging and ironing completion events, with source provenance. `domain/ledger.ts` deduplicates event IDs and derives persistent totals. The Canvas scene derives its marker from the same saved metres as the progress bar.

## Truthful evidence

Deterministic unit tests and synthetic camera E2E checks must never be reported as physical laundry tests. The current user's production progress begins at zero and can only advance from accepted camera events. Test camera streams are injected only in Playwright test contexts. Negative-control events do not earn metres. Community demo data has not been created.

## Physical gate: NOT RUN

## Software verification

- 14 Vitest tests passed: state-machine ordering, stable placement, duplicates, negative streams, camera gaps, image-region extraction, rewards and ledger restoration.
- 3 Playwright checks passed: portrait/landscape without overflow, camera permission denial and a test-only camera pixel cycle awarding 10 m with restoration after reload.
- Production TypeScript/Vite build passed. Dependency audit reported zero vulnerabilities.
- Shared in-app browser inspected with zero user progress. Full/climb perspective switching works.

These results are software verification only. The physical gate below is still not run.

- First physical attempt: product owner could not start the test and reported confusing camera orientation, a close camera view and difficulty fitting the pile inside the source box. No accuracy result was obtained.
- Setup follow-up: calibrate only empty work/completed zones, bound calibration to eight seconds with retry, explain Start availability, add a nearby Start action, synchronise horizontal flipping in preview and analysis, request a full 4:3 frame, use minimum supported lens zoom and give the camera a dedicated landscape row. Source is a pickup region; the whole pile need not fit inside it.
- Phone/browser: Pixel 9 Pro, Microsoft Edge. Product owner clarified that calibration did complete; completion correctness and the Start action were unclear. Calibration capture does not verify semantic emptiness, so the UI now tells the user to check the two empty areas and highlights the nearby Start action.
- Correct folding detections / 20: not measured.
- Duplicates: not measured.
- Two-minute negative-control events: not measured.
- Mobile analysis fps / heat / permission behaviour: not measured.
- Leave/return position on phone: not measured.

Do not proceed to further product phases until the product owner supplies real physical results. The desired target is 18/20 correct, no duplicates and no negative-control events; shortfalls must be reported with exact counts and likely causes.
