# Laundry Mountain demo

The approved composition is **LaundryMountain-Landscape-Edit**: 1,314 frames at 30 fps, 1920 × 1080, **43.8 seconds**. The owner accepted this visual edit. Music and narration were added separately for the YouTube submission.

## Preview and render

This is a separate Remotion project; installing it is optional and does not affect the app.

```sh
cd trailer
npm ci
npm run dev -- --no-open --port=5190
```

The approved render uses a locally licensed Arial Black emphasis font, stored locally as `public/fonts/summit-block.ttf`. That OS font is deliberately not redistributed. Before previewing/rendering, place your own licensed Arial Black font at that path. The app's Nunito Sans fonts and OFL licence are included. The actual logo is an image, not reconstructed text.

```sh
npx remotion render LaundryMountain-Landscape-Edit out/laundry-mountain-final-silent.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --concurrency=3
```

Exports are ignored by Git. The delivered silent MP4 was fully decoded and played through in the shared browser: 43.8 seconds, 1,314 frames, 22,325,195 bytes. The selected sunset end card is preserved; the combined phone cover is a separate asset.

## Current files

- `src/ProductStory.tsx`: approved edit, timing and animated titles.
- `src/PhotoWalkthrough.tsx`: explicitly labelled photo-counting concept, styled to match the app.
- `public/recordings/polished/`: trimmed real gameplay from isolated, labelled demo profiles.
- `public/art/owner-selected-closing.png`: approved sunset ending.
- `cover/laundry-mountain-combined-final.png`: cover showing home, Mount Fuji climbing and an earned badge.
- `VOICEOVER-ELEVENLABS.txt`: narration text.
- `VOICEOVER-43S-CUES.md`: exact scene windows and suggested narration blocks.
- `current-story-handoff.md`: approved edit and verification record.

`Root.tsx` also preserves earlier compositions for reference. Earlier cuts use personal recordings that are excluded from Git and therefore are not fully reproducible from a fresh clone. They are not the submission edit.

## Media and recording

Current polished takes were recorded from actual app interactions in isolated browser profiles, including Start/Bank clicks, earned rewards, saved trail and all three summits. Progress is illustrative demo data, not a record of physically verified laundry.

The optional capture recipes in `../tests/demo-*-capture.spec.ts` are excluded from default regression runs. See `../playwright.capture.config.ts` to run them explicitly; they start the isolated app on port 5194. `prepare-polished-clips.mjs` uses the locally installed Windows Remotion FFmpeg to trim those recordings. Raw recordings and intermediate files remain local; the finished takes are committed.

The concept art was generated for this demo. `public/laundry-room-free-attempt.mp4` is the single authorised free motion-transfer take. Before/after photo estimates remain a labelled proposed feature; there is no implemented AI counter. Personal source recordings, local review evidence and exports are excluded from Git.

Historical production notes are retained in `../docs/archive/trailer-readme-before-submission.md`. Preserve the approved composition when making packaging changes.
