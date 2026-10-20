import { useSyncExternalStore } from 'react'
import { getQuestion, questionsFor } from './repo'

/**
 * Local-only learning progress. Stored in localStorage under one key and exposed through
 * useSyncExternalStore so every component stays in sync. Every storage call is guarded: private
 * windows and blocked storage fall back to in-memory state without breaking the UI.
 */

export interface Attempt {
  quizId: string
  at: string
  score: number
  total: number
  results: { questionId: string; correct: boolean }[]
}

export interface ProgressState {
  v: 1
  attempts: Attempt[]
  steps: Record<string, string[]>
  saved: string[]
  viewed: string[]
}

const KEY = 'chronos.progress.v1'
const empty = (): ProgressState => ({ v: 1, attempts: [], steps: {}, saved: [], viewed: [] })

function load(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return empty()
    const p = JSON.parse(raw) as ProgressState
    return p && p.v === 1 ? { ...empty(), ...p } : empty()
  } catch {
    return empty()
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function commit(next: ProgressState) {
  state = next
  try { window.localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage unavailable: keep in memory */ }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
const snapshot = () => state

export const useProgress = (): ProgressState => useSyncExternalStore(subscribe, snapshot, snapshot)
export const getProgress = () => state

export const recordAttempt = (a: Attempt) => commit({ ...state, attempts: [...state.attempts, a].slice(-200) })
export const toggleSaved = (id: string) =>
  commit({ ...state, saved: state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id] })
export const markViewed = (id: string) => { if (!state.viewed.includes(id)) commit({ ...state, viewed: [...state.viewed, id] }) }
export const setStepDone = (pathId: string, stepId: string, done: boolean) => {
  const cur = state.steps[pathId] ?? []
  const next = done ? [...new Set([...cur, stepId])] : cur.filter((s) => s !== stepId)
  commit({ ...state, steps: { ...state.steps, [pathId]: next } })
}
export const resetProgress = () => commit(empty())

/* ---------------- derived ---------------- */

export const bestScore = (s: ProgressState, quizId: string) => {
  const a = s.attempts.filter((x) => x.quizId === quizId)
  if (!a.length) return undefined
  return a.reduce((best, x) => (x.score / x.total > best.score / best.total ? x : best))
}

/** Latest outcome per question across all attempts. */
export function latestResults(s: ProgressState): Map<string, boolean> {
  const m = new Map<string, boolean>()
  for (const a of s.attempts) for (const r of a.results) m.set(r.questionId, r.correct)
  return m
}

/** Mastery for an entity: share of its tagged questions last answered correctly. */
export function mastery(s: ProgressState, entityId: string): { correct: number; answered: number; total: number } {
  const qs = questionsFor(entityId)
  const latest = latestResults(s)
  let correct = 0, answered = 0
  for (const q of qs) { if (latest.has(q.id)) { answered++; if (latest.get(q.id)) correct++ } }
  return { correct, answered, total: qs.length }
}

export const questionExists = (id: string) => !!getQuestion(id)
