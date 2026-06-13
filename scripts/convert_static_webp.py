#!/usr/bin/env python3
"""
One-off: convert heavy static PNG/JPEG images in frontend/public/images to WebP.
Resizes to max width 1600px. Writes <name>.webp next to the original.
Run from repo root: python3 scripts/convert_static_webp.py
"""
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRS = [
    os.path.join(ROOT, "frontend/public/images/blog-img"),
    os.path.join(ROOT, "frontend/public/images/service-img"),
]
MAX_W = 1600
QUALITY = 80


def convert(path):
    img = Image.open(path)
    img = ImageOps.exif_transpose(img)
    if img.width > MAX_W:
        ratio = MAX_W / float(img.width)
        img = img.resize((MAX_W, int(img.height * ratio)), Image.LANCZOS)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    out = os.path.splitext(path)[0] + ".webp"
    img.save(out, format="WEBP", quality=QUALITY, method=6)
    o, n = os.path.getsize(path), os.path.getsize(out)
    print(f"{os.path.basename(path)}: {o//1024}KB -> {n//1024}KB")


for d in DIRS:
    if not os.path.isdir(d):
        continue
    for name in os.listdir(d):
        if name.lower().endswith((".png", ".jpg", ".jpeg")):
            convert(os.path.join(d, name))
