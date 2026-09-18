export type Pool = 'general' | 'bw'

export type Question = {
  id: string
  num: number
  pool: Pool
  topic: string
  question: string
  answers: string[]
  correct: number
  explanation: string
  image?: string
  imageNote?: string
}

export type Catalog = {
  source: string
  state: string
  passScore: number
  examQuestions: number
  examMinutes: number
  generalCount: number
  stateCount: number
  questions: Question[]
}

export type Progress = {
  seen: Record<string, { correct: boolean; at: number }>
  exams: { at: number; correct: number; total: number; passed: boolean }[]
}
