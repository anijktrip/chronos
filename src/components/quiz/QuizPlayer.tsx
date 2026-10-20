import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Artwork, Entity, Question, QContext, QMatch, QTimeline } from '@/types'
import { entityPath, getEntity, getObjective, getQuestion } from '@/lib/repo'
import { recordAttempt } from '@/lib/progress'
import { t } from '@/i18n'
import { ArtworkImage } from '../ui/ArtworkImage'
import { ArrowDown, ArrowRight, ArrowUp, Check, Cross, Reset } from '../ui/Icons'
import { TypeBadge } from '../ui/TypeBadge'

/* ------------------------------------------------------------------ */
/* Preparation: shuffle once per attempt so re-renders are stable      */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed || 1
  const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 }
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

type Answer =
  | { kind: 'choice'; value: number | null }
  | { kind: 'order'; value: string[] }
  | { kind: 'match'; value: Record<number, number | null> } // left index → right (shuffled) index
  | { kind: 'multi'; value: number[] }

interface Prepared {
  q: Question
  /** For choice questions: display order of option indexes. */
  optionOrder?: number[]
  /** For timeline: initial shuffled item ids. For match: shuffled right indexes. For context: shuffled option indexes. */
  order?: (string | number)[]
}

function prepare(q: Question, seed: number): Prepared {
  switch (q.kind) {
    case 'multiple-choice':
    case 'artwork-id': return { q, optionOrder: shuffle(q.options.map((_, i) => i), seed) }
    case 'timeline': {
      let order = shuffle(q.items.map((i) => i.id), seed)
      // never start already solved
      const solved = [...q.items].sort((a, b) => a.year - b.year).map((i) => i.id)
      if (order.join() === solved.join()) order = [...order].reverse()
      return { q, order }
    }
    case 'match': return { q, order: shuffle(q.pairs.map((_, i) => i), seed) }
    case 'context': return { q, order: shuffle(q.options.map((_, i) => i), seed) }
  }
}

function emptyAnswer(p: Prepared): Answer {
  switch (p.q.kind) {
    case 'multiple-choice': case 'artwork-id': return { kind: 'choice', value: null }
    case 'timeline': return { kind: 'order', value: (p.order as string[]) }
    case 'match': return { kind: 'match', value: {} }
    case 'context': return { kind: 'multi', value: [] }
  }
}

function isAnswered(a: Answer, p: Prepared): boolean {
  if (a.kind === 'choice') return a.value !== null
  if (a.kind === 'order') return true
  if (a.kind === 'multi') return a.value.length > 0
  return Object.values(a.value).filter((v) => v !== null && v !== undefined).length === (p.q as QMatch).pairs.length
}

function evaluate(a: Answer, p: Prepared): boolean {
  const q = p.q
  if (q.kind === 'multiple-choice' || q.kind === 'artwork-id') return a.kind === 'choice' && a.value === q.answer
  if (q.kind === 'timeline' && a.kind === 'order') {
    const correct = [...q.items].sort((x, y) => x.year - y.year).map((i) => i.id)
    return a.value.every((id, i) => id === correct[i])
  }
  if (q.kind === 'match' && a.kind === 'match') {
    const order = p.order as number[]
    return q.pairs.every((_, li) => a.value[li] !== null && a.value[li] !== undefined && order[a.value[li] as number] === li)
  }
  if (q.kind === 'context' && a.kind === 'multi') {
    const right = new Set(q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0))
    const got = new Set(a.value.map((i) => (p.order as number[])[i]))
    return right.size === got.size && [...right].every((i) => got.has(i))
  }
  return false
}

/* ------------------------------------------------------------------ */
/* Player                                                              */
/* ------------------------------------------------------------------ */

interface PlayerProps {
  questionIds: string[]
  /** Used to record the attempt (best score, history). */
  quizId: string
  title?: string
  compact?: boolean
  onExit?: () => void
  exitLabel?: string
}

export function QuizPlayer({ questionIds, quizId, title, compact, onExit, exitLabel = t('Back to quizzes') }: PlayerProps) {
  const [run, setRun] = useState({ ids: questionIds, seed: Date.now() % 100000, n: 0 })
  const prepared = useMemo(() => run.ids.map((id, i) => prepare(getQuestion(id) as Question, run.seed + i * 7919)), [run])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(() => prepared.map(emptyAnswer))
  const [submitted, setSubmitted] = useState<boolean[]>(() => prepared.map(() => false))
  const [done, setDone] = useState(false)
  const headRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIdx(0); setAnswers(prepared.map(emptyAnswer)); setSubmitted(prepared.map(() => false)); setDone(false)
  }, [prepared])
  useEffect(() => { if (!done) headRef.current?.focus({ preventScroll: true }) }, [idx, done])

  const p = prepared[idx]
  const results = prepared.map((pp, i) => (submitted[i] ? evaluate(answers[i], pp) : false))
  const score = results.filter(Boolean).length
  const isSubmitted = submitted[idx]
  const correct = results[idx]

  const setAnswer = (a: Answer) => setAnswers((cur) => cur.map((x, i) => (i === idx ? a : x)))
  const submit = () => {
    setSubmitted((s) => s.map((x, i) => (i === idx ? true : x)))
    setTimeout(() => feedbackRef.current?.focus({ preventScroll: false }), 30)
  }
  const next = () => {
    if (idx < prepared.length - 1) setIdx(idx + 1)
    else {
      recordAttempt({
        quizId, at: new Date().toISOString(), score, total: prepared.length,
        results: prepared.map((pp, i) => ({ questionId: pp.q.id, correct: results[i] })),
      })
      setDone(true)
    }
  }
  const restart = (ids: string[]) => setRun({ ids, seed: Date.now() % 100000, n: run.n + 1 })

  if (done) {
    return (
      <Summary
        title={title} prepared={prepared} results={results} score={score} compact={compact}
        onRetry={() => restart(questionIds)}
        onRetryMissed={() => restart(prepared.filter((_, i) => !results[i]).map((pp) => pp.q.id))}
        onExit={onExit} exitLabel={exitLabel}
      />
    )
  }

  const q = p.q
  const progress = ((idx + (isSubmitted ? 1 : 0)) / prepared.length) * 100

  return (
    <div className={compact ? '' : 'mx-auto max-w-3xl'}>
      <div className="mb-6">
        <div className="flex items-baseline justify-between text-sm">
          <span className="label">{t('{title} · Question {n} of {total}', { title: title ?? t('Quiz'), n: idx + 1, total: prepared.length })}</span>
          <span className="text-muted">{t('{score} correct so far', { score })}</span>
        </div>
        <div className="mt-2 h-[3px] w-full bg-rule" role="progressbar" aria-valuemin={0} aria-valuemax={prepared.length} aria-valuenow={idx + (isSubmitted ? 1 : 0)} aria-label={t('Quiz progress')}>
          <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={`${run.n}-${idx}`} className="fade-in">
        <p className="label mb-3">{KIND_LABEL[q.kind]} · {getObjective(q.objective)?.text}</p>
        <h3 ref={headRef} tabIndex={-1} className="font-serif text-3xl leading-tight outline-none sm:text-4xl">{q.prompt}</h3>

        {q.kind === 'artwork-id' && <ArtworkPrompt artworkId={q.artworkId} clue={q.clue} />}

        <div className="mt-6">
          {(q.kind === 'multiple-choice' || q.kind === 'artwork-id') && (
            <ChoiceList q={q} order={p.optionOrder as number[]} value={(answers[idx] as { value: number | null }).value} locked={isSubmitted} onChange={(v) => setAnswer({ kind: 'choice', value: v })} />
          )}
          {q.kind === 'timeline' && <TimelineSort q={q} value={(answers[idx] as { value: string[] }).value} locked={isSubmitted} onChange={(v) => setAnswer({ kind: 'order', value: v })} />}
          {q.kind === 'match' && <MatchBoard q={q} order={p.order as number[]} value={(answers[idx] as { value: Record<number, number | null> }).value} locked={isSubmitted} onChange={(v) => setAnswer({ kind: 'match', value: v })} />}
          {q.kind === 'context' && <ContextList q={q} order={p.order as number[]} value={(answers[idx] as { value: number[] }).value} locked={isSubmitted} onChange={(v) => setAnswer({ kind: 'multi', value: v })} />}
        </div>

        {/* feedback */}
        <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
          {isSubmitted && (
            <div className={`pop-in mt-8 border-l-4 bg-surface p-5 ${correct ? 'border-artist' : 'border-tradition'}`}>
              <p className={`flex items-center gap-2 font-medium ${correct ? 'text-artist' : 'text-tradition'}`}>
                {correct ? <Check size={18} /> : <Cross size={18} />}
                {correct ? t('Correct') : q.kind === 'context' || q.kind === 'match' || q.kind === 'timeline' ? t('Not quite right') : t('Not quite')}
              </p>
              <p className="mt-2 max-w-prose leading-relaxed">{q.explanation}</p>
              <RelatedLinks ids={q.entityRefs} />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!isSubmitted ? (
            <button type="button" className="btn btn-solid disabled:border-rule disabled:bg-transparent disabled:text-muted" disabled={!isAnswered(answers[idx], p)} onClick={submit}>
              {q.kind === 'timeline' ? t('Check order') : q.kind === 'match' ? t('Check matches') : t('Submit answer')}
            </button>
          ) : (
            <button type="button" className="btn btn-solid" onClick={next}>{idx < prepared.length - 1 ? t('Next question') : t('See my score')} <ArrowRight size={16} /></button>
          )}
          {!isSubmitted && q.kind === 'match' && <span className="text-sm text-muted">{t('Pick an item on the left, then its partner on the right.')}</span>}
          {!isSubmitted && q.kind === 'context' && <span className="text-sm text-muted">{t('Select every option that applies.')}</span>}
        </div>
      </div>
    </div>
  )
}

const KIND_LABEL: Record<Question['kind'], string> = {
  'multiple-choice': t('Multiple choice'), 'artwork-id': t('Artwork identification'), timeline: t('Timeline challenge'), match: t('Match the connection'), context: t('Context challenge'),
}

/* ------------------------------------------------------------------ */
/* Question bodies                                                     */
/* ------------------------------------------------------------------ */

function ArtworkPrompt({ artworkId, clue }: { artworkId: string; clue: string }) {
  const art = getEntity(artworkId) as Artwork
  return (
    <figure className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:items-end">
      <ArtworkImage artwork={art} concealed width={900} ratio={Math.min(Math.max(art.image.ratio, 0.75), 1.6)} fit="contain" className="border border-rule" />
      <figcaption className="text-sm leading-relaxed text-muted"><span className="label mb-1 block text-ink">{t('Look closely')}</span>{clue}</figcaption>
    </figure>
  )
}

function optionState(locked: boolean, selected: boolean, isRight: boolean) {
  if (!locked) return selected ? 'border-ink bg-ink text-paper' : 'border-rule hover:border-ink'
  if (isRight) return 'border-artist bg-artist/10'
  if (selected) return 'border-tradition bg-tradition/10'
  return 'border-rule opacity-60'
}

function ChoiceList({ q, order, value, locked, onChange }: { q: Extract<Question, { options: string[] }>; order: number[]; value: number | null; locked: boolean; onChange: (v: number) => void }) {
  return (
    <div role="radiogroup" aria-label={t('Answer options')} className="grid gap-2">
      {order.map((oi, pos) => {
        const selected = value === oi
        const right = oi === q.answer
        return (
          <button key={oi} type="button" role="radio" aria-checked={selected}
            onClick={() => !locked && onChange(oi)} aria-disabled={locked}
            className={`flex min-h-[56px] items-center gap-4 border px-4 py-3 text-left transition-colors ${optionState(locked, selected, right)} ${locked && selected && !right ? 'shake' : ''}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs ${selected && !locked ? 'border-paper' : 'border-current opacity-70'}`}>{String.fromCharCode(65 + pos)}</span>
            <span className="flex-1">{q.options[oi]}</span>
            {locked && right && <span className="flex items-center gap-1 text-sm text-artist"><Check size={16} /> {t('Correct answer')}</span>}
            {locked && selected && !right && <span className="flex items-center gap-1 text-sm text-tradition"><Cross size={16} /> {t('Your answer')}</span>}
          </button>
        )
      })}
    </div>
  )
}

function TimelineSort({ q, value, locked, onChange }: { q: QTimeline; value: string[]; locked: boolean; onChange: (v: string[]) => void }) {
  const byId = new Map(q.items.map((i) => [i.id, i]))
  const correct = [...q.items].sort((a, b) => a.year - b.year).map((i) => i.id)
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const n = [...value]; [n[i], n[j]] = [n[j], n[i]]
    onChange(n)
  }
  return (
    <div>
      <p className="mb-3 flex items-center justify-between text-xs text-muted"><span>{t('Earliest ↓ latest')}</span><span>{t('Use the arrows to reorder')}</span></p>
      <ol className="grid gap-2">
        {value.map((id, i) => {
          const it = byId.get(id) as QTimeline['items'][number]
          const ok = correct[i] === id
          return (
            <li key={id} className={`flex min-h-[56px] items-center gap-3 border px-3 py-2 ${locked ? (ok ? 'border-artist bg-artist/10' : 'border-tradition bg-tradition/10') : 'border-rule bg-surface'}`}>
              <span className="w-6 text-center font-serif text-xl text-muted">{i + 1}</span>
              <span className="flex-1">
                <span className="block">{it.label}</span>
                {locked && <span className="block text-xs text-muted">{it.yearLabel}{ok ? '' : ` — ${t('belongs at position {n}', { n: correct.indexOf(id) + 1 })}`}</span>}
              </span>
              {locked ? (ok ? <Check size={18} className="text-artist" aria-label={t('In the right place')} /> : <Cross size={18} className="text-tradition" aria-label={t('In the wrong place')} />) : (
                <span className="flex">
                  <button type="button" className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-transparent hover:border-ink disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label={t('Move “{label}” earlier', { label: it.label })}><ArrowUp size={18} /></button>
                  <button type="button" className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-transparent hover:border-ink disabled:opacity-30" disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label={t('Move “{label}” later', { label: it.label })}><ArrowDown size={18} /></button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function MatchBoard({ q, order, value, locked, onChange }: { q: QMatch; order: number[]; value: Record<number, number | null>; locked: boolean; onChange: (v: Record<number, number | null>) => void }) {
  const [pending, setPending] = useState<number | null>(null)
  const letter = (i: number) => String.fromCharCode(65 + i)
  // right side: which left item (by pair order) has claimed each shuffled right slot
  const claimedBy = (ri: number) => Object.entries(value).find(([, v]) => v === ri)?.[0]
  const pairNo = (li: number) => Object.keys(value).filter((k) => value[Number(k)] !== null && value[Number(k)] !== undefined).sort((a, b) => Number(a) - Number(b)).indexOf(String(li))
  void pairNo

  const pickLeft = (li: number) => {
    if (locked) return
    if (value[li] !== null && value[li] !== undefined) { onChange({ ...value, [li]: null }); setPending(null); return }
    setPending(pending === li ? null : li)
  }
  const pickRight = (ri: number) => {
    if (locked) return
    const owner = claimedBy(ri)
    if (owner !== undefined) { onChange({ ...value, [Number(owner)]: null }); return }
    if (pending === null) return
    onChange({ ...value, [pending]: ri })
    setPending(null)
  }
  const leftOk = (li: number) => value[li] !== null && value[li] !== undefined && order[value[li] as number] === li

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="label mb-2">{t('Items')}</p>
        <ul className="grid gap-2">
          {q.pairs.map((pr, li) => {
            const v = value[li]
            const paired = v !== null && v !== undefined
            const sel = pending === li
            return (
              <li key={li}>
                <button type="button" aria-pressed={sel} onClick={() => pickLeft(li)} aria-label={paired ? t('{item}, paired with “{partner}”. Activate to unpair.', { item: pr.left, partner: q.pairs[order[v as number]].right }) : sel ? t('{item}, selected: now choose its partner', { item: pr.left }) : pr.left}
                  className={`flex min-h-[56px] w-full items-center gap-3 border px-3 py-2 text-left transition-colors ${locked ? (leftOk(li) ? 'border-artist bg-artist/10' : 'border-tradition bg-tradition/10') : sel ? 'border-ink bg-ink text-paper' : paired ? 'border-ink bg-surface' : 'border-rule hover:border-ink'}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs ${paired ? 'border-current' : 'border-transparent'}`}>{paired ? letter(li) : ''}</span>
                  <span className="flex-1">{pr.left}</span>
                  {locked && (leftOk(li) ? <Check size={18} className="text-artist" /> : <Cross size={18} className="text-tradition" />)}
                </button>
                {locked && !leftOk(li) && <p className="mt-1 pl-3 text-xs text-muted">{t('Correct partner: {partner}', { partner: pr.right })}</p>}
              </li>
            )
          })}
        </ul>
      </div>
      <div>
        <p className="label mb-2">{t('Partners')}</p>
        <ul className="grid gap-2">
          {order.map((pairIndex, ri) => {
            const owner = claimedBy(ri)
            const claimed = owner !== undefined
            return (
              <li key={ri}>
                <button type="button" onClick={() => pickRight(ri)} aria-label={claimed ? t('{item}, paired with “{partner}”', { item: q.pairs[pairIndex].right, partner: q.pairs[Number(owner)].left }) : q.pairs[pairIndex].right}
                  disabled={locked || (!claimed && pending === null)}
                  className={`flex min-h-[56px] w-full items-center gap-3 border px-3 py-2 text-left transition-colors ${claimed ? 'border-ink bg-surface' : pending !== null && !locked ? 'border-ink border-dashed hover:bg-surface' : 'border-rule opacity-80'}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs ${claimed ? 'border-current' : 'border-transparent'}`}>{claimed ? letter(Number(owner)) : ''}</span>
                  <span className="flex-1">{q.pairs[pairIndex].right}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function ContextList({ q, order, value, locked, onChange }: { q: QContext; order: number[]; value: number[]; locked: boolean; onChange: (v: number[]) => void }) {
  return (
    <ul className="grid gap-2" aria-label={t('Options — select all that apply')}>
      {order.map((oi, pos) => {
        const o = q.options[oi]
        const on = value.includes(pos)
        const state = !locked ? (on ? 'border-ink bg-ink text-paper' : 'border-rule hover:border-ink')
          : on && o.correct ? 'border-artist bg-artist/10' : on && !o.correct ? 'border-tradition bg-tradition/10' : !on && o.correct ? 'border-artist border-dashed' : 'border-rule opacity-60'
        return (
          <li key={oi}>
            <button type="button" role="checkbox" aria-checked={on} onClick={() => !locked && onChange(on ? value.filter((v) => v !== pos) : [...value, pos])} aria-disabled={locked}
              className={`flex min-h-[56px] w-full items-start gap-4 border px-4 py-3 text-left transition-colors ${state}`}>
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border ${on && !locked ? 'border-paper' : 'border-current'}`}>{on && <Check size={14} />}</span>
              <span className="flex-1">
                {o.text}
                {locked && <span className="mt-1 block text-sm text-muted">{o.correct ? (on ? '✓ ' : t('You missed this one.') + ' ') : (on ? '✗ ' : '')}{o.why}</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function RelatedLinks({ ids }: { ids: string[] }) {
  const ents = ids.map((i) => getEntity(i)).filter(Boolean) as Entity[]
  if (!ents.length) return null
  return (
    <div className="mt-4 border-t border-rule pt-3">
      <p className="label mb-2">{t('Learn more')}</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {ents.slice(0, 4).map((e) => <li key={e.id}><Link to={entityPath(e)} className="link-u inline-flex items-center gap-1.5 py-1"><TypeBadge type={e.type} className="!normal-case !tracking-normal" label="" />{e.title}</Link></li>)}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

function Summary({ title, prepared, results, score, compact, onRetry, onRetryMissed, onExit, exitLabel }: {
  title?: string; prepared: Prepared[]; results: boolean[]; score: number; compact?: boolean; onRetry: () => void; onRetryMissed: () => void; onExit?: () => void; exitLabel: string
}) {
  const total = prepared.length
  const pct = Math.round((score / total) * 100)
  const msg = pct === 100 ? t('A clean sweep.') : pct >= 70 ? t('Strong. A few details to revisit.') : pct >= 40 ? t('A good start — the explanations below will help it stick.') : t('Worth another look. Try the linked pages, then retry.')
  const missed = prepared.filter((_, i) => !results[i])
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  const suggest = [...new Set(missed.flatMap((m) => m.q.entityRefs))].map((id) => getEntity(id)).filter(Boolean).slice(0, 5) as Entity[]
  return (
    <div className={compact ? '' : 'mx-auto max-w-3xl'}>
      <p className="label">{t('{title} · Complete', { title: title ?? t('Quiz') })}</p>
      <h3 ref={ref} tabIndex={-1} className="mt-3 flex items-end gap-4 outline-none">
        <span className="font-serif text-[clamp(4rem,14vw,8rem)] leading-none">{score}<span className="text-muted">/{total}</span></span>
        <span className="pb-3 text-lg text-muted">{pct}%</span>
      </h3>
      <p className="mt-2 text-xl" role="status">{msg}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn btn-solid" onClick={onRetry}><Reset size={16} /> {t('Retry all')}</button>
        {missed.length > 0 && <button type="button" className="btn btn-ghost" onClick={onRetryMissed}>{t('Retry the {n} I missed', { n: missed.length })}</button>}
        {onExit && <button type="button" className="btn btn-ghost" onClick={onExit}>{exitLabel}</button>}
        <Link to="/learn/progress" className="btn btn-ghost">{t('My progress')}</Link>
      </div>

      <h4 className="label mb-3 mt-10">{t('Review')}</h4>
      <ol className="divide-y divide-rule border-y border-rule">
        {prepared.map((pp, i) => (
          <li key={pp.q.id} className="grid grid-cols-[1.5rem_1fr] gap-3 py-3">
            {results[i] ? <Check size={18} className="mt-0.5 text-artist" aria-label={t('Correct')} /> : <Cross size={18} className="mt-0.5 text-tradition" aria-label={t('Incorrect')} />}
            <div>
              <p className="font-medium">{pp.q.prompt}</p>
              <p className="mt-1 text-sm text-muted">{pp.q.explanation}</p>
            </div>
          </li>
        ))}
      </ol>

      {suggest.length > 0 && (
        <div className="mt-8">
          <p className="label mb-2">{t('Revisit')}</p>
          <ul className="flex flex-wrap gap-2">{suggest.map((e) => <li key={e.id}><Link to={entityPath(e)} className="chip">{e.title}</Link></li>)}</ul>
        </div>
      )}
    </div>
  )
}
