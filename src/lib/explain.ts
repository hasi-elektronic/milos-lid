import type { Question } from '../types'

export type OtherExplain = {
  text: string
  why: string
}

export type DetailExplain = {
  headline: string
  sentence: string
  note: string
  others: OtherExplain[]
}

const TOPIC_NOTE: Record<string, string> = {
  Recht: 'Viele Rechte stehen im Grundgesetz. Sie gelten in ganz Deutschland.',
  Staat: 'Deutschland ist ein demokratischer Rechtsstaat: alle müssen sich an die Gesetze halten.',
  Politik: 'In einer Demokratie wählen die Menschen das Parlament. Die Wahl ist frei und geheim.',
  Geschichte: 'Die Frage gehört zur deutschen Geschichte. Merke dir das Datum oder das Ereignis.',
  'Gesellschaft und Familie': 'In Deutschland gibt es klare Regeln für Familie, Schule und Zusammenleben.',
  'Europa und Welt': 'Deutschland arbeitet mit anderen Staaten zusammen, zum Beispiel in der EU.',
  'Bund und Länder': 'Deutschland hat Bund und 16 Länder. Sie teilen sich die Aufgaben.',
  'Religion und Kultur': 'Du darfst glauben, was du möchtest. Feste und Bräuche gehören oft zur Kultur.',
  'Bildung und Arbeit': 'Schule, Ausbildung und Arbeit haben in Deutschland feste Regeln.',
  Wirtschaft: 'Steuern und Versicherungen finanzieren den Staat und die Absicherung.',
  'Baden-Württemberg': 'Das ist eine Landesfrage. Du brauchst Wissen über Baden-Württemberg.',
}

function completeStem(question: string, answer: string): string {
  const cleanAnswer = answer.replace(/\.$/, '')
  if (question.includes('…') || question.includes('...')) {
    const filled = question.replace('...', '…').replace('…', cleanAnswer)
    return /[.?!]$/.test(filled) ? filled : `${filled}.`
  }
  const trimmed = question.trim()
  if (trimmed.endsWith('?')) return `${trimmed} Antwort: ${cleanAnswer}.`
  return `${trimmed} ${cleanAnswer}.`
}

function whyWrong(wrong: string, correct: string): string {
  const w = wrong.trim()
  const c = correct.trim()
  if (/^\d+$/.test(w) && /^\d+$/.test(c)) {
    return `${w} ist die falsche Zahl. Richtig ist ${c}.`
  }
  if (/^Bild\s+\d$/i.test(w)) {
    return `Nicht dieses Bild. Richtig ist ${c}.`
  }
  return `„${w}“ passt nicht zur Frage. Richtig ist: ${c}`
}

export function explainQuestion(question: Question): DetailExplain {
  const correct = question.answers[question.correct] ?? ''
  const others = question.answers
    .filter((_, index) => index !== question.correct)
    .map((text) => ({ text, why: whyWrong(text, correct) }))
  return {
    headline: question.explanation,
    sentence: completeStem(question.question, correct),
    note: TOPIC_NOTE[question.topic] ?? 'Lies die Frage genau. Nur eine Antwort ist richtig.',
    others,
  }
}
