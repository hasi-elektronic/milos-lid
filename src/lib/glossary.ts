export type GlossEntry = {
  term: string
  meaning: string
  forms: string[]
}

export type GlossHit = {
  start: number
  end: number
  term: string
  meaning: string
}

export const GLOSSARY: GlossEntry[] = [
  { term: 'Grundgesetz', meaning: 'die Verfassung von Deutschland, das wichtigste Gesetz', forms: ['Grundgesetz', 'Grundgesetzes'] },
  { term: 'Meinungsfreiheit', meaning: 'du darfst deine Meinung sagen, auch gegen die Regierung', forms: ['Meinungsfreiheit'] },
  { term: 'Religionsfreiheit', meaning: 'jeder darf glauben oder nicht glauben', forms: ['Religionsfreiheit'] },
  { term: 'Glaubens- und Gewissensfreiheit', meaning: 'du darfst selbst entscheiden, was du glaubst', forms: ['Glaubens- und Gewissensfreiheit'] },
  { term: 'Rechtsstaat', meaning: 'alle müssen sich an die Gesetze halten, auch der Staat', forms: ['Rechtsstaat'] },
  { term: 'Grundrechte', meaning: 'wichtige Rechte für Menschen, oft im Grundgesetz', forms: ['Grundrechte', 'Grundrechten', 'Grundrecht'] },
  { term: 'Verfassung', meaning: 'die wichtigsten Regeln eines Staates', forms: ['Verfassung'] },
  { term: 'Demokratie', meaning: 'das Volk wählt die Regierung', forms: ['Demokratie'] },
  { term: 'Diktatur', meaning: 'eine Person oder Gruppe hat fast alle Macht, keine freie Wahl', forms: ['Diktatur'] },
  { term: 'Monarchie', meaning: 'ein König oder eine Königin ist Staatsoberhaupt', forms: ['Monarchie'] },
  { term: 'Bundestag', meaning: 'das Parlament für ganz Deutschland, die Abgeordneten', forms: ['Bundestag', 'Bundestages', 'Bundestagswahl'] },
  { term: 'Bundesrat', meaning: 'die Vertretung der Bundesländer beim Bund', forms: ['Bundesrat'] },
  { term: 'Bundespräsident', meaning: 'das Staatsoberhaupt von Deutschland', forms: ['Bundespräsident', 'Bundespräsidentin', 'Bundespräsidenten'] },
  { term: 'Bundeskanzler', meaning: 'Chef / Chefin der Bundesregierung', forms: ['Bundeskanzler', 'Bundeskanzlerin'] },
  { term: 'Bundesregierung', meaning: 'Kanzler/in und Minister/innen für ganz Deutschland', forms: ['Bundesregierung'] },
  { term: 'Bundesversammlung', meaning: 'wählt den Bundespräsidenten / die Bundespräsidentin', forms: ['Bundesversammlung'] },
  { term: 'Abgeordnete', meaning: 'gewählte Personen im Parlament', forms: ['Abgeordnete', 'Abgeordneten'] },
  { term: 'Partei', meaning: 'eine politische Gruppe, z. B. CDU, SPD, Grüne', forms: ['Partei', 'Parteien'] },
  { term: 'Wahl', meaning: 'die Menschen stimmen ab, wer regieren soll', forms: ['Wahl', 'Wahlen', 'Wählerin', 'Wähler'] },
  { term: 'Stimmabgabe', meaning: 'deine Stimme bei der Wahl', forms: ['Stimmabgabe'] },
  { term: 'Parlament', meaning: 'die gewählten Abgeordneten, sie machen Gesetze', forms: ['Parlament'] },
  { term: 'Landtag', meaning: 'das Parlament eines Bundeslandes', forms: ['Landtag'] },
  { term: 'Bundesland', meaning: 'ein Teilstaat in Deutschland, z. B. Baden-Württemberg', forms: ['Bundesland', 'Bundesländer', 'Bundesländern'] },
  { term: 'Kommune', meaning: 'Stadt oder Gemeinde', forms: ['Kommune', 'Kommunalwahlen'] },
  { term: 'Landkreis', meaning: 'mehrere Gemeinden zusammen, Verwaltung vor Ort', forms: ['Landkreis'] },
  { term: 'Ministerpräsident', meaning: 'Regierungschef eines Bundeslandes', forms: ['Ministerpräsident', 'Ministerpräsidentin'] },
  { term: 'Außenminister', meaning: 'Minister für andere Länder — nur beim Bund, nicht im Land', forms: ['Außenminister', 'Außenministerin'] },
  { term: 'Gewaltenteilung', meaning: 'Macht ist geteilt: Parlament, Regierung, Gerichte', forms: ['Gewaltenteilung'] },
  { term: 'Gesetz', meaning: 'eine Regel, die alle einhalten müssen', forms: ['Gesetz', 'Gesetze'] },
  { term: 'Gericht', meaning: 'hier entscheidet ein Richter / eine Richterin', forms: ['Gericht', 'Gerichte'] },
  { term: 'Richter', meaning: 'entscheidet im Gericht nach dem Gesetz', forms: ['Richter', 'Richterin'] },
  { term: 'Polizei', meaning: 'passt auf die Sicherheit auf und hilft', forms: ['Polizei'] },
  { term: 'Behörde', meaning: 'Amt, z. B. Bürgeramt oder Finanzamt', forms: ['Behörde'] },
  { term: 'Einwohner', meaning: 'Menschen, die an einem Ort leben', forms: ['Einwohner', 'Einwohnerinnen'] },
  { term: 'Bürger', meaning: 'Menschen mit Staatsangehörigkeit, oft mit Wahlrecht', forms: ['Bürger', 'Bürgerinnen'] },
  { term: 'Asyl', meaning: 'Schutz in Deutschland für Menschen in Gefahr', forms: ['Asyl'] },
  { term: 'Gleichbehandlung', meaning: 'niemand darf wegen Hautfarbe, Religion oder Geschlecht schlechter behandelt werden', forms: ['Gleichbehandlung'] },
  { term: 'Versammlungsfreiheit', meaning: 'du darfst friedlich demonstrieren', forms: ['Versammlungsfreiheit'] },
  { term: 'Freizügigkeit', meaning: 'du darfst in Deutschland wohnen und dich bewegen', forms: ['Freizügigkeit'] },
  { term: 'Menschenwürde', meaning: 'jeder Mensch hat Wert und darf nicht erniedrigt werden', forms: ['Menschenwürde'] },
  { term: 'Religionsunterricht', meaning: 'Unterricht über Religion in der Schule, Eltern können entscheiden', forms: ['Religionsunterricht'] },
  { term: 'Sozialstaat', meaning: 'der Staat hilft, z. B. bei Krankheit oder Arbeitslosigkeit', forms: ['Sozialstaat'] },
  { term: 'Krankenversicherung', meaning: 'zahlt Arzt und Krankenhaus, in Deutschland Pflicht', forms: ['Krankenversicherung'] },
  { term: 'Rentenversicherung', meaning: 'Geld im Alter, du zahlst Beiträge von der Arbeit', forms: ['Rentenversicherung'] },
  { term: 'Arbeitslosenversicherung', meaning: 'Geld, wenn du Arbeit suchst und keine Stelle hast', forms: ['Arbeitslosenversicherung'] },
  { term: 'Lohnsteuer', meaning: 'Steuer vom Gehalt', forms: ['Lohnsteuer'] },
  { term: 'Umsatzsteuer', meaning: 'Steuer auf Waren und Dienstleistungen (MwSt.)', forms: ['Umsatzsteuer'] },
  { term: 'Kirchensteuer', meaning: 'extra Steuer, wenn du in der Kirche bist', forms: ['Kirchensteuer'] },
  { term: 'Betriebsrat', meaning: 'vertritt die Mitarbeiter in der Firma', forms: ['Betriebsrat'] },
  { term: 'Kündigungsfrist', meaning: 'Zeit, die du oder die Firma vor dem Ende der Arbeit einhalten muss', forms: ['Kündigungsfrist'] },
  { term: 'Tarifvertrag', meaning: 'Vertrag zwischen Gewerkschaft und Arbeitgebern über Lohn und Zeit', forms: ['Tarifvertrag'] },
  { term: 'Gewerkschaft', meaning: 'Organisation von Arbeitnehmern, verhandelt über Lohn', forms: ['Gewerkschaft'] },
  { term: 'Arbeitnehmer', meaning: 'du arbeitest für eine Firma und bekommst Gehalt', forms: ['Arbeitnehmer', 'Arbeitnehmerinnen'] },
  { term: 'Arbeitgeber', meaning: 'die Firma oder Person, die dich bezahlt', forms: ['Arbeitgeber'] },
  { term: 'Europäische Union', meaning: 'Staaten in Europa, die zusammenarbeiten, kurz: EU', forms: ['Europäische Union', 'Europäischen Union'] },
  { term: 'NATO', meaning: 'Militärbündnis, Deutschland ist Mitglied', forms: ['NATO'] },
  { term: 'Bundesrepublik', meaning: 'der deutsche Staat nach 1949, heute ganz Deutschland', forms: ['Bundesrepublik'] },
  { term: 'DDR', meaning: 'Ostdeutschland 1949–1990, Deutsche Demokratische Republik', forms: ['DDR'] },
  { term: 'Wiedervereinigung', meaning: '1990: Ost und West werden wieder ein Land', forms: ['Wiedervereinigung'] },
  { term: 'Holocaust', meaning: 'der Mord an Millionen Juden durch die Nationalsozialisten', forms: ['Holocaust'] },
  { term: 'Nationalsozialismus', meaning: 'Diktatur unter Hitler 1933–1945', forms: ['Nationalsozialismus', 'Nationalsozialisten'] },
  { term: 'Zweiter Weltkrieg', meaning: 'Krieg 1939–1945, endete in Europa am 8. Mai 1945', forms: ['Zweiter Weltkrieg', 'Zweiten Weltkrieg', 'Weltkrieg'] },
  { term: 'Mauer', meaning: 'die Berliner Mauer trennte Ost und West 1961–1989', forms: ['Mauer', 'Mauerfall'] },
  { term: 'Besatzungszonen', meaning: 'nach 1945: Gebiete von USA, UdSSR, Großbritannien, Frankreich', forms: ['Besatzungszonen'] },
  { term: 'Sowjetunion', meaning: 'früherer Staat, hat Ostdeutschland besetzt', forms: ['Sowjetunion'] },
  { term: 'Bundeskanzleramt', meaning: 'Arbeitsort des Bundeskanzlers / der Bundeskanzlerin', forms: ['Bundeskanzleramt'] },
  { term: 'Wappen', meaning: 'das offizielle Bild eines Landes oder Staates', forms: ['Wappen'] },
  { term: 'Landeshauptstadt', meaning: 'die Hauptstadt eines Bundeslandes', forms: ['Landeshauptstadt'] },
  { term: 'Landeszentrale für politische Bildung', meaning: 'Stelle im Land, die über Politik informiert', forms: ['Landeszentrale für politische Bildung'] },
  { term: 'Einbürgerung', meaning: 'du wirst Deutsche / Deutscher', forms: ['Einbürgerung', 'Einbürgerungstest'] },
  { term: 'Staatsangehörigkeit', meaning: 'du gehörst zu einem Staat, z. B. Deutschland', forms: ['Staatsangehörigkeit'] },
  { term: 'Opposition', meaning: 'Parteien im Parlament, die nicht in der Regierung sind', forms: ['Opposition'] },
  { term: 'Koalition', meaning: 'mehrere Parteien regieren zusammen', forms: ['Koalition'] },
  { term: 'Mehrheit', meaning: 'mehr als die Hälfte der Stimmen', forms: ['Mehrheit'] },
  { term: 'Volkssouveränität', meaning: 'die Macht kommt vom Volk', forms: ['Volkssouveränität'] },
  { term: 'Menschenrechte', meaning: 'Rechte, die jeder Mensch hat', forms: ['Menschenrechte'] },
  { term: 'Datenschutz', meaning: 'Schutz deiner persönlichen Daten', forms: ['Datenschutz'] },
  { term: 'Schulpflicht', meaning: 'Kinder müssen zur Schule gehen', forms: ['Schulpflicht'] },
  { term: 'Wehrpflicht', meaning: 'früher: Pflicht zum Militärdienst', forms: ['Wehrpflicht'] },
  { term: 'Ehrenamt', meaning: 'Arbeit ohne Bezahlung, z. B. Wahlhelfer', forms: ['Ehrenamt'] },
  { term: 'Wahlhelfer', meaning: 'hilft am Wahltag im Wahllokal', forms: ['Wahlhelfer', 'Wahlhelferin'] },
  { term: 'Stimmzettel', meaning: 'Zettel, auf dem du bei der Wahl ankreuzt', forms: ['Stimmzettel'] },
  { term: 'Erststimme', meaning: 'bei der Bundestagswahl: Stimme für eine Person im Wahlkreis', forms: ['Erststimme'] },
  { term: 'Zweitstimme', meaning: 'bei der Bundestagswahl: Stimme für eine Partei, sehr wichtig', forms: ['Zweitstimme'] },
  { term: '5-Prozent-Hürde', meaning: 'eine Partei braucht 5 % der Stimmen für den Bundestag', forms: ['5-Prozent-Hürde', 'Fünf-Prozent-Hürde'] },
  { term: 'Föderalismus', meaning: 'Bund und Länder teilen sich die Macht', forms: ['Föderalismus'] },
  { term: 'Kommunalwahl', meaning: 'Wahl in der Stadt oder Gemeinde', forms: ['Kommunalwahl', 'Kommunalwahlen'] },
  { term: 'Bürgermeister', meaning: 'Chef / Chefin einer Stadt oder Gemeinde', forms: ['Bürgermeister', 'Bürgermeisterin'] },
  { term: 'Oberbürgermeister', meaning: 'Bürgermeister einer großen Stadt', forms: ['Oberbürgermeister', 'Oberbürgermeisterin'] },
  { term: 'Christentum', meaning: 'Religion, die Europa stark geprägt hat', forms: ['Christentum'] },
  { term: 'Toleranz', meaning: 'andere Meinungen und Religionen akzeptieren', forms: ['Toleranz'] },
  { term: 'Ostern', meaning: 'christliches Fest im Frühling', forms: ['Ostern'] },
  { term: 'Pfingsten', meaning: 'christlicher Feiertag', forms: ['Pfingsten'] },
  { term: 'Widerspruch', meaning: 'du sagst offiziell: dieser Bescheid ist falsch', forms: ['Widerspruch', 'Einspruch'] },
  { term: 'Bescheid', meaning: 'schriftliche Entscheidung vom Amt', forms: ['Bescheid'] },
  { term: 'Reklamation', meaning: 'du meldest, dass eine Ware kaputt oder falsch ist', forms: ['reklamieren'] },
]

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function findGlossaryHits(text: string): GlossHit[] {
  const hits: GlossHit[] = []
  const taken = new Array(text.length).fill(false)
  const entries = [...GLOSSARY].sort(
    (a, b) => Math.max(...b.forms.map((f) => f.length)) - Math.max(...a.forms.map((f) => f.length)),
  )
  for (const entry of entries) {
    for (const form of [...entry.forms].sort((a, b) => b.length - a.length)) {
      const re = new RegExp(escapeRegExp(form), 'gi')
      let match: RegExpExecArray | null
      while ((match = re.exec(text))) {
        const start = match.index
        const end = start + match[0].length
        if (taken.slice(start, end).some(Boolean)) continue
        for (let i = start; i < end; i++) taken[i] = true
        hits.push({ start, end, term: entry.term, meaning: entry.meaning })
      }
    }
  }
  return hits.sort((a, b) => a.start - b.start)
}

export type TextPart =
  | { kind: 'text'; value: string }
  | { kind: 'word'; value: string; term: string; meaning: string }

export function splitGlossary(text: string): TextPart[] {
  const hits = findGlossaryHits(text)
  if (hits.length === 0) return [{ kind: 'text', value: text }]
  const parts: TextPart[] = []
  let cursor = 0
  for (const hit of hits) {
    if (hit.start > cursor) parts.push({ kind: 'text', value: text.slice(cursor, hit.start) })
    parts.push({
      kind: 'word',
      value: text.slice(hit.start, hit.end),
      term: hit.term,
      meaning: hit.meaning,
    })
    cursor = hit.end
  }
  if (cursor < text.length) parts.push({ kind: 'text', value: text.slice(cursor) })
  return parts
}
