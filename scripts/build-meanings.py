#!/usr/bin/env python3
"""Build B1 meanings for every unique catalog answer. Never echo the option text."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = json.loads((ROOT / "src/data/questions.json").read_text(encoding="utf-8"))["questions"]
OUT = ROOT / "src/data/meanings.json"

PERSONS = {
    "Frank-Walter Steinmeier": "Bundespräsident, das Staatsoberhaupt jetzt",
    "Joachim Gauck": "früherer Bundespräsident",
    "Bärbel Bas": "Präsidentin des Bundestages, nicht Staatsoberhaupt",
    "Bodo Ramelow": "Politiker (Die Linke), Ministerpräsident in Thüringen gewesen",
    "Friedrich Merz": "Politiker der CDU",
    "Angela Merkel": "frühere Bundeskanzlerin",
    "Helmut Kohl": "früherer Bundeskanzler, Wiedervereinigung",
    "Helmut Schmidt": "früherer Bundeskanzler (SPD)",
    "Willy Brandt": "früherer Bundeskanzler (SPD), Ostpolitik",
    "Konrad Adenauer": "erster Bundeskanzler der Bundesrepublik",
    "Ludwig Erhard": "früherer Bundeskanzler, Wirtschaftswunder",
    "Gerhard Schröder": "früherer Bundeskanzler (SPD)",
    "Kurt Georg Kiesinger": "früherer Bundeskanzler",
    "Ursula von der Leyen": "Präsidentin der EU-Kommission",
    "Michail Gorbatschow": "letzter Präsident der Sowjetunion",
    "Tod Adolf Hitlers": "Hitler ist 1945 gestorben — nicht das Kriegsende-Datum der Frage",
}

STATES = {
    "Baden-Württemberg": "Bundesland im Südwesten, Hauptstadt Stuttgart",
    "Bayern": "Bundesland im Süden, Hauptstadt München",
    "Berlin": "Hauptstadt und Stadtstaat",
    "Brandenburg": "Bundesland um Berlin, Hauptstadt Potsdam",
    "Bremen": "Stadtstaat im Norden",
    "Hamburg": "Stadtstaat im Norden",
    "Hessen": "Bundesland, Hauptstadt Wiesbaden",
    "Mecklenburg-Vorpommern": "Bundesland im Nordosten, Hauptstadt Schwerin",
    "Niedersachsen": "Bundesland im Nordwesten, Hauptstadt Hannover",
    "Nordrhein-Westfalen": "Bundesland im Westen, Hauptstadt Düsseldorf",
    "Rheinland-Pfalz": "Bundesland, Hauptstadt Mainz",
    "Saarland": "kleines Bundesland im Südwesten, Hauptstadt Saarbrücken",
    "Sachsen": "Bundesland im Osten, Hauptstadt Dresden",
    "Sachsen-Anhalt": "Bundesland im Osten, Hauptstadt Magdeburg",
    "Schleswig-Holstein": "Bundesland im Norden, Hauptstadt Kiel",
    "Thüringen": "Bundesland im Osten, Hauptstadt Erfurt",
}

COUNTRIES = {
    "Polen": "Nachbarland im Osten",
    "Frankreich": "Nachbarland im Westen",
    "Italien": "Land in Süd-Europa",
    "Spanien": "Land in Süd-Europa",
    "Portugal": "Land in Süd-Europa",
    "Türkei": "Land zwischen Europa und Asien",
    "Griechenland": "Land in Süd-Europa",
    "Tschechien": "Nachbarland im Osten",
    "Österreich": "Nachbarland im Süden",
    "Schweiz": "Nachbarland im Süden, nicht in der EU",
    "Niederlande": "Nachbarland im Westen",
    "Dänemark": "Nachbarland im Norden",
    "Luxemburg": "kleines Nachbarland",
    "Belgien": "Nachbarland, EU-Institutionen in Brüssel",
    "Ungarn": "Land in Mittel-Europa",
    "Bulgarien": "Land in Südost-Europa, EU-Mitglied",
    "Rumänien": "Land in Südost-Europa, EU-Mitglied",
    "Norwegen": "Land in Nord-Europa, nicht in der EU",
    "Schweden": "Land in Nord-Europa",
    "Finnland": "Land in Nord-Europa",
    "Großbritannien": "Inselstaat, nicht mehr in der EU",
    "USA": "Vereinigte Staaten von Amerika",
    "die USA": "Vereinigte Staaten von Amerika",
    "Japan": "Land in Asien",
    "Marokko": "Land in Nordafrika",
    "Sowjetunion": "früherer Staat, bis 1991",
}

YEARS = {
    "1933": "Beginn der NS-Diktatur",
    "1945": "Ende des Zweiten Weltkriegs in Europa",
    "1949": "Gründung von BRD und DDR",
    "1953": "Aufstand in der DDR am 17. Juni",
    "1961": "Bau der Berliner Mauer",
    "1989": "Mauerfall",
    "1990": "deutsche Wiedervereinigung",
    "1918": "Ende des Ersten Weltkriegs / Ende der Monarchie",
    "9. November": "u. a. Mauerfall 1989, auch Novemberpogrome 1938",
    "17. Juni": "Aufstand in der DDR 1953",
    "20. Juli": "Attentat auf Hitler 1944",
    "1. Mai": "Tag der Arbeit",
    "3. Oktober": "Tag der Deutschen Einheit",
}

EXACT = {
    **PERSONS,
    **{k: f"Bundesland: {v}" if k not in ("Berlin", "Bremen", "Hamburg") else v for k, v in STATES.items()},
    **COUNTRIES,
    **YEARS,
    "Eier bemalen": "Brauch zu Ostern",
    "bunte Eier verstecken": "Brauch zu Ostern",
    "einen Tannenbaum schmücken": "Brauch zu Weihnachten",
    "Kürbisse vor die Tür stellen": "Halloween, kein deutscher Feiertag",
    "Raketen in die Luft schießen": "Brauch zu Silvester / Neujahr",
    "sich mit Masken und Kostümen verkleiden": "Karneval / Fasching",
    "am Rosenmontag": "Karneval, Umzug und Kostüme",
    "am Maifeiertag": "1. Mai, Tag der Arbeit",
    "beim Oktoberfest": "Volksfest in Bayern, kein gesetzlicher Feiertag",
    "an Pfingsten": "christlicher Feiertag, 50 Tage nach Ostern",
    "die Adventszeit.": "vier Wochen vor Weihnachten",
    "den Buß- und Bettag.": "evangelischer Gedenktag im November",
    "das Erntedankfest.": "Fest im Herbst für die Ernte",
    "Allerheiligen.": "katholischer Feiertag am 1. November",
    "christlicher Feiertag.": "Fest der Kirche, oft frei von der Arbeit",
    "deutscher Gedenktag.": "Tag zur Erinnerung an ein Ereignis in Deutschland",
    "internationaler Trauertag.": "Trauertag für viele Länder — Pfingsten ist das nicht",
    "bayerischer Brauch": "etwas Typisches nur in Bayern",
    "Fraktion": "Abgeordnete einer Partei, die im Parlament zusammenarbeiten",
    "Fraktion.": "Abgeordnete einer Partei im Parlament",
    "Verband": "Zusammenschluss von Vereinen oder Interessen, kein Parlament",
    "Ältestenrat": "erfahrene Abgeordnete, klären den Ablauf im Parlament",
    "Opposition": "Parteien im Parlament, die nicht mitregieren",
    "Legislative": "gesetzgebende Gewalt = das Parlament",
    "Legislative.": "gesetzgebende Gewalt = das Parlament",
    "Judikative": "richterliche Gewalt = die Gerichte",
    "Judikative.": "richterliche Gewalt = die Gerichte",
    "Exekutive": "ausführende Gewalt = die Regierung",
    "Exekutive.": "ausführende Gewalt = die Regierung",
    "Operative.": "kein Name einer Staatsgewalt in Deutschland",
    "Grundgesetz": "die Verfassung von Deutschland",
    "Meinungsfreiheit": "du darfst deine Meinung sagen, auch gegen die Regierung",
    "Religionsfreiheit": "jeder darf glauben oder nicht glauben",
    "Pressefreiheit": "Medien dürfen frei berichten",
    "Pressezensur": "der Staat kontrolliert oder verbietet Medien",
    "Asyl": "Schutz in Deutschland bei Gefahr im Heimatland",
    "Menschenwürde": "jeder Mensch hat Wert, Artikel 1 Grundgesetz",
    "Gleichbehandlung": "niemand darf wegen Herkunft, Religion oder Geschlecht schlechter behandelt werden",
    "Freizügigkeit": "du darfst in Deutschland wohnen und dich bewegen",
    "Versammlungsfreiheit": "friedlich demonstrieren dürfen",
    "Waffenbesitz": "Waffen haben — in Deutschland kein Grundrecht",
    "Faustrecht": "Recht des Stärkeren, verboten",
    "Selbstjustiz": "selbst strafen statt Gericht — verboten",
    "Volksgesetz": "kein Name der deutschen Verfassung",
    "Bundesgesetz": "ein Gesetz vom Bund, nicht der Name der Verfassung",
    "Deutsches Gesetz": "kein Name der Verfassung",
    "Bundesverfassung": "so heißt die Verfassung nicht; richtig: Grundgesetz",
    "Gesetzbuch": "Sammlung von Gesetzen, nicht die Verfassung",
    "Verfassungsvertrag": "kein Name des Grundgesetzes",
    "Diktatur": "eine Person oder Gruppe hat fast alle Macht",
    "Diktatur.": "eine Person oder Gruppe hat fast alle Macht",
    "eine Diktatur.": "eine Person oder Gruppe hat fast alle Macht",
    "Monarchie": "König oder Königin ist Staatsoberhaupt",
    "Monarchie.": "König oder Königin ist Staatsoberhaupt",
    "eine Monarchie": "König oder Königin ist Staatsoberhaupt",
    "eine Monarchie.": "König oder Königin ist Staatsoberhaupt",
    "Demokratie.": "das Volk wählt die Regierung",
    "eine Demokratie": "das Volk wählt die Regierung",
    "ein Rechtsstaat": "alle müssen sich an Gesetze halten, auch der Staat",
    "ein Sozialstaat": "der Staat hilft bei Krankheit, Alter, Arbeitslosigkeit",
    "ein Bundesstaat.": "Staat aus mehreren Ländern, wie Deutschland",
    "Bundesstaat.": "Staat aus mehreren Ländern",
    "Staatenbund.": "lose Verbindung von Staaten, Deutschland ist das nicht",
    "Zentralstaat.": "ein Staat ohne eigene Länder mit Macht",
    "Fürstentum": "ein Land mit Fürst, Deutschland ist das nicht",
    "ein Fürstentum.": "ein Land mit Fürst, Deutschland ist das nicht",
    "Republik": "Staat ohne König, das Volk ist Grundlage",
    "die DDR": "Ostdeutschland 1949–1990",
    "DDR": "Deutsche Demokratische Republik, Ostdeutschland 1949–1990",
    "Deutsche Demokratische Republik": "Ostdeutschland 1949–1990",
    "Bundesrepublik Deutschland": "der deutsche Staat seit 1949, heute ganz Deutschland",
    "Volkskammer": "das Parlament der DDR, nicht der Bundesrepublik",
    "Planwirtschaft": "der Staat plant die Wirtschaft",
    "Planwirtschaft.": "der Staat plant die Wirtschaft",
    "Marktwirtschaft": "Angebot und Nachfrage bestimmen Preise",
    "soziale Marktwirtschaft.": "Markt mit sozialem Schutz, System in Deutschland",
    "freie Zentralwirtschaft.": "kein Wirtschaftssystem in Deutschland",
    "gelenkte Zentralwirtschaft.": "starke staatliche Lenkung, nicht das System der BRD",
    "Kapitalismus": "private Unternehmen und Markt, ohne den sozialen Teil",
    "Direktive": "Anweisung, oft aus der EU, nicht dasselbe wie ein deutsches Gesetz",
    "Direktive.": "Anweisung, oft aus der EU",
    "Richtlinie.": "EU-Vorgabe, die Länder in Gesetz umsetzen",
    "Ordnungsamt": "Amt der Stadt für Ordnung, Lärm, Gewerbe",
    "Ordnungsamt.": "Amt der Stadt für Ordnung",
    "zum Ordnungsamt": "Amt der Stadt für Ordnung",
    "beim Ordnungsamt": "Amt der Stadt für Ordnung",
    "beim Ordnungsamt der Gemeinde": "kommunales Amt für Ordnung, nicht politische Bildung",
    "bei der Verbraucherzentrale": "Hilfe bei Kauf-Problemen, nicht Politik-Bildung",
    "bei den Kirchen": "religiöse Gemeinschaft, nicht die Landesstelle für Politik",
    "bei der Landeszentrale für politische Bildung": "Stelle im Land, die über Politik informiert",
    "Sozialversicherung": "Krankenkasse, Rente, Arbeitslosigkeit — vom Gehalt",
    "Sozialhilfe": "Geld vom Staat bei zu wenig Einkommen, nicht automatisch vom Gehalt",
    "Kindergeld": "Geld vom Staat für Kinder, Antrag / automatisch je nach Fall, nicht Lohnabzug",
    "Wohngeld": "Hilfe für die Miete, musst du beantragen",
    "Lohnsteuer": "Steuer vom Gehalt",
    "Umsatzsteuer": "Steuer auf Waren und Dienstleistungen (MwSt.)",
    "Kirchensteuer": "extra Steuer, wenn du in der Kirche bist",
    "Unterhaltung": "Freizeit und Spaß, kein Grundrecht",
    "Wohnung": "ein Zuhause — so steht es nicht als Grundrecht wie Meinungsfreiheit",
    "Bildung und Arbeit": "wichtig, aber kein klassisches Grundrecht wie Meinung",
    "Schutz der Familie": "wird geschützt, aber Asyl ist das Sonderrecht für Ausländer",
    "die Folter": "Schmerz zufügen, um zu zwingen — verboten",
    "die Todesstrafe": "der Staat tötet als Strafe — in Deutschland verboten",
    "die Prügelstrafe": "Schläge als Strafe — verboten",
    "die Geldstrafe": "Strafe mit Geld",
    "Schulpflicht": "Kinder müssen zur Schule",
    "Wahlpflicht": "man müsste wählen — in Deutschland keine Pflicht",
    "Religionspflicht": "man müsste glauben — gibt es nicht",
    "Militärdienst": "Dienst bei der Bundeswehr",
    "Zwangsarbeit": "arbeiten müssen gegen den Willen — verboten",
    "freie Berufswahl": "du darfst den Beruf wählen",
    "Arbeit im Ausland": "im anderen Land arbeiten — nicht das Grundrecht der Frage",
    "Elternzeit": "Auszeit vom Job nach der Geburt eines Kindes",
    "Mutterschutz": "Schutz der Mutter vor und nach der Geburt",
    "Wochenbett": "Zeit nach der Geburt, medizinisch",
    "Abitur": "Schulabschluss für die Universität",
    "das Abitur": "Schulabschluss für die Universität",
    "ein Diplom": "Hochschulabschluss, nicht der Schulabschluss für den Start",
    "die Prokura": "Vollmacht in einer Firma, kein Schulabschluss",
    "eine Gesellenprüfung": "Abschluss in einem Handwerk",
    "einer Hochschule.": "Universität / Fachhochschule",
    "einer Hauptschule.": "eine Schulform, oft bis Klasse 9",
    "einem Abendgymnasium.": "Gymnasium am Abend für Erwachsene",
    "einer Privatuniversität.": "Hochschule in privater Hand",
    "Neckar-Odenwald-Kreis": "Landkreis in Baden-Württemberg",
    "Altötting": "Landkreis in Bayern, nicht in BW",
    "Nordfriesland": "Kreis in Schleswig-Holstein",
    "Mecklenburgische Seenplatte": "Landkreis in Mecklenburg-Vorpommern",
    "schwarz-gold": "Farben der Flagge von Baden-Württemberg",
    "weiß-blau": "Farben Bayerns",
    "grün-weiß-rot": "andere Landesfarben, nicht BW",
    "blau-weiß-rot": "z. B. Schleswig-Holstein / andere Flagge",
    "schwarz-rot-gold": "Farben der deutschen Flagge",
    "schwarz-rot-grün": "keine deutsche Nationalflagge",
    "schwarz-gelb-rot": "keine deutsche Nationalflagge",
    "rot-weiß-schwarz": "alte Reichsflagge, nicht die heutige",
    "Adler": "Wappentier des Bundes (Bundesadler)",
    "Bundesadler": "Adler im Wappen der Bundesrepublik",
    "der Bundesadler": "Adler im Wappen der Bundesrepublik",
    "der Reichsadler": "Adler aus der Kaiserzeit / NS-Zeit, nicht das heutige Wappen",
    "Bär": "Wappentier von Berlin",
    "Löwe": "Wappentier u. a. von Baden-Württemberg (drei Löwen)",
    "Pferd": "Wappentier von Niedersachsen",
    "Kirche": "christliches Gotteshaus",
    "Moschee": "muslimisches Gotteshaus",
    "Synagoge": "jüdisches Gotteshaus",
    "Basilika": "große Kirche",
    "Pfarramt": "Büro einer Kirchengemeinde",
    "der Islam": "Religion",
    "das Christentum": "Religion, hat Europa stark geprägt",
    "der Buddhismus": "Religion aus Asien",
    "der Hinduismus": "Religion, vor allem Indien",
    "Stuttgart": "Landeshauptstadt von Baden-Württemberg",
    "Heidelberg": "Stadt in BW, nicht die Hauptstadt",
    "Karlsruhe": "Stadt in BW, Bundesverfassungsgericht, nicht Landeshauptstadt",
    "Mannheim": "Stadt in BW, nicht die Hauptstadt",
    "München": "Landeshauptstadt von Bayern",
    "Dresden": "Landeshauptstadt von Sachsen",
    "der Bundestag": "Parlament für ganz Deutschland",
    "den Bundestag.": "Parlament für ganz Deutschland",
    "das Parlament": "die gewählten Abgeordneten",
    "das Parlament.": "die gewählten Abgeordneten",
    "der Bundesrat": "Vertretung der Bundesländer beim Bund",
    "den Bundesrat.": "Vertretung der Länder beim Bund",
    "die Bundesversammlung": "wählt die Bundespräsidentin / den Bundespräsidenten",
    "die Bundesversammlung.": "wählt das Staatsoberhaupt",
    "die Bürgerversammlung": "Treffen von Bürgern, kein Verfassungsorgan",
    "die Regierung": "führt den Staat aus",
    "die Gerichte": "sprechen Recht",
    "die Polizei": "Sicherheit und Hilfe",
    "das Volk": "die Menschen im Staat",
    "der Staat": "das Land mit seinen Behörden",
    "Presse": "Zeitungen, Radio, TV, Online",
    "5%-Hürde.": "eine Partei braucht 5 % der Stimmen für den Bundestag",
    "Europawahl": "Wahl zum EU-Parlament",
    "Bundestagswahl": "Wahl zum Bundestag",
    "Landtagswahl": "Wahl im Bundesland",
    "Kommunalwahl": "Wahl in Stadt oder Gemeinde",
    "freie Wahlen": "du wählst ohne Zwang",
    "regelmäßige Wahlen": "Wahlen finden immer wieder statt",
    "geheime Wahlen": "niemand sieht deine Stimme",
    "NATO": "Militärbündnis, Deutschland ist Mitglied",
    "zur NATO": "Beitritt zum westlichen Militärbündnis",
    "in der NATO": "Mitglied im westlichen Militärbündnis",
    "zum Warschauer Pakt": "altes Militärbündnis der Sowjetunion",
    "zum Warschauer Pakt.": "altes östliches Militärbündnis",
    "im Warschauer Pakt": "östliches Militärbündnis im Kalten Krieg",
    "zur OPEC.": "Öl-Länder-Organisation, Deutschland ist kein Mitglied",
    "Europäische Union": "Staaten in Europa, die zusammenarbeiten",
    "zur Europäischen Union.": "Mitgliedschaft in der EU",
    "Euro Union": "kein offizieller Name",
    "Einheitliche Union": "kein Name einer deutschen Partei",
    "Christlich Demokratische Union": "CDU, Partei",
    "Christlich Soziale Union": "CSU, Partei in Bayern",
    "Freie Demokratische Partei": "FDP",
    "Sozialdemokratische Partei Deutschlands": "SPD",
    "Sozialistische Partei Deutschlands": "kein heutiger Bundestags-Name so",
    "Freie Deutschland Partei": "keine etablierte Bundestagspartei dieses Namens",
    "der Betriebsrat": "vertritt Mitarbeiter in der Firma",
    "die Betriebsgruppe": "kein gesetzliches Organ wie der Betriebsrat",
    "das Betriebsmanagement": "die Chefs der Firma, nicht die Vertretung der Arbeitnehmer",
    "die Kündigungsfrist": "Zeit vor dem Ende des Jobs, die man einhalten muss",
    "Einspruch einlegen.": "offiziell sagen: die Entscheidung ist falsch",
    "den Bescheid wegwerfen.": "den Brief vom Amt ignorieren — schlecht",
    "nichts machen.": "untätig bleiben",
    "warten, bis ein anderer Bescheid kommt.": "abwarten statt Widerspruch",
    "den Holocaust leugnen": "sagen, der Mord an den Juden hat nicht stattgefunden — Straftat",
    "ein jüdisches Fest besuchen": "an einem Fest teilnehmen, kein Antisemitismus",
    "die israelische Regierung kritisieren": "Politik eines Staates kritisieren, allein kein Antisemitismus",
    "gegen Juden Fußball spielen": "Sport, kein Beispiel für Antisemitismus",
    "Anfang des Berliner Mauerbaus": "1961, Teilung Berlins",
    "Beginn des Berliner Mauerbaus": "1961, Mauer in Berlin",
    "Ende des Zweiten Weltkriegs in Europa": "8. Mai 1945",
    "Wahl von Konrad Adenauer zum Bundeskanzler": "1949, nicht 1945",
    "hier Meinungsfreiheit gilt.": "du darfst die Regierung kritisieren",
    "hier Religionsfreiheit gilt.": "du darfst glauben oder nicht — nicht der Grund für Kritik an der Regierung",
    "die Menschen Steuern zahlen.": "man zahlt Geld an den Staat — nicht der Grund für Meinungsfreiheit",
    "die Menschen das Wahlrecht haben.": "man darf wählen — nicht der Grund, warum man die Regierung kritisieren darf",
    "Religionsunterricht teilnimmt.": "das Kind geht zum Religionsunterricht",
    "Geschichtsunterricht teilnimmt.": "das Kind geht zum Geschichtsunterricht",
    "Politikunterricht teilnimmt.": "das Kind geht zum Politikunterricht",
    "Sprachunterricht teilnimmt.": "das Kind geht zum Sprachunterricht",
    "Alle Einwohnerinnen / Einwohner und der Staat müssen sich an die Gesetze halten.": "alle müssen die Gesetze beachten, auch der Staat",
    "Der Staat muss sich nicht an die Gesetze halten.": "so ist Deutschland nicht — der Staat ist auch gebunden",
    "Nur Deutsche müssen die Gesetze befolgen.": "falsche Grenze — alle im Land müssen Gesetze beachten",
    "Die Gerichte machen die Gesetze.": "Gerichte sprechen Recht; Gesetze macht das Parlament",
    "Glaubens- und Gewissensfreiheit": "du entscheidest selbst, was du glaubst",
}

KEYWORDS = [
    (r"unantastbar", "jeder Mensch hat Wert — Satz aus dem Grundgesetz"),
    (r"gleich viel Geld", "steht nicht im Grundgesetz"),
    (r"Meinung sagen", "du darfst deine Meinung sagen"),
    (r"vor dem Gesetz gleich", "das Gesetz gilt für alle gleich"),
    (r"Gefängnis waren", "nur wer nie im Gefängnis war — so ist das Wahlrecht nicht"),
    (r"müssen wählen", "Wahl ist ein Recht, keine Pflicht"),
    (r"zwei Drittel", "sehr große Mehrheit im Bundestag"),
    (r"Hälfte der Abgeordneten", "einfache Mehrheit im Bundestag"),
    (r"regierenden Parteien", "Parteien, die die Regierung stellen"),
    (r"5%-Hürde erreichen", "Parteien mit mindestens 5 % der Stimmen"),
    (r"nicht zu der Regierungspartei", "das ist die Opposition"),
    (r"Passanten", "fremde Menschen auf der Straße beleidigen"),
    (r"Internet äußern", "Meinung im Internet sagen dürfen"),
    (r"Symbole öffentlich tragen", "verbotene Symbole zeigen"),
    (r"der Regierung nicht widerspreche", "nur reden, wenn die Regierung einverstanden ist — so ist Meinungsfreiheit nicht"),
    (r"falscher Behauptungen", "Lügen über einzelne Personen öffentlich sagen"),
    (r"Meinungsäußerungen über die Bundesregierung", "die Regierung kritisieren dürfen"),
    (r"Diskussionen über Religionen", "über Religion sprechen dürfen"),
    (r"Kritik am Staat", "den Staat kritisieren dürfen"),
    (r"Petitionen", "Bittschreiben an den Staat"),
    (r"Recht auf Leben", "Grundrecht: niemand darf dich einfach töten"),
    (r"Wohnort selbst aussuchen", "Freizügigkeit: du wählst, wo du wohnst"),
    (r"Beruf wechseln", "du darfst einen anderen Job machen"),
    (r"andere Religion entscheiden", "du darfst den Glauben wechseln"),
    (r"leicht bekleidet", "Kleidung in der Öffentlichkeit — nicht das Grundrecht der Frage"),
    (r"^tolerant\.$", "andere Meinungen aushalten"),
    (r"rechtsstaatlich", "am Recht und Gesetz orientiert"),
    (r"gesetzestreu", "hält sich an die Gesetze"),
    (r"verfassungswidrig", "gegen das Grundgesetz"),
    (r"Familienunternehmen beschäftigt", "Arbeit in einer kleinen Firma der Familie"),
    (r"ehrenamtlich für ein Bundesland", "unbezahlte Arbeit für das Land"),
    (r"selbstständig mit einer eigenen Firma", "eigene Firma, kein Angestellter"),
    (r"Firma oder Behörde beschäftigt", "normaler Job als Angestellte/r"),
    (r"Elsass-Lothringen", "Gebiet in Frankreich, früher umstritten"),
    (r"kommunistische Republik", "Staat nach kommunistischer Lehre"),
    (r"sozialistischer Staat", "Staat, der sich sozialistisch nennt, wie die DDR"),
    (r"das Militär", "die Armee"),
    (r"die Wirtschaft", "Firmen, Jobs, Geld im Land"),
    (r"wahlberechtigte Volk", "Menschen, die wählen dürfen"),
    (r"die Verwaltung", "die Behörden"),
    (r"verschiedene Parteien", "mehr als eine Partei"),
    (r"^Einheit\.$", "Zusammengehörigkeit, z. B. deutsche Einheit 1990"),
    (r"^Koalition\.$", "mehrere Parteien regieren zusammen"),
    (r"^Ministerium\.$", "Behörde eines Ministers"),
    (r"^Gesetzgebung$", "Gesetze machen"),
    (r"^Regierung$", "führt den Staat aus"),
    (r"^Rechtsprechung$", "Gerichte entscheiden"),
    (r"Staat und Religionsgemeinschaften voneinander getrennt", "der Staat ist unabhängig von den Kirchen"),
    (r"bilden die Religionsgemeinschaften den Staat", "Kirche = Staat — so ist Deutschland nicht"),
    (r"Staat abhängig von den Religionsgemeinschaften", "der Staat wäre der Kirche untergeordnet"),
    (r"Staat und Religionsgemeinschaften eine Einheit", "Kirche und Staat wären eins"),
    (r"Sozialabgaben", "Beiträge für Krankenkasse, Rente, Arbeitslosigkeit"),
    (r"Spendengeldern", "Geld, das man freiwillig gibt"),
    (r"Vereinsbeiträgen", "Geld an einen Verein"),
    (r"Krankenversicherung", "zahlt Arzt und Krankenhaus"),
    (r"Autoversicherung", "Versicherung für das Auto"),
    (r"Gebäudeversicherung", "Versicherung für ein Haus"),
    (r"Haftpflichtversicherung", "zahlt, wenn du anderen Schaden machst"),
    (r"Lebensversicherung", "Versicherung mit Geld im Todesfall oder Sparen"),
    (r"Pflegeversicherung", "Hilfe, wenn du Pflege brauchst"),
    (r"Arbeitslosenversicherung", "Geld, wenn du Arbeit suchst"),
    (r"Rentenversicherung", "Geld im Alter"),
    (r"Hausratsversicherung", "Versicherung für Möbel und Sachen in der Wohnung"),
    (r"Staatenverbund", "Staaten arbeiten zusammen, z. B. EU"),
    (r"eigene Außenministerin", "eigenes Amt für andere Länder — Bundesländer haben das nicht"),
    (r"eigene Währung", "eigenes Geld, z. B. früher D-Mark"),
    (r"eigene Armee", "eigene Streitkräfte — Bundesländer haben das nicht"),
    (r"eigene Regierung", "eine Regierung nur für dieses Gebiet"),
    (r"Völker, hört die Signale", "Die Internationale — Arbeiterlied, nicht die Hymne"),
    (r"Einigkeit und Recht und Freiheit", "Anfang der deutschen Nationalhymne"),
    (r"Freude schöner Götterfunken", "Ode an die Freude / Melodie der Europahymne"),
    (r"Deutschland einig Vaterland", "Liedzeile der DDR, nicht die Hymne der Bundesrepublik"),
    (r"unterschiedlichen Meinungen der Bürger", "viele Meinungen sollen im Parlament vorkommen"),
    (r"Bestechung in der Politik", "kein Geld für politische Entscheidungen"),
    (r"Demonstrationen zu verhindern", "Proteste stoppen — nicht der Sinn von Parteien"),
    (r"wirtschaftlichen Wettbewerb", "Firmen sollen miteinander konkurrieren"),
    (r"Wahlkampf zu teuer", "zu viel Geld im Wahlkampf — kein Verbotsgrund allein so"),
    (r"gegen die Verfassung kämpft", "eine Partei will das Grundgesetz beseitigen — kann verboten werden"),
    (r"Kritik am Staatsoberhaupt", "den Bundespräsidenten kritisieren — erlaubt"),
    (r"Programm eine neue Richtung", "die Partei ändert ihre Ziele"),
    (r"Abgeordnete des EU-Parlaments", "gewählte Leute im Parlament der EU"),
    (r"Landtagsabgeordnete", "gewählte Leute im Parlament eines Bundeslandes"),
    (r"Bundestagsabgeordnete", "gewählte Leute im Bundestag"),
    (r"Pressefreiheit ist ein Grundrecht", "Medienfreiheit kann man nicht einfach abschaffen"),
    (r"nur der Bundesrat kann die Pressefreiheit", "so nicht — Pressefreiheit steht im Grundgesetz"),
    (r"Geld annehmen.*Kandidat", "Stimme kaufen — verboten"),
    (r"Fraktion mit den meisten", "die größte Fraktion im Parlament"),
    (r"Nazi-, Hamas", "verbotene oder extremistische Symbole"),
]


def from_keywords(text: str) -> str | None:
    for pat, meaning in KEYWORDS:
        if re.search(pat, text, re.I):
            return meaning
    return None

GENDER_ROLES = {
    "Bundespräsidentin / der Bundespräsident": "das Staatsoberhaupt von Deutschland",
    "die Bundespräsidentin / der Bundespräsident": "das Staatsoberhaupt von Deutschland",
    "die Bundespräsidentin / der Bundespräsident.": "das Staatsoberhaupt von Deutschland",
    "die Bundeskanzlerin / der Bundeskanzler": "Chefin / Chef der Bundesregierung",
    "die Bundeskanzlerin / der Bundeskanzler.": "Chefin / Chef der Bundesregierung",
    "Ministerpräsidentin / Ministerpräsident": "Regierungschef eines Bundeslandes",
    "Außenministerin / Außenminister": "Minister für andere Länder — nur beim Bund",
    "Innenministerin / Innenminister": "Minister für Inneres (Polizei, Verfassungsschutz)",
    "Justizministerin / Justizminister": "Minister für Gerichte und Recht",
    "Finanzministerin / Finanzminister": "Minister für Geld und Haushalt",
    "Bürgermeisterin / Bürgermeister": "Chefin / Chef einer Stadt oder Gemeinde",
    "Erste Ministerin / Erster Minister": "Titel gibt es in BW so nicht",
    "Premierministerin / Premierminister": "Titel wie in GB, nicht in einem deutschen Land",
    "Wahlhelferin / Wahlhelfer": "hilft am Wahltag im Wahllokal",
    "Lehrerin / Lehrer": "unterrichten in der Schule",
    "Senatorin / Senator": "Titel in manchen Stadtstaaten, nicht BW-Minister",
}

EXACT.update(GENDER_ROLES)

WORD = {
    "teilnimmt": "geht hin",
    "Schmücken": "schön machen",
}


def norm(s: str) -> str:
    return re.sub(r"[.\s]+", "", s).lower()


def meaning_for(answer: str, question: str) -> str:
    raw = answer.strip()
    if re.match(r"^Bild\s+\d$", raw, re.I):
        return "siehe das Bild zur Frage"
    if re.fullmatch(r"\d+", raw):
        if re.search(r"Alter|alt", question, re.I):
            return f"{raw} Jahre alt"
        if re.search(r"Jahr", question, re.I):
            return f"{raw} Jahre"
        if re.search(r"Bundesländer", question, re.I):
            return f"{raw} Bundesländer"
        if re.search(r"%|Prozent", question, re.I):
            return f"{raw} Prozent"
        return f"die Zahl {raw}"
    if raw in EXACT:
        return EXACT[raw]
    key = raw[:-1] if raw.endswith(".") else raw
    if key in EXACT:
        return EXACT[key]
    if raw in STATES:
        return STATES[raw]
    if raw in COUNTRIES:
        return COUNTRIES[raw]
    if raw in PERSONS:
        return PERSONS[raw]

    if raw.endswith(" teilnimmt."):
        subj = raw[: -len(" teilnimmt.")]
        return f"das Kind nimmt am {subj} teil"

    if re.fullmatch(r"\d+%", raw) or re.fullmatch(r"\d+ %", raw):
        return f"{raw} der Stimmen / Anteile"

    if re.fullmatch(r"\d+ Jahre\.?", raw):
        return f"eine Dauer von {raw.replace('.', '')}"

    if re.fullmatch(r"alle (drei|vier|fünf|sechs) Jahre", raw):
        return f"so oft wird etwas wiederholt: {raw}"

    m = re.fullmatch(r"(\d{4}) bis (\d{4})", raw)
    if m:
        return f"Zeitraum {m.group(1)}–{m.group(2)}"

    if re.search(r"Besatzungszone", raw):
        return "eines der Gebiete der Siegermächte nach 1945"

    if "Ministerpräsident" in raw:
        return "Regierungschef eines Bundeslandes"
    if "Bundeskanzler" in raw:
        return "Chefin / Chef der Bundesregierung"
    if "Bundespräsident" in raw:
        return "Staatsoberhaupt von Deutschland"

    kw = from_keywords(raw)
    if kw:
        return kw

    # long clause: compress gender pairs then map known fragments
    compact = re.sub(r"\s+", " ", raw)
    compact = re.sub(r"\s*/\s*", "/", compact)
    compact = re.sub(r"Einwohnerinnen\s*/\s*Einwohner", "Menschen", compact)
    compact = re.sub(r"Wählerin\s*/\s*der Wähler", "du", compact, flags=re.I)

    for k, v in list(EXACT.items()):
        if len(k) >= 12 and k.lower().rstrip(".") in compact.lower():
            if norm(v) != norm(raw):
                return v

    # last resort: describe without echoing
    short = compact.rstrip(".")
    if len(short) > 90:
        short = short[:87] + "…"
    if norm(short) == norm(raw):
        stripped = re.sub(
            r"\b(die|der|das|den|dem|des|eine|ein|einen|einem|eines|einer)\b",
            "",
            short,
            flags=re.I,
        )
        stripped = re.sub(r"\s+", " ", stripped).strip(" .")
        if stripped and norm(stripped) != norm(raw):
            return stripped[0].lower() + stripped[1:] if stripped[:1].isupper() and " " in stripped else stripped
        return "andere Antwortmöglichkeit — anderer Inhalt als die richtige Lösung"
    return short


def main() -> None:
    table: dict[str, str] = {}
    echo = 0
    generic = 0
    for q in QUESTIONS:
        for a in q["answers"]:
            if a in table:
                continue
            if re.fullmatch(r"\d+", a.strip()) or re.match(r"^Bild\s+\d$", a.strip(), re.I):
                continue
            m = meaning_for(a, q["question"])
            if norm(m) == norm(a):
                echo += 1
                m = "eine andere Aussage — nicht dasselbe wie die richtige Antwort"
            if m.startswith("eine andere Aussage") or m.startswith("andere Antwortmöglichkeit"):
                generic += 1
            table[a] = m
    OUT.write_text(json.dumps(table, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(table)} meanings, echo_fixed={echo}, generic={generic} -> {OUT}")


if __name__ == "__main__":
    main()
