# Laundry Mountain

An event-built MVP turning physical laundry activity into mountain progress.

The current release direction is a personal three-mountain adventure: **Ben Nevis,
Mount Fuji and Everest**. Community/leaderboards are out of scope. Ben Nevis is
playable; Fuji and Everest are currently geographic previews. The next gate is the
whole-app visual review in `docs/design/review/personal-adventure/`, followed by
three-mountain gameplay completion and AI later. See `docs/completion-plan.md`.

## Current scope: playable manual fallback

Home/Add now start a timer and the live basket climb without camera calibration.
Use **Bank this batch**, confirm the number of newly completed items, then climb
10 Laundry Metres per item. Multiple batches, pause/resume, saved sessions, results
and history work locally. Counts are explicitly manual. Timer duration and batch
speed do not award progress. Optional batch photos are temporary previews only;
there is no AI counting/upload endpoint yet. Automatic counting is still planned.

### Preserved camera spike

Folding camera/calibration spike first. Ben Nevis (1,345 m) is the first gameplay environment. Hanging and ironing share the future event contract but are not validated modes. No physical accuracy claim is made until the product owner tests real laundry on a phone.

## Development

Current local entries: `/` is the landing page; `/?view=welcome` is onboarding;
`/?view=home` opens the game; `/?view=mountain` opens the basket climb with a full
geographic-route toggle; `/?view=test` opens the original camera field test.
Existing browser storage keys and failed reports are preserved.

The camera prototype remains at `/?view=camera`: no laundry category, load size or
item quota. Fold any amount and finish whenever ready; progress follows mountain
checkpoints. `/?view=setup` is a compatible alias for camera setup. Prototype camera
calibration is still required until automatic detection is physically validated.
Supporting-screen evidence: `docs/design/review/app-consistency/index.html`.

Visual direction: refine the app against the approved coordinated board on
`visual-refinement`; `main` at `bd064c0` remains the fallback. Landing redesign is
parked. White surfaces, purpose-composed welcome/home art and the approved graphic
basket carry the new direction. The interactive overview retains measured terrain,
mapped route and saved progress, with separate portrait/landscape compositions.
Review evidence: `docs/design/review/visual-refinement/index.html`. The reference
remains the standard; integrated visual acceptance is pending.

Use Node 22.12+ or 24, then `npm ci`, `npm run dev`. `npm run check` runs deterministic tests and a production build. Camera use on a phone requires HTTPS; a plain LAN HTTP URL is insufficient.

`npm run test:e2e` exercises responsive layouts, denied camera permissions and a test-only synthetic pixel stream through the actual camera pipeline. Synthetic tests are software checks, not evidence of physical accuracy. Install the Playwright Chromium browser with `npx playwright install chromium` if needed.

The Windows launcher uses a temporary junction to this exact checkout when its path contains `#`, which otherwise breaks module URLs. It does not copy or move source files. Vite's filesystem access restrictions remain enabled.

## Phone field test

Existing field-test URL (older deployed spike, not the current local game screens): https://laundry-mountain-folding.netlify.app

Current screen work is local at http://localhost:5173/?view=home. Do not deploy updates until the owner requests it.

The approved basket is integrated as separately rigged illustrated assets. Accepted
Laundry Metres drive its finite walk and checkpoint hop. Reduced-motion preferences
disable those animations; revisiting a saved position does not replay rewards.
The climb foreground is an illustrative trail layered over the real-elevation Ben
Nevis renderer. Full mountain retains the mapped route. The landing page shares this
scene and links into onboarding, mountain previews and the original diagnostic flow.

Latest software verification: 29 Vitest checks and the production build passed;
18 Playwright checks passed with stable sources, followed by seven affected checks
after final crop/readability corrections. These include a synthetic camera event
moving the basket, session persistence, refresh, permissions, responsive layouts,
honest empty results, local profiles and labelled demo community. They do **not**
establish physical folding accuracy. The earlier real-phone test counted zero.

The temporary on-screen field-test guide walks through camera permission, framing, calibration, per-cycle folding instructions, report saving, a timed two-minute negative control, and a saved-position reload check. Instructions stay beside the camera and can be hidden/restored. Interrupted controls are marked incomplete; neither guides nor manual guide buttons award metres.

1. Open in normal Edge (Pixel 9 Pro), Chrome (Android) or Safari (iPhone), rotate to landscape, enable the front camera.
2. Prop the phone securely facing the table at roughly 45 degrees. Start about 1–1.5 metres from the work surface and adjust until the folding area and completed area fit the full camera view. Keep the screen facing you: the front camera is required and there is no rear-camera fallback; Flip view changes both preview and analysis. Supported lenses start at minimum zoom.
3. The source box only needs to cover the pickup spot, not the whole laundry pile. Leave Fold here and Completed empty. Adjust the zone rectangles if needed, withdraw hands, then calibrate. Tap Start folding now when ready. Calibration retries after eight seconds if the empty areas cannot settle.
4. Start folding test. Fold one item in the middle, move it completely into Completed, withdraw hands, and wait until Ready before taking the next item. Finish after 20; download the report.
5. Start negative control for two minutes: pause, wave, reach and rearrange the source pile without completing a fold/placement cycle. Finish and download that report too.
6. Note climbed metres, leave and reopen the same URL in the same browser; confirm the exact position restores.

Report correct detections out of 20 (not simply the total count), missed item numbers, duplicates, false events, phone/browser, approximate analysis fps and whether the saved position returned. Target: >=18/20 correct, zero duplicates, zero negative-control events. Report shortfalls honestly.

## Spike limitations

- Frame differences plus a temporal state machine infer completed processing; they do not recognise clothing or judge fold quality.
- Moving an unfolded garment through the same full sequence may satisfy the heuristic. This is a known validity risk for physical testing, not a solved classification problem.
- Similar garment/table colours, auto-exposure, shadows, occlusion and a completed stack covering the entire zone may cause missed or false detections.
- The camera and test end when the page is backgrounded. Re-enable and recalibrate for a fresh test. Metres already accepted are saved immediately.
- Phase 1 persistence is local to the browser origin; Supabase identity/cloud sync is not wired yet. Private browsing, cleared site data or another browser/device will not restore it.
- The Ben Nevis expedition interface is being developed independently while the folding gate is pending, at the product owner's request. Further environments, summit transitions and Surge remain gated. The independent game UI includes badges based only on accepted local progress.
- Test diagnostics deliberately remain visible in this field-test build; the normal consumer experience will hide them.
- No video, images or audio are stored, sent to a backend or included in exported reports.

## Integrity

Only new milestone commits with real timestamps. Never amend, backdate, rebase, squash or force-push. No pre-existing Laundry Mountain implementation is imported. Normal open-source dependencies are recorded in package-lock.json.

## Acceptance order

1. Real folding test: target 18/20 correct detections, zero duplicates, zero events in a two-minute negative control.
2. Ben Nevis: camera event → metres → visible movement → save → leave → restore.
3. Cloud persistence, then hanging and ironing completion workflows.
4. Remaining playable mountain environments.

Owner amendment (6 October): finish the full visual screen set and mountain previews before returning to the physical camera test. Design acceptance is separate from software checks.

Any seeded community records must include `is_demo: true` and be labelled as demo profiles in the UI. The independent game UI includes four fictional demo profiles with these identifiers; no real community accounts or backend exist.

During a live landscape test, the front-camera preview and Ben Nevis progress sit side by side. Front-camera access is required explicitly; unsupported access stops setup with an explanation. Physical framing and accuracy still require the Pixel 9 Pro / Edge test.

If a field test fails, tap View results, describe what happened, then Copy test summary and paste it into the build chat. The latest finished report and its notes stay in the same browser across refreshes. Starting and finishing another test replaces that latest report, so copy it first. JSON download is optional; its filename is shown after requesting it.

## Independent expedition milestone

Open `/?view=expedition` for the Ben Nevis overview, full/climb views, checkpoint exploration and existing saved statistics. The camera spike stays at `/`. Checkpoint exploration changes only the camera focus; it cannot create events or award metres. The original ledger and latest finished report keep their existing storage keys. Returning to camera setup requires fresh calibration.

The scene is entirely code-rendered Canvas 2D with deterministic terrain, a broad rocky summit, lower green glen, lochan, forest and atmosphere. Player animation runs only while progress changes; idle scenes stop requesting frames. Terrain is cached during each animation and rebuilt on resize. Pixel hardware performance still requires manual validation.

Visual references: [VisitScotland Ben Nevis](https://www.visitscotland.com/things-to-do/outdoor-activities/walking/mountains-hills/ben-nevis) and [John Muir Trust Ben Nevis](https://www.johnmuirtrust.org/about-us/where-we-work/ben-nevis). Checkpoint names/targets and route positions are game design, never real navigation data.

## Game screen work

Open `/?view=home` for the mobile game interface: welcome, home, load/goal setup, front-camera calibration, live climb, results, mountain progress, achievements, a labelled demo community, a local profile and session history. The camera field-test interface remains at `/`; the latest failed test report retains its existing storage key and is not replaced by game sessions. Screens share the actual camera pipeline and event ledger. No Supabase account is required for this local milestone. Progress and session records stay in this browser; accounts, cloud sync and asynchronous competition are not implemented yet.

The scene now renders sampled Ben Nevis elevation data and the mapped Mountain Path, lochan, River Nevis and woodland. Five locked expedition previews use separate real elevation grids. See `docs/design/geography.md` for accuracy limits, sources and attribution. The flag and map label move from accepted Laundry Metres. The original ten-screen board is the visual source; see `docs/design/README.md` for provenance and `design-qa.md` for the comparison review. Physical camera accuracy and Pixel performance remain unproven. No Netlify deployment is made during this screen work.
