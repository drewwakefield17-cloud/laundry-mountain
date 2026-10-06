# Game screen design and implementation

The supplied Laundry Mountain ten-screen board is the visual direction. Ben Nevis replaces Snowdon for the first complete environment, following the owner's amendment. Screens are implemented as React UI with an independent code-painted Canvas scene, never a baked screenshot of a screen or whole mountain.

Generated design targets: home.png, setup.png, live.png and results.png. These are design references, not screenshots of the working application or evidence that a physical test passed. Generated through the built-in image generation tool during the event. The prompts specified cream/forest/navy branding, the supplied laundry mountain mark, Highlands terrain with a broad rocky summit, orange player flag at the base, honest zero metrics, flat buttons, mobile portrait and live landscape, and no invented community activity or environmental claims.

Asset provenance: public/brand/laundry-mountain.png is a generated transparent reproduction of the supplied brand direction. public/textures/highland-rock.png is a generated seamless material texture, used lightly within code terrain. No remote visual assets are fetched at runtime.

## Fidelity review

| Surface | Implemented | Deliberate differences / remaining work |
| --- | --- | --- |
| Home | Supplied logo direction, cream surface, green/navy typography, scenic mountain, progress ring, actual saved statistics, primary CTA, checkpoint and navigation | No named account/profile while authentication is absent. Zero progress has an empty ring. |
| Setup | Six load categories, selectable item goal, scenic preview, front camera privacy message and camera handoff | Folding only; categories annotate a folding session, not different validated detectors. |
| Live | Front camera, three calibrated zones, code scene and flag, real event stats, momentum, item goal, pause/resume and finish | Preview is blank until genuine permission. Paused analysis cannot award metres. No decorative synthetic camera footage. |
| Results | Actual base/bonus/total, item count and elapsed wall time, honest zero state, mountain/history links | No confetti or achievement claim for a failed zero-detection session. |
| Mountain/history | Real saved route position, full/climb view, milestones and local completed sessions | Other mountains and community remain gated. |

Scenery now uses layered smooth terrain, granular stone shading, lochan, branching pine silhouettes, grass and cloud atmosphere. It replaces the original flat polygon treatment. The generated targets use richer realistic terrain; the implemented procedural art remains visibly more stylised and should not be described as an exact match or final art approval. Further detail and phone performance review remain open. Terrain is cached across progress changes; idle rendering does not run a continuous animation loop.

## Data and validation

Game sessions use laundry-mountain:game-sessions:v1, separate from the existing field report key. Real camera events update the original progress ledger immediately. Interrupted sessions retain their accepted events; completed sessions retain a results record. Opening the game cannot replace the user's latest failed field report. No Supabase service, fake counts, manual item-award button or community seed is introduced.

Playwright's isolated synthetic camera fixture verifies software wiring, including honest zero results, one accepted event, pause, saving/reloading and landscape bounds. It does not establish garment recognition or physical accuracy. Pixel 9 Pro/Edge remains the genuine acceptance device, and the owner's reported zero-detection failure is unresolved.

No Netlify deploy was performed. GitHub is a private source repository; existing event-time commits were pushed unchanged.
