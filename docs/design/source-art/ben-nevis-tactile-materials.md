# Ben Nevis material refinement — 8 October 2026

Built-in image generation/editing, one edit per orientation. No CLI/API fallback.
Original assets are retained. Generated output was copied into this repository and
encoded as WebP without resizing or retouching. These are projected materials,
not replacement background screenshots: geographic geometry, land-cover masks,
route and player coordinates remain authoritative in the existing Canvas renderer.
Visual registration was inspected; generated painting is not survey evidence.

## Portrait

Inputs: `public/textures/ben-nevis-overview-refined.webp` (edit target),
`docs/design/source-art/approved-app-visual-direction.png` (style reference).
Source: `ben-nevis-overview-tactile.png`.
Runtime: `public/textures/ben-nevis-overview-tactile.webp`.

Prompt:

Edit the FIRST image, a precisely registered portrait terrain material for the real Ben Nevis in a Canvas game. Second image is STYLE REFERENCE ONLY (especially Mountain overview panel). Output ONLY the first terrain image refined, at its identical 920:1710 portrait aspect ratio and identical framing. Preserve EVERY silhouette, summit, ridge, valley, major rock outcrop, foreground river bend and feature in exactly the same pixel positions as first image. No camera change, no re-composition, no enlargement, no stretching, no extra mountains, no trees/structures/route/markers/mascot/UI/text. Preserve the empty pale mint sky as a perfectly flat colour. Refine ONLY the mountain's surface painting toward the polished adult illustrated adventure game in reference 2: stronger broad blue-slate shadow planes, warm pale granite crag highlights, rich pine greens and warm sunlit olive meadows, economical finely drawn cracks inside larger coherent rock forms. Less busy tiny mottled grass noise, no all-over confetti texture, no faceted low-poly look, no oil paint impasto, no photographs. Aim for crisp smooth hand-painted premium adventure game scenery, with the original geographic shapes precisely preserved. River stays on same course with same banks. This is a texture/material edit that will be projected back onto the original real terrain, NOT a full game screenshot.

## Landscape

Inputs: `public/textures/ben-nevis-wide-refined.webp` (edit target),
`docs/design/source-art/ben-nevis-overview-tactile.png` (finish reference).
Source: `ben-nevis-wide-tactile.png`.
Runtime: `public/textures/ben-nevis-wide-tactile.webp`.

Prompt:

Edit FIRST image only: an exactly registered WIDE 2017:780 Ben Nevis terrain material. Second image is colour/material brush finish reference only. Preserve first image's EXACT aspect ratio, camera, full mountain silhouette, summit location upper right, all ridges, valley, rivers, lake, forest boundaries and framing in the same normalized pixel coordinates. Do not crop, shift, move, enlarge or invent landforms. Refine surface painting to match second image's clean premium adult illustrated adventure game finish: coherent large blue-slate shadow planes, pale golden granite light, rich deep green forest masses, warm olive meadows; sharper intentional rock edges and less muddy random small mottling. Smooth precise painted game illustration, not photograph, no low-poly facets or plastic. Keep the empty mint sky flat and unchanged. NO route, UI, text, player, badges, clouds or markers. Texture-only artwork that will be projected on the existing sourced geographic mesh, never a background screenshot. Exact existing feature positions take priority over style enhancement.
