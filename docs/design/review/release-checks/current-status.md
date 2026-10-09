## Submission repository update - 9 October 2026

The owner requested the complete current app in the GitHub submission repository.
Main is being fast-forwarded to the verified working app and demo source; preserve
all history and the earlier baseline commits. This is repository publication only,
not a new production deployment. Commit messages retain [skip netlify].

- Replaced the stale root/trailer README introductions with current scope, install
  and render instructions, real app screenshots, approved cover and voiceover links.
  Previous README notes are preserved in docs/archive/.
- Included the accepted three-mountain app, HTTP-safe session IDs, artwork, domain
  tests, approved Remotion composition, trimmed isolated demo takes and cover.
- Kept personal recording originals, intermediate footage, video exports, caches,
  credentials and the locally licensed OS emphasis font out of Git. The optional
  trailer README explains the font setup and historical compositions.
- Updated existing browser tests for the accepted controls, journal and reward
  dialogs. Moved demo capture recipes behind playwright.capture.config.ts.
- Fixed two bounded layout regressions: the preserved live-camera screen now uses
  landscape width, and manual Save for later stays visible at 667 x 375.
- Verification: 48 unit tests, TypeScript and Vite production build passed. All
  22 browser regressions passed across focused runs (11 camera/geography; 8 app;
  3 corrected selector/reward cases). Production npm audit: zero findings.
  Literal runtime assets and README links checked. The initial broad run exposed
  cold dev-server startup timeouts and stale UI selectors; subsequent focused
  runs passed after server readiness and selector/layout corrections.
- The large preserved geographic-renderer chunk still triggers a Vite size warning.
  Physical camera accuracy, cloud sync and photo estimation remain unvalidated or
  unimplemented; the demo labels photo estimation as a concept.

# Release work — 9 October 2026

## Latest follow-up: owner phone footage and Basky demo

- Correct name: **Basky**. Use the app's exact logo, never reconstructed branding.
- `trailer/` contains Remotion v2: 31.8 s, 1080p30, owner gameplay, new free motion
  shot and a labelled proposed photo-counting animation. Music/VO/review remain.
  See `trailer/README.md` for export and playback verification status.
- Owner's first phone recording preserves the failed start. HTTP LAN reproduction
  identified unavailable `crypto.randomUUID`; shared secure fallback implemented.
  48 tests across 11 files, TS/build and LAN manual-flow checks passed. Evidence:
  `artifacts/phone-http-fix-check.log`, `phone-http-session-fixed.jpg`.
- Second owner recording shows a manual 20-item / 200 m batch and earned rewards.
  It also exposes blue/blank cold Fuji/Everest scenery for several seconds. OPEN
  performance finding; no physical camera accuracy or complete phone pass claimed.
- Landing includes three different app phone screens. Mobile gallery checked;
  evidence `landing-phone-showcase-mobile.jpg`; final build passes.
- Canva was researched as an optional finishing editor; no assets uploaded there.
- No new deployment. Hosting choice, cover, loading fix and final video remain.

The older sections below describe previous checkpoints, not the latest trailer
or test count. The video toolchain separately reported 10 high dependency findings;
that has not been investigated and is not covered by the app production audit.

## Current owner feedback

The owner rejected the initial DemoBro trailer and the first landing-page pass.
The approved three-mountain app remains fixed. Landing has been revised around
purpose-composed mobile/desktop Highland artwork, shorter copy and the app's
illustrated icon/control family. Owner accepted it with “much better”; it is at
http://localhost:5180/. Final build passes. Browser inspections cover 390x844,
320x740, 1440x900 and 844x390, with the reassurance contrast and landscape heading
fixed. Actual CTA/onboarding, mountain link and FAQ expansion checked; no captured
console warnings/errors. Evidence is saved as landing-revised-*.jpg.

## Completed before the landing revision

- Three thumbnail alternatives: ../release-covers/index.html. Selection pending.
- 46 Vitest tests across ten files, TypeScript and production build passed.
- Production dependency audit: zero reported vulnerabilities.
- Fresh local production-origin manual checks: onboarding, valid/invalid batches,
  folding/hanging/ironing, checkpoint and badge rewards, cancel without credit,
  pause/save/reload/resume, results/history and locked-mountain entry.
- Portrait 390 x 844, narrow 320 x 740, landscape 844 x 390 and desktop 1440 x 900
  were inspected. No captured browser warnings/errors. Not physical-phone testing.
- Main app no longer eagerly loads the camera/geographic prototype. Approximate
  initial JS compressed bundle sums: landing 78 kB; game 108 kB, formerly 447 kB
  combined. These are bundle sizes, not measured real-device load times.
- Existing CLI Playwright suite was not rerun in this release pass. Earlier
  camera-fixture results are separate historical evidence.

## Hosting

Draft preview uploaded to the existing Laundry Mountain project only:
https://6ac835ab7996b4f898df7ecc--laundry-mountain-folding.netlify.app

Site: d8d64a2d-8da2-48fc-a9c3-0bf30239e17e (laundry-mountain-folding).
Draft deploy: 6ac835ab7996b4f898df7ecc. HTTPS landing/onboarding/fresh session
checked in the browser. Production still points at 6ac439696037fa9c003978b1.
No other live project was changed. User's existing-site versus new-site choice
remains pending; automatic review rejected a duplicate new project. Netlify
access itself works. Do not promote production until the site choice is resolved.
The new landing revision is local and is not part of that existing draft upload.

## Trailer

DemoBro generated a 19.203-second, 1920 x 1080 draft. The owner watched and rejected
it. Durable playback route verified by redirecting to the actual video:
https://www.demobro.video/v/d7b4d25b-8ab8-41b7-9fcd-8c8ee33110d5.mp4

The displayed share link erroneously used 0.0.0.0; do not distribute that host.
Browser video download stalled and did not yield a confirmed local file. Do not
claim this is the finished submission trailer or an approved soundtrack/edit.

Next direction: custom edit, mascot-led opening using existing approved motion,
real batch-to-climb/checkpoint/badge gameplay, three peaks and an intentional music
arc. Remotion skill read but project/composition not yet created. Creative Claw
12-second music attempt was rejected BEFORE generation: requires 6 credits,
available 1, no credits charged. No music asset or new generated video exists.
Do not purchase credits or silently submit repeat generative video takes.

## Remaining

Preserve the accepted landing, resolve the production site choice,
select a cover, complete/review the custom trailer, and
obtain physical-phone acceptance of the manual flow. AI counting/camera accuracy
and cross-device cloud saves remain deferred and must not be advertised as built.
