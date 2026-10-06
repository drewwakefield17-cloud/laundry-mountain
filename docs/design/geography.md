# Ben Nevis geographic foundation

The owner's 6 October correction makes geographic identity a requirement. The
reference board controls the illustration and interface style; its Snowdon
silhouette must not be passed off as Ben Nevis.

## Data and reproducibility

- Elevation: public Mapzen / Tilezen Terrain Tiles, zoom 12 Terrarium data.
- Decode metres as R × 256 + G + B / 256 − 32768. Bilinearly resample at 50 m.
- Local origin: 56.803° N, 5.036° W. East/north positions and height use kilometres.
- 261 × 261 height samples cover 13 × 13 km. Grid resolution is not a claim of
  50 m positional or vertical survey accuracy. No elevation exaggeration,
  synthetic ridges or replacement summit height is applied.
- OpenStreetMap API extract bbox: west −5.09, south 56.785, east −4.998,
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
Terrain rendering is cached while the player moves. The northwest perspective
uses a 125 degree azimuth, 23 degree downward view and an 8 km camera distance.
Five surface-lighting tones and sparse facet accents provide an illustrated
treatment without changing terrain elevations. Portrait framing shifts the
whole scene upward; it does not stretch the mesh.

Mapped woodland polygons select forest ground cover. Tree sprites occur only in
those polygons below 550 m; their 15–27 m world height is illustrative. Woods can
be mixed species, so these small tree marks do not claim botanical accuracy.
The lochan and River Nevis are mapped features. Small streams are omitted at this
view scale. Seasonal snow and live vegetation are not represented. Land cover
outside the OSM extract is approximate; the elevation mesh remains sourced.

## Source references and credits

- [John Muir Trust — Ben Nevis](https://www.johnmuirtrust.org/about-us/where-we-work/ben-nevis)
  grounds the local landscape context.
- [Walkhighlands — Mountain Path](https://www.walkhighlands.co.uk/fortwilliam/bennevis.shtml)
  provides a cross-check of the lochan approach and upper switchbacks.
- [Tilezen format](https://github.com/tilezen/joerd/blob/master/docs/formats.md)
  and [attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).
- OSM-derived route/features: © OpenStreetMap contributors, ODbL.
- Elevation attribution: Europe terrain data produced using Copernicus data and
  information funded by the European Union — EU-DEM layers; global GMTED2010 and
  SRTM data courtesy of USGS; United Kingdom terrain data © Environment Agency
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
