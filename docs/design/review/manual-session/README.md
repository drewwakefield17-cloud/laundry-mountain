# Manual session evidence — 8 October 2026

Actual app captures from an isolated Playwright context. Counts of 25/28 items and
250/280 metres are software test inputs, not physical laundry detection. The shared
browser's owner progress was not credited with these fixtures.

- `session-phone.png`: immediate camera-free entry and elapsed timer.
- `confirm-phone.png`: explicit manual confirmation, activity and optional photo.
- `session-landscape.png`: active climb and controls side by side.
- `results-phone.png`: confirmed counts and saved session result.

Reproduce using `npm run test:e2e -- tests/manual-session.spec.ts`.
The tests cover batches, walking/checkpoint animation state, cancel/invalid counts,
pause/continue, reload, results/history, old field-report preservation, temporary
photo cleanup, responsive controls and recovery after a session-metadata save fails.
Unit tests verify idempotency, exact metre calculation, legacy camera rewards,
invalid persisted counts and paused timer arithmetic.

No AI counting, cloud sync, physical camera accuracy or owner visual approval is
claimed by these captures. No deployment was performed.
