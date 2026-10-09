# Coherence audit and bounded polish plan — 8 October 2026

Latest owner direction: the integrated visuals are NOT signed off. Prior approval of the Ben Nevis direction does not mean the whole app is finished. Pause implementation; inspect and plan first. No application source, CSS or artwork was changed in this audit.

## Evidence

Current shared-browser captures are in review/coherence-audit/index.html. All screenshots captured in this audit run. The owner session remains 10 items / 100 m; simulated 25-item session uses separate origin 127.0.0.1:5174, not the owner's localhost:5173 storage.

## Main findings

1. Confirmed home overlap: at 685 x 764 the mountain-card-button is 261.2 px tall with a 350 px child. Stats begin at y375 while art ends at y450.8. Narrow 320 x 740 also hides stat icons. The 390 x 844 view fits. Fix flex/scroll sizing rather than replacing art.
2. Strong anchors: Ben Nevis home illustration, three mountain cards, existing badge art, tactile emerald CTA. Preserve them.
3. Inconsistent framing/scale across overview vs climb and across mountains. A giant map basket and tiny far socks do not communicate one scene convention. Trail ground contacts and light/material matching remain unfinished.
4. Icon mismatch: realistic mountain miniature, illustrated basket/badge, flame for cumulative items, thin outlined sock, full painted sock in live play. One family and meaningful labels are needed.
5. Reward gap: after simulated 25 items, checkpoint feedback is a status sentence; earned badges appear in the collection (5) but no reveal. Existing badge detail has no badge image. Results already have mascot/confetti—do not claim all animation/celebration is absent.
6. One basket view is reused everywhere. Rigged walk/hop exists. Add a bounded pose set, not a whole new character.
7. No audio assets/playback found in src/public using two searches. Optional short feedback sounds are new work, not already built.
8. Five cascading theme stylesheets in GameApp make local tweaks drift. Consolidate affected shared styles in the implementation pass; do not rewrite the app.

## Proposed pass, in order

1. Fix layout and consolidate shared controls, icons, checkpoint panel and spacing. Keep light surfaces, navy type, tactile emerald controls.
2. Settle a single representative Ben Nevis scene at start/checkpoint/later progress, portrait + landscape. Same camera/light/ground/scale rules then apply to Fuji/Everest. Real mountain identity remains.
3. Exact approved mascot: idle front/three-quarter, uphill three-quarter walk, celebration. Optional brief Mountains greeting. No full 3D rebuild or large costume set.
4. One coherent reward sequence: manual batch -> metres count -> walk -> checkpoint arrival -> badge reveal -> settle. Optional short sounds, visible mute, reduced motion. No reward replay on revisit or fabricated AI.
5. One integrated evidence set and short motion recording. Fix concrete discrepancies once. Broader redesign ideas go into backlog; backend, AI and landing stay out of this pass.

## Dark mode

Recommendation only, not implemented: keep approved light app and explore dark navy behind the reward reveal first. A global theme adds contrast/state work and will not fix the layout/scene mismatch. If explicitly selected later, compare one light/dark screen before propagation.

## Acceptance

No overlaps or hidden actions at reviewed sizes; one icon/checkpoint family; grounded basket at several trail positions; legible game markers; visible locked/earned badge distinction and first-time badge reveal; no unnecessary looping motion; optional sound; same scene rules across three real mountains. Do not substitute software pass counts for owner visual acceptance.

## Screen findings

- **1 · Welcome — Keep / light polish.** Strong scenic opening and recognisable mascot. Preserve the illustration direction. The repeated front-facing basket needs a deliberate welcome pose; adult wordmark remains a separate deferred task. Evidence: [capture](review/coherence-audit/02-welcome.jpg).
- **2 · Home · phone — Fix layout and shared elements.** The Ben Nevis illustration is a keeper. The photographic-looking mountain icon, flame for total items and thin outline sock do not read as one icon family. Keep the primary action and progress hierarchy. Evidence: [capture](review/coherence-audit/01-home.jpg).
- **3 · Mountains — Keep.** The three illustrated cards are clear and distinctive. Preserve this screen. A small basket greeting or card-entry motion could add life without competing with the destinations. Evidence: [capture](review/coherence-audit/03-mountains.jpg).
- **4 · Ben Nevis · climb — Composition polish.** The foreground, distant mountain and sock have different scale and rendering cues. Use one trail camera, light direction and ground contact rule. The in-scene checkpoint label and separate Checkpoints control compete. Evidence: [capture](review/coherence-audit/04-ben-nevis-climb.jpg).
- **4 · Ben Nevis · overview — Scale polish.** The large character reads as standing on a miniature mountain. Treat the overview as a map: a consistent player marker and legible checkpoint symbols; reserve the expressive large basket for close-up gameplay. Evidence: [capture](review/coherence-audit/05-ben-nevis-overview.jpg).
- **4 · Fuji · overview — Scale polish / preview only.** Terrain identity is clear. The remote socks become too small to read as game targets. Establish a minimum visible marker size without making their bases look like giant boulders. Evidence: [capture](review/coherence-audit/11-fuji-overview.jpg).
- **4 · Fuji · climb — Composition polish / preview only.** Basket, marker and foreground need the same camera and ground plane. Its information card differs from Ben Nevis. Carry one scene interface across all three mountains. Evidence: [capture](review/coherence-audit/12-fuji-climb.jpg).
- **4 · Everest · overview — Scale polish / preview only.** Distinct rock and snow palette works. Small markers and the oversized foreground player still mix map and close-up conventions. Evidence: [capture](review/coherence-audit/13-everest-overview.jpg).
- **4 · Everest · climb — Composition polish / preview only.** The sock looks like a small separate prop rather than a rewarding destination. Align its cloth, pole, base, shadow and distance with the basket and trail. Evidence: [capture](review/coherence-audit/14-everest-climb.jpg).
- **5 · Active session — Strengthen the main game moment.** Simulated audit session, separate browser origin. Banking items is clear, but the scenery is constrained to a card and the front-facing pose repeats. Keep timer and controls clear; let the climb carry more of the visual story. Evidence: [capture](review/coherence-audit/17-session-audit-data.jpg).
- **6 · Bank a batch — Keep / light polish.** Simulated count of 25. The count, activity choice and metres are understandable. Use shared button/icon styling and shorter secondary copy. This is manual entry, not AI counting. Evidence: [capture](review/coherence-audit/18-batch-audit-data.jpg).
- **7 · Checkpoint reached — High-priority reward gap.** Simulated 25 items / 250 m. The status line announces the checkpoint, while the scene immediately labels the next one. A clear arrival beat is missing. The code has a short hop; screenshots do not prove motion quality. Evidence: [capture](review/coherence-audit/19-checkpoint-audit-data.jpg).
- **8 · Session results — Keep structure / improve payoff.** Simulated session. Mascot, confetti and totals already exist. Five badges were earned in this audit sequence but no new-badge reveal appeared. Show earned badge art and a concise next step; reduce repeated slogans. Evidence: [capture](review/coherence-audit/21-results-audit-data.jpg).
- **9 · Badges — Keep artwork.** The badge artwork is a strong reusable asset. Locked and earned tiles can look too similar because some locked badges remain coloured. Make state and progress clearer without redesigning the badges. Evidence: [capture](review/coherence-audit/06-badges.jpg).
- **9 · Badge detail — High-priority reward gap.** An earned badge opens as text only. Show the large badge itself, earned status and one short line. A first-time reveal should feel distinct from reopening an existing badge. Evidence: [capture](review/coherence-audit/07-badge-detail.jpg).
- **10 · Profile — Light polish.** Clear name and progress summary; no need for another scenic redesign. Reuse the agreed icon family and checkpoint component, and give the mascot a resting rather than repeated walking pose. Evidence: [capture](review/coherence-audit/08-profile.jpg).
- **10 · Session history — Light polish.** The real saved active session is visible. The sparse history is understandable; group entries and use a modest journal identity. Do not fill the empty space with arbitrary decoration. Evidence: [capture](review/coherence-audit/09-history.jpg).
- **Appendix · Camera setup — Parked.** Camera-off state only. It is outside the selected manual demo path. Preserve it without investing in this prototype during the visual polish pass; no camera permission or physical test performed. Evidence: [capture](review/coherence-audit/10-camera-parked.jpg).
- **Responsive · Reported overlap — Confirmed defect.** At 685 × 764, the card wrapper shrinks to about 261 px but its artwork remains 350 px high. Stats start before the artwork ends, hiding icons and totals. Fix the wrapper/scroll sizing contract, not the artwork. Evidence: [capture](review/coherence-audit/16-home-overlap.jpg).
- **Responsive · Narrow home — Confirmed defect.** At 320 × 740 the same overlap hides the top of the stats. No horizontal overflow is required for this to fail: future checks must also detect element overlap and hidden content. Evidence: [capture](review/coherence-audit/24-home-narrow.jpg).
- **Responsive · Everest landscape — Composition polish.** The layout fits but the large information box, credits strip and navigation compete with the scene. Preserve controls while giving the trail and checkpoint a clearer hierarchy. Evidence: [capture](review/coherence-audit/15-everest-landscape.jpg).
- **Responsive · Session landscape — Good structure / scene polish.** Simulated audit session. Side-by-side scene and controls are useful. Keep this layout; improve the shared scene, arrival feedback and icon family rather than redesigning the whole screen. Evidence: [capture](review/coherence-audit/20-session-landscape-audit-data.jpg).
- **Evidence · Finished history — Observed.** The separate simulated 25-item session appears in history. This is visual-flow evidence, not physical laundry verification. Evidence: [capture](review/coherence-audit/22-history-audit-data.jpg).
- **Evidence · Newly earned badges — Observed.** The separate simulated session shows five earned badges. This supports the finding that earned state exists but the first-time visual reveal is missing. Evidence: [capture](review/coherence-audit/23-earned-badges-audit-data.jpg).

## Limits

Current viewport captures; off-screen content is not comprehensively audited. Camera-off only. Simulated manual UI sequence is not physical laundry validation. Contrast, screen readers, real-phone performance and full keyboard suite unchecked. Motion implementation was read; a timed recording is still needed to judge quality. No application edits, deployment or new AI work.
