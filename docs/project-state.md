## Submission repository update - 9 October 2026

The owner requested the complete current app in the GitHub submission repository.
Main is being fast-forwarded to the verified working app and demo source; preserve
all history and the earlier baseline commits. This is repository publication only,
not a new production deployment. Commit messages retain [skip netlify].

- Replaced the stale root/trailer README introductions with current scope, install
  and render instructions, real app screenshots, approved cover and voiceover links.
  Previous README notes are preserved in docs/archive/.
- Included the accepted three-mountain app, HTTP-safe session IDs, artwork, domain
  tests, approved Remotion composition, trimmed isolated demo takes and cover.
- Kept personal recording originals, intermediate footage, video exports, caches,
  credentials and the locally licensed OS emphasis font out of Git. The optional
  trailer README explains the font setup and historical compositions.
- Updated existing browser tests for the accepted controls, journal and reward
  dialogs. Moved demo capture recipes behind playwright.capture.config.ts.
- Fixed two bounded layout regressions: the preserved live-camera screen now uses
  landscape width, and manual Save for later stays visible at 667 x 375.
- Verification: 48 unit tests, TypeScript and Vite production build passed. All
  22 browser regressions passed across focused runs (11 camera/geography; 8 app;
  3 corrected selector/reward cases). Production npm audit: zero findings.
  Literal runtime assets and README links checked. The initial broad run exposed
  cold dev-server startup timeouts and stale UI selectors; subsequent focused
  runs passed after server readiness and selector/layout corrections.
- The large preserved geographic-renderer chunk still triggers a Vite size warning.
  Physical camera accuracy, cloud sync and photo estimation remain unvalidated or
  unimplemented; the demo labels photo estimation as a concept.

## Approved 43.8-second visual edit — 9 October

Owner accepted the tightened cut with “pretty happy with this”. Preserve this
visual edit, including the sunset closing; the new cover is a separate asset.
A subsequent overlap report is fixed: Basky sits below/right of the full subtitle.

- Live timeline: http://localhost:5190/LaundryMountain-Landscape-Edit
- Review/download: http://127.0.0.1:5192/
- MP4: trailer/out/laundry-mountain-final-silent.mp4 — 43.8 s, 1920 × 1080,
  30 fps, 1,314 decoded frames, 22,325,195 bytes. Silent for owner-added music/VO.
- Script: trailer/VOICEOVER-ELEVENLABS.txt; exact visual windows and suggested
  recording blocks: trailer/VOICEOVER-43S-CUES.md. No voice audio generated.
- Fresh isolated recordings: tests/demo-polish-capture.spec.ts, both cases passed.
  Images including SVG scenery were preloaded; actual Start/Bank clicks were filmed.
  Only the test recording has a tap indicator. Owner progress and app code unchanged.
- Short standalone clips have fixed boundaries, one readable badge, no outgoing
  dialogs, and walking cuts ending before the idle/camera-reset phase. Scene times
  are in the cue sheet; the 64.3-second MP4/source archive remains available.
- Verified TypeScript, full video decode, source in/out frames, and exported frames
  across all scenes. Evidence: trailer/out/final-qa-board-{1,2,3}.jpg and
  trailer/out/polish-source-boundaries.jpg. The exported MP4 played through 43.8 s in the shared browser with no media error;
  proof: trailer/out/approved-playback-proof.png.
- Photo estimation remains explicitly labelled concept, not implemented detection.
  Later summits come from illustrative manual UI batches in isolated demo profiles.

Cover: owner approved the new combined composition (sunset Basky/logo, three
mountains, three phones) and requested home / Mount Fuji close-up / badge screens.
Completed and visually inspected: trailer/cover/laundry-mountain-combined-final.png.
Phones show Ben Nevis home, Mount Fuji uphill climb and Glen Explorer badge.
The prior combined version is retained alongside it. The approved video ending
remains the selected sunset artwork.

This supersedes the earlier 64.3-second edit and voiceover instructions.


## Latest owner steering — full demo and headline finish, 9 October

Owner confirmed Remotion and requested the complete product story, actual app
screens in motion and all three mountains. The 22-second sample is superseded.
The full sequence is now 64.3 seconds in the SAME live composition:
http://localhost:5190/LaundryMountain-Landscape-Edit.

Owner then said the rest was looking good and requested larger headers, with some
logo-like font variation. Main headers are now 132 px, with local video-only Arial
Black emphasis (not claimed to be the exact raster-logo font). App UI fonts and
production remain unchanged. Owner explicitly selected a new closing image:
`trailer/public/art/owner-selected-closing.png`; use it full-width with a gentle
camera push. This supersedes the earlier request to retain the V3 logo ending.

Sources: trailer/src/ProductStory.tsx and PhotoWalkthrough.tsx.
Real recordings cover start, 25-item batch, walking, checkpoint/badge, saved trail,
Ben Nevis/Fuji/Everest progression and summits. Three recording scenarios passed
individually after the first portrait run exposed a delayed-dialog timing issue
in the capture script. Demo progression is isolated and labelled; no owner data
was altered. Photo estimation is an animated, visibly labelled concept, not built.
TypeScript passed. The full export is 64.3 seconds, 1920 × 1080 at 30 fps
(1,929 decoded frames, 55.3 MB). Selected exported photo, checkpoint, Fuji, Everest
and closing frames were visually inspected. The browser player loaded the new
file and played at its native dimensions without a media error. Review/download:
http://127.0.0.1:5192/ and trailer/out/laundry-mountain-product-story.mp4.
Sound is still deferred. Creative final approval remains open.

See trailer/PRODUCT-STORY.md and trailer/VOICEOVER-PRODUCT-STORY.md.

## Current demo direction — landscape edit, 9 October

The owner rejected v3's pale surrounds, generic corner labels and portrait-first
presentation. They liked its reward and logo ending. The live working composition
is now http://localhost:5190/LaundryMountain-Landscape-Edit (21.8 seconds).
The owner requested two opening still beats (Tuesday / Basky taking it personally),
then real app use and reward, with the cinematic climb moved to the payoff.
This is a direction review, not an approved final submission. Music remains deferred.

- `src/LandscapeEdit.tsx`: new sequence; exact existing Nunito fonts and logo.
- `public/art/basky-takes-it-personally.png`: matching reaction edit generated with
  the built-in image tool from laundry-expedition plus the approved mascot face.
  The room, lighting, laundry mountain and character materials are preserved.
- `public/recordings/landscape-app-demo.webm`: actual app at 960×540, recorded in an
  isolated Playwright context. Manually banked 20 items → 200 m → walking and badge.
  This is software-demo footage, not the owner's phone or physical detector evidence.
  `tests/demo-landscape-capture.spec.ts` passed; owner storage was not touched.
- Existing free generation returned 720×1280 despite a wide source/prompt. The
  closing shot follows Basky with a 16:9 crop; there is no native wide generated
  source, no stretched character and no new paid video generation.
- V3 reward and logo ending are reused. The photo concept is omitted from this
  short correction sample. Photo counting remains unimplemented.
- TypeScript passed. Reaction art and closing framing were checked in Studio.
  Owner creative review is still required. Production and app visuals unchanged.

## Latest: landscape visual cut v3 ready for owner review — 9 October

Owner resumed production after the storyboard and requested landscape, exact app
assets/fonts, real gameplay, a restrained app-styled photo concept and a Canva
trial. Owner then explicitly prioritised seeing the visual video over music.

`trailer/out/laundry-mountain-demo-v3.mp4` is now exported: 36.3 seconds, 1920×1080,
30 fps, H.264, 1,089 decoded frames. Player: http://127.0.0.1:5192/.
This is an unapproved visual review cut, not a finished submission. It uses larger
editorial crops of the owner's count/bank/climb/badge recording, an actual results
capture, the existing free Basky clip, exact logo and app Nunito 800/900 fonts.
The proposed before/after photo sequence is labelled as a concept. No photo AI was
implemented. Audio is intentionally deferred at the owner's latest direction.
Source: `trailer/src/DemoV3.tsx`; narration: `trailer/VOICEOVER-V3.md`.

The variable-frame-rate phone source was normalised before trimming. Climb footage
is source 18.8–21.35 s, slowed to fit its shot; count footage is 15.6–18.9 s.
Results uses an exact owner-recording still with a camera move. Do not describe all
shots as live footage. Selected frames were visually checked; TypeScript passed;
full MP4 decoded and browser playback started without a media error. Owner's
creative verdict remains pending; v1/v2 remain rejected historical drafts.

Canva correct-account draft: https://www.canva.com/design/DAHXgi6L_qo/mguOvY38dTHXmsniC_A23Q/edit
Title: Laundry Mountain — Basky product demo. Exact logo/free Basky clip uploaded;
Beauty Future Pop added as a trial music track. The v3 film is not yet inserted in
that Canva timeline. Prioritise owner review of the exported visuals before more
assembly or sound work. No app code, accepted app visuals or deployment changed.

# Project handoff — 9 October 2026

## Latest: owner stopped v2; storyboard before more production

Owner rejected the 31.8-second v2 as far below target: app too small, generic words,
no convincing story/flow, mismatched invented photo screens and weak logo tile.
Remotion was used for assembly, layouts, text moves and rendering; successful
export/playback was not creative acceptance. Video editing/generation/export is
paused at the owner's request while the story is reviewed.

New review artifact: `trailer/storyboard/index.html`, served at
http://127.0.0.1:5192/storyboard/. Eight proposed portrait shots follow one real
20-item / 200 m batch through banking, movement, badge and saved results. App is
full-frame for 22/32 seconds. Exact logo appears large in the ending's sky.
Photo concept is a separate optional insert, based on the real count sheet with
the same controls and a before/after addition to its photo row. It remains labelled
as proposed. No app code, accepted design or movie composition changed in this
reset. Board images are existing artwork and exact samples from owner footage.
Owner feedback is the next step; do not resume production from older authorization
without accounting for this explicit stop/review request.

## Latest: Basky product demo, owner footage and phone fix — 9 October 2026

The mascot is **Basky** (like basket). Owner wants a product demo with trailer
energy, not a generic tagline montage. Preserve the app's exact logo, typography
and colours. The first custom cut was a useful start but rejected for weak energy,
disjointed story, reconstructed branding and odd laundry in the old walking shot.

`trailer/` now contains a separate Remotion editing project. The 31.8-second v2
composition uses the correct logo, a pile → Basky → real manual batch → rewards →
three mountains story, then a clearly labelled proposed photo-counting animation.
The proposed 18 → 20 correction is illustrative, not working recognition. No AI
counting was added to the app. VO script, timings, provisional captions, original
recordings and source provenance are in `trailer/README.md`. Studio is at
http://localhost:5190/LaundryMountain-Demo-v2; player at http://127.0.0.1:5192/.
Export/playback status is recorded in the trailer README. Music/VO and owner
review remain; do not call this a finished soundtrack or approved submission.

Owner supplied two phone recordings. The second shows 20 manually confirmed items
earning 200 m and real badges. First recording preserves the failed session start.
HTTP LAN reproduction found `crypto.randomUUID` unavailable in insecure contexts;
shared ID generation now falls back to `crypto.getRandomValues`. Native/fallback
tests plus the existing suite pass: 48 tests in 11 files, TypeScript and production
build. The same LAN origin was exercised through start, bank, save/reload and
finish. This is manual-flow evidence, not physical camera/detection validation.

One explicitly authorized free Higgsfield motion attempt completed (720x1280,
6.04 s); v2 uses 0.4–3.4 s. No paid repeat. The two Creative Claw input uploads
were explicitly approved solely for this transfer. See generation-record.json.
Canva was discussed as a possible finishing editor; no Canva upload/project exists.

Accepted landing now includes three different phone views: Ben Nevis, Fuji and
Everest. Mobile gallery inspected; build passes. Accepted app visuals preserved.

Open release finding from the owner's recording: Fuji/Everest have blue/blank
scenery for several seconds on cold entry. Not fixed yet. Clear frames are used
in the demo, and the original recording remains available. This prevents claiming
all physical-phone performance checks passed. Final hosting/site choice, cover
selection, soundtrack/VO and demo approval also remain. No new deployment.
Older status sections below are historical where they conflict with this update.

## Latest: landing revision and trailer rejection — 9 October 2026

Owner rejected the first landing pass as weak and the 19-second DemoBro video as
not good enough. The approved three-mountain app is unchanged. Landing now has
purpose-composed portrait/desktop Ben Nevis artwork, a grounded waving companion,
shorter copy, illustrated stat icons, tactile steps and a sock-stop entry card.
Actual page review is at http://localhost:5180/. Agent inspected 390x844, 320x740,
1440x900 and 844x390; app entry, mountain anchor and FAQ expansion work. Build and
whitespace checks pass; no captured browser warnings/errors. Owner accepted this
landing direction with “much better”. Preserve its hero and visual finish.
New images were made with built-in imagegen; sources/prompts are in source-art and
optimized WebP files in public/art. Existing accepted app scenes were not changed.

Three cover alternatives remain at design/review/release-covers/index.html.
Release evidence and full outstanding work: design/review/release-checks/current-status.md.
The earlier local manual regression pass passed 46 tests; the normal landing/game
now defer camera/geographic prototype code. Old combined-bundle figures below are
historical. The geographic prototype still has a large deferred chunk.

Only a Netlify draft was uploaded, to the existing Laundry Mountain site. Other
projects and the production version were untouched. The draft contains the first
landing, not this revision. Production site choice is still pending after automatic
review rejected creating a duplicate Laundry Mountain project. Netlify access works.

DemoBro draft: https://www.demobro.video/v/d7b4d25b-8ab8-41b7-9fcd-8c8ee33110d5.mp4
Owner rejected it. A custom mascot-led edit is still required; no new cut exists.
Creative Claw music generation was blocked before generation (6 required credits,
1 available, no charge). Do not claim trailer or physical-phone acceptance complete.

## Latest: all three mountains playable — 9 October 2026

The owner accepted the Ben Nevis finish/movement and explicitly authorized Fuji
and Everest to that standard. Both now use the approved UI and uphill companion,
with their own painted home, overview, climb, portrait/landscape session, profile
and reward scenery. No new mockup approval gate. Ben Nevis artwork is preserved.

- Playable order: Ben Nevis (1,345 m) -> Mount Fuji (3,776 m) -> Everest (8,849 m).
  Each has independent saved position, sock checkpoints and summit/unlock states.
- New manual ledger events carry an optional mountain ID. A batch crossing a summit
  fills that mountain and carries its remainder forward exactly once. All three
  positions cap at their summit; lifetime items/metres continue afterwards.
- Old untagged events remain Ben Nevis progress. Historical excess is not silently
  reallocated. Existing ledger/session storage keys and earned badges are retained;
  selected mountain uses a new separate key. Sessions resume on their own mountain.
- Home, profile, journal, results and rewards use the relevant mountain. Each real
  checkpoint has its own copy. Close-camera approaches on the longer climbs are
  at most 250 m so a small batch visibly moves the whole basket. Internal approach
  changes do not create fake checkpoints or extra awards.
- Code lives in the existing React app: shared mountain definitions/progress domain,
  reused session/reward/scene components, scoped expedition CSS. No new dependency.

Verification: production build, 46 tests across 10 files and git diff whitespace
check pass. Existing Vite large-chunk warning remains (main JS ~446.6 kB gzip).
Browser checks used isolated localhost:5174, covering locks, mountain selection,
all checkpoint/summit transitions, cross-summit remainder, whole-basket travel,
pause/resume, save/reload, history/results, badge reveal and post-Everest batches.
Checked 390x844 portrait, 844x390 landscape, 320x740 narrow and 1440x900 desktop.
No captured browser errors/warnings or broken home images. Owner localhost:5173
was read unchanged at Drew / 100 m / 10 items / 2 badges / 0 completed loads.
Test origin ends at all three summits, 14,050 lifetime metres, 1,405 items,
10 completed loads, 8 badges. Those are synthetic manual QA entries, not owner work.

Review: docs/design/review/playable-mountains/index.html and five reference/app
comparisons. Agent visual QA passed, and the owner approved the integrated new
mountains with “perfect” on 9 October. Keep all three mountain designs fixed.
Remaining release work is physical-phone acceptance,
performance/package review, demo video and authorized Vercel deployment/submission.
AI/camera accuracy and cloud sync are deferred; none is claimed or deployed here.
Older entries below are historical and do not override this state.

## Latest: forward travel and recording quality — 8 October 2026

Owner correctly rejected the earlier walking proof: feet alternated but a 10 m
batch translated the basket less than one screen pixel, and the GIF was dithered.
The close scene now stages the current checkpoint approach. Banking animates the
whole basket along that path at frame rate, with perspective scaling and a small
weight shift; it remains at its earned position after the step. Footfall timing
uses whole cycles. At a checkpoint it reaches the sock, celebrates, and stages
the next approach behind the existing reward. Summit progress remains capped.
Manual counts, awards and saved totals are unchanged by this presentation fix.

Verified in the in-app browser on isolated localhost:5174: 10 -> 110 m with a
10-item batch; 110 -> 260 m crossed Into the glen before its real reward; 260 ->
270 m checked a short step in 844 x 390 landscape. Portrait was 390 x 844. Both
sprites, contact shadows, persistent destination and the next approach were
inspected. The final endpoint is beside the visible sock. No console errors.
Owner localhost:5173 progress was untouched. The isolated test session is saved
and paused at 270 m / 27 items; the earlier 127.0.0.1:5174 test remains at summit.

The full-colour capture is review/coordinated-implementation/uphill-travel.webp,
linked from the review gallery. It encodes actual captured frames at their recorded
intervals using lossless WebP; first frame contains 123,671 colours versus the old
GIF's 256. Browser capture itself is JPEG. Do not describe it as a 60 fps video.
Live travel uses requestAnimationFrame. Earlier static screenshots still represent
the approved composition; the current motion clip is authoritative for travel.

Production build and 39 unit tests pass. New regressions cover meaningful projected
travel, checkpoint staging, save/reload stability and no replay/post-summit movement.
Reduced-motion code bypasses travel and foot animation; media emulation was not
available in the in-app browser, so that setting was reviewed in source, not claimed
as a browser-emulated check. Final result: passed for the movement/recording scope.

## Latest owner review — final three tweaks, 8 October 2026

The owner accepted the rest of the correction pass and requested three localized
changes: clear white backing behind the welcome tagline, readable location labels
on Mountains, and a basket facing uphill in climb/session scenes. These are now
implemented; preserve the accepted layouts and artwork elsewhere.

- Welcome: soft white backing with the logo layered above it, checked at 390 and 320 px.
- Mountains: white location text on a dark backing for all three cards.
- Climb/session: rear three-quarter uphill poses A/B, with each shadow beneath
  its planted boot. Checked in 390 px portrait and 844 x 390 landscape. Actual
  isolated test batch added one item / 10 m and showed both frames. Reduced-motion
  rules also cover the two shadows. Owner localhost:5173 progress was untouched.
- Production build passed. No console errors in the isolated browser check.
  Existing 36 unit tests passed in the preceding pass; domain logic is unchanged.
- Current evidence: docs/design/review/coordinated-implementation/final-tweaks.jpg,
  welcome-narrow.jpg, session.jpg, session-landscape.jpg and uphill-motion.gif.
- Built-in imagegen produced public/art/reference-basket-uphill-a.webp and
  public/art/reference-basket-uphill-b-v2.webp. Full source PNGs and exact prompts
  are saved under docs/design/source-art/ with the same stems and .prompt.txt.
  The first uphill B candidate is not used.

## Current correction pass — 8 October 2026, evening

Owner rejected 28 differences versus the approved coordinated references and directed
“proceed until it matches”, Ben Nevis first. The app now includes the reference
correction pass: heavy local fonts, reference-derived painted map/climb scenes,
separate portrait/landscape play compositions, corrected walking boot, socks,
richer medals/rewards and grounded profile/history. Current comparisons and actual
movement evidence: docs/design/review/coordinated-implementation/index.html.
The annotation mapping is docs/design/ben-nevis-reference-match-plan.md.

This is a review checkpoint, not owner sign-off or a measured fidelity percentage.
The rejected backward-boot B-v2 candidate is NOT used. The active B frame is
reference-basket-walk-b-corrected.webp. Default Ben Nevis is an illustrated game
trail; geographic renderer/source is retained. Manual totals and save keys remain.
Owner Home was read unchanged at Drew/100m/10items/2badges; actual batch tests ran
at 127.0.0.1:5174 and reached 1,345 m with 1,350 m lifetime, 135 items, 4 finished loads and 7 badges.
Build passed after the final integration; 36 unit tests passed. Browser checked portrait and
landscape scenes, batch/reward/results/history, badge filtering and route details.
No camera/AI accuracy claim, backend work, deployment or Fuji/Everest refinement.

Older status records below are historical and do not override this direction.


## Latest direction: approved baseline, two scenes, then the demo

The owner approved the current personal app and Ben Nevis visual direction.
Fuji/Everest now have integrated overview/climb scenery previews with independent
geographic meshes, refined paint materials, separate foregrounds, sock trails and
the approved basket rig. Open from Mountains or `?view=mountain&expedition=fuji`
(and `everest`). Preview navigation writes no progress. Playable expedition
selection/unlocks and persistence remain separate gameplay work.

Owner now prioritises a compelling truthful demo video: real laundry, manual batch,
basket walking, checkpoint celebration, new badge reveal and saved progress.
See `submission-plan.md` for inspected Yard 4 requirements/examples and deadline.
Vercel explicitly replaces Netlify as selected host; no deployment requested yet.
Do not reopen Ben Nevis or the approved full-app design exploration.

The following is the prior milestone record; its pending-approval notes are superseded.

## Latest priority: complete the personal-game design first

Personal-adventure design pass is implemented for integrated review. Community,
competitor markers and extra mountain choices removed; old community URL safely
opens Home. Shared nav is Home / Mountains / Start / Badges / You. Existing source
assets remain. Welcome/home, three illustrated mountain cards, personal overview,
badges/profile/history/results refined. Inner scrolling keeps navigation separate
from content. Manual session and owner storage preserved. Cadence-only badges now
use session item counts (five/twenty), retaining old camera achievements. Only stale
copy on the deferred landing was adjusted, not its design. Evidence and remaining
scope are in `completion-plan.md` and `design/review/personal-adventure/`.
Build and visual inspection only this pass; no new gameplay/camera test acceptance,
AI or deployment. Full visual acceptance remains pending.

Original scope-reset request, retained for context:

Owner explicitly redirects the next work away from AI/physical testing and back to
coherent design. Exactly three mountains: Ben Nevis, Mount Fuji and Everest.
Community and route demo competitors are out of the release scope. These removals
were initially planned and are now applied above. Existing manual loop remains; Fuji/Everest are still
previews, not playable expeditions. `docs/completion-plan.md` is the current ordered
plan and supersedes the immediate AI/owner-testing next step below. This planning
turn changes documentation only, leaving the owner's live session untouched.

## Current: playable manual batch fallback on `visual-refinement`

- Owner approved a simpler working loop before automatic counting. Home/Add now
  start or continue a timer and the approved moving basket. Bank a completed batch,
  confirm its count, gain 10 m/item, cross checkpoints, save/return, finish and see
  real session history. No load quota or camera calibration on this path.
- Ledger events use `source: manual` and one stable ID per batch. Counts are
  explicitly self-reported. No timer rewards or momentum multiplier. Legacy camera
  rewards/data stay intact; manual batches do not earn cadence-based badges.
- Optional batch photo previews stay in memory, are never uploaded or analysed,
  and are discarded on dialog close. AI counts, before/after comparison, voice
  encouragement and continuous automatic recognition are not implemented.
- Active sessions can be continued from home after reopening. Save & come back
  later pauses the timer. Closing without pausing leaves it measuring wall time;
  no progress is earned by time. Ledger totals recover manual session metadata if
  storage fails between writes. Failed saves visibly block further crediting.
- Camera spike retained at `?view=camera` / `?view=test`; the old 20-item physical
  acceptance gate remains unpassed. No Supabase or hosting changes; local only.
- Evidence: `docs/design/review/manual-session/` contains isolated browser captures
  (25/28-item counts are software test data, never the owner's ledger). 34 unit
  checks/build and 8 distinct affected browser scenarios passed: 5 existing camera/
  navigation checks plus 3 manual-loop/photo/storage checks. Portrait, narrow phone
  and landscape exercised; actual Pixel camera/file-picker behaviour remains untested.
- Next: owner tries the manual loop on phone; then a separate, honest photo-count
  experiment with editable estimates and a secure server endpoint. Do not claim
  exact counts from hidden/stacked garments or remove manual entry as fallback.

## Previous visual milestone (retained below)

## Current: approved-board refinement on `visual-refinement`

- Tactile pass implemented: common emerald gradient/highlight/lower-edge controls,
  pressed feedback with reduced-motion handling, dimensional stat/progress/reward
  surfaces and adult laundry/climbing wordplay. Profile shows genuine metre/badge
  shortcuts; history/community use less repetitive card framing. Camera remains
  direct entry without load categories or quotas. Approved climb/badges retained.
- Two terrain materials refined through the built-in image editor for cleaner
  painted rock/shadow groups; source/prompt provenance is in
  `docs/design/source-art/ben-nevis-tactile-materials.md`. Geographic meshes,
  proportions, mapped path and persisted position are unchanged. Wide player label
  moved above the basket so it does not obscure the next sock marker.
- New visual evidence: `docs/design/review/tactile-direction/` includes actual Home
  beside the existing approved reference, plus explicitly synthetic results.
  Captures cover all app screens at 390, 320, 844-landscape and 1100 desktop widths.
  Physical camera accuracy remains unproven. No numerical visual fidelity claim.
- Verification: 30 unit tests and production build passed; all 19 browser tests
  passed after the shared UI/copy changes, followed by 5 focused route, rotation,
  persistence and navigation checks after the final terrain materials. Forty final
  captures report no page/HTTP errors or horizontal overflow. The profile badge
  shortcut was also exercised in the shared browser. Actual-phone performance is
  still unmeasured; existing JS chunk warning remains (~434 kB gzip).
- Latest owner feedback supersedes flat controls: the supporting pass feels too
  clinical/dry and has drifted. Restore restrained button depth, adult playful
  laundry/climbing copy and intentional screen composition. Planning request only;
  no runtime edits made for this correction. `docs/design/coherence-plan.md` records
  the bounded proof → shared treatment → overview → verification plan. Do not
  repeat the already-completed full review or reopen the entire style direction.
- Camera style correction: the owner rejected the photographic laundry-room art as
  inconsistent. Camera-off setup now reuses the same illustrated Ben Nevis and
  approved basket as home, with the white welcome-style curved caption, flat CTA,
  quieter privacy copy and white guidance. Real camera replaces the artwork once
  enabled; detection/calibration remain unchanged. Narrow/portrait/landscape visuals,
  build and three targeted entry/synthetic-camera browser tests passed.
- Supporting-screen pass: shared white/navy/emerald surfaces, consistent stat art,
  Ben Nevis artwork in the list/profile, basket empty history, quieter demo labels,
  and landscape camera-off setup with its action visible without scrolling.
- Latest session simplification is implemented: home/Add/empty history open camera
  directly; no category, load-size or item-goal selection. Live progress follows
  the mountain/checkpoint instead of an item quota. Legacy metadata is retained;
  `?view=setup` still works as an alias. Calibration/detection are unchanged.
- Current verification: 30 unit tests, TypeScript/build and 5 game browser tests
  passed, including direct entry, camera-off actions at 844x390 and 667x375,
  synthetic zero/one-event persistence, rotation and keyboard/dialog navigation.
  Captures at 390x844, 320x740, 844x390 and 1100x900 report no horizontal overflow
  or page/HTTP errors. Evidence: `docs/design/review/app-consistency/`.
- Latest steering: visual consistency remains the immediate priority; backend and
  physical testing are parked. For the later camera phase, target automatic setup:
  front camera, landscape, place laundry naturally and start. Avoid mandatory fixed
  zones/manual calibration as the final experience. Existing boxes are diagnostic
  scaffolding, not the approved end-state. This requires detector validation, not
  an overlay-only change. Preserve working diagnostics during current visual work.
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
