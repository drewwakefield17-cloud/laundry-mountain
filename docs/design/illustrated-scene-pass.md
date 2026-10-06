# Geographic illustration integration

The current source of style is the owner's ten-screen board, with its mountain,
card and sign crops saved as `board-*-style-sample.png`. Earlier generated material
paintings were rejected as too impressionistic; added detail alone did not solve
the design-family mismatch.

## Geometry and material ownership

Ben Nevis uses the existing 13 km geographic grid and mapped Mountain Path, water
and woodland. A sourced 25 m grid refines only the summit/North Face region, with a
50 m edge blend. Heights are never stretched or manually lifted. The scenic camera
uses the verified Torlundy photographic viewpoint documented in `geography.md`.

The two `ben-nevis-*-board-style.png` paintings are ground-material inputs, not
scene backgrounds. Offline inverse projection attaches visible paint to a 3072²
north-up world patch. Depth visibility checks reject hidden surfaces. A 100 pixel
view-edge feather and straight-alpha composition prevent a rectangular boundary
when a phone rotates. OSM woodland and water retain authority over painted colours.

Each future mountain has its own elevation grid and `*-board-style.png` material
input. The shared preview renderer draws its actual mesh, depth, seasonal palette,
sky and atmosphere. Illustrative snow and crag texture are not surveyed glacier
boundaries or geological measurements. Previews remain locked, without gameplay
progression. Matterhorn now has a finer independent 257² source grid.

Individual pine, crag and enamel assets support the rendering; the timber sign
is a separate transparent illustration. The route, player, zoom, timer, rewards
and controls remain code-owned. The live/results emblem contains no wordmark.

## Reproduce the material bake

Use Python with Pillow and NumPy; these are offline tools, not browser dependencies.
Run from the existing repository:

```text
python scripts/build-view-material.py guide
python scripts/build-view-material.py guide scenic
python scripts/build-view-material.py bake docs/design/source-art/ben-nevis-route-board-style.png
python scripts/build-view-material.py bake docs/design/source-art/ben-nevis-scenic-board-style.png scenic
python scripts/build-preview-material.py fuji
python scripts/build-preview-material.py fuji docs/design/source-art/fuji-board-style.png
```

Repeat the preview pair for matterhorn, kilimanjaro, denali and everest. Projection
buffers live under ignored `artifacts/geography`; the source guides/paintings and
production WebP materials are retained. Recreate crag data only if changing its
source using `build-crag-detail.py`; provenance includes tile URLs and hashes.

## Verification and limits

Phone route controls were inspected at 390×786 and 844×390; the regression also
covers 667×375. Zoom pins retain screen dimensions. Landscape view-edge artefacts
were corrected. Actual preview dialogs and all ten core surfaces were inspected.
Live camera/results evidence is explicitly synthetic and isolated from user data.

26 unit tests and eight affected browser tests passed, with targeted capture/live
and preview follow-ups. A shared-browser home paint measured approximately 1.4 seconds on this
desktop. Preview paints now coalesce asset/resize notifications and reuse at most
ten surfaces; reopening Fuji verified a cache hit of approximately 0.1 ms. This
avoids repeated identical paints without reducing resolution. Intermediate bake
PNGs stay under ignored `artifacts/geography`, not alongside shipping source art.
Backdrops are cached, but material decoding uses significant memory;
neither hardware performance nor physical folding accuracy has been validated.
The existing build reports a large JavaScript bundle warning.

Visual approval remains blocked. The stronger blue grouped planes and wider type
are closer, but sign lettering, terrain detail/light balance and the completeness
of the forest surround still need to meet the owner's source. Rejected candidates
are retained as local working evidence; they are not production assets.
