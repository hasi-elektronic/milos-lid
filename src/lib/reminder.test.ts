import { describe, expect, it } from 'vitest'
import { dailyReminderIcs } from './reminder'

describe('daily reminder', () => {
  it('builds a daily calendar event', () => {
    const ics = dailyReminderIcs(new Date('2026-09-18T12:00:00'))
    expect(ics).toContain('RRULE:FREQ=DAILY')
    expect(ics).toContain('SUMMARY:LiD für Milos — 20 Fragen')
    expect(ics).toContain('DTSTART:20260919T080000')
  })
})
