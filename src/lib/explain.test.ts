import { describe, expect, it } from 'vitest'
import catalog from '../data/questions.json'
import { explainQuestion } from './explain'
import { findGlossaryHits, splitGlossary } from './glossary'
import type { Question } from '../types'

describe('glossary', () => {
  it('finds Grundgesetz in a sentence', () => {
    const hits = findGlossaryHits('Wie heißt die deutsche Verfassung? Grundgesetz')
    expect(hits.some((h) => h.term === 'Grundgesetz')).toBe(true)
  })

  it('does not overlap longer phrases', () => {
    const parts = splitGlossary('Die Europäische Union ist wichtig.')
    const words = parts.filter((p) => p.kind === 'word')
    expect(words.some((w) => w.kind === 'word' && w.term === 'Europäische Union')).toBe(true)
  })
})

describe('explain', () => {
  it('completes a weil-stem and lists three wrong answers', () => {
    const q = catalog.questions.find((item) => item.id === 'g-001') as Question
    const detail = explainQuestion(q)
    expect(detail.sentence).toContain('Meinungsfreiheit')
    expect(detail.others).toHaveLength(3)
    expect(detail.note.length).toBeGreaterThan(20)
  })

  it('explains a wrong number for BW Landtag', () => {
    const q = catalog.questions.find((item) => item.id === 'bw-03') as Question
    const detail = explainQuestion(q)
    expect(detail.sentence).toContain('5')
    expect(detail.others.some((o) => o.why.includes('falsche Zahl'))).toBe(true)
  })
})
