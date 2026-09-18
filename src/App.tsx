import { useEffect, useMemo, useState } from 'react'
import catalogJson from './data/questions.json'
import { formatTime, pickExam, scoreExam } from './lib/exam'
import {
  loadProgress,
  markAnswer,
  recordExam,
  wrongIds,
} from './lib/progress'
import type { Catalog, Progress, Question } from './types'

const catalog = catalogJson as Catalog
const LETTERS = ['A', 'B', 'C', 'D'] as const

type View = 'home' | 'learn' | 'exam' | 'result' | 'legal'
type Filter = 'all' | 'bw' | 'general' | 'wrong' | string

function filterQuestions(questions: Question[], filter: Filter, progress: Progress) {
  if (filter === 'all') return questions
  if (filter === 'bw') return questions.filter((q) => q.pool === 'bw')
  if (filter === 'general') return questions.filter((q) => q.pool === 'general')
  if (filter === 'wrong') {
    const ids = new Set(wrongIds(progress))
    return questions.filter((q) => ids.has(q.id))
  }
  return questions.filter((q) => q.topic === filter)
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [progress, setProgress] = useState<Progress>(() =>
    typeof localStorage === 'undefined' ? { seen: {}, exams: [] } : loadProgress(),
  )
  const [filter, setFilter] = useState<Filter>('all')
  const [learnIndex, setLearnIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [exam, setExam] = useState<Question[]>([])
  const [examIndex, setExamIndex] = useState(0)
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({})
  const [secondsLeft, setSecondsLeft] = useState(catalog.examMinutes * 60)
  const [result, setResult] = useState<ReturnType<typeof scoreExam> | null>(null)

  const learnList = useMemo(
    () => filterQuestions(catalog.questions, filter, progress),
    [filter, progress],
  )
  const currentLearn = learnList[learnIndex]
  const currentExam = exam[examIndex]
  const topics = useMemo(() => {
    const set = new Set(catalog.questions.map((q) => q.topic))
    return [...set]
  }, [])
  const seenCount = Object.keys(progress.seen).length
  const knownCount = Object.values(progress.seen).filter((s) => s.correct).length
  const errorCount = wrongIds(progress).length
  const lastExam = progress.exams[0]

  useEffect(() => {
    if (view !== 'exam' || result) return
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [view, result])

  useEffect(() => {
    if (view === 'exam' && secondsLeft === 0 && !result && exam.length > 0) {
      const scored = scoreExam(exam, examAnswers, catalog.passScore)
      setResult(scored)
      setProgress(recordExam(progress, scored))
      setView('result')
    }
  }, [secondsLeft, view, result, exam, examAnswers, progress])

  function startLearn(nextFilter: Filter) {
    setFilter(nextFilter)
    setLearnIndex(0)
    setPicked(null)
    setView('learn')
  }

  function startExam() {
    const next = pickExam(catalog.questions)
    setExam(next)
    setExamIndex(0)
    setExamAnswers({})
    setSecondsLeft(catalog.examMinutes * 60)
    setResult(null)
    setView('exam')
  }

  function chooseLearn(index: number) {
    if (!currentLearn || picked !== null) return
    setPicked(index)
    setProgress(markAnswer(progress, currentLearn.id, index === currentLearn.correct))
  }

  function nextLearn() {
    setPicked(null)
    setLearnIndex((i) => Math.min(i + 1, Math.max(learnList.length - 1, 0)))
  }

  function prevLearn() {
    setPicked(null)
    setLearnIndex((i) => Math.max(i - 1, 0))
  }

  function finishExam(answers: Record<string, number>) {
    const scored = scoreExam(exam, answers, catalog.passScore)
    setResult(scored)
    setProgress(recordExam(progress, scored))
    setView('result')
  }

  return (
    <div className="app">
      <header className="top">
        <button type="button" className="brand" onClick={() => setView('home')}>
          LiD für Milos
        </button>
        {view === 'exam' && !result ? (
          <span className={secondsLeft < 300 ? 'timer warn' : 'timer'}>
            {formatTime(secondsLeft)}
          </span>
        ) : (
          <span className="badge">Baden-Württemberg</span>
        )}
      </header>

      {view === 'home' && (
        <main className="stack">
          <section className="hero card">
            <p className="kicker">Übungstest · B1</p>
            <h1>Leben in Deutschland</h1>
            <p className="lead">
              300 allgemeine Fragen plus 10 Fragen zu Baden-Württemberg.
              Prüfung: 33 Fragen, 60 Minuten, 17 Richtige zum Bestehen.
            </p>
            <div className="actions">
              <button type="button" className="btn primary" onClick={() => startLearn('all')}>
                Üben
              </button>
              <button type="button" className="btn" onClick={startExam}>
                Prüfung starten
              </button>
            </div>
          </section>

          <section className="stats">
            <article>
              <strong>{knownCount}</strong>
              <span>richtig gelernt</span>
            </article>
            <article>
              <strong>{seenCount}/310</strong>
              <span>gesehen</span>
            </article>
            <article>
              <strong>{errorCount}</strong>
              <span>Fehler</span>
            </article>
          </section>

          {lastExam && (
            <p className="last">
              Letzte Prüfung: {lastExam.correct}/{lastExam.total}{' '}
              {lastExam.passed ? '— bestanden' : '— nicht bestanden'}
            </p>
          )}

          <div className="actions wrap">
            <button type="button" className="btn ghost" onClick={() => startLearn('bw')}>
              Nur BW (10)
            </button>
            {errorCount > 0 && (
              <button type="button" className="btn ghost" onClick={() => startLearn('wrong')}>
                Fehler wiederholen
              </button>
            )}
          </div>
        </main>
      )}

      {view === 'learn' && (
        <main className="stack">
          <label className="filter">
            Thema
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value)
                setLearnIndex(0)
                setPicked(null)
              }}
            >
              <option value="all">Alle Fragen (310)</option>
              <option value="bw">Baden-Württemberg (10)</option>
              <option value="general">Nur allgemein (300)</option>
              <option value="wrong">Nur Fehler</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>

          {learnList.length === 0 || !currentLearn ? (
            <p className="card">Keine Fragen in diesem Filter.</p>
          ) : (
            <>
              <p className="meta">
                {learnIndex + 1} / {learnList.length} · {currentLearn.topic}
              </p>
              <QuestionBlock
                question={currentLearn}
                picked={picked}
                reveal
                onPick={chooseLearn}
              />
              <div className="actions">
                <button type="button" className="btn ghost" onClick={prevLearn} disabled={learnIndex === 0}>
                  Zurück
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={nextLearn}
                  disabled={learnIndex >= learnList.length - 1}
                >
                  Weiter
                </button>
              </div>
            </>
          )}
        </main>
      )}

      {view === 'exam' && currentExam && (
        <main className="stack">
          <p className="meta">
            Frage {examIndex + 1} / {exam.length}
            {currentExam.pool === 'bw' ? ' · Baden-Württemberg' : ''}
          </p>
          <QuestionBlock
            question={currentExam}
            picked={examAnswers[currentExam.id] ?? null}
            reveal={false}
            onPick={(index) =>
              setExamAnswers((current) => ({ ...current, [currentExam.id]: index }))
            }
          />
          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setExamIndex((i) => Math.max(0, i - 1))}
              disabled={examIndex === 0}
            >
              Zurück
            </button>
            {examIndex < exam.length - 1 ? (
              <button type="button" className="btn primary" onClick={() => setExamIndex((i) => i + 1)}>
                Weiter
              </button>
            ) : (
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  const open = exam.length - Object.keys(examAnswers).length
                  if (open > 0 && !window.confirm(`${open} Fragen ohne Antwort. Trotzdem abgeben?`)) {
                    return
                  }
                  finishExam(examAnswers)
                }}
              >
                Abgeben
              </button>
            )}
          </div>
        </main>
      )}

      {view === 'result' && result && (
        <main className="stack">
          <section className={`card result ${result.passed ? 'pass' : 'fail'}`}>
            <p className="kicker">{result.passed ? 'Bestanden' : 'Nicht bestanden'}</p>
            <h1>
              {result.correct} / {result.total}
            </h1>
            <p>Zum Bestehen brauchst du 17 richtige Antworten.</p>
          </section>
          <ul className="review">
            {exam.map((q, i) => {
              const chosen = examAnswers[q.id]
              const ok = chosen === q.correct
              return (
                <li key={q.id} className={ok ? 'ok' : 'bad'}>
                  <strong>
                    {i + 1}. {ok ? 'Richtig' : 'Falsch'}
                  </strong>
                  <span>{q.question}</span>
                  {!ok && <em>{q.explanation}</em>}
                </li>
              )
            })}
          </ul>
          <div className="actions">
            <button type="button" className="btn primary" onClick={startExam}>
              Nochmal prüfen
            </button>
            <button type="button" className="btn" onClick={() => setView('home')}>
              Start
            </button>
          </div>
        </main>
      )}

      {view === 'legal' && (
        <main className="stack card legal">
          <h1>Impressum</h1>
          <p>
            Hasi Elektronic · Hamdi Güncavdı
            <br />
            Grabenstraße 18
            <br />
            71665 Vaihingen an der Enz
            <br />
            07042 / 16391 · info@hasi-elektronic.de
          </p>
          <h2>Datenschutz</h2>
          <p>
            Diese Seite speichert Fortschritt nur lokal in deinem Browser
            (localStorage). Es gibt kein Konto, keine Cookies von Dritten und
            keine Analyse.
          </p>
          <h2>Quelle</h2>
          <p>{catalog.source}. Dies ist keine amtliche Prüfung.</p>
        </main>
      )}

      <footer>
        <button type="button" onClick={() => setView('legal')}>
          Impressum
        </button>
        <span>Quelle: BAMF-Katalog 07.05.2025</span>
      </footer>
    </div>
  )
}

function QuestionBlock({
  question,
  picked,
  reveal,
  onPick,
}: {
  question: Question
  picked: number | null
  reveal: boolean
  onPick: (index: number) => void
}) {
  const show = reveal && picked !== null
  return (
    <section className="card question">
      <h2>{question.question}</h2>
      {question.image && (
        <img src={question.image} alt="Fragebild" className="qimg" />
      )}
      {question.imageNote && <p className="note">{question.imageNote}</p>}
      <div className="choices">
        {question.answers.map((answer, index) => {
          let extra = ''
          if (show) {
            if (index === question.correct) extra = ' good'
            else if (index === picked) extra = ' bad'
          } else if (picked === index) extra = ' selected'
          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              className={`choice${extra}`}
              onClick={() => onPick(index)}
              disabled={show}
            >
              <span>{LETTERS[index]}</span>
              {answer}
            </button>
          )
        })}
      </div>
      {show && <p className="why">{question.explanation}</p>}
    </section>
  )
}
