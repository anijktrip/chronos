import type { Entity, EntityType, RelationType } from '@/types'
import { getEntity, getRelationships, relationsOf, requireEntity, RELATION_META, type ResolvedRelation } from './repo'

export type EdgeKind = RelationType | 'place' | 'theme'

export interface GNode { id: string; entity: Entity; depth: number; hidden: number }
export interface GEdge { id: string; source: string; target: string; kind: EdgeKind; note: string; derived: boolean; label: string }

export interface GraphOptions {
  focus: string
  depth: 1 | 2
  entityTypes: EntityType[]
  relationTypes: RelationType[]
  showPlaces: boolean
  showThemes: boolean
  /** Progressive disclosure: at depth 2, show at most this many new neighbours per depth-1 node. */
  perNode: number
}

export const ALL_RELATION_TYPES = Object.keys(RELATION_META) as RelationType[]

function visibleNeighbours(id: string, o: GraphOptions): ResolvedRelation[] {
  return relationsOf(id, o.relationTypes).filter((r) => o.entityTypes.includes(r.other.type) || r.other.id === o.focus)
}

export function buildGraph(o: GraphOptions): { nodes: GNode[]; edges: GEdge[] } {
  const focus = requireEntity(o.focus)
  const nodes = new Map<string, GNode>()
  const edges = new Map<string, GEdge>()

  const addEdge = (r: ResolvedRelation, ownerId: string) => {
    const e: GEdge = {
      id: r.rel.id, source: r.rel.from, target: r.rel.to, kind: r.rel.type, note: r.rel.note + (r.rel.qualifier ? ` (${r.rel.qualifier})` : ''),
      derived: false, label: RELATION_META[r.rel.type].label,
    }
    if (!edges.has(e.id)) edges.set(e.id, e)
    void ownerId
  }

  nodes.set(focus.id, { id: focus.id, entity: focus, depth: 0, hidden: 0 })
  const first = visibleNeighbours(focus.id, o)
  for (const r of first) {
    if (!nodes.has(r.other.id)) nodes.set(r.other.id, { id: r.other.id, entity: r.other, depth: 1, hidden: 0 })
    addEdge(r, focus.id)
  }

  if (o.depth === 2) {
    const seeds = [...nodes.values()].filter((n) => n.depth === 1)
    for (const seed of seeds) {
      const cand = visibleNeighbours(seed.id, o).filter((r) => r.other.id !== focus.id)
      // prefer already-visible nodes (draws links between neighbours), then new ones by connectedness
      const known = cand.filter((r) => nodes.has(r.other.id))
      const fresh = cand.filter((r) => !nodes.has(r.other.id)).sort((a, b) => relationsOf(b.other.id).length - relationsOf(a.other.id).length)
      known.forEach((r) => addEdge(r, seed.id))
      fresh.slice(0, o.perNode).forEach((r) => {
        nodes.set(r.other.id, { id: r.other.id, entity: r.other, depth: 2, hidden: 0 })
        addEdge(r, seed.id)
      })
    }
  }

  // how many connections each node still has that are not on screen
  for (const n of nodes.values()) {
    const all = visibleNeighbours(n.id, o)
    n.hidden = all.filter((r) => !nodes.has(r.other.id)).length
  }

  // optional derived layers: geographic and thematic taxonomy (not relationship records)
  const derive = (kind: 'place' | 'theme', ids: (e: Entity) => string[], limit: number) => {
    const counts = new Map<string, string[]>()
    for (const n of [...nodes.values()]) for (const id of ids(n.entity)) counts.set(id, [...(counts.get(id) ?? []), n.id])
    const picks = [...counts.entries()].filter(([, who]) => who.length >= 2 || who.includes(focus.id)).sort((a, b) => b[1].length - a[1].length).slice(0, limit)
    for (const [id, who] of picks) {
      const ent = getEntity(id)
      if (!ent) continue
      if (!nodes.has(id)) nodes.set(id, { id, entity: ent, depth: 2, hidden: 0 })
      for (const w of who) {
        const eid = `d-${kind}-${w}-${id}`
        edges.set(eid, { id: eid, source: w, target: id, kind, derived: true, label: kind === 'place' ? 'is geographically associated with' : 'is tagged with theme', note: kind === 'place' ? 'Geographic association recorded on the entity (not a relationship record).' : 'Theme tag recorded on the entity (not a relationship record).' })
      }
    }
  }
  if (o.showPlaces) derive('place', (e) => e.places, 5)
  if (o.showThemes) derive('theme', (e) => e.themes, 5)

  return { nodes: [...nodes.values()], edges: [...edges.values()] }
}

/** Breadth-first path between two entities over explicit relationship records. */
export function findPath(a: string, b: string, maxHops = 6): ResolvedRelation[] | null {
  if (a === b) return []
  const prev = new Map<string, { from: string; r: ResolvedRelation }>()
  const queue = [a]
  const seen = new Set([a])
  while (queue.length) {
    const cur = queue.shift() as string
    if (cur === b) break
    for (const r of relationsOf(cur)) {
      if (seen.has(r.other.id)) continue
      seen.add(r.other.id)
      prev.set(r.other.id, { from: cur, r })
      queue.push(r.other.id)
    }
  }
  if (!prev.has(b)) return null
  const path: ResolvedRelation[] = []
  let cur = b
  while (cur !== a) {
    const step = prev.get(cur) as { from: string; r: ResolvedRelation }
    // re-express from the walker’s perspective (from → cur)
    path.unshift({ ...step.r, other: getEntity(cur) as Entity, dir: step.r.rel.from === step.from ? 'out' : 'in', phrase: step.r.rel.from === step.from ? RELATION_META[step.r.rel.type].label : RELATION_META[step.r.rel.type].inverse })
    cur = step.from
  }
  return path.length > maxHops ? null : path
}

export const degree = (id: string) => getRelationships().filter((r) => r.from === id || r.to === id).length
