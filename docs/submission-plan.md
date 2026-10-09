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

Export verified: out/laundry-mountain-landscape-review.mp4, 21.8 seconds, 1920x1080 H.264 at 30 fps, 654 decoded frames. Opening, batch dialog, app movement and closing crop inspected. Browser MP4 playback confirmed without media error. Current player: http://127.0.0.1:5192/. Source climbing clip remains a softer 720p portrait crop; no resolution improvement is claimed.


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

# Yard 4: a small, convincing live demo

**Current gate:** owner rejected demo v2 and requested a stop and visual storyboard.
Review `../trailer/storyboard/index.html` before further editing/generation/export.
The portrait, full-frame app story and optional photo insert are proposals only.
The existing v2 MP4 is not an approved submission video.

## Latest demo direction — 9 October 2026

Owner corrected the mascot name to **Basky**, wants the app's exact logo and a
coherent problem → action → reward demonstration. Current Remotion v2 is 31.8 s:
laundry pile, Basky companion, owner's actual 20-item / 200 m batch, earned badges,
three peaks, proposed photo counting, branded close. Photo counting is labelled
throughout as a proposed feature; it is not working AI. Source, scene timings,
voiceover and provisional captions are in `../trailer/`. Music/VO and owner review
are outstanding. Canva is a possible finishing editor, not yet an active project.
No paid video retry is authorized; one approved free motion shot completed.
See project-state.md and trailer/README.md before relying on historical notes below.

## Current execution status — 9 October 2026

Three cover choices are saved at design/review/release-covers/index.html. The
initial landing was rejected and has now been revised locally with composed
portrait/desktop mountain scenery; review at http://localhost:5180/.

Netlify draft deployment and local release checks are recorded in
design/review/release-checks/current-status.md. Production is unchanged.
DemoBro generated a 19.203 s 1080p landscape draft from the public preview, but the
owner watched and rejected it. Do not publish it as the final trailer. Verified
playback: https://www.demobro.video/v/d7b4d25b-8ab8-41b7-9fcd-8c8ee33110d5.mp4

Custom replacement direction: existing approved basket motion as the hero,
deliberate hook/reveal, actual manual batch-to-climb/checkpoint/badge footage,
three destinations and a short branded ending. Remotion is available as a skill
but no project/composition has yet been created. A 12 s music attempt through
Creative Claw did not start: 6 credits required, 1 available, no charge. Resolve a
usable score without purchasing anything automatically. Broader paid video
regeneration is not implicitly authorized by a complaint about the draft.

## Latest trailer brief — 9 October 2026

### Owner reference examples and builder-first proposal

Owner supplied these production benchmarks (style need not be copied):
- Repo City: https://youtu.be/dU3AJCfMiNs — clear product metaphor, real interface
  steps, moving world details and a concise branded finish.
- Splat Lab: https://youtu.be/qHNq8BCIIsY — mascot establishes personality; the
  edit rapidly progresses from creation to interaction to playable payoff.
- Chore Wars: https://youtu.be/5asRYRAYN90 — theatrical problem/action/reward arc,
  conceptual scenes mixed with phone views, culminating in the rocket launch.
- Supplied Chore Wars thumbnail — a strong central hero and immediately readable
  title; use as a composition/impact benchmark, not a space/pixel-art direction.
- Supplied Ghostrun GIF — 15.9 seconds, consistent phone framing, compact feature
  beats, short adjacent captions and a character-led end card. A sampled contact
  sheet is saved at `design/review/trailer-references/ghostrun-contact-sheet.jpg`.

Review method: supplied image inspection, eight sampled GIF frames, YouTube page/
player inspection and completed Higgsfield scene analyses for all three URLs.
Audio descriptions are from automated analysis, not an independently auditioned
music mix. No third-party footage was downloaded for reuse. Analysis IDs:
326b81e7-0da2-4f9c-a5c9-bc869dc51e57 (Repo City),
338e0191-1f72-47ef-bee8-6aa99f5e9430 (Splat Lab),
508f2aa4-5655-471d-8d8a-4201b27ea4c3 (Chore Wars).

Owner is open to landscape. Recommended master is 16:9 with wide mountain/mascot
shots and legible portrait app footage; target about 60 seconds with the shortest
cut that clearly conveys the loop. Keep the approved adult illustrated finish.

Owner proposes trying Hackyard's Demo Builder with the live URL after release
checks. Supported order: finish landing/checks -> publish the checked build when
release work is authorized -> try one builder draft -> assess its actual export,
motion, music and editing options -> retain useful output and add custom mascot,
sound and editing work where needed. Owner supplied https://www.demobro.video/.
Its start page was inspected in the browser on 9 October: a public live URL is
required; a public GitHub repository and short Demo focus hint are optional. The
page recommends the repo for richer product context and explicitly accepts Vercel
links. No music, aspect-ratio, export or pricing options are exposed on this form;
those capabilities remain unverified until we see the workflow/output.
Proposed focus hint: "Turn completed laundry into mountain progress: confirm a
batch, watch the basket climb, reach a sock checkpoint and earn a badge."
Use the checked live app plus its public repository once ready. No build was
deployed and no builder job submitted during this reference review.

All three mountain visuals are owner-approved. The owner now wants an energetic
app trailer, with the basket mascot as its hero, music, sound and deliberate pacing.
A static screenshot montage is explicitly insufficient. Conceptual mascot shots
are welcome alongside actual app interactions and a short laundry/folding moment;
promotional animation must not imply unimplemented app features or automatic counting.

Proposed format: a 60–75 second landscape master, with a strong laundry-pile hook,
the mascot beginning its adventure, the real confirm-batch/walk/checkpoint loop,
a badge payoff, the three destinations, and a clear end card. Use the approved
character design throughout. Keep generated hero shots few and focused so character
continuity and iteration do not dominate the release schedule. Music should build
and resolve with the edit; choose music suitable for release and mix effects below
important copy/voice. Real folding footage from the owner would improve the hook;
otherwise any conceptual depiction must remain clearly promotional.

The landing page retains the planned entry structure: mascot/mountain hero and
Start your climb, optional trailer, three-step explanation, three mountains and
brief practical information. Finish it in the approved app family, preserve the
previous rejection of the split landing composition, and correct outdated camera
and planned-mode copy. Trailer audio must be user-initiated on the landing page.

This is a planning estimate/creative brief, not a production or deployment record.
Allow roughly 6–10 focused working hours for landing polish, release checks, a
60–75 second trailer and one edit pass; generated-shot retries, footage availability,
physical-device findings and deployment access can change elapsed time.
No video generation or deployment was started by this planning discussion.

## Prior verified submission context

Updated 8 October 2026 from the owner's latest direction and the live event page.

## Verified event requirements

Source: https://hackyard.tech/yards/yard-4 (read in the shared browser).
Theme: gamify an everyday task, with the actual task getting done. Solo project,
open-source repository, demo video; code written during the event build window.
Ship deadline: Friday 9 October 2026, 18:00 UTC / 19:00 UK time.
Voting closes Sunday 11 October at 22:00 UTC. Do not rewrite Git history.

The solo guide recommends focusing the build around a short working demo:
https://hackyard.tech/ai-hackathons-for-solo-developers

## What the visible entries demonstrate

Read the Yard 4 submission cards and inspected Oddlings' cover and opening demo.
Oddlings explicitly describes a self-reported chore loop with local saves; its
cover is an illustration, while its playable creatures use CSS. This is useful
presentation context, not a claim that its mechanics or quality should be copied.
https://hackyard.tech/yards/yard-4/66b507f5-91a6-4752-b1a2-1039d61dc69c

Sock Séance describes one small camera-colour matching mechanic and ghost reward;
Clean Sweep describes timed chores with XP/commentary. Several builds are local
and account-free. No evidence establishes how voters will rank them. Do not claim
to have reviewed every app or video from card descriptions alone.

## Owner's priority and demo path

Finish the approved three-mountain visual family, then make these moments work
reliably in the actual app before recording:

1. Strong opening: mountain of washing beside the basket and Ben Nevis.
2. Start a session immediately; show real folding briefly.
3. Bank newly completed items. Label manual entry honestly; a photo is optional.
4. Basket walks up the trail and reaches an orange sock checkpoint.
5. A newly earned badge gets a focused reveal animation and appears in Badges.
6. Show progress saved, then the three distinct mountain destinations.
7. Close with one memorable promise and the project/repository link.

Aim for approximately 60–90 seconds, subject to the owner's final demo choice.
Record real interactions. If a later recording uses a seeded position to reach a
checkpoint quickly, identify the demo setup and keep it separate from owner saves.
No simulated AI claims or awards divorced from completed-item events.

## Deliberately deferred

Continuous camera recognition, AI photo estimates, accounts, cloud sync, community,
production-scale backend and broad marketing pages. The current manual/local loop
is the release foundation. The thumbnail can be purpose-composed artwork, with
the video showing the actual experience. No video or thumbnail has been made yet.

Vercel is now the owner's chosen host. No deployment is authorized in this pass.
