# Chronos — Global Art History (prototype)

An interactive learning platform for global art history. **Explore → Connect → Understand → Learn.**
React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · React Router (hash routing) · d3-force (graph layout only). English and Greek.

## Quick start

Requires **Node.js 20 or newer** (22 recommended; `.node-version` pins 22).

```bash
npm install          # or: npm ci   (uses package-lock.json)
npm run dev          # http://localhost:5173
npm run validate     # data integrity: unique ids, every reference resolves
npm run build        # type-checks, then builds the static site into dist/
npm run preview      # serves dist/ locally at http://localhost:4173
```

The built site is plain static files with relative paths and hash routing (`#/…`), so it runs from any static host or sub-folder. It needs no server, no environment variables and no secrets.

## Deploying to Cloudflare Pages (automatic deploys from GitHub)

1. Put this project at the **root** of a GitHub repository (the files in this folder, not a folder containing them).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, and choose the repository.
3. Use these settings:

| Setting | Value |
|---|---|
| Framework preset | **None** (or **Vite**, if it is offered: the two settings below are the same) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |
| Environment variable (optional) | `NODE_VERSION` = `22` (the `.node-version` file already asks for it) |

4. Save and deploy. Every push to the production branch builds and publishes automatically; other branches get preview URLs.

There are no redirect rules to configure: the app uses hash routing, so deep links such as `/#/artists/saul-bass` work without a `_redirects` file.

## Languages

The header, mobile menu and footer carry an EN / ΕΛ switch. The choice is stored in the browser (`chronos:lang`) and the page reloads in the chosen language, keeping the `#/route`. First visit: Greek if the browser language is Greek, otherwise English. UI strings live in `src/i18n/el/*` (English text is the key); Greek content overlays live in `src/data/el/*`. Run `npx tsx scripts/check-i18n.ts` to see any untranslated UI string.

## Continuing development with Claude (from another account)

Everything needed is inside this folder: source, data, images, fonts, build configuration and the notes in `CLAUDE.md` (which Claude Code reads automatically). Nothing depends on a particular Claude session.

1. **Create the repository.** On GitHub create a new empty repository, then upload this folder's contents to its root (web upload, or `git init && git add . && git commit -m "Chronos" && git branch -M main && git remote add origin <url> && git push -u origin main`).
2. **Connect Claude.** In the other Claude account open Claude Code (claude.ai/code or the desktop app), connect GitHub and choose the new repository. Claude reads `CLAUDE.md` first, so it knows the conventions, the checks to run and the rules about content and licences.
3. **Connect Cloudflare Pages** to the same repository (see the section above). From then on, every push to the production branch deploys by itself.
4. **A good first message** to Claude: *"Read CLAUDE.md and README.md, run npm install, npm run validate and npm run build, and tell me when everything passes. Then I will ask for changes."*
5. **Before each push**, ask Claude to run the four checks listed in `CLAUDE.md` (data validation, type-check, Greek-string check, build). Ask it to work on a branch and to open a pull request if you want to review changes before they go live.

The data scripts in `scripts/` need internet access to Wikimedia and Wikidata; the site itself never does (all images are bundled), so the build and the live site work offline.

> **Everything in this prototype is sample content.** About 900 records — 25 hand-written pages and
> the rest structured *index* records — each marked `status.level = 'sample'` and shown as such in the UI. Nothing has been
> scholarly-reviewed. References are *starting points to verify against* (standard works and
> holding-institution collection sites) — they are not claim-level footnotes.

## Images and licences — read this

* **Artworks.** About 200 works carry a bundled image in `src/assets/art/<artwork-id>.jpg`, with credit and licence in `src/data/image-credits.json`.
  Most come from Wikimedia Commons files tagged public domain, CC0, CC BY or CC BY-SA. A few were supplied by the project owner; their credit line says so.
  Works that are still in copyright (for example Picasso's *Guernica*, Dalí's *The Persistence of Memory*, Warhol's *Campbell's Soup Cans*) are kept as records
  **without** an image: the page says so and links to the museum (`image.restricted` in `src/types`). Artworks with no image at all are not listed anywhere.
  **Check each image's licence before publishing publicly**, in particular the works supplied by the project owner and the Edward Hopper works.
* **Artist works and links.** Every artist page has a *Works* section: a gallery of licence-checked Commons images where the artist died in 1955 or earlier, plus links to the artist's own
  website (where one exists), WikiArt (only where the page exists), Wikimedia Commons and Wikipedia. Data: `src/data/artist-works.json`, produced by `scripts/find-works.ts` and `scripts/find-links.ts`
  (hand-checked websites are in `scripts/artist-sites.json`).
* **Movement examples.** Each movement page has an *Examples* section from `src/data/movement-works.json` (`scripts/find-movement-works.ts`).
* **Artist portraits.** `scripts/find-portraits.ts` takes an artist's Wikidata image only after checking that the item is a human whose birth year agrees with our record, then checks the licence on Commons.
  No portrait is ever invented or substituted.
* **Fonts.** Albert Sans (titles, open licence) and Aeonik Pro Light/Regular (body and UI, and Greek titles), bundled from `src/assets/fonts`. Aeonik Pro is a commercial typeface: confirm the licence covers web use before publishing.
* The data scripts call Wikimedia and Wikidata and are deliberately slow (one request at a time, `Retry-After` honoured). Run them with `NODE_USE_ENV_PROXY=1 npx tsx scripts/<name>.ts` when behind a proxy. They are only needed to refresh data, never to build the site.

## Architecture

```
src/
  types/            Domain model (entities, relationships, quiz, paths)
  data/             CONTENT ONLY. One file per entity family + relationships + learning
    index.ts        the only module that knows where content comes from
  lib/
    repo.ts         single read API over content (pages never import raw arrays)
    graph.ts        relationship graph: ego networks, progressive disclosure, path-finding
    search.ts       index, scoring, nine combinable filters, URL (de)serialisation
    progress.ts     localStorage store (useSyncExternalStore): attempts, steps, saved, viewed
    time.ts images.ts
  components/
    layout/         Header (mega-menu), mobile menu, SearchDialog, Footer, nav config
    ui/             cards, badges, reveal, SectionNav, image plate, icons, hooks
    timeline/       Timeline (full + preview), minimap, detail card, list view
    graph/          ConnectionsGraph (d3-force layout, tweened), PathFinder
    quiz/           QuizPlayer (5 question kinds), MiniQuiz
    templates/      ArtworkViewer (zoom), LifeTimeline, SpanBar, WorldMap, RelationList
  pages/            Route-level screens
scripts/            validate-data.ts · find-portraits.ts · fetch-portraits.mjs · fetch-images.mjs · wm.mjs · inline-preview.mjs
```

**Two depths of content.** *Full* records are hand-written (`traditions.ts`, `movements.ts`, `movements-full.ts`, `artists.ts`, `artworks.ts` …).
*Index* records are generated from compact tables — `movement-index.ts` (one line per movement, school, collective, tradition or style) and
`artist-index.ts` (one line per artist, from the 400-entry master list) — and carry classification, dates, origin, taxonomy section, movement tags and
editorial flags but no prose. They are real entities in the same graph, so relationships, search and filters work on them; pages show only what exists.
`DATA-AUDIT.md` documents the normalisation (duplicates, corrections, classification decisions, gaps).

**Swapping in a CMS/database:** re-implement the arrays exported by `src/data/index.ts` (fetch,
GraphQL, SQL — same shapes) and `lib/repo.ts` stays as it is. Relationships are explicit records
(`{id, type, from, to, note, qualifier?}`); nothing is duplicated on entity pages. Places and themes are
*attributes* (taxonomy), which the graph can layer in as clearly-labelled derived edges.

### Routes (hash-based)

| Route | Screen |
|---|---|
| `/` | Home |
| `/explore/coverage` | Coverage & gaps: statistics computed from the data, plus an open list of gaps |
| `/explore` · `/explore/timeline` · `/explore/geography[/:region]` · `/explore/periods[/:slug]` · `/explore/browse` (`/search`) | Explore |
| `/movements[?kind=&section=&domain=&region=&full=1&q=][/:slug]` | Movements, schools & traditions: taxonomy directory + 19-part page template (only appropriate sections shown) with an interactive network |
| `/artists[?section=&era=&gender=&kind=&region=&movement=&profiles=1&q=]` · `/artists/relationships` · `/artists/:slug` | Artist directory, 11-section profile and compact index-record page |
| `/artworks` · `/artworks/compare?a=&b=` · `/artworks/:slug` | Artworks, comparison, viewer |
| `/connections?focus=` · `/connections/events\|exchanges\|themes[/:slug]` · `/places/:slug` | Connections + shared context template |
| `/learn` · `/learn/path/:id` · `/learn/quizzes` · `/learn/quiz/:id\|practice?entity=\|review` · `/learn/progress` · `/learn/saved` | Learn |

### Data model

Entities (`id`, `slug`, `type`, `title`, `summary`, `dates {start,end,approx,label}`, `regions`, `places`, `themes`, `tags`, `sources`, `status`):
tradition · movement · style · **school** · **collective** · artist (individual / workshop / collective / anonymous) · artwork · event · exchange · theme · place · period (shared era / regional).
Years are signed integers (−221 = 221 BCE); `approx` softens the bar edges on the timeline; `end: null` means ongoing.
Relationship types: influenced by · collaborated with · studied under · developed from · reacted against · associated with ·
created by · cultural exchange · exemplifies · shaped by · depicts · **part of** — each with a direction, an inverse phrase and a required `note`.
Learning: `Question` (5 kinds, each with `entityRefs` + a learning `objective`) → `Quiz` (a list of question ids) → `LearningPath`.

### Design system

Brand palette (see `src/index.css`): White `#ECE9E9`, Black `#1D2121`, Volt `#B9ED00`, Lean `#7182CB`, Heat `#FF6716`, Grey `#CECECE`. Each entity type has a fill colour with a text colour that passes contrast
on it (white text on Tradition, Movement, Style, Place and Period; dark text on the lighter fills) and a deep variant for coloured text on white. Type is identified by colour and name, not by icon.
Titles use Albert Sans (Aeonik Pro in Greek), body text uses Aeonik Pro. Page side padding steps up with the screen: 200 px at 1920 wide, 240 px at 2560.
Motion: page fade, scroll reveals, the hero carousel, tweened graph layout, timeline panning — all disabled under `prefers-reduced-motion`.

### Accessibility

Skip link, landmarks, visible focus, keyboard operation for every control (timeline entries are buttons; graph nodes are
focusable; a text alternative for the graph and a list view for the timeline), accessible quiz feedback (`aria-live`),
no hover-only functionality, alt text required on every artwork (enforced by `validate`). axe-core (WCAG 2.2 AA tags)
was run over 16 key pages with no remaining violations at desktop width.

## What works

Taxonomy of ~208 movements, schools, collectives and traditions, 408 artist records, about 200 artworks, 26 historical events and ~1,100 documented relationships · Coverage & gaps page · Homepage (all 8 sections, interactive) · zoomable/pannable/pinchable timeline with 10 lanes, region + type filters, hover
previews, detail panel, minimap, list view · year slider + map · movement/artist/artwork/context templates ·
connections map (depth, relationship + kind filters, derived place/theme layers, focus, path-finder) · artwork compare ·
search (global dialog + 9 combinable filters in the URL) · 7 quizzes + per-subject practice + review of misses · progress,
saved items and path completion stored locally.

## Known limitations

- Sample dataset only; not reviewed. Specific claims flagged in-record (e.g. the Inka tunic's exact object) need verification.
- The world map is an abstract hand-simplified locator, not a cartographic source.
- Dense lanes at full zoom-out show marker-only entries (label on hover/focus); zoom or use list view for detail.
- Timeline drag/pinch and the artwork viewer were exercised in headless Chromium, not on physical touch devices.
- No automated test suite yet beyond `npm run validate` and the browser smoke scripts used during the build.
