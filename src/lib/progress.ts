import type { Progress } from '../types'

const KEY = 'milos-lid-v1'

const empty = (): Progress => ({ seen: {}, exams: [] })

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Progress
    if (!parsed || typeof parsed !== 'object') return empty()
    return {
      seen: parsed.seen ?? {},
      exams: Array.isArray(parsed.exams) ? parsed.exams : [],
    }
  } catch {
    return empty()
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function markAnswer(
  progress: Progress,
  id: string,
  correct: boolean,
): Progress {
  return markMany(progress, [{ id, correct }])
}

export function markMany(
  progress: Progress,
  items: { id: string; correct: boolean }[],
): Progress {
  if (items.length === 0) return progress
  const seen = { ...progress.seen }
  const at = Date.now()
  for (const item of items) {
    seen[item.id] = { correct: item.correct, at }
  }
  const next: Progress = { seen, exams: progress.exams }
  saveProgress(next)
  return next
}

export function recordExam(
  progress: Progress,
  result: { correct: number; total: number; passed: boolean },
): Progress {
  const next: Progress = {
    seen: progress.seen,
    exams: [
      { at: Date.now(), ...result },
      ...progress.exams,
    ].slice(0, 20),
  }
  saveProgress(next)
  return next
}

export function wrongIds(progress: Progress): string[] {
  return Object.entries(progress.seen)
    .filter(([, value]) => !value.correct)
    .map(([id]) => id)
}
