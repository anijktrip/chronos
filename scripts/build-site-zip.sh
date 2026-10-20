#!/usr/bin/env bash
# Builds chronos-site.zip (the folder to upload to Cloudflare Pages) with the bundled images re-encoded a little smaller,
# so the archive stays under 30 MB. The images in the repository are not changed.
set -euo pipefail
cd "$(dirname "$0")/.."
A=src/assets/art; H=src/assets/hero; P=src/assets/portraits
restore() { for d in art hero portraits; do [ -d "src/assets/.$d-full" ] && { rm -rf "src/assets/$d"; mv "src/assets/.$d-full" "src/assets/$d"; }; done; true; }
trap restore EXIT
python3 -I scripts/optimize-images.py "$A" /tmp/zip-art "${ZIP_ART_W:-900}" "${ZIP_ART_Q:-70}"
python3 -I scripts/optimize-images.py "$H" /tmp/zip-hero "${ZIP_HERO_W:-400}" "${ZIP_HERO_Q:-68}"
python3 -I scripts/optimize-images.py "$P" /tmp/zip-port "${ZIP_PORT_W:-280}" "${ZIP_PORT_Q:-66}"
mv "$A" src/assets/.art-full; cp -r /tmp/zip-art "$A"
mv "$H" src/assets/.hero-full; cp -r /tmp/zip-hero "$H"
mv "$P" src/assets/.portraits-full; cp -r /tmp/zip-port "$P"
npm run build
rm -f chronos-site.zip
(cd dist && zip -qr ../chronos-site.zip .)
ls -la chronos-site.zip
