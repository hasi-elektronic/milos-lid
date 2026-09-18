import { describe, expect, it } from 'vitest'
import catalog from '../data/questions.json'
import { formatTime, pickExam, scoreExam, shuffle } from './exam'

function rngFrom(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

describe('catalog', () => {
  const questions = catalog.questions

  it('has 300 general + 10 BW questions', () => {
    expect(questions).toHaveLength(310)
    expect(questions.filter((q) => q.pool === 'general')).toHaveLength(300)
    expect(questions.filter((q) => q.pool === 'bw')).toHaveLength(10)
  })

  it('has unique ids and four answers each', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(310)
    for (const q of questions) {
      expect(q.answers).toHaveLength(4)
      expect(q.correct).toBeGreaterThanOrEqual(0)
      expect(q.correct).toBeLessThan(4)
      expect(q.question.length).toBeGreaterThan(8)
      expect(q.explanation).toContain('Richtig ist:')
    }
  })

  it('keeps known BW answers', () => {
    const byId = Object.fromEntries(questions.map((q) => [q.id, q]))
    expect(byId['bw-02']?.answers[byId['bw-02'].correct]).toContain(
      'Neckar-Odenwald',
    )
    expect(byId['bw-03']?.answers[byId['bw-03'].correct]).toBe('5')
    expect(byId['bw-04']?.answers[byId['bw-04'].correct]).toBe('16')
    expect(byId['bw-05']?.answers[byId['bw-05'].correct]).toBe('schwarz-gold')
    expect(byId['bw-07']?.answers[byId['bw-07'].correct]).toBe('Stuttgart')
    expect(byId['bw-09']?.answers[byId['bw-09'].correct]).toContain(
      'Ministerpräsident',
    )
    expect(byId['bw-10']?.answers[byId['bw-10'].correct]).toContain('Außenminister')
  })
})

describe('exam', () => {
  it('picks 30 general and 3 BW', () => {
    const exam = pickExam(catalog.questions, rngFrom(42))
    expect(exam).toHaveLength(33)
    expect(exam.filter((q) => q.pool === 'general')).toHaveLength(30)
    expect(exam.filter((q) => q.pool === 'bw')).toHaveLength(3)
    expect(new Set(exam.map((q) => q.id)).size).toBe(33)
  })

  it('scores pass at 17', () => {
    const exam = catalog.questions.slice(0, 33)
    const answers: Record<string, number> = {}
    exam.forEach((q, i) => {
      answers[q.id] = i < 17 ? q.correct : (q.correct + 1) % 4
    })
    const result = scoreExam(exam, answers, 17)
    expect(result.correct).toBe(17)
    expect(result.passed).toBe(true)
  })

  it('shuffles without losing items', () => {
    const items = [1, 2, 3, 4, 5]
    expect(shuffle(items, rngFrom(7)).sort()).toEqual(items)
    expect(items).toEqual([1, 2, 3, 4, 5])
  })

  it('formats the timer', () => {
    expect(formatTime(3600)).toBe('60:00')
    expect(formatTime(59)).toBe('00:59')
    expect(formatTime(0)).toBe('00:00')
  })
})
