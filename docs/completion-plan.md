# Laundry Mountain completion plan

Updated 8 October 2026 after the owner approved the personal app / Ben Nevis finish.

## Current priority (supersedes older acceptance notes below)

The owner likes the built app and Ben Nevis. Finish Fuji and Everest in that family,
then prioritise the working demo sequence in `submission-plan.md`: completed items,
basket movement, checkpoint celebration, animated newly earned badge, saved progress.
The target is a compelling truthful video and open-source repository, not a broad
production backend. Vercel is now explicitly selected; deployment remains paused.
The deadline is 9 October at 19:00 UK time. AI and continuous detection are deferred.

Fuji and Everest now have full overview/climb scene implementations in the existing
app, with independent terrain, foregrounds, game trails and rigged basket. These
remain clearly marked previews; actual expedition unlocks and saved progress still
need the separate gameplay pass. Ben Nevis and owner session data remain unchanged.


## Implementation checkpoint — personal adventure pass

Steps 1–3 now have an integrated implementation for review: three active mountain
choices, personal navigation, no community or demo competitors; refined welcome,
home, selection, overview, achievements, profile, history and results. The original
approved basket and mountain geometry remain. Regular screens now scroll above
their navigation, avoiding content hidden underneath it. Cadence badge wording is
replaced by five/twenty items in one session, using saved counts rather than speed;
prior camera-earned badges remain valid. No session data is rewritten.

Step 4 is now the review point. See `design/review/personal-adventure/index.html`
and `whole-app.png`. Screens are actual renders; populated states are isolated
visual fixtures. TypeScript/build passed; 30 captured visual states have no script
errors or horizontal overflow. Gameplay/camera suites have deliberately not been
run in this design pass; their outdated navigation expectations were maintained
for later execution. No AI work or deployment occurred.

The owner has since approved the Ben Nevis/app visual direction. The full overview preserves real
terrain and a land-following route; it is not a pixel copy of the conceptual board.
Fuji and Everest now have prominent geographic preview cards but still need the
playable progression work in step 5. Landing composition and adult wordmark remain
deferred; only inaccurate scope/camera copy was corrected on the existing landing.

## Release scope

Personal laundry adventure. Ben Nevis → Mount Fuji → Everest. No community,
leaderboards, demo competitors or other mountain choices. Retain the approved
basket, sock checkpoints, illustrated realism for adults, tactile emerald actions,
navy type and witty but clear copy. Original ten-screen board plus the approved
coordinated board remain the visual reference. No restart or stack change.

## Where we are

- Built: existing app screens; Ben Nevis live climb; manual timer/batch loop;
  local progress, session history, badges and optional temporary photo previews.
- Approved visual baseline: current personal app and Ben Nevis; Fuji/Everest
  receive the same finish in the next scene pass.
- Fuji/Everest: existing artwork/terrain previews, not playable progression.
- Outstanding: release scope cleanup, final app design, three-mountain progression,
  phone/gameplay acceptance, optional AI photo estimates, landing and submission.
- Camera recognition remains unvalidated. No AI counting or cloud sync exists.

## Execute in this order

1. **Simplify the product.** Remove community page/navigation/route competitors and
   Matterhorn, Kilimanjaro and Denali from active choices and copy. Preserve source
   assets and history. Navigation: Home, Mountains, Start, Badges, You. Keep the
   original detector in development diagnostics, outside the normal player journey.
2. **Finish the main visual journey.** Welcome → Home → live climb → batch count →
   celebration → mountain overview. Reuse approved art and controls; improve full
   overview hierarchy, route readability, scene framing and landscape composition.
   Give Ben Nevis, Fuji and Everest their real, distinct scenery within one family.
   Include paused, empty, summit and saved-session states. Avoid a new style search.
3. **Finish supporting screens.** Three-mountain selection/unlock presentation,
   achievements, personal profile and session history. Match icon treatment,
   typography, depth, spacing and voice. Explain manual progress honestly; remove
   obsolete camera-first instructions from the normal flow. Keep badge rules clear
   for the eventual manual-mode functional pass, without faking earned achievements.
4. **One whole-app visual review.** Actual current app screens together at matching
   phone sizes, plus landscape gameplay, beside the approved references. Identify
   remaining concrete differences. One focused correction pass, then freeze an
   accepted visual baseline. No invented percentage; no owner camera test yet.
5. **Complete and test the game.** Make all three expeditions playable: selection,
   checkpoints, unlocks, summit transitions and per-mountain saved positions. Verify
   manual counts, rewards, pause/resume, leave/return, storage failures and real-phone
   usability. Reuse the current local foundation; don't introduce account/backend
   services without a necessary feature. Software checks are not real-device proof.
6. **Add AI last.** Separate photo-count estimate experiment with honest uncertainty,
   editable confirmation and manual fallback. Decide the server/provider/privacy
   implementation then. Don't block release on continuous live-fold detection.
7. **Package the finished app.** Carry the settled style into the landing page,
   record a truthful demo and prepare the submission. Review the owner's forthcoming
   example before choosing demo format. Vercel is now the selected host. Deployment remains paused until explicitly
   resumed. Follow the demo priorities in `submission-plan.md`.

## Working discipline

Work through each stage in order. Give short updates stating current stage,
completed result and next result. Inspect rendered visuals during design work;
reserve full gameplay/AI acceptance for the later stages. Keep all changes on
`visual-refinement` with meaningful new commits and `[skip netlify]` while deployment
is paused. No history rewriting or changes to the owner's saved progress.
