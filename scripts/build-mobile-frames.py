"""Build the cropped, lighter frame sequence used by the hero animation on phones.

The desktop frames are 1584x1056 with the device always in the right half, so a
portrait screen would show it tiny and off-centre. This crops every frame to the
union of the subject's bounds (plus padding), so the crop never shifts between
frames, then downsizes and re-encodes as lossy WebP with alpha.

Re-run after replacing anything in public/animations/canvas:
    python scripts/build-mobile-frames.py
Requires Pillow. The frame count is read from content/animation-config.ts.
"""

import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "animations" / "canvas"
TARGET = ROOT / "public" / "animations" / "canvas-mobile"
CONFIG = ROOT / "content" / "animation-config.ts"
PREFIX = "living-canvas-"
WIDTH = 720
PADDING = 16
ALPHA_THRESHOLD = 24

frame_count = int(re.search(r"frameCount:\s*(\d+)", CONFIG.read_text()).group(1))
frames = [SOURCE / f"{PREFIX}{index:04d}.webp" for index in range(1, frame_count + 1)]

left, top, right, bottom = 10**9, 10**9, 0, 0
for path in frames:
    image = Image.open(path)
    bounds = image.getchannel("A").point(lambda value: 255 if value > ALPHA_THRESHOLD else 0).getbbox()
    if bounds:
        left, top = min(left, bounds[0]), min(top, bounds[1])
        right, bottom = max(right, bounds[2]), max(bottom, bounds[3])

source_width, source_height = Image.open(frames[0]).size
box = (max(0, left - PADDING), max(0, top - PADDING), min(source_width, right + PADDING), min(source_height, bottom + PADDING))
height = round(WIDTH * (box[3] - box[1]) / (box[2] - box[0]))

TARGET.mkdir(parents=True, exist_ok=True)
for stale in TARGET.glob(f"{PREFIX}*.webp"):
    stale.unlink()
total = 0
for path in frames:
    output = TARGET / path.name
    Image.open(path).crop(box).resize((WIDTH, height), Image.LANCZOS).save(output, "WEBP", quality=80, method=6, alpha_quality=90)
    total += output.stat().st_size

print(f"{len(frames)} frames -> {TARGET.relative_to(ROOT)} ({WIDTH}x{height}, {total / 1024 / 1024:.1f} MB)")
print(f"crop box in source pixels: {box}")
