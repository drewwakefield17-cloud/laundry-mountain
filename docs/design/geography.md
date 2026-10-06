# Ben Nevis geographic foundation

The owner's 6 October correction makes geographic identity a requirement. The
reference board controls the illustration and interface style; its Snowdon
silhouette must not be passed off as Ben Nevis.

## Data and reproducibility

- Elevation: public Mapzen / Tilezen Terrain Tiles, zoom 12 Terrarium data.
- Decode metres as R Ã— 256 + G + B / 256 âˆ’ 32768. Bilinearly resample at 50 m.
- Local origin: 56.803Â° N, 5.036Â° W. East/north positions and height use kilometres.
- 261 Ã— 261 height samples cover 13 Ã— 13 km. Grid resolution is not a claim of
  50 m positional or vertical survey accuracy. No elevation exaggeration,
  synthetic ridges or replacement summit height is applied.
- OpenStreetMap API extract bbox: west âˆ’5.09, south 56.785, east âˆ’4.998,
  north 56.827. Mountain Path relation 4004229 supplies the connected path from
  the visitor-centre area to the summit. Its mapped horizontal length is 7.892 km.
- Path progress is resampled by horizontal arc length. 1,345 Laundry Metres are
  game units, not 1,345 actual metres of walking or measured ascent.
- Source URLs and SHA-256 hashes: `geography-sources.json`.
- Rebuild with `python scripts/build-geography.py` (Pillow required). The script
  uses cached source files in ignored `artifacts/geography` when available.

## Rendering

Canvas 2D renders actual mesh triangles using surface-normal lighting and small
painted material samples. It does not use a flattened mountain image. Path,
player, checkpoint markers and zoom use the same projection. A single uniform
viewport scale prevents portrait/landscape resizing from changing proportions.
Terrain rendering is cached while the player moves. The route camera is at local x = -5.35 km, z = 1.74 km, 0.9 km above sampled
ground, looking toward the mapped summit. The scenic camera uses the recorded
Torlundy viewpoint of Geograph photo 5029113: local x = -0.926 km, z = 5.503 km,
2 m above sampled ground, looking toward the North Face.
The material pass rasterises the unchanged mesh with perspective-correct world
coordinates, painted rock/meadow detail and per-pixel mapped land cover. A depth
buffer resolves visible terrain and hides tree sprites behind intervening slopes.
A soft ink contour traces real occlusion edges. Painted fractures are artistic
surface detail, not surveyed geology. A small four-entry backdrop cache reuses
completed scenery between screens; route/player rendering remains independent.
Home, onboarding and live medallions use the scenic perspective, while the route
map fits the complete mapped climb. All framing uses a single uniform scale. Portrait framing shifts the
whole scene upward; it does not stretch the mesh.

Mapped woodland polygons select forest ground cover. Tree sprites occur only in
those polygons below 550 m; their 15â€“27 m world height is illustrative. Woods can
be mixed species, so these small tree marks do not claim botanical accuracy.
The lochan and River Nevis are mapped features. Small streams are omitted at this
view scale. Seasonal snow and live vegetation are not represented. Land cover
outside the OSM extract is approximate; the elevation mesh remains sourced.

## Source references and credits

- [Ben Nevis from near Torlundy — Nigel Brown](https://www.geograph.org.uk/photo/5029113)
  was visually inspected to check the broad plateau, North Face cliffs and lower
  planted woodland. It is a reference, not a production texture or background.

- [John Muir Trust â€” Ben Nevis](https://www.johnmuirtrust.org/about-us/where-we-work/ben-nevis)
  grounds the local landscape context.
- [Walkhighlands â€” Mountain Path](https://www.walkhighlands.co.uk/fortwilliam/bennevis.shtml)
  provides a cross-check of the lochan approach and upper switchbacks.
- [Tilezen format](https://github.com/tilezen/joerd/blob/master/docs/formats.md)
  and [attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).
- OSM-derived route/features: Â© OpenStreetMap contributors, ODbL.
- Elevation attribution: Europe terrain data produced using Copernicus data and
  information funded by the European Union â€” EU-DEM layers; global GMTED2010 and
  SRTM data courtesy of USGS; United Kingdom terrain data Â© Environment Agency
  copyright and/or database right 2015. All rights reserved.
- In-product credits and downloadable derived data are at
  `/terrain-credits.html` and `/data/ben-nevis.json`.

## Acceptance status

This replaces the generic geometry. It is not a claim that the illustrated art
finish now matches the reference board, nor that real-phone folding detection
has passed. The other five mountains now have separate elevation-based selection
and detail previews following the request to finish the screens first. Playable
routes and progression on those mountains remain deferred.


## Locked expedition previews

`build-expedition-previews.py` creates five independent 129 x 129 grids from
Terrarium data. Extents, resolutions and source hashes are recorded in
`expedition-preview-sources.json`. The grids are served at `/data/fuji.json`,
`/data/matterhorn.json`, `/data/kilimanjaro.json`, `/data/denali.json` and
`/data/everest.json`. Each uses its own geographic coordinates and a coherent
viewpoint. These are cropped views with equal horizontal and vertical units.
Snow and vegetation colours are illustrative seasonal treatments, not surveyed
ice or woodland boundaries. Small summits are smoothed by the grid resolution.
These previews are not complete playable mountain environments.

## Refined cliffs and illustrated surface materials

`build-crag-detail.py` samples zoom 13 Terrarium tiles into a 141 x 141, 25 m grid
covering local x 0–3.5 km and z -1.5–2 km. `crag-detail-sources.json` records the
source URLs/hashes. The 50 m outer mesh omits cells replaced by this refinement;
fine heights blend to the outer source within a 50 m boundary band. No height
exaggeration or invented peaks are applied. A unit check covers all four seams.
Grid spacing is not survey accuracy; height fields cannot represent overhangs.

Paint is attached to world coordinates. The 13 km north-up ground atlas supplies
broad groups. `build-view-material.py` produces terrain-only route and North Face
guides from the same camera/geometry, then inverse-projects illustrated surface
paint onto a 3072 x 3072 atlas covering x -4–6 km, z -2–6 km. Visibility/depth masks
exclude hidden ground. Alpha fades the source view boundaries so a wider viewport
does not expose a rectangular material boundary. Code still draws the geometry,
atmosphere, mapped land cover, woodland sprites, route, player and camera framing.
Mapped water/woodland masks remain authoritative over generated material colours.
Painted fissures, boulders, plants and lighting are illustrative, not surveyed
geological or botanical features. Current paint style remains rejected by the owner.

`build-preview-material.py` applies the same principle independently to each locked
mountain's own orthographic mesh; each uses a separate 1024 x 1024 world material.
The six-degree camera tilt and equal kilometre axes preserve terrain proportions.
Cream foreground mist softens finite data edges without adding geographic ground.
Snow and vegetation paint remains an illustrative seasonal treatment.

Large pines/boulders at the Ben Nevis viewport edge are decorative illustration
framing, separate from the depth-tested mapped woodland. They are not mapped
features or a claim of their location/physical scale. Trail portraits, flags and
labels are screen-space game markers, so zoom does not enlarge them beyond usability.

Landscape references:
- https://www.fujisan-climb.jp/en/
- https://www.sac-cas.ch/en/huts-and-tours/sac-route-portal/matterhorn-1138/alpinism/
- https://www.tanzaniaparks.go.tz/kilimanjaro
- https://www.nps.gov/dena/learn/nature/glaciers.htm
- https://trade.ntb.gov.np/tourist-destination/everest-region-2/

Everest's game target rounds 8,848.86 m to 8,849 Laundry Metres. Denali retains
the name agreed in the brief. Additional elevation attribution: ArcticDEM DEMs
were created from DigitalGlobe imagery and funded under NSF awards 1043681,
1559691 and 1542736. 3DEP data courtesy of the US Geological Survey.
