# Live dial and trail-sign refinement — 6 October 2026

The supplied ten-screen board remains the target. This pass addresses the owner's
specific feedback about the wordmark inside the live dial and the oversized,
cartoony trail signs. It does not close the overall mountain-art acceptance gate.

## Implemented in the existing app

- Icon-only laundry/mountain emblem, with no lettering inside the live medallion.
- Full circular code-rendered landscape, cream curved timer plate and honest goal ring.
- Compact landscape timer keeps the folded towels visible with the front camera.
- Slimmer warm painted timber sign, smaller lettering and reduced map footprint.
- Preserved the pending north-face scenic camera and mapped Torlundy surroundings;
  reduced noisy material contrast. Terrain dimensions and mapped route remain unchanged.

The initial grey, highly realistic sign was rejected by the owner and was not added
to the app. The replacement follows the warmer illustrated palette of reference
screen 7. Individual transparent assets supplement the Canvas world; no full scene
or screen bitmap replaces gameplay.

## Asset generation briefs and provenance

Built-in image generation was used with the existing brand artwork and supplied
reference as inputs. Final briefs:

- **Emblem:** preserve the orange flag and sun, navy outlined snowy peak, turquoise
  and white folded towels and flanking pines. Remove all Laundry Mountain wording
  and typography. Produce one clean transparent icon with no surrounding scene.
- **Sign:** use the original board's screen 7 as the style authority. Three slim,
  warm honey timber boards on a natural wooden post, illustrated painted detail,
  restrained condensed navy lettering: “Cleaner clothes”, “Brighter days”, “Higher
  you”. Avoid photorealistic grey wood, exaggerated board shapes, thick outlines
  and a large grass base. Transparent background.

Editable source files: `source-art/laundry-mountain-emblem.png` and
`source-art/trail-sign-refined.png`. Optimized production files:
`public/brand/laundry-mountain-emblem.webp`, `public/art/trail-sign-refined.webp`.

## Verification

24 unit tests, TypeScript and production build passed. Seven affected game and
expedition browser tests passed; after a landscape timer adjustment, both isolated
camera flow tests passed again. Inspected actual phone portrait and landscape
captures. Synthetic camera fixtures are software checks, not physical accuracy.
Shared-browser map inspection produced no captured warnings/errors.

Figma live and map nodes were updated: icon-only asset, full medallion, curved timer
plate, full-height renderer underlay, smaller new sign, oversized decorative pine
removed. The Starter-plan MCP quota blocked the final Figma screenshot, so the
updated Figma render is **not verified**. App inspection remains available.

Overall visual acceptance: **NOT PASSED**. Mountain composition and illustrated
terrain detail still need improvement. Pixel 9 Pro / Edge physical folding test
remains unresolved after zero detections. No Netlify deployment.
