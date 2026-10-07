# Visual refinement assets — 8 October 2026

Built-in imagegen produced individual illustrations/materials from the approved
app board. Runtime exports are WebP (Pillow compression only). The approval is for
the reference direction, not automatic approval of these integrated assets.

| Runtime asset | Purpose / source |
| --- | --- |
| `public/art/ben-nevis-welcome-refined.webp` | Static welcome illustration; source PNG in `source-art/ben-nevis-welcome-refined.png`. No mascot, UI or progress baked into the landscape. |
| `public/art/ben-nevis-home-refined.webp` | Square editorial Ben Nevis home art; generated source `exec-65dd86a5-3d92-4a81-9b92-9411b7a10d3d.png`. Existing basket is layered in React. |
| `public/art/trail-icons-refined.webp` | Four-icon atlas, generated source `exec-abe521f2-ee09-4f49-b28d-a65802d5413e.png`. Restrained dimensional basket, sculpted slate mountain, flame and star medal. Mountain was simplified following owner feedback; no final icon approval claimed. |
| `public/textures/ben-nevis-overview-refined.webp` | Registered ground material; see `overview-refined-prompt.txt`. Numeric terrain and mapped land cover remain authoritative. |
| `public/textures/ben-nevis-wide-refined.webp` | Registered wide-camera material; see `wide-refined-prompt.txt` and numeric control image. |
| `public/art/overview-foreground-refined.webp` | True-alpha decorative rocks/heather frame; see `overview-foreground-prompt.txt`. Separate from measured terrain. |

Generated source IDs refer to the task's local imagegen output directory under
`C:/Users/Nicow/.codex/generated_images/01a10e15-87f3-7733-89bc-9a6bfa161c59/`.
The home/welcome brief was richly illustrated adult Highland adventure scenery,
recognisable broad Ben Nevis, clear atmospheric layers and purple heather framing,
without interface or character pixels. This is a summary, not a verbatim prompt.

One further overview material candidate was evaluated and rejected as too marginal:
it retained repetitive grass marks and did not close the reference gap. It is not
loaded by the app. No further unbounded image-generation loop was used.
