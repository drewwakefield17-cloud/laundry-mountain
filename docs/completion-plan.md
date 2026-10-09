# Laundry Mountain completion plan

Latest follow-up: custom Basky demo v2 now exists in `../trailer/`, with actual
owner footage and labelled photo-counting concept. Music/VO and approval remain.
Phone HTTP session start fixed; 48 tests + build pass. Owner footage exposed slow
cold Fuji/Everest scenery loading: fix and verify before release sign-off. Preserve
accepted app/landing styling and exact logo. No new deployment or Canva project.

Updated 9 October 2026 after the three-mountain implementation and browser checks.

Latest release follow-up: the first landing and DemoBro draft were rejected. The
landing revision is now owner-approved (“much better”). Local release checks
and a Netlify draft smoke check are complete; production remains unchanged while
the existing-site/new-site choice is pending. Finish the custom trailer, choose a
cover and perform physical-phone acceptance. Full current evidence and blockers:
`design/review/release-checks/current-status.md`. These notes supersede the older
Vercel-only next steps below; no unrelated live project may be changed.

## Current priority (supersedes historical notes below)

Ben Nevis, Fuji and Everest are implemented as playable expeditions in the approved
visual family. Their checkpoints, selection, unlocks, summit overflow and local
saves are connected. Build and 46 tests pass; full progression and responsive views
were exercised on an isolated origin. Review the integrated evidence at
`design/review/playable-mountains/index.html`.

Next release work:
1. Physical-phone acceptance of the manual loop and practical load/performance review.
2. Record the truthful demo in `submission-plan.md`: completed laundry, confirmed
   batch, whole-basket movement, sock checkpoint, earned badge and saved progress.
3. Final release/package/repository check, then Vercel deployment when authorized
   and submission. Target remains 9 October, 19:00 UK time.

AI counting, camera validation and cloud services remain deferred. The owner
approved the integrated Fuji/Everest visuals with “perfect” on 9 October.
All three mountain designs are now fixed for release; physical checks remain.
The older stage records below document how the app reached this point.

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

- Built: all three playable mountains, manual timer/batch loop, per-mountain
  positions, sequential unlocks, local saves, history, badges and temporary photos.
- Accepted baseline: Ben Nevis and uphill movement. Fuji/Everest share that UI,
  with distinct scenery and an integrated review ready for the owner.
- Verified: 46 unit tests, production build, isolated full progression browser run,
  portrait/landscape/narrow/desktop visual inspection. Existing saves preserved.
- Remaining: physical-phone acceptance, performance/release packaging, demo and
  authorized deployment/submission. No AI counting or cloud sync exists.

## Original implementation stages (current status above)

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
