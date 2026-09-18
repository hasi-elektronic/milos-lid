export function dailyReminderIcs(now = new Date()): string {
  const start = new Date(now)
  start.setDate(start.getDate() + 1)
  start.setHours(8, 0, 0, 0)
  const end = new Date(start)
  end.setMinutes(15)
  const stamp = icsStamp(now)
  const begin = icsStamp(start)
  const stop = icsStamp(end)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hasi Elektronic//LiD Milos//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:lid-milos-daily@hasi-elektronic.de',
    `DTSTAMP:${stamp}`,
    `DTSTART:${begin}`,
    `DTEND:${stop}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:LiD für Milos — 20 Fragen',
    'DESCRIPTION:https://milos-lid.pages.dev',
    'URL:https://milos-lid.pages.dev',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

function icsStamp(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}T${p(date.getHours())}${p(date.getMinutes())}00`
}

export function downloadDailyReminder(): void {
  const blob = new Blob([dailyReminderIcs()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'lid-milos-taeglich.ics'
  link.click()
  URL.revokeObjectURL(url)
}
