# Laundry Mountain screen implementation

The owner's supplied ten-screen Laundry Mountain board is the source of visual truth. The earlier generated home/setup/live/results images in this folder are exploratory concepts, not approved replacements for that board and not screenshots of the app.

## Implemented screens

`/?view=welcome`, `home`, `setup`, `mountain`, `mountains`, `badges`, `community`, `profile` and `sessions` are directly reviewable locally. Camera, live and results are entered through the real session flow. The original diagnostic test stays at `/` so existing phone bookmarks and saved reports are preserved.

The game now has cream/forest/navy styling, the stacked Laundry Mountain mark, a compact scenic home card, four statistics, six load choices, a circular live mountain, session rewards, a detailed route map with a wooden sign, nine earned-progress badges, a labelled demo leaderboard and a local editable profile. Front-camera preview, progress and session controls remain visible together in portrait and landscape.

## Scene construction

Ben Nevis now uses a 50 m geographic elevation mesh and the actual mapped Mountain Path. The lochan, River Nevis and woodland coverage derive from OpenStreetMap. All coordinates and elevations use the same units, with no vertical exaggeration. See `geography.md` and its source manifests for provenance and limitations. Five other expeditions have separate elevation-based card/detail previews; their playable routes are still deferred.

The route, player flag and labelled fictional demo climbers share the same projection. Saved Laundry Metres determine the player position. Full/climb view changes only the view. Decoded scene assets are reused and terrain is cached during progress animation. Pixel performance remains unverified. No full-scene mountain image is used.

## Art provenance

All new raster art was generated during this event with the built-in image generator, guided by the supplied board. Original PNGs are retained in `source-art/`; production WebP derivatives live under `public/art/` and `public/brand/`. The originals are not requested by the UI. Additional illustrated textures are under `public/textures/`.

| Asset | Purpose / prompt direction |
| --- | --- |
| brand/laundry-mountain-stacked | Transparent stacked logo: navy/blue lettering, mountain, folded teal laundry, sunrise and orange flag, supplied brand direction |
| art/scots-pine | Transparent isolated detailed illustrated Scots pine, emerald needles, golden light and dark teal shadows |
| art/highland-boulders | Transparent Highland granite cluster, moss, fern and grass; a terrain object, never a whole scene |
| art/highland-clouds | Transparent ivory cumulus cluster, pale mint shadows and granular painted edges, no scenery or sky rectangle |
| art/forest-border | Transparent sage woodland border, tall corner trees and open pale center |
| art/trail-sign | Transparent wooden three-plank trail sign: Cleaner Clothes / Brighter Days / Higher You |
| art/demo-jamie, demo-taylor, demo-morgan | Fictional outdoor profile portraits for explicitly labelled demo/test records |

Runtime references use local WebP files. No user photograph, camera frame or video is stored in these assets. Phosphor supplies consistent product icons. Roboto and Roboto Condensed are the game typefaces; font delivery currently uses Google Fonts with a sans-serif fallback.

## Honest states and approved differences

- Ben Nevis replaces the board's Snowdon. Other mountains are labelled future expeditions with real-terrain visual previews.
- Counters, badges and the route use accepted saved events. The user's current zero-progress state is not replaced by the board's example 36% progress, streak or rewards.
- CO2 claims and invented wash durations are omitted. The UI displays Laundry Metres, actual session duration and item goals.
- Community records have `is_demo: true`, `demo-*` IDs, per-profile Demo labels and an explicit fictional-preview notice. Clicking one explains it is not a registered account. The user's own row is real local progress. No accounts or cloud sync are connected.
- A zero-detection result shows zero metres and no earned celebration. The user's failed field report is stored separately and preserved.
- The latest exact-board instruction supersedes the earlier flat-control direction: emerald gradients, highlights and bevelled badge plates now follow the reference.
- Local profile name and progress need no Supabase project. Clearing this browser's storage loses local progress.

See ../../design-qa.md for comparisons, iterations and validation. Automated camera fixtures establish software wiring only; the physical folding gate remains unresolved after the Pixel 9 Pro / Edge zero-count report. No Netlify deployment was performed during this work.


## Correction-pass art

Generated with built-in imagegen, matching the supplied board; originals retained:
- `art/badge-emerald`, `badge-amber`, `badge-navy`: small blank bevelled medal plates; icons and earned state remain live code.
- `art/reference-forest-border`: transparent mint decorative border for interface surfaces, not mapped terrain.
- `art/illustrated-pines`: small terrain objects constrained to mapped woodland.
- `textures/illustrated-rock` and `illustrated-meadow`: material samples used by the code renderer, no mountain silhouette.
- `art/demo-casey`: fourth fictional demo portrait, labelled Demo.
- `art/folding-workspace-guide`: camera-off setup illustration, explicitly labelled in the UI; never presented as live camera footage.

## Bounded review

One coordinated screen pass and one comparison/correction pass, as requested.
The owner defines pass as reference fidelity with the agreed mountains. The
mountain surface artwork remains the principal open visual issue. Functional
tests passing do not close that issue. See root `design-qa.md`.
