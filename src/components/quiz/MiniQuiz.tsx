import { useState } from 'react'
import { questionsFor } from '@/lib/repo'
import { t } from '@/i18n'
import { QuizPlayer } from './QuizPlayer'

/** Short practice set for any entity, assembled from the question bank by entity reference. */
export function MiniQuiz({ entityId, entityTitle, max = 3 }: { entityId: string; entityTitle: string; max?: number }) {
  const all = questionsFor(entityId)
  const [started, setStarted] = useState(false)
  if (!all.length) return <p className="text-muted">{t('No practice questions are tagged to {title} yet.', { title: entityTitle })}</p>

  // prefer a spread of question kinds
  const seen = new Set<string>()
  const picked = [...all].sort((a, b) => a.kind.localeCompare(b.kind)).filter((q) => (seen.has(q.kind) ? false : (seen.add(q.kind), true))).slice(0, max)
  for (const q of all) if (picked.length < max && !picked.includes(q)) picked.push(q)

  if (!started) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-6 border border-ink bg-surface p-6 sm:p-8">
        <div className="max-w-xl">
          <p className="font-serif text-3xl leading-tight">{picked.length === 1 ? t('{n} quick question on {title}', { n: picked.length, title: entityTitle }) : t('{n} quick questions on {title}', { n: picked.length, title: entityTitle })}</p>
          <p className="mt-2 text-muted">{picked.length > 1 ? t('Takes about {n} minutes. Your result is saved on this device.', { n: picked.length }) : t('Takes about {n} minute. Your result is saved on this device.', { n: 1 })}</p>
        </div>
        <button type="button" className="btn btn-solid" onClick={() => setStarted(true)}>{t('Start mini quiz')}</button>
      </div>
    )
  }
  return (
    <div className="border border-ink bg-surface p-5 sm:p-8">
      <QuizPlayer compact questionIds={picked.map((q) => q.id)} quizId={`mini:${entityId}`} title={t('Mini quiz · {title}', { title: entityTitle })} onExit={() => setStarted(false)} exitLabel={t('Close')} />
    </div>
  )
}
