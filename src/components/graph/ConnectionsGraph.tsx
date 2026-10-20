import { forceCollide, forceLink, forceManyBody, forceRadial, forceSimulation, forceX, forceY, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { t } from '@/i18n'
import type { Entity, EntityType, RelationType } from '@/types'
import { ALL_RELATION_TYPES, buildGraph, findPath, type EdgeKind, type GEdge, type GNode } from '@/lib/graph'
import { allEntities, entityPath, getEntity, isMovementLike, regionName, relationsOf, RELATION_META, TYPE_LABEL } from '@/lib/repo'
import { formatDate } from '@/lib/time'
import { ArtworkImage } from '../ui/ArtworkImage'
import { FilterLayout } from '../ui/FilterLayout'
import { useElementSize, usePrefersReducedMotion } from '../ui/hooks'
import { ArrowRight, Reset } from '../ui/Icons'
import { SaveButton } from '../ui/SaveButton'
import { heroOfAny } from '../ui/heroOf'
import { TypeBadge } from '../ui/TypeBadge'
import { TYPE_VAR, typeFill } from '../ui/typeStyles'

/* ------------------------------------------------------------------ */
/* Visual language                                                     */
/* ------------------------------------------------------------------ */

const DASH: Record<EdgeKind, string> = {
  influenced_by: '', studied_under: '', developed_from: '', created_by: '', exemplifies: '',
  reacted_against: '7 4', associated_with: '1.5 4.5', cultural_exchange: '9 3 2 3', shaped_by: '3 3', depicts: '11 3', part_of: '',
  collaborated_with: '', place: '1 4', theme: '1 4',
}
const WIDTH: Record<EdgeKind, number> = {
  influenced_by: 1.8, studied_under: 2.2, developed_from: 2, created_by: 1.2, exemplifies: 1.2, reacted_against: 1.8, associated_with: 1.4,
  cultural_exchange: 1.8, shaped_by: 1.6, depicts: 1.6, part_of: 1.6, collaborated_with: 2.4, place: 1, theme: 1,
}

const ENTITY_GROUPS: { id: string; label: string; types: EntityType[] }[] = [
  { id: 'movement', label: t('Movements & traditions'), types: ['movement', 'tradition', 'style', 'school', 'collective'] },
  { id: 'artist', label: t('Artists'), types: ['artist'] },
  { id: 'artwork', label: t('Artworks'), types: ['artwork'] },
  { id: 'event', label: t('Events'), types: ['event'] },
  { id: 'exchange', label: t('Exchanges'), types: ['exchange'] },
]

function Shape({ type, r, filled = true }: { type: EntityType; r: number; filled?: boolean }) {
  const color = TYPE_VAR[type]
  // filled: a coloured body with a thin halo in the stage colour (so overlapping nodes stay distinct); outer nodes are hollow
  const common = filled
    ? { fill: color, stroke: 'rgb(15 18 18 / .7)', strokeWidth: 1.6, strokeLinejoin: 'round' as const }
    : { fill: 'rgb(var(--surface))', stroke: color, strokeWidth: 3, strokeLinejoin: 'round' as const }
  return <circle r={r} {...common} />
}

/* ------------------------------------------------------------------ */
/* Layout (d3-force, computed synchronously then tweened)              */
/* ------------------------------------------------------------------ */

interface SimNode extends SimulationNodeDatum { id: string; depth: number; r: number }
type Pos = Map<string, { x: number; y: number }>

const radius = (n: GNode) => (n.depth === 0 ? 22 : n.depth === 1 ? 14 : 10)

function computeLayout(nodes: GNode[], edges: GEdge[], W: number, H: number, prev: Pos): Pos {
  const cx = W / 2, cy = H / 2
  const m = Math.min(W, H)
  const r1 = m * (W < 520 ? 0.27 : 0.3)
  const r2 = Math.min(W * 0.44, m * 0.47)
  const simNodes: SimNode[] = nodes.map((n, i) => {
    const p = prev.get(n.id)
    const ang = (i / Math.max(nodes.length, 1)) * Math.PI * 2
    const rr = n.depth === 0 ? 0 : n.depth === 1 ? r1 : r2
    return { id: n.id, depth: n.depth, r: radius(n), x: p?.x ?? cx + Math.cos(ang) * rr, y: p?.y ?? cy + Math.sin(ang) * rr, ...(n.depth === 0 ? { fx: cx, fy: cy } : {}) }
  })
  const links: SimulationLinkDatum<SimNode>[] = edges.map((e) => ({ source: e.source, target: e.target }))
  const sim = forceSimulation(simNodes)
    .force('link', forceLink<SimNode, SimulationLinkDatum<SimNode>>(links).id((d) => d.id).distance(r1 * 0.9).strength(0.08))
    .force('charge', forceManyBody().strength(-260))
    .force('collide', forceCollide<SimNode>((d) => d.r + (W < 520 ? 24 : 34)))
    .force('radial', forceRadial<SimNode>((d) => (d.depth === 0 ? 0 : d.depth === 1 ? r1 : r2), cx, cy).strength(0.95))
    .force('x', forceX(cx).strength(0.015))
    .force('y', forceY(cy).strength(0.02))
    .stop()
  for (let i = 0; i < 280; i++) sim.tick()
  const padX = W < 520 ? 44 : 70, padY = 34
  const out: Pos = new Map()
  simNodes.forEach((n) => out.set(n.id, { x: Math.min(Math.max(n.x ?? cx, padX), W - padX), y: Math.min(Math.max(n.y ?? cy, padY), H - padY - 10) }))
  return out
}

/** Eases displayed positions toward the target layout so changes read as movement, not a jump. */
function useTweened(target: Pos, reduced: boolean): Pos {
  const [cur, setCur] = useState<Pos>(target)
  const curRef = useRef<Pos>(target)
  useEffect(() => {
    if (reduced) { curRef.current = target; setCur(target); return }
    const from = new Map(curRef.current)
    const start = performance.now()
    const dur = 650
    let raf = 0
    const step = (t: number) => {
      const k = Math.min((t - start) / dur, 1)
      const e = 1 - Math.pow(1 - k, 3)
      const next: Pos = new Map()
      target.forEach((to, id) => {
        const f = from.get(id) ?? to
        next.set(id, { x: f.x + (to.x - f.x) * e, y: f.y + (to.y - f.y) * e })
      })
      curRef.current = next
      setCur(next)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, reduced])
  return cur
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

interface Props {
  defaultFocus: string
  /** Preset filters (e.g. the artist-relationships view). */
  presetEntityGroups?: string[]
  presetRelations?: RelationType[]
  lockEntityGroups?: boolean
  heading?: string
  /** Embedded preview: hides filters, legend and text alternative. */
  compact?: boolean
}

export function ConnectionsGraph({ defaultFocus, presetEntityGroups, presetRelations, lockEntityGroups, heading = t('Connections map'), compact }: Props) {
  const reduced = usePrefersReducedMotion()
  const [sp, setSp] = useSearchParams()
  const [localFocus, setLocalFocus] = useState<string | null>(null)
  const focusParam = sp.get('focus')
  const focus = !compact && focusParam && getEntity(focusParam) ? focusParam : localFocus ?? defaultFocus

  const [groups, setGroups] = useState<string[]>(presetEntityGroups ?? ENTITY_GROUPS.map((g) => g.id))
  const [rels, setRels] = useState<RelationType[]>(presetRelations ?? ALL_RELATION_TYPES)
  const [depth, setDepth] = useState<1 | 2>(1)
  const [places, setPlaces] = useState(false)
  const [themes, setThemes] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [hoverEdge, setHoverEdge] = useState<string | null>(null)

  const entityTypes = useMemo(() => ENTITY_GROUPS.filter((g) => groups.includes(g.id)).flatMap((g) => g.types), [groups])
  const graph = useMemo(
    () => buildGraph({ focus, depth, entityTypes: [...entityTypes, ...(places ? (['place'] as EntityType[]) : []), ...(themes ? (['theme'] as EntityType[]) : [])], relationTypes: rels, showPlaces: places, showThemes: themes, perNode: 4 }),
    [focus, depth, entityTypes, rels, places, themes],
  )

  useEffect(() => setSelected(null), [focus])

  const [boxRef, box] = useElementSize<HTMLDivElement>()
  const W = Math.max(box.width, 300)
  const H = compact ? (box.width < 560 ? 440 : 480) : box.width < 560 ? 520 : 600
  const prev = useRef<Pos>(new Map())
  const target = useMemo(() => {
    const p = computeLayout(graph.nodes, graph.edges, W, H, prev.current)
    prev.current = p
    return p
  }, [graph, W, H])
  const pos = useTweened(target, reduced)

  const setFocus = (id: string) => {
    if (compact) { setLocalFocus(id); return }
    const next = new URLSearchParams(sp)
    next.set('focus', id)
    setSp(next, { replace: true })
  }
  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]))
  const selNode = selected ? nodeById.get(selected) : undefined
  const focusEntity = getEntity(focus) as Entity
  const incident = selected ? new Set(graph.edges.filter((e) => e.source === selected || e.target === selected).map((e) => e.id)) : new Set<string>()
  const hovered = hoverEdge ? graph.edges.find((e) => e.id === hoverEdge) : undefined

  const reset = () => {
    setGroups(presetEntityGroups ?? ENTITY_GROUPS.map((g) => g.id)); setRels(presetRelations ?? ALL_RELATION_TYPES); setDepth(1); setPlaces(false); setThemes(false)
  }

  const label = (e: Entity, n: GNode) => {
    const max = box.width < 520 ? (n.depth === 0 ? 20 : 15) : n.depth === 0 ? 30 : 24
    return e.title.length > max ? e.title.slice(0, max - 1).trimEnd() + '…' : e.title
  }

  const controls = (
        <div className="space-y-5">
        <div>
          <label htmlFor="focus-input" className="label mb-2 block">{t('Focus on')}</label>
          <input
            id="focus-input" list="focus-list" className="field" defaultValue={focusEntity.title} key={focus}
            placeholder={t('Type to find an entity…')} aria-describedby="focus-hint"
            onChange={(e) => {
              const hit = allEntities().find((x) => x.title.toLowerCase() === e.target.value.toLowerCase() && x.type !== 'place' && x.type !== 'period')
              if (hit) setFocus(hit.id)
            }}
          />
          <datalist id="focus-list">
            {allEntities().filter((e) => e.type !== 'place' && e.type !== 'period').map((e) => <option key={e.id} value={e.title}>{TYPE_LABEL[e.type]}</option>)}
          </datalist>
          <p id="focus-hint" className="mt-2 text-xs text-muted">{t('Choose from the suggestions, or click any node and use “Make focus”.')}</p>
        </div>

        <div className="space-y-4">
          {!lockEntityGroups && (
            <fieldset>
              <legend className="label mb-2">{t('Show these kinds')}</legend>
              <div className="flex flex-wrap gap-1.5">
                {ENTITY_GROUPS.map((g) => (
                  <button key={g.id} type="button" className="chip chip-type" style={typeFill(g.types[0])} aria-pressed={groups.includes(g.id)} onClick={() => toggle(groups, g.id, setGroups)}>
                    {g.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend className="label mb-2">{t('Relationship types')} <span className="normal-case tracking-normal">{t('— the line style tells them apart')}</span></legend>
            <div className="flex flex-wrap gap-1.5">
              {ALL_RELATION_TYPES.map((t) => (
                <button key={t} type="button" className="chip" aria-pressed={rels.includes(t)} onClick={() => toggle(rels, t, setRels)} title={RELATION_META[t].description}>
                  <svg width="22" height="8" aria-hidden><line x1="1" y1="4" x2="21" y2="4" stroke="currentColor" strokeWidth={WIDTH[t]} strokeDasharray={DASH[t]} /></svg>
                  {RELATION_META[t].directed ? RELATION_META[t].label.replace(/^(was |is )/, '') : RELATION_META[t].label.replace(/^is /, '')}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-1.5" role="group" aria-label={t('How far to reach')}>
              <span className="label mr-1">{t('Reach')}</span>
              <button type="button" className="chip" aria-pressed={depth === 1} onClick={() => setDepth(1)}>{t('Direct links')}</button>
              <button type="button" className="chip" aria-pressed={depth === 2} onClick={() => setDepth(2)}>{t('Links of links')}</button>
            </div>
            <div className="flex items-center gap-1.5" role="group" aria-label={t('Extra layers')}>
              <span className="label mr-1">{t('Layers')}</span>
              <button type="button" className="chip" aria-pressed={places} onClick={() => setPlaces(!places)}>{t('Places')}</button>
              <button type="button" className="chip" aria-pressed={themes} onClick={() => setThemes(!themes)}>{t('Themes')}</button>
            </div>
            <button type="button" className="chip border-transparent" onClick={reset}><Reset size={14} /> {t('Reset filters')}</button>
          </div>
        </div>
        </div>
  )

  const mapEl = (
        <div>
          <div ref={boxRef} className="relative overflow-hidden rounded-[1.75rem] bg-surface" style={{ height: H, backgroundImage: 'radial-gradient(rgb(var(--ink) / .13) 1px, transparent 1.3px)', backgroundSize: '22px 22px' }}>
            <svg width={W} height={H} role="group" aria-label={t('Connections around {title}: {nodes} nodes, {links} links. A text version follows the map.', { title: focusEntity.title, nodes: graph.nodes.length, links: graph.edges.length })} className="block">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5" fill="none" stroke="rgb(var(--ink) / .5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></marker>
                <marker id="arr-hi" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5" fill="none" stroke="rgb(var(--ink))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></marker>
              </defs>

              {/* edges */}
              <g>
                {graph.edges.map((e) => {
                  const a = pos.get(e.source), b = pos.get(e.target)
                  const na = nodeById.get(e.source), nb = nodeById.get(e.target)
                  if (!a || !b || !na || !nb) return null
                  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1
                  // a gentle bow (always to the same side of the line) so links read as soft arcs rather than ruled lines
                  const bow = Math.min(34, len * 0.14) * (e.id.charCodeAt(e.id.length - 1) % 2 ? 1 : -1)
                  const cx = (a.x + b.x) / 2 - (dy / len) * bow, cy = (a.y + b.y) / 2 + (dx / len) * bow
                  const sx = cx - a.x, sy = cy - a.y, sl = Math.hypot(sx, sy) || 1
                  const ex = b.x - cx, ey = b.y - cy, el = Math.hypot(ex, ey) || 1
                  const x1 = a.x + (sx / sl) * (radius(na) + 3), y1 = a.y + (sy / sl) * (radius(na) + 3)
                  const x2 = b.x - (ex / el) * (radius(nb) + 5), y2 = b.y - (ey / el) * (radius(nb) + 5)
                  const d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`
                  const directed = e.derived ? false : RELATION_META[e.kind as RelationType].directed
                  const hi = incident.has(e.id) || hoverEdge === e.id
                  const dim = selected ? !incident.has(e.id) : false
                  const mx = 0.25 * x1 + 0.5 * cx + 0.25 * x2, my = 0.25 * y1 + 0.5 * cy + 0.25 * y2
                  return (
                    <g key={e.id} opacity={dim ? 0.14 : 1} style={{ transition: 'opacity .25s' }}>
                      <path d={d} fill="none" stroke="rgb(var(--ink))" strokeLinecap="round" strokeOpacity={hi ? 0.9 : e.derived ? 0.24 : 0.42} strokeWidth={hi ? WIDTH[e.kind] * 0.75 + 0.9 : WIDTH[e.kind] * 0.7}
                        strokeDasharray={DASH[e.kind] || undefined} markerEnd={directed ? (hi ? 'url(#arr-hi)' : 'url(#arr)') : undefined}
                        className={reduced ? '' : 'fade-in'} />
                      <path d={d} fill="none" stroke="transparent" strokeWidth={16} onMouseEnter={() => setHoverEdge(e.id)} onMouseLeave={() => setHoverEdge(null)}
                        onClick={() => setSelected(selected === e.source ? e.target : e.source)} style={{ cursor: 'pointer' }} />
                      {hi && !e.derived && (
                        <text x={mx} y={my - 7} textAnchor="middle" fontSize={11} fill="rgb(var(--ink))" stroke="rgb(var(--surface))" strokeWidth={5} paintOrder="stroke" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>{e.label}</text>
                      )}
                    </g>
                  )
                })}
              </g>

              {/* nodes */}
              <g>
                {[...graph.nodes].sort((a, b) => b.depth - a.depth).map((n) => {
                  const p = pos.get(n.id)
                  if (!p) return null
                  const isSel = selected === n.id
                  const adjacent = selected ? incident.size > 0 && graph.edges.some((e) => incident.has(e.id) && (e.source === n.id || e.target === n.id)) : true
                  const ty = n.entity.type
                  const r = radius(n)
                  return (
                    <g key={n.id} transform={`translate(${p.x},${p.y})`} opacity={selected && !adjacent && !isSel ? 0.3 : 1} style={{ transition: 'opacity .25s' }}
                      role="button" tabIndex={0} aria-pressed={isSel}
                      aria-label={[n.entity.title, TYPE_LABEL[ty], ...(n.depth === 0 ? [t('current focus')] : []), ...(n.hidden ? [t('{n} more connections', { n: n.hidden })] : [])].join(', ')}
                      onClick={() => setSelected(isSel ? null : n.id)}
                      onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); setSelected(isSel ? null : n.id) } }}
                      className="cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100">
                      {n.depth === 0 && <circle r={r + 15} fill="rgb(var(--volt))" opacity={0.4} />}
                      <circle className="ring opacity-0" r={r + 8} fill="none" stroke="rgb(var(--ink))" strokeWidth={1.5} />
                      {isSel && <circle r={r + 7} fill="none" stroke="rgb(var(--ink))" strokeWidth={1.5} />}
                      <circle r={r + 12} fill="transparent" />
                      <g style={{ filter: 'drop-shadow(0 2px 5px rgb(29 33 33 / .22))' }}><Shape type={ty} r={r} filled={n.depth < 2 || ty === 'place' || ty === 'theme' ? n.depth < 2 : false} /></g>
                      {n.hidden > 0 && (
                        <g transform={`translate(${r + 5},${-r - 4})`} aria-hidden>
                          <rect x={-(6 + String(n.hidden).length * 3.2)} y={-8} width={12 + String(n.hidden).length * 6.4} height={16} rx={8} fill="rgb(var(--ink))" />
                          <text textAnchor="middle" dy={3.4} fontSize={9.5} fill="rgb(var(--volt))" fontWeight={500}>+{n.hidden}</text>
                        </g>
                      )}
                      <text y={r + 17} textAnchor="middle" fontSize={n.depth === 0 ? 14 : 12} fontWeight={n.depth === 0 ? 500 : 400} fill="rgb(var(--ink))"
                        stroke="rgb(var(--surface))" strokeWidth={5} strokeLinejoin="round" paintOrder="stroke" style={{ pointerEvents: 'none', fontFamily: 'inherit', letterSpacing: '-0.01em' }}>{label(n.entity, n)}</text>
                    </g>
                  )
                })}
              </g>
            </svg>

            {graph.nodes.length === 1 && (
              <div className="pointer-events-none absolute inset-x-0 top-[58%] mx-auto max-w-xs text-center text-sm text-muted">{t('No connections match the current filters. Turn on more relationship types or kinds.')}</div>
            )}
            {hovered && (
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 max-w-md rounded-2xl bg-night p-4 text-sm text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] pop-in" role="status">
                <p className="font-medium">{(getEntity(hovered.source) as Entity).title} <span className="font-normal text-volt">{hovered.label}</span> {(getEntity(hovered.target) as Entity).title}</p>
                <p className="mt-1 text-white/70">{hovered.note}</p>
              </div>
            )}
          </div>

          {!compact && <Legend />}
          {!compact && <TextAlternative focusId={focus} edges={graph.edges} onFocus={setFocus} />}
        </div>
  )

  if (compact) {
    return (
      <section aria-label={heading}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {mapEl}
        <aside aria-label={t('Selected node')} className="lg:sticky lg:top-24 lg:self-start">
          <Preview entity={(selNode ?? nodeById.get(focus))?.entity ?? focusEntity} isFocus={!selNode || selNode.id === focus} onFocus={setFocus} edges={graph.edges} />
        </aside>
        </div>
      </section>
    )
  }

  return (
    <section aria-label={heading}>
      <FilterLayout id="g-filters" panel={controls}>
        {mapEl}
        <aside aria-label={t('Selected node')} className="mt-6">
          <Preview wide entity={(selNode ?? nodeById.get(focus))?.entity ?? focusEntity} isFocus={!selNode || selNode.id === focus} onFocus={setFocus} edges={graph.edges} />
        </aside>
      </FilterLayout>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Legend() {
  const shown: EntityType[] = ['movement', 'artist', 'artwork', 'event', 'exchange']
  return (
    <details className="mt-3 text-sm" open>
      <summary className="label cursor-pointer py-2">{t('How to read the map')}</summary>
      <div className="grid gap-4 border-t border-rule py-3 sm:grid-cols-2">
        <ul className="grid grid-cols-2 gap-2">
          {shown.map((ty) => (
            <li key={ty} className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="-12 -12 24 24" aria-hidden><Shape type={ty} r={6.5} /></svg>
              <span>{ty === 'movement' ? t('Movement · tradition · school') : TYPE_LABEL[ty]}</span>
            </li>
          ))}
          <li className="col-span-2 text-xs text-muted">{t('Hollow outer nodes are links-of-links. “+N” marks connections not shown yet — click the node, then “Make focus”.')}</li>
        </ul>
        <p className="text-xs leading-relaxed text-muted">
          {t('Arrows follow the sentence: {example}. Plain lines (collaboration, association, exchange) have no direction. Only documented relationships are drawn — two things sharing a century is never enough.').split('{example}').flatMap((part, i) => (i === 0 ? [part] : [<em key="ex">A —{t('was influenced by')}→ B</em>, part]))}
        </p>
      </div>
    </details>
  )
}

function TextAlternative({ focusId, edges, onFocus }: { focusId: string; edges: GEdge[]; onFocus: (id: string) => void }) {
  const f = getEntity(focusId) as Entity
  const rels = relationsOf(focusId).filter((r) => edges.some((e) => e.id === r.rel.id))
  return (
    <details className="mt-1 text-sm">
      <summary className="label cursor-pointer py-2">{t('Read the connections as text ({n})', { n: rels.length })}</summary>
      <ul className="divide-y divide-rule border-y border-rule">
        {rels.length === 0 && <li className="py-3 text-muted">{t('No connections with the current filters.')}</li>}
        {rels.map((r) => (
          <li key={r.rel.id} className="py-3">
            <span className="font-medium">{f.title}</span> <span className="text-muted">{r.phrase}</span>{' '}
            <button type="button" className="link-u font-medium" onClick={() => onFocus(r.other.id)}>{r.other.title}</button>
            <span className="mt-1 block text-muted">{r.rel.note}{r.rel.qualifier ? ` (${r.rel.qualifier})` : ''}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}

function Preview({ entity, isFocus, onFocus, edges, wide = false }: { entity: Entity; isFocus: boolean; onFocus: (id: string) => void; edges: GEdge[]; wide?: boolean }) {
  const hero = heroOfAny(entity)
  const rels = relationsOf(entity.id).filter((r) => edges.some((e) => e.id === r.rel.id)).slice(0, 5)
  return (
    <div className={`overflow-hidden rounded-[1.75rem] bg-surface ${wide ? 'sm:grid sm:grid-cols-[16rem_minmax(0,1fr)]' : ''}`}>
      {hero && <ArtworkImage artwork={hero} width={600} ratio={wide ? 0.85 : 1.7} className={`!rounded-none ${wide ? 'min-w-0 sm:!aspect-auto sm:!h-full sm:min-h-[16rem] sm:w-full' : ''}`} />}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <TypeBadge type={entity.type} />
          <span className="label">{isFocus ? t('Focus') : t('Selected')}</span>
        </div>
        <h2 className="mt-2 font-serif text-3xl leading-tight">{entity.title}</h2>
        <p className="mt-1 text-sm text-muted">{formatDate(entity.dates)}{entity.regions[0] ? ` · ${regionName(entity.regions[0])}` : ''}</p>
        <p className="mt-3 text-sm leading-relaxed">{entity.summary}</p>
        {rels.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-rule pt-3 text-xs leading-relaxed">
            {rels.map((r) => (
              <li key={r.rel.id}><span className="text-muted">{r.phrase}</span> <strong className="font-medium">{r.other.title}</strong> — {r.rel.note}</li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {!isFocus && entity.type !== 'place' && entity.type !== 'theme' && (
            <button type="button" className="btn btn-ghost" onClick={() => onFocus(entity.id)}>{t('Make focus')}</button>
          )}
          <Link to={entityPath(entity)} className="btn btn-solid">{t('Open page')} <ArrowRight size={16} /></Link>
          <SaveButton id={entity.id} title={entity.title} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* “How are these connected?”                                          */
/* ------------------------------------------------------------------ */

export function PathFinder({ onShow }: { onShow?: (id: string) => void }) {
  const options = allEntities().filter((e) => e.type !== 'place' && e.type !== 'period' && e.type !== 'theme')
  const [a, setA] = useState('artist-van-gogh')
  const [b, setB] = useState('artist-hokusai')
  const result = useMemo(() => findPath(a, b), [a, b])
  const sel = (value: string, set: (v: string) => void, id: string, label: string) => (
    <div>
      <label htmlFor={id} className="label mb-2 block">{label}</label>
      <select id={id} value={value} onChange={(e) => set(e.target.value)} className="field">
        {[[t('Movements & traditions'), options.filter(isMovementLike)], [t('Artists'), options.filter((e) => e.type === 'artist')], [t('Artworks'), options.filter((e) => e.type === 'artwork')], [t('Events & exchanges'), options.filter((e) => e.type === 'event' || e.type === 'exchange')]].map(([g, list]) => (
          <optgroup key={g as string} label={g as string}>{(list as Entity[]).map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}</optgroup>
        ))}
      </select>
    </div>
  )
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">{sel(a, setA, 'pf-a', t('From'))}{sel(b, setB, 'pf-b', t('To'))}</div>
      <div className="mt-6" aria-live="polite">
        {a === b && <p className="text-sm text-muted">{t('Choose two different entities.')}</p>}
        {a !== b && result === null && <p className="text-sm text-muted">{t('No chain of documented relationships links these two in the sample dataset. (That is a statement about the data, not about history.)')}</p>}
        {a !== b && result && (
          <ol className="relative space-y-0 border-l border-ink pl-6">
            <li className="pb-5"><span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 bg-ink" aria-hidden /><Link to={entityPath(a)} className="font-serif text-2xl link-u">{(getEntity(a) as Entity).title}</Link></li>
            {result.map((s, i) => (
              <li key={s.rel.id} className="pb-5">
                <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 bg-ink" aria-hidden />
                <p className="text-sm text-muted">{s.phrase}{s.rel.qualifier ? ` (${s.rel.qualifier})` : ''} — {s.rel.note}</p>
                <p className="mt-1 flex items-center gap-3"><Link to={entityPath(s.other)} className="font-serif text-2xl link-u">{s.other.title}</Link><TypeBadge type={s.other.type} /></p>
                {i === result.length - 1 && onShow && <button type="button" onClick={() => onShow(a)} className="btn btn-ghost mt-3">{t('Show {title} on the map', { title: (getEntity(a) as Entity).title })}</button>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
