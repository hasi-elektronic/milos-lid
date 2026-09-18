import { describe, expect, it } from 'vitest'
import catalog from '../data/questions.json'
import type { Progress, Question } from '../types'
import { DAILY_SIZE, pickDaily, rngFromString } from './daily'
import { defineAnswer } from './glossary'

describe('defineAnswer long options', () => {
  it('never leaves a long clause empty', () => {
    const sample =
      'Alle Einwohnerinnen / Einwohner und der Staat müssen sich an die Gesetze halten.'
    expect(defineAnswer(sample).length).toBeGreaterThan(10)
    expect(defineAnswer(sample)).toMatch(/Gesetze/i)
  })
})

describe('pickDaily', () => {
  it('picks 20 unique questions and prefers wrong ones', () => {
    const questions = catalog.questions as Question[]
    const progress: Progress = {
      seen: {
        [questions[0].id]: { correct: false, at: 1 },
        [questions[1].id]: { correct: true, at: 1 },
      },
      exams: [],
    }
    const daily = pickDaily(questions, progress, rngFromString('2026-09-18'))
    expect(daily).toHaveLength(DAILY_SIZE)
    expect(new Set(daily.map((q) => q.id)).size).toBe(DAILY_SIZE)
    expect(daily.some((q) => q.id === questions[0].id)).toBe(true)
  })
})
