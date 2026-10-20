import { useMemo, type ReactNode } from 'react'
import { t } from '@/i18n'
import { formatYear } from '@/lib/time'
import type { Artist, MovementLike, RegionId } from '@/types'
import { getArtists, getMovements, getRegions, getRelationships, movementsOfArtist } from '@/lib/repo'
import { ARTIST_SECTIONS, MOVEMENT_SECTIONS } from '@/data/taxonomy'
import { useDocumentTitle } from '@/components/ui/hooks'
import { Breadcrumbs, PageHeader, SectionHeading } from '@/components/ui/Page'

/* ---------- small charts (text values always shown; bars are decoration) ---------- */

function Bars({ rows, max, unit = '' }: { rows: { label: ReactNode; value: number; note?: string }[]; max?: number; unit?: string }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={i} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_auto]">
          <span className="leading-tight">{r.label}</span>
          <span className="h-3 rounded-full bg-surface" aria-hidden><span className="block h-3 rounded-full bg-ink" style={{ width: `${Math.max(r.value ? 1.5 : 0, (r.value / top) * 100)}%` }} /></span>
          <span className="w-24 text-right tabular-nums">{r.value}{unit}{r.note && <span className="ml-1 text-muted">{r.note}</span>}</span>
        </li>
      ))}
    </ul>
  )
}

function Stat({ n, label, note }: { n: number | string; label: string; note?: string }) {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <p className="font-display text-5xl leading-none tabular-nums">{n}</p>
      <p className="mt-2 text-sm">{label}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  )
}

function Gap({ title, children, tag }: { title: string; children: ReactNode; tag: string }) {
  return (
    <li className="grid gap-x-8 gap-y-1 border-t border-rule py-5 sm:grid-cols-[11rem_1fr]">
      <p className="label pt-1">{tag}</p>
      <div><h3 className="font-display text-2xl leading-tight">{title}</h3><div className="mt-1.5 max-w-3xl leading-relaxed text-ink/85">{children}</div></div>
    </li>
  )
}

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '–')

/** Renders a translated sentence containing a `{name}` slot with a React node in that slot (keeps Greek word order free). */
const slot = (s: string, name: string, node: ReactNode) => {
  const [a, b = ''] = s.split(`{${name}}`)
  return <>{a}{node}{b}</>
}

export function CoveragePage() {
  useDocumentTitle(t('Coverage & gaps'))
  const artists = useMemo(() => getArtists(), [])
  const movements = useMemo(() => getMovements(), [])
  const regions = getRegions()
  const masterList = artists.filter((a) => a.taxonomy)

  const g = useMemo(() => {
    const count = (f: (a: Artist) => boolean) => artists.filter(f).length
    const women = count((a) => a.gender === 'woman'), men = count((a) => a.gender === 'man'), nb = count((a) => a.gender === 'non-binary or gender-diverse')
    const unrecorded = artists.length - women - men - nb
    const known = women + men + nb
    const byRegion = regions.map((r) => {
      const l = artists.filter((a) => a.regions.includes(r.id as RegionId))
      return { r, n: l.length, w: l.filter((a) => a.gender === 'woman').length, k: l.filter((a) => a.gender).length }
    })
    const order = [t('Before {year}', { year: formatYear(500) }), '500 – 1399', '1400 – 1599', '1600 – 1799', '1800 – 1859', '1860 – 1899', '1900 – 1929', t('{year} and later', { year: 1930 })]
    const bucket = (y: number) => { const i = [500, 1400, 1600, 1800, 1860, 1900, 1930].findIndex((edge) => y < edge); return order[i === -1 ? order.length - 1 : i] }
    const byEra = order.map((o) => {
      const l = artists.filter((a) => a.dates.start !== 0 && bucket(a.dates.start) === o)
      return { o, n: l.length, w: l.filter((a) => a.gender === 'woman').length }
    })
    const bySection = ARTIST_SECTIONS.map((s) => {
      const l = artists.filter((a) => a.taxonomy === s.id)
      return { s, n: l.length, w: l.filter((a) => a.gender === 'woman').length }
    })
    const womenBefore1800 = artists.filter((a) => a.gender === 'woman' && a.dates.start < 1800)
    const fewest = [...byRegion].sort((a, b) => a.n - b.n).slice(0, 3)
    const contemporary = count((a) => !!a.contemporary)
    const profiles = count((a) => a.level !== 'index')
    const lostOrCopies = artists.filter((a) => a.flags?.some((f) => /No (works|securely)|known (only|mainly)|later copies/i.test(f)))
    const dup = artists.filter((a) => a.flags?.some((f) => /Listed twice/.test(f)))
    const approx = count((a) => !!a.dates.approx)

    const untagged = artists.filter((a) => a.taxonomy && movementsOfArtist(a.id).length === 0).length
    const mByKind = (['movement', 'school', 'collective', 'tradition', 'style'] as const).map((k) => ({ k, n: movements.filter((m) => m.type === k).length }))
    const mByRegion = regions.map((r) => ({ r, n: movements.filter((m) => m.regions.includes(r.id)).length }))
    const mBySection = MOVEMENT_SECTIONS.map((s) => ({ s, n: movements.filter((m: MovementLike) => m.taxonomy?.includes(s.id)).length }))
    const full = movements.filter((m) => m.level !== 'index').length
    return { women, men, nb, unrecorded, known, byRegion, byEra, bySection, womenBefore1800, fewest, contemporary, profiles, lostOrCopies, dup, approx, untagged, mByKind, mByRegion, mBySection, full }
  }, [artists, movements, regions])

  const KIND_LABEL: Record<string, string> = { movement: t('Movements'), school: t('Schools & workshops'), collective: t('Collectives & groups'), tradition: t('Traditions'), style: t('Styles & strands') }

  return (
    <>
      <Breadcrumbs items={[{ label: t('Explore'), to: '/explore' }, { label: t('Coverage & gaps') }]} />
      <PageHeader eyebrow={t('Explore · Method')} title={t('Coverage & gaps')}
        intro={t('A database of art history is also a record of what it leaves out. These figures are computed live from the data you are browsing, followed by an open list of gaps — geographic, cultural, gender and historical — that the next rounds of research should close.')} />

      <div className="page-x space-y-24 pb-24">
        <section aria-labelledby="counts-h">
          <h2 id="counts-h" className="sr-only">{t('Counts')}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat n={artists.length} label={t('artist records')} note={t('{n} with written profiles', { n: g.profiles })} />
            <Stat n={movements.length} label={t('movements, schools, collectives & traditions')} note={t('{n} with full pages', { n: g.full })} />
            <Stat n={getRelationships().length} label={t('documented relationships')} note={t('each with a stated reason')} />
            <Stat n={regions.length} label={t('regions on the shared axis')} note={t('Central Asia has no region of its own yet')} />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            {slot(t('Read these numbers carefully. They describe the {master} — a starting foundation, not a measure of the field. A person’s absence from it says nothing about their importance. Gender is recorded only so representation can be measured; it is a data field, not a way of sorting artists’ work.'), 'master', <em>{t('master list as supplied')}</em>)}
          </p>
        </section>

        <section aria-labelledby="who-h">
          <SectionHeading id="who-h" label={t('Artists')} title={t('Who is in the list')} />
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-2xl">{t('By region of origin')} <span className="text-base text-muted">{t('(women share in brackets)')}</span></h3>
              <Bars rows={g.byRegion.map((x) => ({ label: x.r.name, value: x.n, note: x.k ? `(${pct(x.w, x.k)})` : '' }))} />
              <p className="mt-3 text-xs text-muted">{t('An artist with two origins (for example “Spain / Mexico”) counts once in each region.')}</p>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl">{t('By period (birth or start year)')}</h3>
              <Bars rows={g.byEra.map((x) => ({ label: x.o, value: x.n, note: x.n ? `(${pct(x.w, x.n)})` : '' }))} />
            </div>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-2xl">{t('Gender field')}</h3>
              <div role="img" aria-label={t('{women} women, {men} men, {nb} non-binary or gender-diverse, {na} not applicable', { women: g.women, men: g.men, nb: g.nb, na: g.unrecorded })} className="flex h-8 overflow-hidden rounded-full bg-surface">
                <span className="bg-ink" style={{ width: pct(g.men, artists.length) }} />
                <span className="bg-accent" style={{ width: pct(g.women, artists.length) }} />
                <span className="bg-muted" style={{ width: `${Math.max(1.5, (g.nb / artists.length) * 100)}%` }} />
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-ink" aria-hidden />{t('Men')}: <strong className="font-medium tabular-nums">{g.men}</strong> ({pct(g.men, artists.length)})</li>
                <li><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />{t('Women')}: <strong className="font-medium tabular-nums">{g.women}</strong> ({pct(g.women, artists.length)})</li>
                <li><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-muted" aria-hidden />{t('Non-binary or gender-diverse')}: <strong className="font-medium tabular-nums">{g.nb}</strong></li>
                <li className="text-muted">{t('Not applicable (collectives, anonymous makers, unresolved): {n}', { n: g.unrecorded })}</li>
              </ul>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">
                {t('Only {n} women artists in the list began working before 1800{names}, though women worked as artists, scribes, weavers and ceramicists in every earlier century. Their absence reflects who was recorded and collected, and who is treated as central in the source list, not who made art.', { n: g.womenBefore1800.length, names: g.womenBefore1800.length ? ` (${g.womenBefore1800.map((a) => a.title).join(', ')})` : '' })}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-display text-2xl">{t('Women by section of the master list')}</h3>
              <Bars rows={g.bySection.map((x) => ({ label: x.s.short, value: x.w, note: t('of {n}', { n: x.n }) }))} max={Math.max(...g.bySection.map((x) => x.n))} />
            </div>
          </div>
        </section>

        <section aria-labelledby="mov-h">
          <SectionHeading id="mov-h" label={t('Movements')} title={t('What the taxonomy covers')} />
          <div className="grid gap-12 lg:grid-cols-3">
            <div><h3 className="mb-4 font-display text-2xl">{t('By classification')}</h3><Bars rows={g.mByKind.map((x) => ({ label: KIND_LABEL[x.k], value: x.n }))} /></div>
            <div><h3 className="mb-4 font-display text-2xl">{t('By section')}</h3><Bars rows={g.mBySection.map((x) => ({ label: x.s.short, value: x.n }))} /></div>
            <div><h3 className="mb-4 font-display text-2xl">{t('By region of origin')}</h3><Bars rows={g.mByRegion.map((x) => ({ label: x.r.name, value: x.n }))} />
              <p className="mt-3 text-xs text-muted">{t('Entries spanning several regions count in each.')}</p></div>
          </div>
        </section>

        <section aria-labelledby="gaps-h">
          <SectionHeading id="gaps-h" label={t('Open list')} title={t('Important gaps')} />
          <p className="mb-6 max-w-prose text-muted">{slot(t('Named people and movements below are {candidates}, not additions: none has been added to the database. Each would be verified before being entered.'), 'candidates', <strong className="font-medium text-ink">{t('candidates to research')}</strong>)}</p>
          <ul>
            <Gap tag={t('Geographic')} title={t('Southeast Asia has {n} artists in the master list', { n: g.byRegion.find((x) => x.r.id === 'southeast-asia')?.n ?? 0 })}>
              <p>{t('The region is on the timeline through Khmer art at Angkor, yet no Southeast Asian artist appears in the master list. Candidates include Raden Saleh (Indonesia, 19th century), Affandi (Indonesia), Fernando Amorsolo (the Philippines), and the many modern and contemporary artists of Vietnam, Thailand and Myanmar.')}</p>
            </Gap>
            <Gap tag={t('Geographic')} title={t('Central Asia and the Caucasus have no region in the framework')}>
              <p>{t('The ten-region frame places Central Asia nowhere. The arts of the Silk Road cities, Timurid Samarkand and Bukhara, Armenia, Georgia and Azerbaijan need either a new region or an explicit mapping decision.')}</p>
            </Gap>
            <Gap tag={t('Cultural')} title={t('Indigenous artists of the Americas, and pre-1900 Indigenous artists anywhere')}>
              <p>{t('Indigenous American makers appear only as traditions (Maya, Inka) and, for the contemporary period, not at all in the master list apart from one unresolved entry. First Nations, Native American and Inuit artists such as Norval Morrisseau, Kay WalkingStick, Jaune Quick-to-See Smith and Kenojuak Ashevak are candidates; Oceanian and Aboriginal art is better covered than the Americas.')}</p>
            </Gap>
            <Gap tag={t('Cultural')} title={t('Black American artists of the Harlem Renaissance and after')}>
              <p>{t('Aaron Douglas and Jacob Lawrence are in the database as relationship examples but are not in the master list. Candidates include Henry Ossawa Tanner, Archibald Motley, Augusta Savage, Meta Vaux Warrick Fuller, Romare Bearden and Faith Ringgold.')}</p>
            </Gap>
            <Gap tag={t('Gender')} title={t('Women artists, especially before the twentieth century')}>
              <p>{t('Hilma af Klint, Paula Modersohn-Becker, Sophie Taeuber-Arp, Georgia O’Keeffe, Alma Thomas, Judy Chicago, Carolee Schneemann and Magdalena Abakanowicz are among the well-documented women missing from the list. Lilly Reich, Marianne Brandt and Gunta Stölzl are missing from design.')}</p>
            </Gap>
            <Gap tag={t('Historical')} title={t('Medieval, Byzantine and early Islamic named artists')}>
              <p>{t('The medieval section stops at the Italian Trecento and two Byzantine architects. Named masters of other medieval traditions — such as Yahya al-Wasiti of Baghdad, or the illuminators and architects of the Islamic world, Africa and Asia — are absent, as are women scribes and illuminators.')}</p>
            </Gap>
            <Gap tag={t('Design')} title={t('Typography, photography and architecture are thin')}>
              <p>{t('The design section includes graphic designers and architects but few type designers or photographers. Candidates: Jan Tschichold, Herbert Bayer, Adrian Frutiger, Josef Müller-Brockmann, Otl Aicher, Wolfgang Weingart, Zuzana Licko; Gordon Parks, Tina Modotti, Berenice Abbott, Manuel Álvarez Bravo, Graciela Iturbide; Luis Barragán, Hassan Fathy, Geoffrey Bawa, Balkrishna Doshi, Kenzō Tange.')}</p>
            </Gap>
            <Gap tag={t('Movements')} title={t('Movements and schools not yet in the taxonomy')}>
              <p>{t('Rinpa and the Kanō school (Japan); the Lingnan school (China); Russian icon painting; the School of Paris; Group f/64 and “straight” photography; Spatialism; Capitalist Realism; Art Brut; Superflat; the Oshogbo school (Nigeria); the Baroda group (India); the Hermannsburg school (Australia); Kinshasa popular painting; Egyptian modernism and Art et Liberté; the Hudson River School, the Ashcan School and American Regionalism; Gandhara, Pala and Chola art; Ottoman and Safavid painting as separate entries.')}</p>
            </Gap>
            <Gap tag={t('Structure')} title={t('Artists without a movement tag')}>
              <p>{t('{a} of the {b} records have no movement tag yet. Many artists, such as Brâncuși, Bacon, Moore, Kahlo, Kapoor and Gerhard Richter, are left untagged because no entry in the current taxonomy fits them honestly. That is by design: artists are not forced into one category, and a missing tag is a prompt to extend the taxonomy rather than to stretch an existing label.', { a: g.untagged, b: masterList.length })}</p>
            </Gap>
          </ul>
        </section>
      </div>
    </>
  )
}
