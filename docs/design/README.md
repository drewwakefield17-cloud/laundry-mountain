# Laundry Mountain screen implementation

The owner's supplied ten-screen Laundry Mountain board is the source of visual truth. The earlier generated home/setup/live/results images in this folder are exploratory concepts, not approved replacements for that board and not screenshots of the app.

## Implemented screens

`/?view=welcome`, `home`, `setup`, `mountain`, `mountains`, `badges`, `community`, `profile` and `sessions` are directly reviewable locally. Camera, live and results are entered through the real session flow. The original diagnostic test stays at `/` so existing phone bookmarks and saved reports are preserved.

The game now has cream/forest/navy styling, the stacked Laundry Mountain mark, a compact scenic home card, four statistics, six load choices, a circular live mountain, session rewards, a detailed route map with a wooden sign, nine earned-progress badges, a labelled demo leaderboard and a local editable profile. Front-camera preview, progress and session controls remain visible together in portrait and landscape.

## Scene construction

Ben Nevis remains the only built mountain. Canvas 2D draws a height field with surface-normal lighting, rock and grass materials, distant ridges, a lochan, a stream and woodland. Small independent illustrated pine, boulder, cloud and sign assets supply detail. There is no baked whole-mountain image or screen screenshot behind the controls. The user's explicit code-built interactive mountain requirement takes precedence over design-skill defaults against code illustration.

The curved route is sampled on the same terrain. Saved Laundry Metres determine the flag and its moving percentage label. Full/climb view changes only the view. Decoded scene images are shared between renders; cached terrain is reused during progress animation. Idle scenes stop requesting animation frames. Pixel hardware performance remains unverified.

## Art provenance

All new raster art was generated during this event with the built-in image generator, guided by the supplied board. Original PNGs are retained in `source-art/`; production WebP derivatives live under `public/art/` and `public/brand/`. Production derivatives total approximately 607 KB across all nine assets; the originals are not requested by the UI.

| Asset | Purpose / prompt direction |
| --- | --- |
| brand/laundry-mountain-stacked | Transparent stacked logo: navy/blue lettering, mountain, folded teal laundry, sunrise and orange flag, supplied brand direction |
| art/scots-pine | Transparent isolated detailed illustrated Scots pine, emerald needles, golden light and dark teal shadows |
| art/highland-boulders | Transparent Highland granite cluster, moss, fern and grass; a terrain object, never a whole scene |
| art/highland-clouds | Transparent ivory cumulus cluster, pale mint shadows and granular painted edges, no scenery or sky rectangle |
| art/forest-border | Transparent sage woodland border, tall corner trees and open pale center |
| art/trail-sign | Transparent wooden three-plank trail sign: Cleaner Clothes / Brighter Days / Higher You |
| art/demo-jamie, demo-taylor, demo-morgan | Fictional outdoor profile portraits for explicitly labelled demo/test records |

Runtime references use local WebP files. No user photograph, camera frame or video is stored in these assets. Phosphor supplies consistent product icons. Nunito Sans is the game typeface; font delivery currently uses Google Fonts with a sans-serif fallback.

## Honest states and approved differences

- Ben Nevis replaces the board's Snowdon. Other mountains are labelled future expeditions and have no environments yet.
- Counters, badges and the route use accepted saved events. The user's current zero-progress state is not replaced by the board's example 36% progress, streak or rewards.
- CO2 claims and invented wash durations are omitted. The UI displays Laundry Metres, actual session duration and item goals.
- Community records have `is_demo: true`, `demo-*` IDs, per-profile Demo labels and an explicit fictional-preview notice. Clicking one explains it is not a registered account. The user's own row is real local progress. No accounts or cloud sync are connected.
- A zero-detection result shows zero metres and no earned celebration. The user's failed field report is stored separately and preserved.
- Flat green buttons follow the product brief; the reference board's baked lighting is not copied into controls.
- Local profile name and progress need no Supabase project. Clearing this browser's storage loses local progress.

See ../../design-qa.md for comparisons, iterations and validation. Automated camera fixtures establish software wiring only; the physical folding gate remains unresolved after the Pixel 9 Pro / Edge zero-count report. No Netlify deployment was performed during this work.
