"""Shrinks every image in a directory for the single-file preview (which must stay under 16 MB, data: URIs included).
Usage: python3 -I scripts/optimize-images.py <src-dir> <dst-dir> <max-width> <quality>"""
import os, sys
from PIL import Image

src, dst, max_w, q = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
os.makedirs(dst, exist_ok=True)
total_in = total_out = 0
for name in sorted(os.listdir(src)):
    path = os.path.join(src, name)
    if not name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        continue
    im = Image.open(path).convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    out = os.path.join(dst, os.path.splitext(name)[0] + '.jpg')
    im.save(out, 'JPEG', quality=q, optimize=True, progressive=True)
    total_in += os.path.getsize(path); total_out += os.path.getsize(out)
print(f'{src}: {total_in/1048576:.1f} MB -> {total_out/1048576:.1f} MB')
