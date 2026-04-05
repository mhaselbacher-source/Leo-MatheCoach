---
typ: technische-dokumentation
projekt: "Leo MatheCoach"
erstellt: 2026-04-04
aktualisiert: 2026-04-06
status: aktiv
---

# Leo MatheCoach: Technische Dokumentation

## 1. Zweck

Diese Datei ist die technische Uebersicht fuer Codex und spaetere Sessions.

Sie soll verhindern, dass der Projektstand in jeder Session neu rekonstruiert werden muss.

---

## 2. Projektstatus

Stand per 2026-04-06:

- Ein konzeptioneller Neuaufbau ist in Arbeit
- Die bestehende App im Projektordner ist Referenz, nicht das finale Zielbild
- Produktkonzept, inhaltliche Schaerfung und Maskottchen-Styleguide liegen vor
- Die neue App-Struktur ist nicht nur Zielbild, sondern jetzt als lauffaehiger Scaffold in `app/` vorhanden
- Login, Home und Session-Grundflow laufen lokal mit Mock-State; Ergebnis-, Dashboard- und Reward-Screens sind als erste Basis ebenfalls angelegt
- `Einmaleins-Blitz` ist technisch bereits auf echte Generator-, Bewertungs- und Stufenlogik umgestellt
- `Einmaleins`-Schwachstellen sind im Home- und Dashboard-UI jetzt als konkrete Uebungsempfehlung sichtbar
- lokale Persistenz speichert jetzt auch eine kleine Historie pro `Einmaleins`-Faktenpaar fuer Wiederholungsaufgaben
- `Bruch-Match` ist ebenfalls an die neue Session-Architektur mit Stufenlogik und Aufgabenlabels angeschlossen
- der Login kann jetzt optional direkt gegen Supabase-RPCs laufen und dabei gespeicherten Remote-Stand in den bestehenden App-State hydratisieren
- abgeschlossene Sessions koennen jetzt optional auch wieder nach Supabase zurueckgeschrieben werden
- das V1-Schema kennt jetzt auch eine faktbezogene Historie fuer `Einmaleins` ueber `times_fact_stats`
- fuer manuelle Pruefung gibt es jetzt einen eigenen lokalen Testleitfaden sowie einen geschuetzten lokalen Score-Reset im Dashboard
- der echte Supabase-Flow fuer Login, Session-Speicherung und Rueck-Hydration wurde inzwischen gegen die laufende Instanz verifiziert
- fuer reproduzierbare Remote-Pruefung gibt es jetzt ein eigenes Verifikationsscript im App-Projekt
- erste UX- und Mobile-Verfeinerungen fuer Login, Session, Ergebnis, Reward und Dashboard sind umgesetzt
- der Build der neuen App ist jetzt fuer GitHub Pages auf `docs/` umgestellt
- der naechste Schritt ist jetzt die Live-Validierung dieses `docs/`-Builds auf GitHub Pages

---

## 3. Ordnerlogik

### Aktiver Projektordner

- [Leo-MatheCoach](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach)

Dieser Ordner enthaelt:

- aktive Konzeptdokumente
- den aktuellen Referenz-Deploy-Stand
- kuenftige Umsetzungsartefakte der neuen App

### Aktive App-Basis

- [app/](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app)

Dieser Ordner enthaelt jetzt:

- die neue Vite-/React-/TypeScript-Codebasis
- globale Styles, Tokens und CSS Modules
- einen kleinen App-Flow ohne Router
- lokalen Persistenz-Mock ueber `localStorage`
- ein technisch angebundenes `Einmaleins-Blitz`-Modul mit Generator- und Bewertungslogik
- ein technisch angebundenes `Bruch-Match`-Modul mit eigener Aufgaben-Engine
- direkte lokale Tests fuer Teile der `times`- und `frac`-Kernlogik
- den konfigurierten Vite-Build, der fuer Deploy jetzt direkt nach `../docs` schreibt

### Deploy-Output

- [docs/](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/docs)

Dieser Ordner enthaelt jetzt:

- den generierten GitHub-Pages-Build der neuen App
- `index.html` plus gebaute Assets unter `app-assets/`
- `.nojekyll` fuer Pages-kompatible statische Auslieferung

### Archiv

- [_Archiv alte Version](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/_Archiv%20alte%20Version)

Das Archiv enthaelt:

- alte Konzepte
- alte Setup-Dokumentation
- fruehe Referenzdateien aus vorangegangenen Sessions

Diese Inhalte sind Quellen, aber nicht die aktive Hauptarbeitsbasis.

---

## 4. Wichtige aktive Dokumente

- [01_Gesamtkonzept.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/01_Gesamtkonzept.md)
- [02_Inhaltliche-Schaerfung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/02_Inhaltliche-Schaerfung.md)
- [03_Maskottchen-Styleguide.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/03_Maskottchen-Styleguide.md)
- [04_Umsetzungsplan.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/04_Umsetzungsplan.md)
- [05_Arbeitslog.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/05_Arbeitslog.md)
- [08_UI-Richtung-und-Farbwelt.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/08_UI-Richtung-und-Farbwelt.md)
- [09_Kernscreens-V1.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/09_Kernscreens-V1.md)
- [10_Module-V1-Finalisierung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/10_Module-V1-Finalisierung.md)
- [11_Technisches-Zielbild.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/11_Technisches-Zielbild.md)
- [07_Session-Handover.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/07_Session-Handover.md)
- [12_Lokaler-Testleitfaden.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/12_Lokaler-Testleitfaden.md)

---

## 5. Asset-Ablage und Vorlagen

Auch nach dem Scaffold sollen Bilder und Vorlagen im Projektordner klar getrennt abgelegt werden.

Die Root-Assets bleiben weiterhin die Quelle.
Einzelne produktiv benoetigte Dateien duerfen gezielt nach `app/public/` oder spaeter `app/src/assets/` uebernommen werden.

Empfohlene Ablage:

- `10_projects/Leo-MatheCoach/assets/mascot/`
- `10_projects/Leo-MatheCoach/assets/ui/`
- `10_projects/Leo-MatheCoach/assets/reference/`
- `10_projects/Leo-MatheCoach/prompts/`

Verwendung:

- `assets/mascot/`: finale oder halbfinale Fido-Bilder, Posen, Varianten
- `assets/ui/`: Moodboards, Screen-Referenzen, Farbtafeln, UI-Skizzen
- `assets/reference/`: externe Inspirationsbilder oder exportierte Zwischenstaende
- `prompts/`: Prompt-Sammlungen fuer ChatGPT, Gemini oder andere Bildtools

Aktuell wichtige Mascot-Assets:

- `assets/mascot/fido-main-v1.png` als beschlossene Hauptfigur
- `assets/mascot/fido-poses-final-v1.png` als aktuelles finales Posen-Sheet fuer V1
- `assets/mascot/V2/fido-poses-v2-favorite-source.png` als Quellvariante des finalisierten Posen-Sheets
- `assets/mascot/V2/fido-poses-v2-alt-01.png`
- `assets/mascot/V2/fido-poses-v2-alt-02.png`
- `assets/mascot/V2/fido-poses-v2-alt-03.png`

Regel:

- generierte Bilder und visuelle Vorlagen nicht im Archiv ablegen
- nur historische Altstaende gehoeren ins Archiv
- neue visuelle Arbeit gehoert in den aktiven Projektordner
- produktiv eingebundene Assets nur gezielt in die App uebernehmen

Bereits in die neue App uebernommen:

- `app/public/mascot/fido-main-v1.png`

---

## 6. Referenz-App: aktueller technischer Stand

Die bestehende Referenz-App liegt aktuell in:

- [index.html](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/index.html)

Charakter:

- eine einzelne HTML-Datei
- React per CDN
- ReactDOM per CDN
- Babel im Browser
- Tailwind per CDN

Die Referenz-App ist nuetzlich, weil sie bereits Ideen und Logik enthaelt:

- Login mit Name + PIN
- Supabase-Anbindung
- XP, Streak und Session-Fortschritt
- mehrere Trainingsmodule
- Wochenplan-Ansatz

Aber:

- sie ist technisch und produktlogisch nicht das finale Ziel
- sie dient als Vorlage und Ideenspeicher
- die neue App soll sauber neu aufgebaut werden

---

## 7. Datenhaltung und Backend

Aktuelle technische Leitplanken:

- Hosting ueber GitHub Pages
- Persistenz ueber Supabase
- kein GitHub-Repo als Laufzeit-Datenspeicher
- kein `service_role` im Frontend

Bekannter lokaler SQL-Stand:

- [001_leo_matheapp_init.sql](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/supabase/001_leo_matheapp_init.sql)

Bekannte Tabellen und Funktionen aus dem bisherigen Stand:

- Tabellen: `players`, `player_stats`, `quiz_results`, `skill_stats`
- RPCs: `create_player`, `login_player`, `get_player_state`, `save_session_results`, `save_free_training_result`

Diese Struktur kann fuer den Neuaufbau weiterverwendet oder angepasst werden.

---

## 8. Produktlogik: aktueller Stand

Bereits festgelegt:

- Zielgruppe: nur Leo
- Lernniveau: 6. Klasse
- V1-Startmodule: `Einmaleins-Blitz` und `Bruch-Match`
- App-Ton: ruhig, klar, motivierend
- Maskottchen: Fido
- Hauptfigur: `fido-main-v1.png`
- Posen-Sheet fuer V1: `fido-poses-final-v1.png`
- UI-Farbwelt: warmes Creme-Sand-System mit gedecktem Blau als Leitakzent
- UI-Richtung: Home freundlich, Session fokussiert, Dashboard ruhig motivierend
- V1-Screen-Set: Login/Wiedereinstieg, Home, Session, Ergebnis, Dashboard, Belohnungsansicht
- V1-Module: `Einmaleins-Blitz` und `Bruch-Match` sind fachlich definiert
- technisches Zielbild: sauberer Neuaufbau in `app/` mit Vite, React, TypeScript, CSS Modules und gekapselter Supabase-Schicht
- statt Elternbereich ein einfaches Fortschritts-Dashboard

Noch offen:

- spaetere UX-Verfeinerungen nach Backend-Anbindung
- mobile Darstellung systematisch pruefen
- GitHub Pages Deploy gegen den aktuellen `docs/`-Build live pruefen

---

## 8a. Technischer Stand in `app/`

Wichtige aktuelle Bausteine:

- `app/src/modules/times/times-engine.ts`
  - enthaelt Generatorlogik fuer `Einmaleins-Blitz`
  - bildet Stufe 1 bis 3 aus `ModuleProgress` ab
  - erzeugt 8er-Runden mit `Standardaufgabe`, `Fokusreihe`, `Gemischte Runde` und Review- bzw. Schluesselfakten
  - priorisiert bei vorhandener Historie fehlerhafte Fakten fuer spaetere Wiederholung

- `app/src/modules/times/times-module.ts`
  - baut daraus die aktive Session fuer das Modul `times`
  - gibt die aktuelle Stufe im Session-Untertitel mit

- `app/src/modules/times/times-engine.ts`
  - exportiert jetzt zusaetzlich eine Ableitung fuer die aktuell schwaechsten Fakten
  - diese wird in Home, Dashboard und Empfehlungstexten genutzt

- `app/src/modules/module-registry.ts`
  - erstellt Sessions jetzt nicht mehr rein statisch, sondern modulabhaengig mit Fortschritt und bei `times` zusaetzlich mit Fakt-Historie
  - kapselt die modulbezogene Antwortbewertung
  - leitet die Home-Empfehlung fuer `Einmaleins-Blitz` jetzt bei vorhandener Historie aus dem schwaechsten Fakt ab

- `app/src/features/home/HomeScreen.tsx`
  - zeigt eine ruhige `Einmaleins-Fokus`-Karte mit den aktuell schwaechsten Fakten

- `app/src/features/dashboard/DashboardScreen.tsx`
  - zeigt eine kompakte Liste der aktuell auffaelligen `Einmaleins`-Fakten mit Fehler- und Versuchszahl
  - enthaelt jetzt zusaetzlich einen lokalen `Score zurücksetzen`-Pfad mit PIN-Abfrage
  - erlaubt jetzt ausserdem direkte Modulstarts aus dem Dashboard

- `app/scripts/verify-supabase-flow.mjs`
  - fuehrt einen echten RPC-Flow gegen die konfigurierte Supabase-Instanz aus
  - legt einen frischen Test-Player an, prueft `create_player`, `login_player`, `get_player_state` und `save_session_results`
  - validiert anschliessend die Rueck-Hydration inklusive `times_fact_stats` fuer `6x7` und `7x8`
  - ist ueber `npm run verify:supabase` im App-Ordner aufrufbar

- `app/src/features/session/SessionScreen.tsx`
  - bewertet Antworten ueber die Modul-Registry statt ueber simplen Direktvergleich
  - zeigt dadurch normalisierte Werte und die neue Aufgabenmetadatenstruktur korrekt an
  - kann jetzt zusaetzlich modulbezogene `feedbackNote`-Hinweise nach falschen Antworten anzeigen
  - unterstuetzt jetzt Auto-Fokus auf Zahlenfelder und `Enter` als direkte Primaeraktion

- `app/src/modules/frac/frac-engine.ts`
  - enthaelt die Aufgaben-Engine fuer `Bruch-Match`
  - bildet Stufe 1 bis 3 aus `ModuleProgress` ab
  - erzeugt 8er-Runden mit `Darstellung zu Bruch`, `Bruch zu Darstellung`, `Vergleichen`, `Gleichwertig` und in Stufe 3 auch `Position`
  - haengt pro Aufgabe kurze erklaerende Feedback-Hinweise an

- `app/src/modules/frac/frac-module.ts`
  - baut daraus die aktive Session fuer das Modul `frac`
  - gibt die aktuelle Stufe im Session-Untertitel mit

- `app/src/state/app-reducer.ts`
  - schreibt fuer abgeschlossene `times`-Sessions pro Faktenpaar lokale Kennzahlen mit
  - nutzt diese Historie beim Start neuer `times`-Sessions wieder indirekt ueber die Session-Erzeugung

- `app/src/lib/storage/app-storage.ts`
  - persistiert weiterhin den lokalen Snapshot im Browser
  - speichert jetzt auch die minimale Remote-Identitaet indirekt ueber `player.id` mit

- `12_Lokaler-Testleitfaden.md`
  - beschreibt den schnellsten manuellen Testweg lokal und mit Supabase
  - enthaelt konkrete Testdaten, Terminalbefehle und das `.env.local`-Beispiel

- `app/src/lib/supabase/client.ts`
  - kapselt die optionale Initialisierung des Browser-Supabase-Clients
  - deaktiviert Auth-Session-Persistenz bewusst, weil V1 ueber Name + PIN und RPCs arbeitet

- `app/src/lib/supabase/player-api.ts`
  - bildet den ersten lesenden Backend-Pfad
  - ruft `login_player` und anschliessend `get_player_state` auf

- `app/src/lib/supabase/player-mapper.ts`
  - mappt den Supabase-Rueckgabewert auf das bestehende `AppSnapshot`
  - uebernimmt XP, Streak und modulbezogenen Fortschritt fuer `times` und `frac`
  - liest jetzt auch `times_fact_stats` aus dem Backend in das bestehende `timesFactStats`-Modell ein

- `app/src/features/auth/LoginScreen.tsx`
  - verwendet Supabase jetzt optional beim Login
  - faellt ohne gesetzte `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` weiterhin auf den lokalen Flow zurueck
  - fuellt fuer schnelle Tests jetzt standardmaessig `Leo` und `1234` vor
  - zeigt jetzt zusaetzlich, ob gerade lokaler Testmodus oder Supabase-Login aktiv ist

- `app/src/features/result/ResultScreen.tsx`
  - zeigt jetzt deutlichere Sync-Hinweise und klare Folgeaktionen fuer neue Runde, Home oder Dashboard

- `app/src/features/reward/RewardScreen.tsx`
  - ist fuer kleinere Breiten robuster und zeigt Sync-Hinweise sichtbarer

- `app/vite.config.ts`
  - baut fuer GitHub Pages jetzt nach `../docs`
  - nutzt `app-assets/` als Build-Asset-Ordner, damit kein Konflikt mit dem Projektordner `assets/` entsteht

- `app/public/.nojekyll`
  - wird mit in den Deploy-Output kopiert, damit GitHub Pages die neue App korrekt ausliefert

- `app/src/features/dashboard/DashboardScreen.tsx`
  - fragt vor lokalem Reset jetzt einen separaten Schutz-PIN ab
  - verwendet dafuer bevorzugt `VITE_RESET_GUARD_PIN`, aktuell mit Fallback `8642`

- `app/src/state/app-reducer.ts`
  - setzt den lokalen Fortschritt beim Reset jetzt sichtbar auf Nullwerte statt auf fruehere Demo-Startwerte

- `app/src/lib/supabase/session-mapper.ts`
  - mappt abgeschlossene lokale Sessions auf das RPC-Format fuer `save_session_results`
  - liefert fuer `times` jetzt auch `factKey` mit, damit Einmaleins-Faktenpaare backendseitig aggregiert werden koennen

- `app/src/lib/supabase/session-api.ts`
  - kapselt den schreibenden Backend-Pfad fuer abgeschlossene Sessions
  - speichert eine Runde via `save_session_results`
  - laedt anschliessend den aktualisierten Player-Stand wieder ueber `get_player_state`

- `app/src/app/App.tsx`
  - enthaelt jetzt den Hintergrundeffekt fuer `pendingSessionSync`
  - haelt den Reducer bewusst frei von Netzwerkzugriffen

- `app/src/state/app-types.ts` und `app/src/state/app-reducer.ts`
  - fuehren einen kleinen Status fuer ausstehende Session-Synchronisierung
  - erlauben damit lokales Session-Ende und nachgelagerten Remote-Sync als getrennte Schritte

- `app/src/lib/supabase/player-mapper.test.ts`
  - prueft das Backend-Mapping direkt per `node --test`

- `app/src/lib/supabase/session-api.test.ts`
  - prueft das Mapping abgeschlossener Sessions auf das RPC-Payloadformat direkt per `node --test`

- `supabase/001_leo_matheapp_init.sql`
  - enthaelt jetzt zusaetzlich die Tabelle `times_fact_stats`
  - erweitert `get_player_state` um `times_fact_stats`
  - erweitert `save_session_results` um faktbezogene Aggregation fuer `times`

- `app/src/modules/times/times-engine.test.ts`
  - prueft lokal Generatorverteilung, Stufenzuordnung, Antwortnormalisierung und Review-Priorisierung

- `app/src/modules/frac/frac-engine.test.ts`
  - prueft lokal Rundenumfang, Stufenzuordnung, Positionsaufgabe in Stufe 3 und Antwortbewertung

Verifiziert:

- `node --test src/lib/supabase/player-mapper.test.ts`
- `node --test src/lib/supabase/session-api.test.ts`
- `node --test src/modules/times/times-engine.test.ts`
- `node --test src/modules/frac/frac-engine.test.ts`
- `npm run build`

---

## 9. Regeln fuer spaetere Codex-Sessions

Wenn eine neue Session die App weiterentwickelt, sollte sie in dieser Reihenfolge arbeiten:

1. [07_Session-Handover.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/07_Session-Handover.md) lesen
2. [04_Umsetzungsplan.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/04_Umsetzungsplan.md) lesen
3. nur die relevanten Konzeptdokumente dazunehmen
4. vor Codearbeit pruefen, ob die Referenz-App nur Quelle oder noch Ziel ist
5. nach technischen Aenderungen diese Datei aktualisieren

---

## 10. Session-Ablauf fuer den Nutzer

Empfohlener Ablauf fuer neue Chats:

1. neuen Chat starten
2. Codex auf das Handover verweisen
3. den konkreten Block der Session nennen

Geeigneter Start:

`Bitte lies zuerst 10_projects/Leo-MatheCoach/07_Session-Handover.md und arbeite dann am naechsten sinnvollen Schritt weiter. Fokus dieser Session: ...`

Am Ende einer Session sollte der Nutzer nicht nur ein Handover verlangen, sondern die Aktualisierung des Projektstands insgesamt.

Geeigneter Abschluss:

`Bitte aktualisiere jetzt 04_Umsetzungsplan.md, 05_Arbeitslog.md und 07_Session-Handover.md auf Basis dieser Session.`

Wenn technische Struktur oder Assets neu dazugekommen sind:

`Bitte aktualisiere zusaetzlich 06_Technische-Dokumentation.md.`

---

## 11. Technischer Zielstand

Der aktuelle Zielstand ist in [11_Technisches-Zielbild.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/11_Technisches-Zielbild.md) beschrieben.

Kurzfassung:

- produktiver Frontend-Code kommt in `app/`
- die Root-`index.html` bleibt Legacy-Referenz
- Screen-Wechsel laufen in V1 ueber eine kleine AppShell statt ueber einen komplexen Router
- Supabase wird ueber gekapselte Services angebunden
- die alte Wochenlogik der Referenz-App ist nicht mehr die Zielstruktur
- der aktuelle Scaffold baut lokal erfolgreich mit `npm run build`

## 12. Empfohlene technische Reihenfolge

Fuer die Umsetzung gilt ausdruecklich diese Reihenfolge:

1. neue App in `app/` lokal scaffolden
2. Login, Home und Session-Grundflow zuerst ohne Backend mit Mock-State lauffaehig machen
3. danach die Modul-Logik pro Lernmodul sauber implementieren
4. erst danach Supabase lokal anbinden und gegen echte Daten testen
5. GitHub Pages erst pruefen, wenn der lokale Build stabil ist

Damit werden UI, Ablauf und Lernlogik zuerst isoliert testbar, bevor Deployment oder Backend-Fehler die Arbeit verlangsamen.

Diese Datei bleibt bewusst kompakt und verweist fuer die eigentliche Zielarchitektur auf das eigene Technikdokument.
