# Product demo edit — 9 October

This supersedes the rejected 21.8-second correction sample. The user explicitly
requested a complete product story, three mountains, actual screens in motion,
explanatory on-screen copy and a before/after photo-counting concept. Remotion is
confirmed as the editing tool. Do not switch to Rust, Rive or Canva.

Target order:
1. The pile has been there since Tuesday.
2. Basky takes it personally.
3. Introduce Laundry Mountain: conquer your pile, one load at a time.
4. Start the actual session.
5. Before photo, after photo, suggested count and correction (labelled concept).
6. Confirm 25 items, see +250 metres and the actual walk.
7. Reach Into the glen and earn a real badge.
8. Show the saved illustrated trail.
9. After further example loads, reach Ben Nevis summit and unlock Fuji.
10. Show Fuji's real trail and landscape gameplay.
11. Show Everest's real trail and landscape gameplay.
12. Show the actual Everest summit reward.
13. Cinematic Basky climbing the pile, then the owner-selected sunset closing artwork.

Sources: ProductStory.tsx and PhotoWalkthrough.tsx. The live composition ID remains
LaundryMountain-Landscape-Edit so the owner's open tab updates. Historical short
cut is retained as LaundryMountain-Short-Review. Production/app visuals unchanged.

Recording: tests/demo-story-capture.spec.ts uses separate local browser contexts,
real UI manual submissions and real reward/unlock operations. Main portrait demo
profile is labelled Demo climber with is_demo: true. No owner browser data changed.
These are illustrative demo loads, not physical detection or real-user activity.
Later-load progress is editorially separated from the initial 25-item example.

The first long capture stalled on an earned badge appearing after Finish; waiting
for the application's delayed dialog before continuing fixed the capture flow.
Portrait journey and 25-item landscape recording now passed. Source reward and
mountain frames were inspected. Automatic photo counting is still unimplemented;
its animated proposal is labelled in the film and does not claim shipped AI.

Music/voiceover remain deferred at the owner's request. Creative approval pending.
