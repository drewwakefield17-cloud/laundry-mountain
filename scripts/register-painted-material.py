"""Register a painted surface to its unchanged terrain guide before UV baking.

Image generation occasionally moves the skyline. Only material sampling is
warped: each column's first painted ground point maps to the measured silhouette,
and the bottom of the frame stays fixed. The original DEM and depth mask remain
the only geometry authority. This is offline asset tooling, not a browser effect.
"""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image

source, guide, output = map(Path, sys.argv[1:4])
control = np.array(Image.open(guide).convert('RGB'))
h, w = control.shape[:2]
paint = np.array(Image.open(source).convert('RGB').resize((w, h), Image.Resampling.LANCZOS))

def skyline(image):
    # All guides and these ground-only paints use an empty pale mint background.
    # Compare against each column's top swatch; require a run to ignore specks.
    background = np.median(image[:12], axis=0)
    ground = np.linalg.norm(image.astype(float) - background[None], axis=2) > 38
    sustained = ground[:-3] & ground[1:-2] & ground[2:-1] & ground[3:]
    present = sustained.any(axis=0)
    top = sustained.argmax(axis=0).astype(float)
    top[~present] = h - 1
    return top

actual, painted = skyline(control), skyline(paint)
delta = actual - painted
# Smooth tiny brush-edge detection noise, never the terrain itself.
delta = np.convolve(np.pad(delta, (4, 4), mode='edge'), np.ones(9)/9, mode='valid')
delta = np.clip(delta, -h*.12, h*.12)
yy, xx = np.indices((h,w))
position = np.clip((yy-actual[None]) / np.maximum(1,h-1-actual[None]),0,1)
sample_y = np.clip(yy-delta[None]*(1-position),0,h-1)
lo = sample_y.astype(int); hi = np.minimum(lo+1,h-1); t = sample_y-lo
registered = (paint[lo,xx]*(1-t[...,None])+paint[hi,xx]*t[...,None]).astype('uint8')
output.parent.mkdir(parents=True,exist_ok=True)
Image.fromarray(registered).save(output)
metrics = {'source':str(source),'guide':str(guide),'output':str(output),
           'width':w,'height':h,'median_shift_px':round(float(np.median(delta)),2),
           'max_shift_px':round(float(np.abs(delta).max()),2),
           'geometry_changed':False}
output.with_suffix('.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps(metrics))
