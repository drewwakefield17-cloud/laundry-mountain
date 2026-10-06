"""Build the offline Ben Nevis mesh from public elevation and OSM data.

Requires Python + Pillow. Run from the repository root. Cached source data lives
in ignored artifacts/geography; no network requests occur in the game itself.
See docs/design/geography.md for sources, attribution and resolution limits.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from xml.etree import ElementTree as ET
import hashlib
import heapq
import json
import math
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / 'artifacts/geography'
CACHE.mkdir(parents=True, exist_ok=True)
LAT, LON = 56.803, -5.036
KM_LAT = 111.195
KM_LON = KM_LAT * math.cos(math.radians(LAT))
SIZE, STEP, LOW = 261, 0.05, -6.5
ZOOM = 12
OSM_URL = 'https://api.openstreetmap.org/api/0.6/map?bbox=-5.09,56.785,-4.998,56.827'

def fetch(url, path):
    if not path.exists():
        with urllib.request.urlopen(url, timeout=40) as response:
            path.write_bytes(response.read())
    return path

def pixels(lat, lon):
    n = 256 * 2 ** ZOOM
    return (lon + 180) / 360 * n - .5, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - .5

def local(lat, lon):
    return [round((lon - LON) * KM_LON, 5), round((lat - LAT) * KM_LAT, 5)]

sample = []
tiles = set()
for row in range(SIZE):
    for col in range(SIZE):
        x, y = pixels(LAT + (LOW + row * STEP) / KM_LAT, LON + (LOW + col * STEP) / KM_LON)
        sample.append((x, y))
        for px, py in [(math.floor(x), math.floor(y)), (math.floor(x)+1, math.floor(y)+1)]:
            tiles.add((px // 256, py // 256))

def tile(item):
    x, y = item
    url = f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{x}/{y}.png'
    path = fetch(url, CACHE / f'terrarium-{ZOOM}-{x}-{y}.png')
    print('elevation tile', x, y, flush=True)
    return item, Image.open(path).convert('RGB'), url, hashlib.sha256(path.read_bytes()).hexdigest()

with ThreadPoolExecutor(max_workers=4) as pool:
    downloaded = list(pool.map(tile, sorted(tiles)))
images = {key: im for key, im, _, _ in downloaded}

def height(px, py):
    r, g, b = images[(px//256, py//256)].getpixel((px % 256, py % 256))
    return r*256 + g + b/256 - 32768

heights = []
for x, y in sample:
    ix, iy = math.floor(x), math.floor(y)
    a, b = x-ix, y-iy
    h = (height(ix, iy)*(1-a) + height(ix+1, iy)*a)*(1-b) + (height(ix, iy+1)*(1-a) + height(ix+1, iy+1)*a)*b
    heights.append(round(h))

osm_path = fetch(OSM_URL, CACHE / 'ben-nevis-map.osm')
root = ET.parse(osm_path).getroot()
nodes = {n.get('id'): local(float(n.get('lat')), float(n.get('lon'))) for n in root.findall('node')}
ways = {w.get('id'): w for w in root.findall('way')}
tags = lambda e: {t.get('k'): t.get('v') for t in e.findall('tag')}
relation = next(r for r in root.findall('relation') if r.get('id') == '4004229')
route_ids = [m.get('ref') for m in relation.findall('member') if m.get('type') == 'way']
graph = {}
for ident in route_ids:
    ids = [nd.get('ref') for nd in ways[ident].findall('nd')]
    for a, b in zip(ids, ids[1:]):
        distance = math.dist(nodes[a], nodes[b])
        graph.setdefault(a, []).append((b, distance))
        graph.setdefault(b, []).append((a, distance))
visitor = local(56.8101622, -5.0770317)
summit = nodes['8870212']
start = min(graph, key=lambda n: math.dist(nodes[n], visitor))
end = min(graph, key=lambda n: math.dist(nodes[n], summit))
queue, seen, previous = [(0, start)], {}, {}
while queue:
    d, n = heapq.heappop(queue)
    if n in seen: continue
    seen[n] = d
    if n == end: break
    for neighbor, distance in graph[n]:
        if neighbor not in seen and d + distance < previous.get(neighbor, (float('inf'), ''))[0]:
            previous[neighbor] = (d + distance, n)
            heapq.heappush(queue, (d + distance, neighbor))
assert end in seen, 'Mapped Mountain Path is disconnected'
node_path = [end]
while node_path[-1] != start: node_path.append(previous[node_path[-1]][1])
route = [nodes[n] for n in reversed(node_path)]
# Keep the mapped geometry, including switchbacks; do not fit a smooth spline.
if math.dist(route[-1], summit) < .025: route.append(summit)
features = []
for ident, w in ways.items():
    t = tags(w)
    kind = ('water' if t.get('natural') == 'water' else
            'wood' if t.get('natural') == 'wood' or t.get('landuse') == 'forest' else
            'river' if t.get('waterway') in ['river', 'stream'] else None)
    if kind:
        points = [nodes[n.get('ref')] for n in w.findall('nd') if n.get('ref') in nodes]
        if len(points) > 2:
            features.append({'id': ident, 'kind': kind, 'name': t.get('name', ''), 'points': points})

data = {'origin': {'latitude': LAT, 'longitude': LON}, 'grid': {'size': SIZE, 'stepKm': STEP, 'minKm': LOW},
        'heights': heights, 'route': route, 'features': features, 'summit': summit,
        'source': {'terrain': 'Tilezen / Mapzen Terrain Tiles', 'map': 'OpenStreetMap contributors', 'routeRelation': 4004229}}
out = ROOT / 'public/data'
out.mkdir(exist_ok=True)
(out/'ben-nevis.json').write_text(json.dumps(data, separators=(',', ':')), encoding='utf-8')
manifest = {'fetchedForBuild': '2026-10-06', 'terrainTiles': [{'url': url, 'sha256': sha} for _, _, url, sha in downloaded],
            'osm': {'url': OSM_URL, 'sha256': hashlib.sha256(osm_path.read_bytes()).hexdigest(), 'routeWays': route_ids},
            'gridSpacingMetres': STEP*1000, 'verticalScale': 1, 'routeLengthKm': round(seen[end], 3)}
(ROOT/'docs/design/geography-sources.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('Saved', SIZE*SIZE, 'elevations;', len(route), 'route points;', len(features), 'features; route km', round(seen[end], 3), flush=True)
