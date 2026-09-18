import type { Question } from '../types'

export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const current = next[i]
    const swap = next[j]
    if (current === undefined || swap === undefined) continue
    next[i] = swap
    next[j] = current
  }
  return next
}

export function pickExam(
  questions: Question[],
  rng: () => number = Math.random,
): Question[] {
  const general = questions.filter((q) => q.pool === 'general')
  const bw = questions.filter((q) => q.pool === 'bw')
  const pickedGeneral = shuffle(general, rng).slice(0, 30)
  const pickedBw = shuffle(bw, rng).slice(0, 3)
  return shuffle([...pickedGeneral, ...pickedBw], rng)
}

export function scoreExam(
  exam: Question[],
  answers: Record<string, number>,
  passScore = 17,
) {
  const correct = exam.filter((q) => answers[q.id] === q.correct).length
  return {
    correct,
    total: exam.length,
    unanswered: exam.filter((q) => answers[q.id] === undefined).length,
    passed: correct >= passScore,
  }
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
