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

type View = 'home' | 'briefing' | 'exam' | 'catalog' | 'result' | 'legal'
type ExamKind = 'official' | 'learn'
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
  const [catalogIndex, setCatalogIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [examKind, setExamKind] = useState<ExamKind>('official')
  const [exam, setExam] = useState<Question[]>([])
  const [examIndex, setExamIndex] = useState(0)
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({})
  const [secondsLeft, setSecondsLeft] = useState(catalog.examMinutes * 60)
  const [result, setResult] = useState<ReturnType<typeof scoreExam> | null>(null)

  const catalogList = useMemo(
    () => filterQuestions(catalog.questions, filter, progress),
    [filter, progress],
  )
  const currentCatalog = catalogList[catalogIndex]
  const currentExam = exam[examIndex]
  const topics = useMemo(() => {
    const set = new Set(catalog.questions.map((q) => q.topic))
    return [...set]
  }, [])
  const seenCount = Object.keys(progress.seen).length
  const knownCount = Object.values(progress.seen).filter((s) => s.correct).length
  const errorCount = wrongIds(progress).length
  const lastExam = progress.exams[0]
  const answeredCount = Object.keys(examAnswers).length
  const isOfficial = examKind === 'official' && view === 'exam'

  useEffect(() => {
    if (!isOfficial || result) return
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
  }, [isOfficial, result])

  useEffect(() => {
    if (isOfficial && secondsLeft === 0 && !result && exam.length > 0) {
      finishExam(examAnswers)
    }
  }, [secondsLeft, isOfficial, result, exam.length])

  function openCatalog(nextFilter: Filter) {
    setFilter(nextFilter)
    setCatalogIndex(0)
    setPicked(null)
    setView('catalog')
  }

  function prepareExam(kind: ExamKind) {
    setExamKind(kind)
    setExam(pickExam(catalog.questions))
    setExamIndex(0)
    setExamAnswers({})
    setPicked(null)
    setSecondsLeft(catalog.examMinutes * 60)
    setResult(null)
    if (kind === 'official') setView('briefing')
    else setView('exam')
  }

  function chooseLearn(index: number) {
    if (!currentCatalog || picked !== null) return
    setPicked(index)
    setProgress(markAnswer(progress, currentCatalog.id, index === currentCatalog.correct))
  }

  function chooseExam(index: number) {
    if (!currentExam) return
    if (examKind === 'learn' && picked !== null) return
    setExamAnswers((current) => ({ ...current, [currentExam.id]: index }))
    if (examKind === 'learn') {
      setPicked(index)
      setProgress(markAnswer(progress, currentExam.id, index === currentExam.correct))
    }
  }

  function goExam(next: number) {
    setExamIndex(next)
    const q = exam[next]
    setPicked(examKind === 'learn' && q ? (examAnswers[q.id] ?? null) : null)
  }

  function finishExam(answers: Record<string, number>) {
    const scored = scoreExam(exam, answers, catalog.passScore)
    setResult(scored)
    setProgress(recordExam(progress, scored))
    setView('result')
  }

  return (
    <div className="shell">
      <div className="flag" aria-hidden="true" />
      <div className="app">
        <header className="top">
          <button type="button" className="brand" onClick={() => setView('home')}>
            <span className="mark" aria-hidden="true" />
            <span>
              <strong>LiD für Milos</strong>
              <small>Leben in Deutschland</small>
            </span>
          </button>
          {isOfficial ? (
            <span className={secondsLeft < 300 ? 'timer warn' : 'timer'} aria-live="polite">
              {formatTime(secondsLeft)}
            </span>
          ) : (
            <span className="badge">Baden-Württemberg</span>
          )}
        </header>

        {view === 'home' && (
          <main className="stack">
            <section className="hero">
              <p className="kicker">BAMF-Katalog · Stand 07.05.2025</p>
              <h1>Zwei Wege zur Prüfung.</h1>
              <p className="lead">
                Wie im Amt: 33 Fragen, 60 Minuten, 17 Richtige. Oder lernen:
                nach jeder Antwort kommt die Lösung mit kurzer Erklärung.
              </p>
            </section>

            <div className="modes">
              <button type="button" className="mode official" onClick={() => prepareExam('official')}>
                <IconClock />
                <h2>Prüfung wie im Amt</h2>
                <p>33 Fragen · 60 Minuten · keine Hilfe bis zum Schluss</p>
                <span className="mode-cta">Prüfung starten</span>
              </button>
              <button type="button" className="mode learn" onClick={() => prepareExam('learn')}>
                <IconBook />
                <h2>Lernen mit Erklärung</h2>
                <p>Auch 33 Fragen — nach jeder Antwort siehst du, warum</p>
                <span className="mode-cta">Jetzt lernen</span>
              </button>
            </div>

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
                <span>Fehler offen</span>
              </article>
            </section>

            {lastExam && (
              <p className="last">
                Letzte Prüfung: {lastExam.correct}/{lastExam.total}{' '}
                {lastExam.passed ? 'bestanden' : 'nicht bestanden'}
              </p>
            )}

            <div className="secondary">
              <button type="button" className="chip" onClick={() => openCatalog('all')}>
                Alle 310 Fragen
              </button>
              <button type="button" className="chip" onClick={() => openCatalog('bw')}>
                Nur BW
              </button>
              {errorCount > 0 && (
                <button type="button" className="chip" onClick={() => openCatalog('wrong')}>
                  Fehler wiederholen
                </button>
              )}
            </div>
          </main>
        )}

        {view === 'briefing' && (
          <main className="stack">
            <section className="card briefing">
              <p className="kicker">Vor der Prüfung</p>
              <h1>Wie der echte Test</h1>
              <ul className="rules">
                <li>33 Fragen: 30 allgemein, 3 zu Baden-Württemberg</li>
                <li>60 Minuten Zeit</li>
                <li>17 richtige Antworten zum Bestehen</li>
                <li>Keine Lösung während der Prüfung</li>
                <li>Du kannst zwischen den Fragen hin- und herspringen</li>
              </ul>
              <div className="bar">
                <button type="button" className="btn" onClick={() => setView('home')}>
                  Zurück
                </button>
                <button type="button" className="btn primary" onClick={() => setView('exam')}>
                  Prüfung beginnen
                </button>
              </div>
            </section>
          </main>
        )}

        {view === 'exam' && currentExam && (
          <main className="stack exam-view">
            <div className="hud">
              <p className="meta">
                Frage {examIndex + 1} von {exam.length}
                {currentExam.pool === 'bw' ? ' · Land' : ''}
                {examKind === 'learn' ? ' · mit Erklärung' : ''}
              </p>
              <div className="track" aria-hidden="true">
                <i style={{ width: `${(answeredCount / exam.length) * 100}%` }} />
              </div>
              <p className="meta right">{answeredCount} beantwortet</p>
            </div>

            <QuestionBlock
              question={currentExam}
              picked={examKind === 'learn' ? picked : (examAnswers[currentExam.id] ?? null)}
              reveal={examKind === 'learn'}
              onPick={chooseExam}
            />

            <div className="navmap" aria-label="Fragenübersicht">
              {exam.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  className={`dot${i === examIndex ? ' current' : ''}${examAnswers[q.id] !== undefined ? ' done' : ''}`}
                  onClick={() => goExam(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="bar">
              <button
                type="button"
                className="btn"
                onClick={() => goExam(Math.max(0, examIndex - 1))}
                disabled={examIndex === 0}
              >
                Zurück
              </button>
              {examIndex < exam.length - 1 ? (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => goExam(examIndex + 1)}
                  disabled={examKind === 'learn' && picked === null}
                >
                  Nächste Frage
                </button>
              ) : (
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    const open = exam.length - Object.keys(examAnswers).length
                    if (
                      examKind === 'official' &&
                      open > 0 &&
                      !window.confirm(`${open} Fragen ohne Antwort. Trotzdem abgeben?`)
                    ) {
                      return
                    }
                    finishExam(examAnswers)
                  }}
                >
                  {examKind === 'official' ? 'Abgeben' : 'Auswertung'}
                </button>
              )}
            </div>
          </main>
        )}

        {view === 'catalog' && (
          <main className="stack">
            <label className="filter">
              Thema
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value)
                  setCatalogIndex(0)
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

            {catalogList.length === 0 || !currentCatalog ? (
              <p className="card">Keine Fragen in diesem Filter.</p>
            ) : (
              <>
                <p className="meta">
                  {catalogIndex + 1} / {catalogList.length} · {currentCatalog.topic}
                </p>
                <QuestionBlock
                  question={currentCatalog}
                  picked={picked}
                  reveal
                  onPick={chooseLearn}
                />
                <div className="bar">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setPicked(null)
                      setCatalogIndex((i) => Math.max(i - 1, 0))
                    }}
                    disabled={catalogIndex === 0}
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => {
                      setPicked(null)
                      setCatalogIndex((i) => Math.min(i + 1, catalogList.length - 1))
                    }}
                    disabled={catalogIndex >= catalogList.length - 1}
                  >
                    Weiter
                  </button>
                </div>
              </>
            )}
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
                      {q.pool === 'bw' ? ' · BW' : ''}
                    </strong>
                    <span>{q.question}</span>
                    <em>{q.explanation}</em>
                  </li>
                )
              })}
            </ul>
            <div className="bar">
              <button type="button" className="btn" onClick={() => setView('home')}>
                Start
              </button>
              <button type="button" className="btn primary" onClick={() => prepareExam(examKind)}>
                Nochmal
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
              Fortschritt bleibt nur in deinem Browser. Kein Konto, keine Tracker.
            </p>
            <h2>Quelle</h2>
            <p>{catalog.source}. Dies ist keine amtliche Prüfung.</p>
          </main>
        )}

        <footer>
          <button type="button" onClick={() => setView('legal')}>
            Impressum
          </button>
          <span>Keine amtliche Prüfung · BAMF 07.05.2025</span>
        </footer>
      </div>
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
  const correct = show && picked === question.correct
  return (
    <section className="card question">
      <h2>{question.question}</h2>
      {question.image && (
        <img src={question.image} alt="Abbildung zur Frage" className="qimg" />
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
      {show && (
        <div className={`why ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Richtig' : 'Nicht richtig'}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </section>
  )
}

function IconClock() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
