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

# Laundry Mountain — Basky demo

## Current status: v2 rejected; storyboard review only

Owner explicitly stopped the edit on 9 October: app footage was too small,
generic copy lacked story/flow, invented photo UI did not match the app, and the
logo tile was weak. Do not present the export below as approved or submission-ready.
No further video generation/rendering until the owner has reviewed the new direction.

Visual storyboard: http://127.0.0.1:5192/storyboard/ (`storyboard/index.html`).
Eight portrait frames propose one continuous 20-item -> 200-metre -> badge -> saved
result story. 22/32 seconds are actual product footage, full-frame. Click frames
to enlarge. The photo idea is a separate optional insert using the actual count
sheet as its base, with a proposed before/after row in the existing photo section.
The exact source frames and UI remain identifiable. No recognition is implemented.
This is a static planning artifact, not an animatic or a new finished movie.
Browser inspection found no missing images/overflow at the current 562px viewport;
enlarge/next/close controls checked. Screenshot: `storyboard/storyboard-review.png`.

Isolated Remotion editing project; the existing Vite app is unchanged by this video
project. Current composition: `LaundryMountain-Demo-v2`, 31.8 s, 1920×1080, 30 fps.
The mascot's correct name is **Basky**. The actual app logo is copied verbatim from
`../public/brand/reference-logo.webp`; never rebuild or recolour its wordmark.

## Preview and export

```powershell
npm ci
npm run dev -- --no-open --port=5190
node review-server.mjs
node node_modules/@remotion/cli/remotion-cli.js render LaundryMountain-Demo-v2 out/laundry-mountain-demo-v2.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=3
```

Studio: http://localhost:5190/LaundryMountain-Demo-v2
Player: http://127.0.0.1:5192/
Exports are ignored by Git. Review frames are in `out/v2-verified/`.
Completed export: `out/laundry-mountain-demo-v2.mp4` (16,795,413 bytes), H.264,
1920x1080, 30 fps, 954 frames / 31.8 seconds. The MP4 is silent. VO text/timing
and provisional SRT are alongside this file.
Owner review, narration, soundtrack and final mix remain. The initial 34.6-second
cut is superseded: owner found it disjointed, low energy, and incorrectly branded.

## Media provenance

- `public/recordings/owner-session-01.mp4`: owner's 23.95 s recording, showing the
  pre-fix phone session-start problem. Preserved, not used as successful gameplay.
- `owner-session-02.mp4`: owner's 116.92 s recording; 20 items / 200 m, earned
  badges, saved progress and mountain previews. Originals remain untouched in Downloads.
- Gameplay: source 16.6–24.6 s; rewards: 24.6–29.1 s (3 s used).
  Cropped only browser chrome: crop=960:1862:0:280. Normalized to 30 fps for editing.
- Three peaks: Ben Nevis 56.5–62 s clip; Fuji still at 74 s; Everest still at 84 s.
  Fuji/Everest stills avoid cold image-load pauses and navigation in this recording.
  They are real app screens, not fabricated unlocked progress.
- `public/laundry-room-free-attempt.mp4`: one authorized free Higgsfield Genjutsu
  motion transfer. 720×1280, 24 fps, 6.04 s; source shot 0.4–3.4 s used. The owner
  explicitly approved the concept image and approved walk upload to Creative Claw
  solely as an intermediate transfer. No paid fallback or repeat attempt.
- `public/art/laundry-expedition.png`: built-in imagegen concept artwork.
- `public/art/photo-counting-concept.png`: built-in imagegen before/after diptych.
  Used only in the labelled proposed feature. Counts are illustrative animation,
  not AI results. Exact prompts in `concept-art.prompt.txt` and `photo-concept.prompt.txt`.
- Remaining scenery/icons/fonts come from the approved app assets; Nunito font
  license retained in `public/fonts/OFL.txt`.

## Checks and limits

TypeScript passes. Rendered keyframes visually inspected; encoding errors fixed.
The complete v2 MP4 played to 31.8 seconds in the shared browser with no video
error and no captured console warning/error. End card and concept payoff inspected
from the exported file. Logo SHA256 matches the app asset exactly. The media
WebCodecs renderer failed on the tall phone clips; switched to OffthreadVideo and
the complete render succeeded. Owner approval and sound mix are still pending. No camera
accuracy claim. Owner's phone recording exposed blue/blank scenery for several
seconds on cold Fuji/Everest entry; logged as a release issue, not hidden by edit
selection. App HTTP UUID bug fixed separately, 48 tests + build passed.

The scaffold install reported 10 high findings in the isolated video toolchain;
not yet investigated. Do not confuse that with the earlier app production audit.
