import type { DailySet, Progress } from '../types'

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
      daily: parsed.daily,
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
  const next: Progress = { seen, exams: progress.exams, daily: progress.daily }
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
    daily: progress.daily,
  }
  saveProgress(next)
  return next
}

export function saveDaily(progress: Progress, daily: DailySet): Progress {
  const next: Progress = { ...progress, daily }
  saveProgress(next)
  return next
}

export function markDailyAnswered(progress: Progress, id: string): Progress {
  if (!progress.daily) return progress
  if (progress.daily.answered.includes(id)) return progress
  return saveDaily(progress, {
    ...progress.daily,
    answered: [...progress.daily.answered, id],
  })
}

export function wrongIds(progress: Progress): string[] {
  return Object.entries(progress.seen)
    .filter(([, value]) => !value.correct)
    .map(([id]) => id)
}
