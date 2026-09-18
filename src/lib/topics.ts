import type { Progress, Question } from '../types'

export type TopicStat = {
  topic: string
  total: number
  seen: number
  correct: number
  wrong: number
  rate: number | null
}

export function topicStats(questions: Question[], progress: Progress): TopicStat[] {
  const groups = new Map<string, Question[]>()
  for (const question of questions) {
    const list = groups.get(question.topic) ?? []
    list.push(question)
    groups.set(question.topic, list)
  }
  const stats: TopicStat[] = []
  for (const [topic, list] of groups) {
    let seen = 0
    let correct = 0
    for (const question of list) {
      const record = progress.seen[question.id]
      if (!record) continue
      seen += 1
      if (record.correct) correct += 1
    }
    stats.push({
      topic,
      total: list.length,
      seen,
      correct,
      wrong: seen - correct,
      rate: seen === 0 ? null : correct / seen,
    })
  }
  return stats.sort((a, b) => {
    if (a.rate === null && b.rate === null) return b.total - a.total
    if (a.rate === null) return 1
    if (b.rate === null) return -1
    if (a.rate !== b.rate) return a.rate - b.rate
    return b.wrong - a.wrong
  })
}

export function examTopicStats(
  exam: Question[],
  answers: Record<string, number>,
): TopicStat[] {
  const fake: Progress = { seen: {}, exams: [] }
  for (const question of exam) {
    const chosen = answers[question.id]
    if (chosen === undefined) continue
    fake.seen[question.id] = { correct: chosen === question.correct, at: 0 }
  }
  return topicStats(exam, fake).filter((row) => row.seen > 0)
}
