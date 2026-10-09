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
