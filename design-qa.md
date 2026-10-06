# Screen fidelity and interaction review

final result: passed

Scope: the locally implemented game screens and responsive UI. This is **not** physical folding acceptance, real-device performance approval, cloud/community readiness, or a claim that the complete product is finished. The Pixel 9 Pro / Edge zero-detection report remains unresolved.

## Source and normalization

The user's original ten-screen Laundry Mountain board is the visual source of truth. The four older generated concepts in docs/design are exploratory, not approved target replacements. The user explicitly requires Ben Nevis first, an interactive code-built mountain, real local progress, identifiable demo users, front-camera visibility, flat product controls and no deployments. Those instructions govern intentional differences below.

Reference crops exclude phone bezels and system chrome. Reference and implementation images are shown at equal 390 px width, preserving each image's own aspect ratio. The supplied board has different first/second-row phone proportions, so no screenshot was stretched to fake matching dimensions. App captures use a 390×786 viewport unless named otherwise. Results captures are 390×844. Landscape live captures are 844×390. Synthetic camera captures are explicitly named and never installed in the shared browser or production data.

Saved comparisons: [home](docs/design/review/comparison-home.png), [setup](docs/design/review/comparison-setup.png), [map](docs/design/review/comparison-mountain.png), [badges](docs/design/review/comparison-badges.png), [community](docs/design/review/comparison-community.png), and [results](docs/design/review/comparison-results.png). [Actual screen overview](docs/design/review/current-screens.jpg). Screenshots are implementation evidence, not generated concepts.

## Iterations and resolved findings

| Finding | Severity | Resolution / verification |
| --- | --- | --- |
| Generic home layout and oversized marketing heading lost the reference's hierarchy | P1 | Greeting/profile header, one scenic card, four compact stats and a single primary start action; reviewed in combined home comparison |
| Thin outline icons and narrow typography changed the visual character | P2 | Consistent Phosphor filled/duotone icons, navy Nunito Sans hierarchy, compact labelled controls; reviewed against home/setup/community reference |
| Soft procedural terrain lacked detail, lighting and depth | P1 | Rebuilt terrain as a lit height field with rock/grass materials, distant faceted ranges, illustrated trees, boulders, cloud layers and water; route sampled on the same surface |
| Terrain occupied only part of the dedicated mountain screen | P1 | Immersive full-height map, floating header, wooden sign, compact full/climb control and on-demand checkpoint drawer |
| Straight coarse route and detached percentage label | P2 | Curved switchback samples, saved-event flag movement and a Canvas label attached to the actual player position |
| Splash stretched the terrain and had an obvious composition seam | P2 | Independent logo/scene composition, proportionate scenery and blended sky/foreground boundaries |
| Live circle zoom hid the summit | P2 | Full mountain composition in live ring; actual progress, elapsed time and event burst retained |
| Portrait live screen separated the camera from progress by scrolling | P1 | Compact camera-over-game layout, larger circular scene with a stat column, full-width goal and controls; bounding-box assertions pass at 390×786 and 844×390 |
| Badge cards were too tall and lacked the reference's three-row structure | P2 | Nine compact badge cards, clear earned/locked treatment and working filters/criteria dialogs |
| Modal keyboard focus could escape and was not reliably restored | P1 | Native modal dialog, explicit Tab wrapping, Escape close and trigger focus restoration; browser test passes |
| Multi-megabyte illustration downloads | P2 | Production WebP derivatives total 607,228 bytes across nine assets; untouched source PNGs retained outside public; shared decoded images and cached terrain avoid per-event repaints |

## Mandatory comparison passes

- **Layout and spacing:** checked combined images, section order, margins, three-column choices/badges, leaderboard rows and bottom navigation. Scene-led map now follows the reference's immersion instead of a panel-heavy layout. On narrow screens the navigation stays available.
- **Typography:** corrected the overly condensed first implementation; checked header hierarchy, button width, body readability, stats, wrap behavior and empty states. The reference is a raster concept, not a font specification; Nunito Sans preserves its rounded, bold navy character.
- **Palette and surfaces:** cream background, emerald primary controls, sage secondary surfaces, navy type, orange/gold rewards and pale woodland; no generic dark dashboard styling. Flat controls follow the brief instead of copying baked highlights from the image.
- **Image quality:** inspected alpha edges, scale, new WebP derivatives, logo legibility, sign text, tree/rock integration and fictional portraits. Mountain geometry and route remain interactive code; raster assets are separate objects, never a whole-scene screenshot. Ben Nevis intentionally differs from the Snowdon silhouette.
- **Icons and content:** consistent library icons, real counts/metres, no invented CO2 savings or duration prediction, no fake registered users. Zero results and locked badges remain honest.
- **States:** checked selected load/goal, badge filters, empty earned badges, local profile save/reload, demo-user explanation, community filters, locked future mountains, checkpoint expansion, full/climb views, session pause/resume, zero/nonzero results and saved history.
- **Accessibility:** semantic buttons/fieldsets/labels, image descriptions, focus-visible styling, modal containment and return focus, Escape close, reduced-motion handling. Automatic animation stops while idle.
- **Responsive behavior:** game checks at 390 px, home overflow checks at 320 and 768 px, and actual camera/progress/control bounds at 390×786 portrait and 844×390 landscape. This is browser verification, not a Pixel hardware result.

## Intentional state / scope differences

1. Actual progress is zero until accepted events exist. The reference's 36%, streaks and earned badges are sample content; none is injected into the user's ledger.
2. Ben Nevis is the only complete scene. Fuji, Matterhorn, Kilimanjaro, Denali and Everest are explicitly future expeditions, with no extra environments built.
3. Fictional demo profiles have `is_demo: true`, `demo-*` IDs, per-row Demo labels and an explicit notice. They cannot award the user progress. No live community sync is claimed.
4. Front-camera preview remains visible in the live game, including portrait. The reference's camera-free live mockup is adapted to the user's explicit no-shortcuts requirement.
5. No physical accuracy claim follows from test-only pixel streams. Hanging/ironing acceptance, real folding and physical persistence testing remain gated.

## Validation

- `npm run check`: 20 unit tests passed; TypeScript and production build passed.
- `npm run test:e2e`: all 15 browser checks passed on the final flows. This includes the new profile/community/modal check, both zero/nonzero fixture sessions, portrait and landscape bounds, storage restoration and preservation of the failed field report.
- Manual browser check: full/climb map controls and checkpoint drawer work and preserve zero metres. Shared browser contains genuine local state, not the synthetic fixture.
- No Netlify deployment, no Supabase provisioning, no Git history rewriting. A new normal event-time commit records this pass.

There are no remaining P0/P1/P2 findings in this screen-review scope. Physical folding accuracy and actual Pixel performance remain separate unresolved acceptance gates; they are not waived by this review.
