# Coordinated visual target — 8 October 2026

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

## Current correction checkpoint (latest)

The 28-comment Ben Nevis correction pass is integrated. The painted overview and
climb scenes, medal atlas, matching scenic compositions, heavier type, sock markers,
and shared controls are now in the app. The raised boot in walk pose B was rejected
as backwards and replaced by `reference-basket-walk-b-corrected.webp`; the rejected
candidates are not referenced by the application.

Current side-by-side evidence and the captured batch-to-reward sequence are in
`review/coordinated-implementation/index.html`. The annotation mapping, checks and
remaining visual acceptance are tracked in `ben-nevis-reference-match-plan.md`.
The build and 36 unit tests pass. These checks do not establish exact visual parity
or owner approval. Owner saved progress was preserved; gameplay checks used an
isolated origin. Fuji/Everest scene refinement remains parked.

## Earlier implementation notes (superseded where noted above)

- The owner requires side-by-side actual screenshots against every approved screen
  and targets at least 95% fidelity. Do not claim a measured percentage or completion
  from build/test success. Current app acceptance remains pending.
- Mountains header: remove All mountains / Your progress filters. All three cards
  remain visible. Use the reference-derived `coordinated-mountains-header.webp`
  vignette, including the low angular rock ledge. The first separate mossy-boulder
  substitution was rejected. The final asset corrects the outward-pointing boots;
  both feet are planted in a consistent direction. Source and prompts are saved.
- Default game-map direction: after the owner asked which route was easiest and
  best visually while retaining mountain identity, the recommended approach was
  illustrated landscapes grounded in the real silhouette, with separate functional
  trail, checkpoint and avatar layers. Keep paths on land and preserve the exact
  geographic renderer/data as a fallback. This supersedes the exact-mapped-route
  presentation requirement below, not mountain identity or honest progression.
- Ready but not integrated: `coordinated-ben-nevis-map.webp`,
  `coordinated-ben-nevis-climb.webp`, and the nine-cell `coordinated-medals.webp`.
  The map/climb assets require route anchors and responsive framing inspection.
  Fuji/Everest still use the earlier scenery preview renderer.
- Current captures: `review/coordinated-implementation/`. The newest Mountains
  header comparison is `mountains-header-comparison.jpg`; the other comparisons
  require refreshing after the remaining integration. Full-app parity is not done.

## Approval and scope

LATEST: the owner approved all five sheets: “Every single screenshot ... is perfect”.
They then explicitly authorized implementation screen by screen, using these as
the grounding/source of truth. The earlier proposals-only/stop-before-code text below
is historical and superseded. Preserve the existing app and compare implementation
against the relevant sheet, with truthful data and the corrections listed below.

Execution order: shared components → welcome → home → mountains → badges → profile
→ history → active session/batch → checkpoint/badge/results → three mountain views
→ responsive and integrated verification. Record evidence and remaining gaps here.

The owner explicitly approved the foundation board (welcome, home, mountains and badges):
“i love this direction ... fantastic ... more connected and coherent”.
File: review/coordinated-proposal/01-foundation-approved.png.
It is the new visual benchmark, grounded in original-ui-board.png and the exact
approved-basket-graphic-direction.png. Do not confuse approval of this concept with
approval of the current application or the subsequently generated boards.

Trail/profile, rewards, responsive/history and buildathon cover are coordinated
proposals still awaiting review. App source, CSS, runtime art and user data have NOT
been changed to implement these mockups. These were generated with built-in imagegen;
the exact prompts and project copies sit alongside the boards.

## Preserve the foundation

Adult painted outdoor adventure; fresh white UI, navy headings, rich emerald shallow
dimensional controls, orange sock accents, restrained crafted graphic icon family.
Recognisable real Ben Nevis, Fuji and Everest. Keep the exact ivory/teal basket with
teal/cream washing, orange striped sock and brown boots. Welcome gets a purpose-composed
panorama; home gets a progress-focused card; active play gets an immersive near trail.
Do not repeat the same front-facing mascot at every size in every composition.
All four home stat icons, values and labels must remain visible. On short viewports
scroll the content instead of shrinking a parent beneath fixed-height child art.

## Interpretation before implementation

These raster concepts guide composition; they are not UI code, tested animation,
geographic navigation, real earned user data or final copy.
- Foundation artwork shows inconsistent illustrative badge numbers/requirements:
  preserve actual existing badge rules and use accurate earned/locked states in code.
  In particular, do not implement the generated “3 loads done”/“50 loads” requirements.
- The mountain-shaped icon is a generic UI symbol, not the actual Ben Nevis silhouette.
- Keep Full mountain / Climb view as an actionable paired toggle; the isolated
  full-width buttons in the trail mock are not an instruction to remove the toggle.
- Map paths must follow the actual mapped land route. Generated near-water routes,
  added sock positions and invented background land/water features are not GIS truth.
- Keep icons semantically correct: folded clothes for completed items, not a flame.
- “Saved in this browser” must not use a cloud-sync implication.
- Sound switches, new poses and reward reveals are proposed, not currently implemented.
- Cover is promotional montage, not a claim that Scotland, Fuji and Everest are adjacent.
  Final submission cover should show the finished app and accurately supported claims.
- Global dark mode is not chosen. Dark navy is proposed only for the badge reveal.

## Motion acceptance — still to demonstrate

One short separate motion preview is needed before declaring natural movement.
Facing follows the trail tangent; uphill three-quarter/back pose for travel;
a planted foot and tight ground shadow during stance; no boot skating;
opposing arms/legs, modest basket body weight shift, contained cloth follow-through;
settle before turning toward the viewer to celebrate. Do not loop a hop over every screen.
Recommended sequence: bank -> count metres -> walk -> sock arrival -> badge reveal -> settle.
Provide optional restrained sound, visible mute and reduced-motion alternatives.
Preview must show the same character and scene as the selected board, not unrelated footage.

## Next gate

Review the remaining coordinated boards against the approved foundation. Resolve only
material differences; do not reopen a new style exploration. Then build a bounded
implementation pass and compare actual screenshots at the same sizes/states.
No application edits during this concept task. Gameplay, AI and hosting remain separate.
