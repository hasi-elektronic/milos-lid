import { describe, expect, it } from 'vitest'
import catalog from '../data/questions.json'
import { explainQuestion } from './explain'
import { defineAnswer, findGlossaryHits, splitGlossary } from './glossary'
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

  it('explains Easter distractors by festival, without echoing the option', () => {
    expect(defineAnswer('Eier bemalen')).toMatch(/Ostern/i)
    expect(defineAnswer('einen Tannenbaum schmücken')).toMatch(/Weihnachten/i)
    expect(defineAnswer('Kürbisse vor die Tür stellen')).toMatch(/Halloween/i)
    expect(defineAnswer('Raketen in die Luft schießen')).toMatch(/Silvester|Neujahr/i)
    expect(defineAnswer('Eier bemalen').toLowerCase()).not.toBe('eier bemalen')
  })

  it('defines Fraktion like a dictionary', () => {
    expect(defineAnswer('Fraktion')).toMatch(/Abgeordnete einer Partei/i)
    expect(defineAnswer('Verband')).toMatch(/Vereinen|Interessen/i)
    expect(defineAnswer('Opposition')).toMatch(/nicht mitregieren|nicht in der Regierung/i)
  })
})

describe('explain', () => {
  it('lists all four answers as dictionary entries', () => {
    const q = catalog.questions.find((item) =>
      item.answers.includes('Fraktion'),
    ) as Question
    const detail = explainQuestion(q)
    expect(detail.entries).toHaveLength(4)
    const fraktion = detail.entries.find((e) => e.text === 'Fraktion')
    expect(fraktion?.correct).toBe(true)
    expect(fraktion?.meaning).toMatch(/Parlament/i)
    expect(detail.entries.every((e) => !e.meaning.includes('passt nicht'))).toBe(true)
  })

  it('covers every catalog answer without echoing the option', () => {
    for (const q of catalog.questions) {
      const detail = explainQuestion(q as Question)
      for (const entry of detail.entries) {
        expect(entry.meaning.length).toBeGreaterThan(2)
        expect(entry.meaning.replace(/[. ]/g, '').toLowerCase()).not.toBe(
          entry.text.replace(/[. ]/g, '').toLowerCase(),
        )
      }
    }
  })

  it('defines BW Landtag years as years, not as "wrong"', () => {
    const q = catalog.questions.find((item) => item.id === 'bw-03') as Question
    const detail = explainQuestion(q)
    expect(detail.entries.find((e) => e.correct)?.meaning).toBe('5 Jahre')
    expect(detail.entries.find((e) => e.text === '3')?.meaning).toBe('3 Jahre')
  })
})
