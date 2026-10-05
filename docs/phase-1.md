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

## Guided physical test

The product owner requested instructions on the phone screen while testing. A field-test-only guide now follows camera/setup state and real detector stages. It prompts saving the folding report, gives three timed negative-control instructions (pause, wave/reach, rearrange), marks controls shorter than two minutes as incomplete, and supports a recorded-position/reload check. It distinguishes saved-state restoration from physical detection accuracy. Guide buttons never create laundry events or award metres.

Do not proceed to further product phases until the product owner supplies real physical results. The desired target is 18/20 correct, no duplicates and no negative-control events; shortfalls must be reported with exact counts and likely causes.

### Front-camera requirement

The product owner confirmed the front camera is essential so the screen and gamification remain visible. This supersedes the optional rear-camera setup guidance. Requests now require facingMode=user explicitly and reject a reported rear camera, stopping its stream. The live landscape layout places the preview beside the mountain and saved metre counter. On-screen setup keeps the screen facing the user.

Validation: 18 unit tests and seven Playwright software checks passed, including unavailable-front-camera handling, incorrect rear-camera rejection, both preview orientations and camera/scene/metre-counter viewport bounds at 844 x 390. Synthetic pixels remain test-only. Real Pixel 9 Pro / Edge camera framing, performance and 20-item accuracy are still pending.

### Failed physical attempt and report access

The product owner reported that the phone test failed and could not locate the downloaded report. The owner then confirmed zero automatic counts. The physical item count and failure stage have not yet been supplied; no acceptance pass is claimed. The detector and its thresholds remain unchanged pending physical evidence.

The latest finished report can now be opened with View results and read or copied in the app. The summary includes automatic event count, duration, analysis FPS, observed/last recorded stages and human notes. Notes persist with the report across reloads. Download requests explain the filename and where to look, while offering a text fallback. This does not remotely collect phone diagnostics; the owner must share the summary.

### Independent work while physical testing is unavailable

The product owner explicitly requested other build work while unable to complete the test. We are developing the Ben Nevis expedition view without marking the camera gate passed, extending other mountains, or fabricating progress. The scene, checkpoints and saved ledger view can be developed independently. The earlier stop-at-physical-testing restriction is relaxed for this requested independent work only.

Expedition route: `/?view=expedition`; original field-test route: `/`. The flag derives from the same saved metres in both views. Checkpoint selection focuses the scene without changing the ledger or unlocking a mountain. No community seed records or simulated current-user events are created. Navigation retains the saved field report, stops the camera, and invalidates calibration before returning.

The existing reference informs forest/cream colours, flat buttons, scenic focus and numerical hierarchy. Intentional limits: this milestone adds a single Ben Nevis overview and code-rendered scene rather than all ten reference screens, baked artwork, fake player profiles or unmeasured environmental savings. Supabase/cloud identity remains outstanding. Physical folding acceptance remains zero detections reported, exact human item count unknown.

Independent milestone validation: 20 Vitest tests and 11 Playwright checks passed. Verified checkpoint boundaries, route restoration, portrait/landscape overflow, scene controls, report preservation, stopped camera tracks, recalibration on return, and the existing synthetic camera pipeline. Browser console inspection found no relevant errors. No physical camera acceptance is implied.
