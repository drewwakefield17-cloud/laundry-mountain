# Laundry Mountain

An event-built MVP turning physical laundry activity into mountain progress.

## Current scope: Phase 1

Folding camera/calibration spike first. Ben Nevis (1,345 m) is the first gameplay environment. Hanging and ironing share the future event contract but are not validated modes. No physical accuracy claim is made until the product owner tests real laundry on a phone.

## Development

Use Node 22.12+ or 24, then `npm ci`, `npm run dev`. `npm run check` runs deterministic tests and a production build. Camera use on a phone requires HTTPS; a plain LAN HTTP URL is insufficient.

`npm run test:e2e` exercises responsive layouts, denied camera permissions and a test-only synthetic pixel stream through the actual camera pipeline. Synthetic tests are software checks, not evidence of physical accuracy. Install the Playwright Chromium browser with `npx playwright install chromium` if needed.

The Windows launcher uses a temporary junction to this exact checkout when its path contains `#`, which otherwise breaks module URLs. It does not copy or move source files. Vite's filesystem access restrictions remain enabled.

## Phone field test

Test URL: https://laundry-mountain-folding.netlify.app

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
- Ben Nevis is an early code-rendered visual for the technical loop, not finished scene art. Further environments, summit transitions, Surge and achievements wait behind the physical folding gate.
- Test diagnostics deliberately remain visible in this field-test build; the normal consumer experience will hide them.
- No video, images or audio are stored, sent to a backend or included in exported reports.

## Integrity

Only new milestone commits with real timestamps. Never amend, backdate, rebase, squash or force-push. No pre-existing Laundry Mountain implementation is imported. Normal open-source dependencies are recorded in package-lock.json.

## Acceptance order

1. Real folding test: target 18/20 correct detections, zero duplicates, zero events in a two-minute negative control.
2. Ben Nevis: camera event → metres → visible movement → save → leave → restore.
3. Cloud persistence, then hanging and ironing completion workflows.
4. Additional mountain environments and secondary product screens.

Any seeded community records must include `is_demo: true` and be labelled as demo profiles in the UI. Phase 1 has no community seed data.

During a live landscape test, the front-camera preview and Ben Nevis progress sit side by side. Front-camera access is required explicitly; unsupported access stops setup with an explanation. Physical framing and accuracy still require the Pixel 9 Pro / Edge test.
