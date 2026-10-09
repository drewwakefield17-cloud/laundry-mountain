# Ben Nevis reference-match plan

## Latest: forward travel and recording quality — 8 October 2026

Owner correctly rejected the earlier walking proof: feet alternated but a 10 m
batch translated the basket less than one screen pixel, and the GIF was dithered.
The close scene now stages the current checkpoint approach. Banking animates the
whole basket along that path at frame rate, with perspective scaling and a small
weight shift; it remains at its earned position after the step. Footfall timing
uses whole cycles. At a checkpoint it reaches the sock, celebrates, and stages
the next approach behind the existing reward. Summit progress remains capped.
Manual counts, awards and saved totals are unchanged by this presentation fix.

Verified in the in-app browser on isolated localhost:5174: 10 -> 110 m with a
10-item batch; 110 -> 260 m crossed Into the glen before its real reward; 260 ->
270 m checked a short step in 844 x 390 landscape. Portrait was 390 x 844. Both
sprites, contact shadows, persistent destination and the next approach were
inspected. The final endpoint is beside the visible sock. No console errors.
Owner localhost:5173 progress was untouched. The isolated test session is saved
and paused at 270 m / 27 items; the earlier 127.0.0.1:5174 test remains at summit.

The full-colour capture is review/coordinated-implementation/uphill-travel.webp,
linked from the review gallery. It encodes actual captured frames at their recorded
intervals using lossless WebP; first frame contains 123,671 colours versus the old
GIF's 256. Browser capture itself is JPEG. Do not describe it as a 60 fps video.
Live travel uses requestAnimationFrame. Earlier static screenshots still represent
the approved composition; the current motion clip is authoritative for travel.

Production build and 39 unit tests pass. New regressions cover meaningful projected
travel, checkpoint staging, save/reload stability and no replay/post-summit movement.
Reduced-motion code bypasses travel and foot animation; media emulation was not
available in the in-app browser, so that setting was reviewed in source, not claimed
as a browser-emulated check. Final result: passed for the movement/recording scope.

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

8 October 2026. Latest owner direction: concentrate on approval of the Ben Nevis
experience before extending the visual system to Fuji/Everest. Implementation is now authorized: “ok proceed until it matches”. The approved
references remain the acceptance target; implementation and owner visual approval are separate.

## Fixed target and scope

The LEFT approved images in coordinated-proposal are the target, including asset
style, composition, mascot pose, ground contact, type proportions, iconography,
colours and control sizes. Similar themed substitutes have repeatedly failed.
Use all 28 owner annotations as an explicit open checklist. Preserve functioning
manual progression and saved user data. Park Fuji/Everest scene refinement, AI,
backend, landing and submission artwork until this visual gate is met.

## Root causes to correct

1. Typography differs systematically: verify actual loaded font files, rendered
   family and available weights before changing CSS numbers. Match heading letter
   shapes, density, size and line breaks; do not merely make everything bold.
2. Artwork is compositionally different: scenery, mascot poses and socks need to
   come from the matching approved panel, not approximate unrelated replacements.
3. Scene layers lack a shared ground plane: position feet, shadows, rocks and sock
   bases together and scale them consistently with depth. Test all motion frames.
4. Layout dimensions drift: reproduce reference image area, white panels, rings,
   icons and controls at the same viewport. Avoid squeezed or floating content.
5. QA showed known gaps to the owner without closing them. Capture current actual
   UI against the exact panel and inspect the composite before each checkpoint.

## Annotation checklist (all initially open)

| Comments | Surface | Required correction |
|---|---|---|
| 1 | Welcome | Match walking pose/feet, visual contrast, sock checkpoints, logo without TM, separate clear tagline, headline, subheading, white curve and Get Started proportions. |
| 2–5 | Home | Match heavy Ben Nevis title, thicker/larger progress ring, scene sock markers, bold checkpoint name/distance and reference composition. |
| 6 | Shared navigation | Replace plain star with the reference hexagonal badge/star symbol. |
| 7–9 | Mountains collection | Extend rocky ledge naturally to screen edge; match vivid artwork, heavier headings, larger elevation numbers and locks. Keep all three existing cards; focus new scenery work on Ben Nevis. |
| 10 | Badges | Match illustrated/enamel medal artwork, scale, gold rims, semantic motifs, silver locked states and scenic header. Inspect the generated medal atlas before reuse. |
| 11 | Badges footer | Remove the unwanted inspirational quote below the grid. This annotation targets the quote, not badge requirement descriptions. |
| 12–14 | Ben Nevis overview | Recompose against approved full mountain: plateau silhouette, sky/glen/lake/foreground hierarchy, dotted trail on land, sock markers, player pin, large title, summit symbol and bottom checkpoint/control layout. Current terrain view is not accepted. |
| 15 | Ben Nevis climb | Match painted scenery, foreground walking basket pose/size, planted boots, trail framing and consistent marker perspective. |
| 16–17 | Active session | Correct upper scene to the same approved family. Preserve the lower stats/actions section marked okay. |
| 18–19 | Profile | Match scenic composition and seated mascot on a proper ledge, bold title, stat proportions, checkpoint row, form and reference action ordering. |
| 20–21 | Batch entry | Match bold heading/count, spacing, larger clothes artwork, correct folded/hung/ironed icons, sheet proportions and close control. Preserve accessible count entry and clear incremental counting. |
| 22–23 | Checkpoint | Add the missing matching sock milestone, match celebratory pose, grounded feet, bold title and progress panel. |
| 24 | Badge reveal | Match crisp medal, larger visual impact, controlled golden rays/sparks, vivid twilight scenery, celebratory mascot and typography. Respect reduced motion and sound preference. |
| 25 | Results | Match heavier title, grounded celebratory pose/scene with marker, stats order/proportions and an earned reward row when a real reward exists. Never fabricate an unlock for appearance. |
| 26–27 | History | Remove duplicate heading, match scenic seated mascot on rock, reference hierarchy and compact rows; eliminate floating mascot. Use real session counts and descriptive truthful labels. |
| 28 | Landscape play | Compose for landscape explicitly; match relative camera depth, basket/marker size, ground contact and controls. Do not stretch the portrait composition. |

## Execution and visible checkpoints

### 1. Establish the reference-matched Ben Nevis foundation

Verify type delivery/weights and define exact shared heading, number, button, ring,
sock and navigation treatments. Resolve source art composition and mascot poses.
Finish Welcome and Home against the corresponding foundation panels. Output:
fresh live-app side-by-sides, with comments 1–6 individually marked fixed/open.
Do not expand to Fuji/Everest or generate new style alternatives.

### 2. Finish the mountain and playable scene

Implement reference-composed illustrated Ben Nevis overview and close climb with
functional separate trail, progress and avatar layers. Existing generated Ben Nevis
map/climb assets are candidates, not accepted just because they exist. Verify each
against its reference before integration; replace inadequate art directly from the
approved panel. Preserve geographic data/renderer as fallback.

Keep mountain identity recognisable and path on dry land. Match the reference's
camera and depth, avoiding a distant tiny mascot as progress increases. Walking
must advance along the trail with grounded footfalls and appropriate camera
framing. Output: overview, climb and portrait/landscape active-session comparisons,
plus a short real batch -> walk -> checkpoint sequence. Preserve approved lower
session controls. Close comments 12–17 and 28.

### 3. Carry the settled family through the remaining journey

Finish collection/header, medals and badge reveal, profile/history, batch,
checkpoint and results using the established assets and dimensions. Output: fresh
full Ben Nevis journey comparison and motion evidence, with all 28 annotations
mapped to exact fixes or explicit remaining defects. Close comments 7–11, 18–27.

## Acceptance and reporting

- Update the same review page after each completed checkpoint. Clearly label
  fresh capture state and remaining defects; do not reuse stale captures as proof.
- Match viewport, framing and representative progress when comparing; use an
  isolated test origin/data so owner progress is never reset for screenshots.
- Check boldness, line breaks, logo/tagline, sock details, ring thickness, medal
  family, character feet, perspective and scene vividness before handing off.
- Review functional controls and meaningful regression checks alongside visuals.
- No invented 95% score, no claim of exact parity with visible mismatches, and no
  production/AI claims from a design pass. Final visual approval belongs to owner.
- Implementation authorized in the subsequent turn. Current evidence is in the same coordinated-implementation gallery.

## Implemented correction checkpoint — 8 October, evening

- Shared local 800/900 font delivery; heavier headings/numbers, large progress ring,
  orange sock markers and hexagonal navigation badge. Home capture reads the
  preserved owner state (Drew,100m,10items,2badges); no owner ledger edits.
- Replaced the default Ben Nevis terrain view with painted reference-derived map,
  dry-land dotted route, checkpoint markers and live player pin. Geographic source
  files remain available. Close play uses separate portrait/landscape compositions.
- Replaced Welcome/logo (noTM), profile/history, checkpoint, results and badge-reveal
  assets from the corresponding approved panels. Added the actual earned results badge.
- Integrated all nine illustrated medals and compact truthful requirement captions;
  removed badge footer quote. Corrected iron/photo controls and profile action order.
- User caught a reversed raised boot in the B-v2 asset candidate. That candidate is
  rejected. The replacement is reference-basket-walk-b-corrected.webp; heel is under
  ankle and toe points forward. Its exact prompt is saved beside source art. The
  live two-pose walk was inspected via saved frames after a real isolated test batch.
- Isolated browser test banked 25 items (+250m), moved1100→1345, showed checkpoint,
  earned Summit Seeker and saved results/history. Reduced-motion rules suppress pose
  and position animation. Physical camera/AI/deployment are out of this pass.
- Build and36 unit tests passed during integration. The final build also passed after the last
  spacing, captions and checkpoint-control changes. Gallery status must remain comparison-ready, not an
  invented fidelity percentage or owner sign-off.
