# Laundry Mountain — Figma working design

Created 6 October 2026 using the connected Figma tools, at the owner's request.

- File: https://www.figma.com/design/TtfHJ1SkrVGpKsL8Lm9HiF
- Supplied reference evidence: node `5:16`.
- Working screen board: node `5:20`.
- Home / mountain / live: nodes `5:24`, `5:25`, `5:26`.
- Screenshot: `review/figma-working-screens.jpg`.

## What this establishes

Three editable 390 × 786 phone compositions, project colour variables, Roboto /
Roboto Condensed text styles, flat primary-button states, four statistic components
and shared navigation. Native text, layouts, icons and component instances represent
the UI. Imported images are discrete art or the explicitly separate supplied reference
evidence. A temporary local capture was removed after extracting source art; no Figma
capture script remains in the application.

The home and live numbers are labelled design fixtures on the board. The mountain
underlay records the actual existing map at 0%, including demo markers. It is a
reference underlay, not a new accepted terrain renderer or an editable gameplay route.
The camera illustration is clearly labelled camera off; it is not a recording or
evidence that physical detection works.

## Acceptance is still NOT PASSED

The existing elevation-based mountain art was retained as context. Figma does not
automatically transform it into the supplied illustration style. The remaining work
is deliberate art direction and implementation, especially these reference criteria:

1. Rich painted crags, readable ridge planes and detailed foreground trees rather
   than a grainy shaded mesh or uniform miniature-tree field.
2. Geographic identity: Ben Nevis's plateau and north-face character, measured
   elevation, actual route and Highland surroundings. No invented alpine cone.
3. A coherent illustrated style across terrain, laundry identity, badges and scenery.
   Correct existing flat-button preference; no embossed controls.
4. Home hierarchy and density comparable to reference screen 2; rewarding circular
   progress and compact statistics comparable to screen 5; a legible route and player
   comparable to screen 7. Keep attribution and clearly identified demo participants.
5. Actual live front camera and progress visible together, including phone landscape.
   A design-only camera strip is not responsive or real-device verification.

## How to continue

Own the Figma work; the owner need not learn Figma. Present rendered comparisons
in chat. Use the exact supplied board as the target, not this working board as a
substitute. Resolve Ben Nevis artwork first with a bounded, focused pass and identify
the remaining gap candidly; avoid speculative changes across all screens at once.

After the visual direction is resolved, adapt it into the existing React/Canvas app
without swapping the interactive mountain for a flattened image. Run the affected
experience, inspect phone portrait/landscape, exercise controls and persistence,
and run relevant existing tests. Physical accuracy remains a separate failed gate.

## Verification of this design step

Rendered the whole board, repaired initially missing WebP assets using equivalent
PNG imports, and corrected SVG progress arcs after inspecting the render. Final
board contains 54 native text nodes, 79 frames, 27 vector nodes, 8 discrete image
rectangles and 7 component instances. Font families match current product CSS.
Phone bounds and content hierarchy were read back. No application behaviour changed,
so no application test results or new physical-camera success are claimed.
