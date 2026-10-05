# Laundry Mountain

An event-built MVP turning physical laundry activity into mountain progress.

## Current scope: Phase 1

Folding camera/calibration spike first. Ben Nevis (1,345 m) is the first gameplay environment. Hanging and ironing share the future event contract but are not validated modes. No physical accuracy claim is made until the product owner tests real laundry on a phone.

## Development

Use Node 22.12+ or 24, then `npm ci`, `npm run dev`. `npm run check` runs deterministic tests and a production build. Camera use on a phone requires HTTPS; a plain LAN HTTP URL is insufficient.

## Integrity

Only new milestone commits with real timestamps. Never amend, backdate, rebase, squash or force-push. No pre-existing Laundry Mountain implementation is imported. Normal open-source dependencies are recorded in package-lock.json.

## Acceptance order

1. Real folding test: target 18/20 correct detections, zero duplicates, zero events in a two-minute negative control.
2. Ben Nevis: camera event → metres → visible movement → save → leave → restore.
3. Cloud persistence, then hanging and ironing completion workflows.
4. Additional mountain environments and secondary product screens.

Any seeded community records must include `is_demo: true` and be labelled as demo profiles in the UI. Phase 1 has no community seed data.
