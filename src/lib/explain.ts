import type { Question } from '../types'
import { defineAnswer } from './glossary'

export type DictEntry = {
  text: string
  meaning: string
  correct: boolean
}

export type DetailExplain = {
  correctText: string
  entries: DictEntry[]
}

export function explainQuestion(question: Question): DetailExplain {
  const correctText = question.answers[question.correct] ?? ''
  const entries = question.answers.map((text, index) => ({
    text,
    meaning: defineAnswer(text, question.question),
    correct: index === question.correct,
  }))
  return { correctText, entries }
}
