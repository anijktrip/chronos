#!/usr/bin/env bash
# Builds dist-artifact/preview.html: one self-contained file with fonts and images inlined.
# Artwork images are temporarily swapped for smaller copies (restored afterwards) so the file fits the 16 MB limit.
set -euo pipefail
cd "$(dirname "$0")/.."
ART=src/assets/art; FULL=src/assets/.art-full; PORT=src/assets/portraits; PFULL=src/assets/.portraits-full
HERO=src/assets/hero; HFULL=src/assets/.hero-full
restore() {
  if [ -d "$HFULL" ]; then rm -rf "$HERO"; mv "$HFULL" "$HERO"; fi
  if [ -d "$FULL" ]; then rm -rf "$ART"; mv "$FULL" "$ART"; fi
  if [ -d "${PFULL:-x}" ]; then rm -rf "$PORT"; mv "$PFULL" "$PORT"; fi
}
trap restore EXIT
python3 -I scripts/optimize-images.py "$ART" /tmp/art-opt "${ART_MAX_W:-1000}" "${ART_Q:-72}"
PORT=src/assets/portraits; PFULL=src/assets/.portraits-full
python3 -I scripts/optimize-images.py "$PORT" /tmp/port-opt "${PORT_MAX_W:-300}" "${PORT_Q:-68}"
python3 -I scripts/optimize-images.py "$HERO" /tmp/hero-opt "${HERO_MAX_W:-360}" "${HERO_Q:-60}"
mv "$HERO" "$HFULL"; cp -r /tmp/hero-opt "$HERO"
mv "$ART" "$FULL"; cp -r /tmp/art-opt "$ART"
mv "$PORT" "$PFULL"; cp -r /tmp/port-opt "$PORT"
npx vite build -c vite.artifact.config.ts
node scripts/inline-preview.mjs
