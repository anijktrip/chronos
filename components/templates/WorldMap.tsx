import { Link } from 'react-router-dom'
import { t } from '@/i18n'
import type { RegionId } from '@/types'
import { getPlaces, getRegions } from '@/lib/repo'

/**
 * A deliberately abstract, low-polygon world map (equirectangular). It is a locator, not a
 * cartographic source: coastlines are simplified by hand and boundaries are not drawn.
 */
const W = 1000, H = 480, LAT_TOP = 84, LAT_BOT = -58
const px = (lon: number) => ((lon + 180) / 360) * W
const py = (lat: number) => ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * H
const poly = (pts: [number, number][]) => pts.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')

const LAND: [number, number][][] = [
  // North & Central America
  [[-168, 66], [-162, 70], [-141, 70], [-128, 70], [-115, 68], [-95, 72], [-85, 70], [-80, 63], [-94, 59], [-93, 54], [-82, 52], [-79, 57], [-77, 62], [-70, 60], [-60, 55], [-56, 52], [-66, 45], [-70, 42], [-76, 38], [-76, 35], [-81, 31], [-80, 26], [-84, 30], [-90, 30], [-97, 27], [-97, 22], [-92, 19], [-90, 21], [-87, 21], [-88, 16], [-84, 15], [-83, 10], [-79, 9], [-86, 11], [-92, 14], [-97, 16], [-105, 20], [-106, 23], [-112, 29], [-110, 23], [-117, 32], [-121, 35], [-124, 40], [-124, 47], [-128, 51], [-135, 58], [-145, 60], [-152, 59], [-158, 57], [-165, 54], [-158, 58], [-162, 60], [-166, 62]],
  // Greenland
  [[-73, 78], [-60, 82], [-30, 83], [-20, 78], [-20, 70], [-43, 60], [-52, 64], [-58, 75]],
  // South America
  [[-79, 9], [-72, 12], [-62, 11], [-52, 5], [-50, 0], [-44, -2], [-35, -6], [-37, -12], [-41, -22], [-48, -26], [-53, -34], [-58, -38], [-65, -41], [-66, -47], [-69, -52], [-72, -54], [-75, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -1], [-78, 3], [-77, 8]],
  // Eurasia
  [[-9, 37], [-9, 43], [-1, 44], [-4, 48], [2, 51], [8, 54], [10, 57], [12, 55], [20, 55], [24, 60], [22, 65], [30, 70], [45, 68], [60, 70], [75, 73], [100, 77], [115, 73], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [160, 53], [156, 57], [142, 59], [135, 54], [141, 48], [135, 43], [130, 42], [129, 35], [126, 35], [126, 38], [121, 40], [122, 37], [119, 35], [122, 30], [121, 25], [110, 21], [108, 17], [109, 12], [105, 9], [100, 13], [100, 8], [103, 1], [98, 8], [98, 16], [94, 17], [92, 22], [88, 22], [80, 15], [78, 8], [73, 17], [72, 22], [67, 25], [60, 25], [57, 27], [50, 30], [48, 29], [56, 25], [59, 22], [52, 16], [43, 13], [39, 21], [35, 28], [34, 31], [36, 36], [27, 37], [24, 38], [22, 36], [19, 41], [18, 40], [16, 38], [15, 40], [12, 42], [10, 44], [7, 44], [3, 43], [0, 39], [-2, 37], [-6, 36]],
  // Africa
  [[-17, 21], [-10, 30], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [35, 28], [43, 12], [51, 12], [48, 5], [40, -3], [40, -10], [35, -20], [33, -26], [28, -33], [20, -35], [18, -32], [12, -18], [13, -10], [9, -1], [10, 4], [4, 6], [-8, 4], [-13, 8], [-17, 15]],
  // Australia, NZ, Japan, Britain, Indonesia, Madagascar, Cuba
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [135, -34], [130, -32], [115, -34], [113, -26]],
  [[173, -35], [178, -38], [175, -41], [173, -39]], [[172, -41], [174, -41], [170, -46], [167, -46]],
  [[130, 31], [132, 34], [136, 35], [140, 36], [142, 40], [140, 42], [144, 43], [141, 45], [139, 40], [135, 36], [131, 34]],
  [[-5, 50], [1, 51], [2, 53], [-2, 57], [-5, 58], [-6, 56], [-3, 54], [-5, 52]],
  [[95, 5], [106, -6], [104, -5], [98, 2]], [[109, 1], [117, 7], [119, 1], [116, -4], [110, -3]], [[105, -6], [114, -8], [106, -7]],
  [[44, -25], [49, -15], [50, -13], [46, -16]], [[-85, 22], [-74, 20], [-77, 20], [-82, 23]],
]

interface Props {
  /** Region ids that have entries active at the selected year (highlighted). */
  active?: Set<RegionId>
  counts?: Partial<Record<RegionId, number>>
  highlight?: RegionId | null
  onHover?: (id: RegionId | null) => void
}

export function WorldMap({ active, counts, highlight, onHover }: Props) {
  const regions = getRegions()
  const places = getPlaces()
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label={t('Map of the ten regions. Each marker links to a region page.')}>
      {[-120, -60, 0, 60, 120].map((lo) => <line key={lo} x1={px(lo)} x2={px(lo)} y1={0} y2={H} stroke="rgb(var(--rule))" strokeWidth={0.6} />)}
      {[60, 30, 0, -30].map((la) => <line key={la} x1={0} x2={W} y1={py(la)} y2={py(la)} stroke="rgb(var(--rule))" strokeWidth={0.6} strokeDasharray={la === 0 ? undefined : '2 4'} />)}
      {LAND.map((p, i) => <polygon key={i} points={poly(p)} fill="rgb(var(--sunk))" stroke="rgb(var(--ink))" strokeOpacity={0.55} strokeWidth={0.8} strokeLinejoin="round" />)}
      {places.map((pl) => <circle key={pl.id} cx={px(pl.coordinates[0])} cy={py(pl.coordinates[1])} r={1.9} fill="rgb(var(--ink))" opacity={0.55} />)}
      {regions.map((r) => {
        const on = !active || active.has(r.id)
        const hi = highlight === r.id
        const n = counts?.[r.id] ?? 0
        const cx = px(r.anchor[0]), cy = py(r.anchor[1])
        const rad = on ? 13 + Math.min(n, 6) * 2.2 : 10
        return (
          <Link key={r.id} to={`/explore/geography/${r.id}`} aria-label={counts ? t('{name}: {n} active entries', { name: r.name, n }) : r.name}
            onMouseEnter={() => onHover?.(r.id)} onMouseLeave={() => onHover?.(null)} onFocus={() => onHover?.(r.id)} onBlur={() => onHover?.(null)} className="outline-none [&:focus-visible_.ring]:opacity-100">
            <circle className="ring opacity-0" cx={cx} cy={cy} r={rad + 6} fill="none" stroke="rgb(var(--ink))" strokeWidth={2} />
            {on && <circle cx={cx} cy={cy} r={rad + 7} fill="rgb(var(--volt))" opacity={hi ? 0.45 : 0.28} style={{ transition: 'all .4s' }} />}
            <circle cx={cx} cy={cy} r={rad} fill={on ? 'rgb(var(--volt))' : 'rgb(var(--paper))'} stroke={on ? 'rgb(var(--ink))' : 'rgb(var(--muted))'} strokeWidth={1.5} style={{ transition: 'all .4s var(--ease)', cursor: 'pointer' }} />
            {counts && on && <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill="rgb(var(--ink))" style={{ pointerEvents: 'none' }}>{n}</text>}
            <text x={cx} y={cy + rad + 14} textAnchor="middle" fontSize={11.5} fontWeight={hi ? 700 : 500} fill="rgb(var(--ink))" stroke="rgb(var(--paper))" strokeWidth={3.5} paintOrder="stroke" style={{ pointerEvents: 'none' }}>{r.short}</text>
          </Link>
        )
      })}
    </svg>
  )
}
