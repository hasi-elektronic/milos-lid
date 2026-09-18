import { describe, expect, it } from 'vitest'
import type { Progress, Question } from '../types'
import { examTopicStats, topicStats } from './topics'

const q = (
  id: string,
  topic: string,
): Question => ({
  id,
  num: 1,
  pool: 'general',
  topic,
  question: 'x',
  answers: ['a', 'b', 'c', 'd'],
  correct: 0,
  explanation: 'Richtig ist: a',
})

describe('topicStats', () => {
  const questions = [
    q('g-1', 'Recht'),
    q('g-2', 'Recht'),
    q('g-3', 'Geschichte'),
    q('bw-1', 'Baden-Württemberg'),
  ]

  it('sorts weakest practiced topics first', () => {
    const progress: Progress = {
      seen: {
        'g-1': { correct: false, at: 1 },
        'g-2': { correct: true, at: 1 },
        'g-3': { correct: true, at: 1 },
      },
      exams: [],
    }
    const rows = topicStats(questions, progress)
    expect(rows[0]?.topic).toBe('Recht')
    expect(rows[0]?.rate).toBe(0.5)
    expect(rows[0]?.wrong).toBe(1)
    expect(rows.find((r) => r.topic === 'Baden-Württemberg')?.rate).toBeNull()
  })

  it('summarizes an exam by topic', () => {
    const exam = [q('a', 'Recht'), q('b', 'Recht'), q('c', 'Politik')]
    const rows = examTopicStats(exam, { a: 0, b: 1, c: 0 })
    const recht = rows.find((r) => r.topic === 'Recht')
    expect(recht?.correct).toBe(1)
    expect(recht?.seen).toBe(2)
  })
})
