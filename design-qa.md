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

# Reference fidelity review — 8 October 2026

## Latest owner verdict: v2 demo rejected — 9 October 2026

The demo did not pass creative review. App visibility, story/flow, concept UI
consistency and logo presentation failed despite a successful export. Production
is stopped for a visual storyboard review: `trailer/storyboard/index.html`.
The proposed full-frame portrait sequence and app-based photo insert are not yet
approved. Current app and landing visual acceptance are unaffected.

## Latest: demo and phone evidence — 9 October 2026

Accepted app/landing visuals remain fixed. Landing now has three different app
phones (Ben Nevis home, Fuji session, Everest overview); mobile evidence is
`docs/design/review/release-checks/landing-phone-showcase-mobile.jpg`.
The custom Remotion v2 demo uses the app's exact logo and correct name **Basky**,
owner-recorded gameplay, and an explicitly labelled photo-counting concept.
It is a silent review edit; music, VO and owner approval remain.

Owner phone footage verifies a manual 20-item / 200 m batch and badges, but also
reveals several seconds of blue/blank scenery on cold Fuji/Everest entry. This
loading finding is OPEN. Selecting loaded frames for the edit does not pass it.
The failed HTTP phone start was reproduced and fixed with secure random ID
fallback; LAN start/bank/save/resume/finish checked, 48 unit tests + build passed.
This does not validate automatic counting or physical camera accuracy.

Trailer asset details and export/playback checks: `trailer/README.md`.

## Latest: landing revision — 9 October 2026

Owner rejected the first landing as weak. Revised it to carry the accepted app's
painted mountain setting and tactile visual family into a complete hero scene.
One responsive picture selects a dedicated portrait or wide composition, with
the mascot and contact shadows integrated into the artwork. Short real HTML copy
and primary CTA remain readable, and the scene is never used as a screenshot of
an interactive app. Reused approved illustrated stat icons below the hero.

Agent visual checks: 390x844 portrait, 320x740 narrow, 1440x900 desktop, 844x390
landscape. Fixed the reassurance line's contrast and landscape headline wrapping;
landscape has a scoped pale scrim behind copy. No horizontal overflow or broken
images in inspected states. CTA enters actual onboarding; sock card moves to the
mountains; local-save FAQ expands. Captured browser error/warning list empty.
TypeScript/production build and diff whitespace checks pass. No domain change.

Evidence: design/review/release-checks/landing-revised-{phone,narrow,desktop,
landscape,steps,mountains}.jpg. Artwork and exact prompts:
design/source-art/landing-highland-{portrait,wide}.* (beneath docs/).
Result: owner accepted the revision with “much better”. Live production is unchanged.
The owner also rejected the DemoBro draft; it is not the submission trailer.

## Latest: Fuji and Everest implementation — 9 October 2026

**Final result: passed for agent implementation/visual QA and owner visual approval.**
The owner accepted the integrated Fuji/Everest review with “perfect” on 9 October.
Freeze this visual baseline. Physical-device acceptance remains separate.
No measured fidelity percentage is claimed.

Reference: approved coordinated Ben Nevis foundation/trail/reward sheets, plus the
subsequently accepted uphill orientation and movement. Reused existing components,
navy typography, tactile emerald actions, sock markers and mascot artwork. Added
separate Fuji and Everest home/map/climb/session/landscape/profile art using built-in
image generation; full source PNGs and prompts are in `docs/design/source-art/`.

Actual browser renders and references were viewed together in five normalized
comparisons under `docs/design/review/playable-mountains/`: home, map, session,
profile and results. Original reference crops retain their aspect ratio beside
390x844 app screenshots. Different mountain identities and earned QA counters are
intentional; neither reference counters nor achievements were hard-coded.

Visual corrections closed: grounded home companions (replaced the first flat
composites with purpose-composed art), clear pale sky behind headings, map labels
clear of the bottom cards and summit header, solid readable checkpoint details,
large result/lifetime totals on one line, and white backing behind results honesty
copy. New badge/reward backgrounds and companion placement checked in portrait and
landscape. No open P0/P1/P2 finding in the two-mountain scope.

Browser verification on isolated localhost:5174:
- Locked preview -> Ben Nevis summit -> Fuji -> Everest -> all summits completed.
- Summit overflow (25 m into Fuji, 29 m into Everest), no duplicate credit,
  post-Everest lifetime counting with capped mountain positions.
- Real checkpoint queues, summit copy, result transitions and earned Load Legend.
- Whole-basket transforms changed position/scale for actual 10-item batches on both
  new mountains; pause/save/reload/resume and correct mountain in journal/results.
- 390x844 portrait; 844x390 session/reward landscape; 320x740 home/map; 1440x900
  home/map. No horizontal overflow at tested narrow/desktop widths. No captured
  browser console errors/warnings. Home image loads complete.
- Original owner save read unchanged: Drew / Ben Nevis 100 m / 10 items / 2 badges.

Build and all 46 unit tests (10 files) pass; whitespace check passes. Tests include
legacy save preservation, tagged overflow/deduplication/reload, summit caps, session
reconciliation, checkpoint selection and visible short-batch travel. Existing
large-chunk warning is a release performance concern, not a new test failure.
Physical-device usability/performance and camera accuracy are not claimed here.
Reduced-motion handling is retained and source-reviewed; not browser-emulated.

Evidence: `finished-mountains.jpg`, five `*-comparison.jpg` images, individual
map/session/landscape/checkpoint/summit/home/profile/results captures, plus narrow,
desktop and landscape badge captures. `index.html` is the integrated review entry.
Previous records below are historical; new scope supersedes parked preview status.

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

### Scoped visual QA result

Final result: passed for the three requested changes. No open P0/P1/P2 findings
within this scope. Compared the supplied complaint crops and the fresh captures,
then refreshed matching approved-reference/app comparisons in the review gallery.
The 390 x 844 app captures retain the accepted composition; supplied crops cover
only the affected regions, so no numerical pixel-fidelity score is inferred.
A first CSS pass let the white halo overlap the logo: corrected by placing the
logo above the backing and recaptured at 390 and 320 px. Both uphill foot poses
were inspected at full size and in the actual batch animation; shadow anchors
were corrected for the planted foot in each pose. No unrelated redesign.

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


## Latest: two expedition scenes and owner approval

The owner approved the personal app / Ben Nevis baseline. Fuji and Everest now
have full overview and climb scenery previews in the same app, independently
rendered from their geographic grids. Scene framing, high-resolution materials,
separate illustrated foregrounds and marker/basket placement were checked in
phone, narrow and landscape layouts. See `docs/design/review/three-peaks/` and
`docs/design/three-peaks-scenes.md`. Build passed; twelve captures recorded no
script/asset errors or horizontal overflow; preview navigation left isolated
localStorage empty. No physical-phone/gameplay acceptance or deployment claimed.
The older pending whole-app-approval wording below is superseded by owner feedback.

## Latest: personal three-mountain design review

`docs/design/review/personal-adventure/whole-app.png` collects the current actual
screens and two landscape views; `index.html` opens the individual-size gallery.
Community/competitors removed. Welcome returns to the reference's compact promise;
home uses a compact title plate, honest item count, shared stat/action treatments.
Three mountain cards now give each geographic scene enough space. Achievements,
profile and history share the same type, materials and restrained depth. Main
content scrolls above navigation rather than underneath it. The original boards
remain the benchmark, with the personal scope and manual flow as deliberate changes.

30 visual states at phone/narrow/landscape widths inspected for layout; no script
errors or horizontal overflow in capture evidence. Build passed. Actual gameplay,
physical camera and AI tests are deferred as requested. Visual approval pending;
Fuji/Everest are still labelled previews, not claimed playable. Results/session
images use explicitly isolated fixture counts and do not alter owner progress.

## Functional follow-up: manual session fallback

Owner-approved simplification implemented without replacing the visual system.
The live scene retains the approved basket/scenery; shared tactile emerald actions
lead into an explicit manual batch dialog. Portrait and landscape captures are in
`docs/design/review/manual-session/`. Landscape keeps scene and actions together;
the batch dialog scrolls on short screens. No camera permission is required.
34 unit tests/build and 8 affected browser scenarios passed, including resume,
checkpoint movement, storage interruption and temporary photo disposal. This is
software verification of manual entry, not detection accuracy or visual sign-off.

## Current gate: visual refinement

Latest tactile correction: `docs/design/review/tactile-direction/`. Shared raised
emerald controls, progress/reward depth, contextual wordplay and quieter supporting
screen grouping are implemented. Ben Nevis materials refined in both orientations;
geographic geometry and route retained. Compare `home-results-proof.jpg` against
the approved board. Results evidence is synthetic. No owner acceptance or invented
90% score is claimed. See material provenance in `docs/design/source-art/`.
30 unit tests/build, all 19 browser tests and five final terrain/navigation checks
passed. Forty final captures have no page/HTTP errors or horizontal overflow.
Physical detection remains unverified. Palette spot checks: white on the darkest/
lightest default emerald gradient stops is at least 4.53:1; reward text on its pale
amber background is 6.0:1. These checks are not a whole-app accessibility audit.

Latest supporting-screen evidence: `docs/design/review/app-consistency/`.
Camera-off artwork now shares home's illustrated Ben Nevis/basket and welcome's
curved white caption, replacing the rejected photographic laundry room. Inspected
at 320 px, 390 px and landscape widths; build and 3 targeted browser tests passed.
Shared surfaces, controls, icons, profile artwork, empty history and mountain list
have been inspected across phone, narrow phone, landscape and desktop. The camera
introduction now fits landscape with Enable camera visible. Entry goes directly to
camera; load/category selections and live item quotas have been removed by request.
Results/history evidence uses an explicitly synthetic fixture, not physical laundry.
30 unit checks/build and 5 game browser tests passed after these changes. No page/
HTTP errors or horizontal overflow in the 26 captures. Actual folding remains unproven.

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
