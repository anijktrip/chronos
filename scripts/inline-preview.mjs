// Turns dist-artifact/ into one self-contained HTML fragment (no external files) for previewing.
import fs from 'node:fs'
const dir = new URL('../dist-artifact/', import.meta.url)
const js = fs.readFileSync(new URL('app.js', dir), 'utf8').replace(/<\/script/gi, '<\\/script')
const css = fs.readFileSync(new URL('app.css', dir), 'utf8').replace(/<\/style/gi, '<\\/style')
const out = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chronos</title>\n<style>${css}</style></head>\n<body><div id="root"></div>\n<script type="module">${js}</script></body></html>\n`
fs.writeFileSync(new URL('preview.html', dir), out)
console.log('preview.html', (out.length / 1048576).toFixed(2), 'MB')
