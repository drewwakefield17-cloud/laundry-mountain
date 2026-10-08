# Fuji and Everest scene pass — 8 October

The owner approved the current Ben Nevis / personal-app baseline. This pass adds
separate overview and close-up scenery for the other two active destinations.
Ben Nevis renderer, route, owner ledger and current manual session are unchanged.

## Implementation

`ExpeditionScene` renders the existing 129-square geographic elevation meshes in
Canvas 2D. It uses one uniform world scale and independently frames the trail in
portrait and landscape. Texture paint is attached to world coordinates, not a
flat replacement screenshot. Dotted paths, socks, basket body/limbs and foreground
layers remain separate. `metres` is a presentation input with walking/checkpoint
motion; preview screens supply zero and award nothing.

Both expedition cards now open full screens with Full mountain / Climb view.
The existing navigation and return-to-mountains path remain available. Deep links:
`/?view=mountain&expedition=fuji` and `/?view=mountain&expedition=everest`.

Fuji: truncated volcanic cone, wooded foothills, bare upper rock and seasonal snow.
Everest: original Himalayan mesh, rock/snow/ice, no transplanted Highland greenery.
The scenery is a seasonal artistic interpretation, not live weather or mapped
plant/glacier boundaries. Foreground framing is illustrative. These new laundry
trails are game routes sampled onto the heightfield, not surveyed climbing tracks.
Ben Nevis retains its actual OSM Mountain Path. Product credits explain the distinction.

## Art provenance and reproduction

- Existing `fuji-approved-style.png` and `everest-approved-style.png` supplied the
  terrain shape references. Generated refined material plates preserve their view.
- `*-refined-material.prompt.txt` records the plate prompts. Plate source PNGs are
  stored alongside these records. `build-preview-material.py ID` creates the guide;
  run again with the refined PNG path to bake the 2048-square terrain WebP.
- Runtime foregrounds: `public/art/fuji-foreground.webp` and
  `public/art/everest-foreground.webp`, generated with true alpha. Prompts are in
  `source-art/*foreground*.prompt.txt` and `everest-snow-refinement.prompt.txt`.
  One rejected Everest refinement picked up greenery from the style reference;
  it was replaced with the snow-only final asset, not shipped.
- Approved basket body/limb/sock assets are reused unchanged.

Geographic references consulted:
https://www.fujisan-climb.jp/en/comparison-of-routes/
https://science.nasa.gov/earth/earth-observatory/edmund-hillarys-everest-route-8396/
The latter describes the southern Everest route; it is contextual reference, not
the source of the northern-view game trail drawn by this renderer.

## Perspective correction after owner review

Sock markers now diminish with route distance and anchor at their actual opaque
base instead of a bright floating oval. The basket is smaller relative to the
terrain. Close-up foregrounds preserve their native aspect ratio; basket and sock
ground contacts use that same image transform. Landscape uses a centre crop and
left-side controls to keep the massif, trail and character visible together.
Finite terrain-grid edges fade into the atmosphere instead of showing cut edges.
All 12 portrait, narrow and landscape captures were refreshed after these changes;
browser errors and horizontal overflow were empty, and the production build passed.
This is verification evidence, not owner visual approval or gameplay validation.

## Remaining integration

These are integrated app scenery previews, not connected playable expeditions.
Unlocks, per-mountain earned positions, summit transitions and the badge-reveal
moment belong to the next demo/gameplay pass. Do not call this automatic laundry
detection or a production backend. Vercel selected; no deployment in this pass.

Visual evidence: `review/three-peaks/`. The capture script uses isolated browser
storage and does not touch the owner's in-progress session. Its responsive checks
are not real-phone performance or physical-camera validation.
