import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { Entity, LearningPath, PathStep, Question } from '@/types'
import {
  allEntities, entityPath, getEntity, getObjective, getObjectives, getPath, getPaths, getQuestion, getQuestions, getQuiz, getQuizzes, questionsFor, TYPE_LABEL, TYPE_LABEL_PLURAL,
} from '@/lib/repo'
import { bestScore, latestResults, mastery, resetProgress, setStepDone, useProgress } from '@/lib/progress'
import { EntityCard } from '@/components/ui/EntityCard'
import { useDocumentTitle } from '@/components/ui/hooks'
import { ArrowRight, Check } from '@/components/ui/Icons'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '@/components/ui/Page'
import { Reveal } from '@/components/ui/Reveal'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { Missing } from './MovementDetail'
import { lang, t } from '@/i18n'

const KIND_NAMES: Record<Question['kind'], string> = { 'multiple-choice': t('Multiple choice'), 'artwork-id': t('Artwork ID'), timeline: t('Timeline'), match: t('Match'), context: t('Context') }
const stepsLabel = (n: number) => (n === 1 ? t('{n} step', { n }) : t('{n} steps', { n }))
const questionsLabel = (n: number) => (n === 1 ? t('{n} question', { n }) : t('{n} questions', { n }))
const minutesLabel = (n: number) => (n === 1 ? t('{n} minute', { n }) : t('{n} minutes', { n }))

function stepDone(s: PathStep, pathId: string, progress: ReturnType<typeof useProgress>): boolean {
  if (progress.steps[pathId]?.includes(s.id)) return true
  if (s.kind === 'read') return progress.viewed.includes(s.entity)
  if (s.kind === 'quiz') return progress.attempts.some((a) => a.quizId === s.quizId)
  return false
}
export const pathProgress = (p: LearningPath, progress: ReturnType<typeof useProgress>) => {
  const done = p.steps.filter((s) => stepDone(s, p.id, progress)).length
  return { done, total: p.steps.length, pct: Math.round((done / p.steps.length) * 100) }
}

/* ------------------------------------------------------------------ */

export function LearnHome() {
  useDocumentTitle(t('Learn'))
  const progress = useProgress()
  const quizzes = getQuizzes()
  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn') }]} />
      <PageHeader eyebrow={t('Learn')} title={t('Learn it so it stays')} intro={t('Guided paths take you through connected records in a sensible order. Quizzes ask you to place, identify, match and explain — not just recall a name.')} />
      <div className="page-x space-y-20 pb-24">
        <section>
          <SectionHeading no="◦" label={t('Learning paths')} title={t('Guided routes')} aside={<Link to="/learn/progress" className="link-u text-ink">{t('My progress')}</Link>} />
          <div className="grid gap-5 lg:grid-cols-3">
            {getPaths().map((p, i) => {
              const pr = pathProgress(p, progress)
              return (
                <Reveal key={p.id} delay={i * 70}>
                  <Link to={`/learn/path/${p.id}`} className="group card-hover flex h-full flex-col border border-rule bg-surface p-6">
                    <p className="label">{t('{level} · {steps}', { level: t(p.level), steps: stepsLabel(p.steps.length) })}</p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">{p.description}</p>
                    <div className="mt-auto pt-6">
                      <div className="h-[3px] bg-rule" role="progressbar" aria-valuenow={pr.pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('{title} progress', { title: p.title })}><div className="h-full bg-ink transition-all" style={{ width: `${pr.pct}%` }} /></div>
                      <p className="mt-2 flex items-center justify-between text-sm"><span className="text-muted">{t('{done} of {total} done', { done: pr.done, total: pr.total })}</span><span className="inline-flex items-center gap-2 font-medium">{pr.done ? t('Continue') : t('Begin')} <ArrowRight size={16} className="arrow-nudge" /></span></p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section>
          <SectionHeading no="◦" label={t('Interactive quizzes')} title={t('Try yourself')} aside={<Link to="/learn/quizzes" className="link-u text-ink">{t('All quizzes')}</Link>} />
          <ul>
            {quizzes.slice(0, 4).map((q) => {
              const b = bestScore(progress, q.id)
              return (
                <li key={q.id}>
                  <Link to={`/learn/quiz/${q.id}`} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-rule py-4 hover:bg-surface sm:grid-cols-[1fr_12rem_6rem]">
                    <span><span className="block font-serif text-2xl">{q.title}</span><span className="block text-sm text-muted">{q.description}</span></span>
                    <span className="hidden text-sm text-muted sm:block">{t('{questions} · ~{min} min', { questions: questionsLabel(q.questionIds.length), min: q.minutes })}</span>
                    <span className="text-right text-sm">{b ? <span className="font-medium">{b.score}/{b.total}</span> : <ArrowRight size={16} className="arrow-nudge ml-auto" />}</span>
                  </Link>
                </li>
              )
            })}
            <li className="rule-t" />
          </ul>
        </section>
        <section className="grid gap-8 border-t border-ink pt-6 md:grid-cols-3">
          {[[t('Learning objectives'), t('Every question is tied to an objective such as “place works on one chronology” or “explain how events shaped art”.')], [t('Entity references'), t('Each question points to the artists, works and movements it teaches, so practice can be built around any subject.')], [t('Local progress'), t('Scores, mastery and saved items live in this browser only. Nothing is sent anywhere.')]].map(([title, d]) => (
            <div key={title}><p className="font-serif text-2xl">{title}</p><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></div>
          ))}
        </section>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

export function PathPage() {
  const { id = '' } = useParams()
  const path = getPath(id)
  useDocumentTitle(path?.title)
  const progress = useProgress()
  if (!path) return <Missing what="learning path" />
  const pr = pathProgress(path, progress)
  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn'), to: '/learn' }, { label: path.title }]} />
      <PageHeader eyebrow={t('{level} path · {steps}', { level: t(path.level), steps: stepsLabel(path.steps.length) })} title={path.title} intro={path.description}>
        <div className="max-w-md">
          <div className="h-[3px] bg-rule" role="progressbar" aria-valuenow={pr.pct} aria-valuemin={0} aria-valuemax={100} aria-label={t('Path progress')}><div className="h-full bg-ink transition-all duration-500" style={{ width: `${pr.pct}%` }} /></div>
          <p className="mt-2 text-sm text-muted">{t('{done} of {total} complete', { done: pr.done, total: pr.total })}</p>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">{path.objectives.map((o) => <li key={o} className="chip cursor-default">{getObjective(o)?.text}</li>)}</ul>
      </PageHeader>
      <ol className="page-x pb-24">
        {path.steps.map((s, i) => {
          const done = stepDone(s, path.id, progress)
          const manual = progress.steps[path.id]?.includes(s.id)
          const ent = s.kind === 'read' ? getEntity(s.entity) : undefined
          const target = s.kind === 'read' ? entityPath(s.entity) : s.kind === 'quiz' ? `/learn/quiz/${s.quizId}` : s.to
          const title = s.kind === 'read' ? ent?.title : s.kind === 'quiz' ? getQuiz(s.quizId)?.title : s.label
          return (
            <li key={s.id} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-rule py-6 sm:grid-cols-[4rem_1fr_auto]">
              <span className={`flex h-9 w-9 items-center justify-center border ${done ? 'border-ink bg-ink text-paper' : 'border-rule font-serif text-xl'}`}>{done ? <Check size={16} /> : i + 1}</span>
              <div>
                <p className="label">{s.kind === 'read' ? (ent ? t(TYPE_LABEL[ent.type]) : t('Read')) : s.kind === 'quiz' ? t('Quiz') : t('Explore')}</p>
                <h2 className="mt-1 font-serif text-3xl leading-tight"><Link to={target} className="link-u">{title}</Link></h2>
                <p className="mt-1 text-muted">{s.prompt}</p>
              </div>
              <div className="col-span-2 mt-3 flex items-center gap-3 sm:col-span-1 sm:mt-0">
                <Link to={target} className="btn btn-ghost">{s.kind === 'quiz' ? t('Take quiz') : s.kind === 'read' ? t('Read') : t('Open')} <ArrowRight size={16} /></Link>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-muted">
                  <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--ink))]" checked={!!manual} onChange={(e) => setStepDone(path.id, s.id, e.target.checked)} />
                  <span>{t('Mark done')}</span>
                </label>
              </div>
            </li>
          )
        })}
        <li className="rule-t" />
      </ol>
    </>
  )
}

/* ------------------------------------------------------------------ */

export function QuizzesPage() {
  useDocumentTitle(t('Quizzes'))
  const progress = useProgress()
  const nav = useNavigate()
  const latest = latestResults(progress)
  const missed = getQuestions().filter((q) => latest.get(q.id) === false)
  const subjects = allEntities().filter((e) => questionsFor(e.id).length > 0 && ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork'].includes(e.type))
  const [subject, setSubject] = useState(subjects[0]?.id ?? '')

  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn'), to: '/learn' }, { label: t('Quizzes') }]} />
      <PageHeader eyebrow={t('Learn')} title={t('Interactive quizzes')} intro={t('Five kinds of question — multiple choice, artwork identification, timeline challenge, match the connection and context challenge — with an explanation after every answer.')} />
      <div className="page-x space-y-16 pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          {getQuizzes().map((q, i) => {
            const b = bestScore(progress, q.id)
            const kinds = [...new Set(q.questionIds.map((id) => (getQuestion(id) as Question).kind))]
            return (
              <Reveal key={q.id} delay={(i % 2) * 70}>
                <Link to={`/learn/quiz/${q.id}`} className="group card-hover flex h-full flex-col border border-rule bg-surface p-6">
                  <div className="flex items-start justify-between gap-3"><p className="label">{t('{questions} · ~{min} min', { questions: questionsLabel(q.questionIds.length), min: q.minutes })}</p>{b && <p className="label text-ink">{t('Best {score}/{total}', { score: b.score, total: b.total })}</p>}</div>
                  <h2 className="mt-3 font-serif text-3xl leading-tight">{q.title}</h2>
                  <p className="mt-2 text-sm text-ink/80">{q.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">{kinds.map((k) => <li key={k} className="border border-rule px-2 py-0.5 text-xs text-muted">{KIND_NAMES[k]}</li>)}</ul>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium">{b ? t('Try again') : t('Start')} <ArrowRight size={16} className="arrow-nudge" /></span>
                </Link>
              </Reveal>
            )
          })}
        </div>

        <section className="grid gap-8 border-t border-ink pt-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">{t('Practise a subject')}</h2>
            <p className="mt-2 max-w-md text-sm text-muted">{t('Every question is tagged to the entities it teaches, so you can drill any movement, artist or work.')}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="sr-only" htmlFor="subject">{t('Subject')}</label>
              <select id="subject" className="field !w-auto min-w-[16rem]" value={subject} onChange={(e) => setSubject(e.target.value)}>
                {(['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork'] as const).map((ty) => (
                  <optgroup key={ty} label={t(TYPE_LABEL_PLURAL[ty])}>{subjects.filter((s) => s.type === ty).map((s) => <option key={s.id} value={s.id}>{s.title} ({questionsFor(s.id).length})</option>)}</optgroup>
                ))}
              </select>
              <button type="button" className="btn btn-solid" onClick={() => nav(`/learn/quiz/practice?entity=${subject}`)}>{t('Practise')}</button>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl">{t('Review what you missed')}</h2>
            <p className="mt-2 max-w-md text-sm text-muted">{missed.length ? (missed.length > 1 ? t('{n} questions were answered incorrectly the last time you saw them.', { n: missed.length }) : t('{n} question was answered incorrectly the last time you saw it.', { n: missed.length })) : t('Nothing to review yet — questions you get wrong will collect here.')}</p>
            <button type="button" className="btn btn-ghost mt-4 disabled:opacity-40" disabled={!missed.length} onClick={() => nav('/learn/quiz/review')}>{t('Start review')}</button>
          </div>
        </section>
      </div>
    </>
  )
}

export function QuizPage() {
  const { id = '' } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const progress = useProgress()
  const [started, setStarted] = useState(false)

  const cfg = useMemo(() => {
    if (id === 'practice') {
      const e = getEntity(sp.get('entity') ?? '')
      if (!e) return null
      const qs = questionsFor(e.id)
      return { quizId: `mini:${e.id}`, title: t('Practice · {title}', { title: e.title }), description: t('Every question tagged to {title}.', { title: e.title }), questionIds: qs.map((q) => q.id), objectives: [...new Set(qs.map((q) => q.objective))], minutes: Math.max(1, qs.length) }
    }
    if (id === 'review') {
      const latest = latestResults(progress)
      const qs = getQuestions().filter((q) => latest.get(q.id) === false)
      return { quizId: 'review', title: t('Review: questions to revisit'), description: t('Questions you answered incorrectly last time.'), questionIds: qs.map((q) => q.id), objectives: [...new Set(qs.map((q) => q.objective))], minutes: Math.max(1, qs.length) }
    }
    const q = getQuiz(id)
    return q ? { quizId: q.id, title: q.title, description: q.description, questionIds: q.questionIds, objectives: q.objectives, minutes: q.minutes } : null
    // progress intentionally read once at mount for the review quiz
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sp])
  useDocumentTitle(cfg?.title)
  if (!cfg) return <Missing what="quiz" />
  if (cfg.questionIds.length === 0) return <div className="page-x py-20"><EmptyState title={t('No questions to show')}>{t('There is nothing in this set yet.')} <Link to="/learn/quizzes" className="link-u">{t('Back to quizzes')}</Link></EmptyState></div>

  const kinds = [...new Set(cfg.questionIds.map((qid) => (getQuestion(qid) as Question).kind))]
  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn'), to: '/learn' }, { label: t('Quizzes'), to: '/learn/quizzes' }, { label: cfg.title }]} />
      <div className="page-x py-10 sm:py-14">
        {!started ? (
          <div className="mx-auto max-w-3xl">
            <p className="label">{t('{questions} · about {minutes}', { questions: questionsLabel(cfg.questionIds.length), minutes: minutesLabel(cfg.minutes) })}</p>
            <h1 className="page-title mt-4">{cfg.title}</h1>
            <p className="page-intro mt-4">{cfg.description}</p>
            <div className="mt-8 grid gap-8 border-t border-ink pt-6 sm:grid-cols-2">
              <div><p className="label mb-2">{t('You will practise')}</p><ul className="space-y-1.5 text-sm">{cfg.objectives.map((o) => <li key={o}>• {getObjective(o)?.text}</li>)}</ul></div>
              <div><p className="label mb-2">{t('Question types')}</p><ul className="flex flex-wrap gap-1.5">{kinds.map((k) => <li key={k} className="border border-rule px-2 py-1 text-xs">{KIND_NAMES[k]}</li>)}</ul></div>
            </div>
            <div className="mt-8 flex gap-3"><button type="button" className="btn btn-solid" onClick={() => setStarted(true)}>{t('Begin')} <ArrowRight size={16} /></button><Link to="/learn/quizzes" className="btn btn-ghost">{t('Back')}</Link></div>
          </div>
        ) : (
          <QuizPlayer questionIds={cfg.questionIds} quizId={cfg.quizId} title={cfg.title} onExit={() => nav('/learn/quizzes')} />
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

export function ProgressPage() {
  useDocumentTitle(t('Learning progress'))
  const progress = useProgress()
  const latest = latestResults(progress)
  const qs = getQuestions()
  const answered = qs.filter((q) => latest.has(q.id))
  const correct = answered.filter((q) => latest.get(q.id))
  const byObjective = getObjectives().map((o) => {
    const list = qs.filter((q) => q.objective === o.id)
    const a = list.filter((q) => latest.has(q.id))
    const c = a.filter((q) => latest.get(q.id))
    return { o, total: list.length, answered: a.length, correct: c.length }
  })
  const subjects = allEntities().filter((e) => ['movement', 'school', 'collective', 'tradition', 'style', 'artist', 'artwork'].includes(e.type))
    .map((e) => ({ e, m: mastery(progress, e.id) })).filter((x) => x.m.answered > 0).sort((a, b) => a.m.correct / a.m.answered - b.m.correct / b.m.answered)
  const [confirm, setConfirm] = useState(false)
  const history = [...progress.attempts].reverse().slice(0, 12)
  const title = (quizId: string) => quizId.startsWith('mini:') ? t('Mini quiz · {title}', { title: getEntity(quizId.slice(5))?.title ?? '' }) : quizId === 'review' ? t('Review') : getQuiz(quizId)?.title ?? quizId

  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn'), to: '/learn' }, { label: t('Progress') }]} />
      <PageHeader eyebrow={t('Learn')} title={t('Your progress')} intro={t('Stored only in this browser. Clearing site data or switching device starts fresh.')} />
      <div className="page-x space-y-16 pb-24">
        <section className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4 [&>*]:bg-paper" aria-label={t('Summary')}>
          {[[String(progress.attempts.length), t('quiz attempts')], [`${correct.length}/${answered.length || 0}`, t('questions currently correct')], [`${answered.length}/${qs.length}`, t('questions seen')], [String(progress.viewed.length), t('pages visited')]].map(([n, l]) => (
            <div key={l} className="p-6"><p className="font-serif text-6xl leading-none">{n}</p><p className="mt-2 text-sm text-muted">{l}</p></div>
          ))}
        </section>

        <section>
          <SectionHeading no="◦" label={t('By learning objective')} title={t('What you can do')} />
          <ul className="grid gap-x-12 md:grid-cols-2">
            {byObjective.map(({ o, total, answered: a, correct: c }) => (
              <li key={o.id} className="border-t border-rule py-4">
                <p>{o.text}</p>
                <div className="mt-3 h-[6px] bg-rule" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={c} aria-label={o.text}><div className="h-full bg-artist transition-all" style={{ width: `${total ? (c / total) * 100 : 0}%` }} /></div>
                <p className="mt-1 text-xs text-muted">{t('{correct} correct · {seen} seen · {total} in the bank', { correct: c, seen: a, total })}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading no="◦" label={t('By subject')} title={t('Strongest and weakest')} />
          {subjects.length === 0 ? <EmptyState title={t('No quiz answers yet')}>{t('Take a quiz and your mastery of each artist, work and movement appears here.')}</EmptyState> : (
            <ul>
              {subjects.map(({ e, m }) => (
                <li key={e.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-rule py-3 sm:grid-cols-[14rem_1fr_6rem]">
                  <span><Link to={entityPath(e)} className="font-serif text-xl link-u">{e.title}</Link></span>
                  <span className="hidden h-[6px] bg-rule sm:block"><span className="block h-full bg-artist" style={{ width: `${(m.correct / Math.max(m.answered, 1)) * 100}%` }} /></span>
                  <span className="text-right text-sm text-muted">{t('{correct}/{answered} correct', { correct: m.correct, answered: m.answered })}</span>
                </li>
              ))}
              <li className="rule-t" />
            </ul>
          )}
        </section>

        <section>
          <SectionHeading no="◦" label={t('Learning paths')} title={t('Where you are')} />
          <div className="grid gap-5 md:grid-cols-3">
            {getPaths().map((p) => { const pr = pathProgress(p, progress); return (
              <Link key={p.id} to={`/learn/path/${p.id}`} className="card-hover border border-rule p-5">
                <p className="font-serif text-2xl leading-tight">{p.title}</p>
                <div className="mt-4 h-[3px] bg-rule"><div className="h-full bg-ink" style={{ width: `${pr.pct}%` }} /></div>
                <p className="mt-2 text-sm text-muted">{t('{done} of {total} complete', { done: pr.done, total: pr.total })}</p>
              </Link>
            ) })}
          </div>
        </section>

        <section>
          <SectionHeading no="◦" label={t('History')} title={t('Recent attempts')} />
          {history.length === 0 ? <p className="text-muted">{t('No attempts yet.')} <Link to="/learn/quizzes" className="link-u text-ink">{t('Take a quiz')}</Link>.</p> : (
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{t('Recent quiz attempts')}</caption>
              <thead><tr className="border-y border-ink"><th className="py-2 pr-4 label font-medium">{t('Quiz')}</th><th className="py-2 pr-4 label font-medium">{t('Score')}</th><th className="py-2 label font-medium">{t('When')}</th></tr></thead>
              <tbody>{history.map((a, i) => <tr key={i} className="border-b border-rule"><td className="py-3 pr-4">{title(a.quizId)}</td><td className="py-3 pr-4 font-medium">{a.score}/{a.total}</td><td className="py-3 text-muted">{new Date(a.at).toLocaleString(lang === 'el' ? 'el-GR' : undefined)}</td></tr>)}</tbody>
            </table>
          )}
        </section>

        <section className="border-t border-ink pt-6">
          {!confirm ? <button type="button" className="btn btn-ghost" onClick={() => setConfirm(true)}>{t('Reset all progress…')}</button> : (
            <div className="flex flex-wrap items-center gap-3" role="alertdialog" aria-label={t('Confirm reset')}><p className="text-sm">{t('Erase quiz history, path progress, saved items and visited pages from this browser?')}</p>
              <button type="button" className="btn btn-solid" onClick={() => { resetProgress(); setConfirm(false) }}>{t('Yes, erase')}</button><button type="button" className="btn btn-ghost" onClick={() => setConfirm(false)}>{t('Cancel')}</button></div>
          )}
        </section>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

export function SavedPage() {
  useDocumentTitle(t('Saved content'))
  const { saved, viewed } = useProgress()
  const ents = saved.map((id) => getEntity(id)).filter(Boolean) as Entity[]
  const [hintPre, hintPost] = t('Use the {save} button on any page — or the bookmark on timeline and map previews — to collect it here.').split('{save}')
  const recent = [...viewed].reverse().slice(0, 6).map((id) => getEntity(id)).filter(Boolean) as Entity[]
  return (
    <>
      <Breadcrumbs items={[{ label: t('Learn'), to: '/learn' }, { label: t('Saved') }]} />
      <PageHeader eyebrow={t('Learn')} title={t('Saved content')} intro={t('Anything you bookmark appears here. Saved items live in this browser only.')} />
      <div className="page-x space-y-16 pb-24">
        {ents.length === 0 ? (
          <EmptyState title={t('Nothing saved yet')}>{hintPre}<strong>{t('Save')}</strong>{hintPost}
            <div className="mt-4"><Link to="/explore/browse" className="btn btn-solid">{t('Browse to find something')}</Link></div></EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ents.map((e) => <div key={e.id}><EntityCard entity={e} /><div className="mt-1 flex justify-between"><TypeBadge type={e.type} /></div></div>)}</div>
        )}
        {recent.length > 0 && (
          <section><SectionHeading no="◦" label={t('History')} title={t('Recently visited')} />
            <div>{recent.map((e) => <EntityCard key={e.id} entity={e} variant="row" />)}<div className="rule-t" /></div></section>
        )}
      </div>
    </>
  )
}
