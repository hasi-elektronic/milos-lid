import type { Progress, Question } from '../types'
import { shuffle } from './exam'
import { topicStats } from './topics'

export function rngFromString(seed: string) {
  let value = 1
  for (let i = 0; i < seed.length; i++) {
    value = (value * 31 + seed.charCodeAt(i)) % 2147483647
  }
  if (value <= 0) value = 1
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export const DAILY_SIZE = 20

export function todayISO(now = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' })
}

export function pickDaily(
  questions: Question[],
  progress: Progress,
  rng: () => number = Math.random,
): Question[] {
  const wrong = questions.filter((q) => progress.seen[q.id]?.correct === false)
  const unseen = questions.filter((q) => !progress.seen[q.id])
  const weakTopics = new Set(
    topicStats(questions, progress)
      .filter((row) => row.rate !== null && row.rate < 0.8)
      .map((row) => row.topic),
  )
  const weak = questions.filter(
    (q) => weakTopics.has(q.topic) && progress.seen[q.id]?.correct !== true,
  )
  const picked: Question[] = []
  const seenIds = new Set<string>()
  for (const pool of [wrong, weak, unseen, questions]) {
    for (const question of shuffle(pool, rng)) {
      if (picked.length >= DAILY_SIZE) return picked
      if (seenIds.has(question.id)) continue
      seenIds.add(question.id)
      picked.push(question)
    }
  }
  return picked
}

export function dailyDone(progress: Progress, date = todayISO()): number {
  if (progress.daily?.date !== date) return 0
  const answered = new Set(progress.daily.answered)
  return progress.daily.ids.filter((id) => answered.has(id)).length
}
