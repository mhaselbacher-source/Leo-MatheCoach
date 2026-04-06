---
typ: arbeitslog
projekt: "Leo MatheCoach"
erstellt: 2026-04-04
aktualisiert: 2026-04-06
status: aktiv
---

# Leo MatheCoach: Arbeitslog

## Zweck

Dieses Dokument haelt wichtige Arbeits- und Entscheidungsstaende chronologisch fest.

Es ist kein Konzept und keine To-do-Liste.
Es dokumentiert:

- was gemacht wurde
- was entschieden wurde
- was bewusst offen blieb
- was die naechste Session wissen muss

---

## Eintragsformat

Empfohlenes Format:

`YYYY-MM-DD [Typ] Thema - Entscheidung / Umsetzung / Hinweis`

Typen:

- `[I]` Information
- `[D]` Entscheidung
- `[U]` Umsetzung
- `[O]` Offen

---

## Log

2026-04-03 [I] Projektkarte fuer Leo MatheCoach angelegt und Grundrichtung dokumentiert.

2026-04-03 [D] Technische Grundarchitektur festgelegt: statische Web-App auf GitHub Pages, Persistenz ueber Supabase, Login ueber Name + PIN.

2026-04-03 [U] Erste Referenz-App als HTML-Stand mit Supabase-Anbindung, XP/Streak-Logik und mehreren Mathemodulen erstellt.

2026-04-04 [D] Alte Materialsammlung als historische Quelle behandelt; neue aktive Arbeitsbasis liegt im Ordner `10_projects/Leo-MatheCoach/`.

2026-04-04 [U] Neues Produktdokument [01_Gesamtkonzept.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/01_Gesamtkonzept.md) erstellt.

2026-04-04 [D] Inhaltliche Leitplanken geschaerft: Zielgruppe nur Leo, 6. Klasse, Fokus auf Einmaleins und Brueche, ruhiges klares UI, Fido als Hundemaskottchen, kein Elternbereich.

2026-04-04 [U] Zweites Produktdokument [02_Inhaltliche-Schaerfung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/02_Inhaltliche-Schaerfung.md) erstellt.

2026-04-04 [D] V1-Kernmodule festgelegt: `Einmaleins-Blitz` und `Bruch-Match`.

2026-04-04 [U] Maskottchen-Richtung mit [03_Maskottchen-Styleguide.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/03_Maskottchen-Styleguide.md) dokumentiert.

2026-04-04 [D] Operative Projektdokumentation aufgesetzt: Umsetzungsplan, Arbeitslog, technische Doku und Session-Handover.

2026-04-04 [U] Asset-Ordner und Prompt-Pack fuer die erste Fido-Bildrunde angelegt: `assets/mascot/`, `assets/ui/`, `assets/reference/`, `prompts/01_Fido-Prompt-Pack.md`.

2026-04-04 [D] Lokale Sprachregel im Projektordner verankert: sichtbare Texte fuer Nutzer werden mit normalen Umlauten geschrieben; ASCII bleibt fuer technische Bezeichner erlaubt.

2026-04-04 [U] Erste Fido-Bildrunde gesichtet, Shortlist ausgewählt und umbenannt: `fido-main-v1.png`, `fido-main-flat-v1.png`, `fido-poses-v1.png`, `fido-style-directions-v1.png`, `fido-concepts-school-v1.png`.

2026-04-04 [D] Finale Fido-Stilrichtung fuer V1 festgelegt: `fido-main-v1.png` ist die Hauptfigur. `fido-main-flat-v1.png` bleibt nur Referenz fuer spaetere Vereinfachung oder kleinere UI-Groessen.

2026-04-04 [U] Auswahl-Dokument und Umsetzungsplan auf die finale Fido-Entscheidung aktualisiert; zusaetzlich ein fokussiertes Produktionsbriefing fuer das finale Posen-Set angelegt: `prompts/02_Fido-Posen-Set-Final.md`.

2026-04-04 [D] Neuer Posen-Favorit fuer V1 festgelegt: `assets/mascot/V2/fido-poses-v2-favorite-source.png` ist derzeit die beste Basis fuer das finale 5-Posen-Set.

2026-04-04 [I] Der wichtigste verbleibende Mangel am neuen Posen-Favoriten ist der eingebrannte englische Text im Bild; dieser gilt als Produktionsdetail und nicht als Richtungsproblem.

2026-04-04 [U] Textfreie Endvariante des Posen-Favoriten im aktiven Asset-Ordner abgelegt als `assets/mascot/fido-poses-final-v1.png`.

2026-04-04 [U] Kryptische Dateinamen der V2-Posenrunde fuer die weitere Arbeit bereinigt: `fido-poses-v2-favorite-source.png`, `fido-poses-v2-alt-01.png`, `fido-poses-v2-alt-02.png`, `fido-poses-v2-alt-03.png`.

2026-04-04 [D] Die Fido-Grundlage fuer V1 ist damit vorlaeufig stabil: Hauptfigur `fido-main-v1.png`, Posen-Sheet `fido-poses-final-v1.png`.

2026-04-04 [D] V1-Farbwelt und UI-Richtung festgelegt: warmes Creme-Sand-System mit `Coach Blue` als primaerem Aktionsakzent; Home freundlich, Session fokussiert, Dashboard ruhig motivierend.

2026-04-04 [U] Eigenstaendiges UI-Dokument angelegt: [08_UI-Richtung-und-Farbwelt.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/08_UI-Richtung-und-Farbwelt.md).

2026-04-04 [D] V1-Kernscreens festgelegt: Login/Wiedereinstieg, Home, Session, Ergebnis, Dashboard und Belohnungsansicht bilden das komplette Hauptscreen-Set fuer den ersten Neuaufbau.

2026-04-04 [U] Screen-Konzept mit Mini-Wireframe und Standardfluss angelegt: [09_Kernscreens-V1.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/09_Kernscreens-V1.md).

2026-04-04 [D] Die V1-Module fachlich finalisiert: `Einmaleins-Blitz` und `Bruch-Match` haben jetzt feste Fragetypen, 8er-Runden, einfache Schwierigkeitsstufen sowie klare XP-, Stern- und Fortschrittsregeln.

2026-04-04 [U] Moduldokument fuer die Umsetzung angelegt: [10_Module-V1-Finalisierung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/10_Module-V1-Finalisierung.md).

2026-04-04 [D] Technisches Zielbild fuer V1 festgelegt: sauberer Neuaufbau in `app/` mit React, TypeScript, Vite, CSS Modules, kleiner AppShell und gekapselter Supabase-Schicht.

2026-04-04 [U] Eigenstaendiges Technikdokument angelegt: [11_Technisches-Zielbild.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/doku/11_Technisches-Zielbild.md).

2026-04-04 [I] Der konzeptionelle V1-Unterbau ist damit komplett genug fuer den Start der technischen Umsetzung: Designrichtung, Kernscreens, Moduldefinition und Zielarchitektur sind festgelegt.

2026-04-04 [O] Als naechstes kann die neue App-Struktur im Ordner `app/` angelegt werden. Danach folgen Basislayout, Navigation und die erste technische Anbindung.

2026-04-05 [U] Neue Frontend-Codebasis im Ordner `app/` angelegt: Vite, React, TypeScript, CSS-Tokens, CSS Modules und Grundstruktur fuer `app`, `features`, `modules`, `lib`, `state`.

2026-04-05 [U] Erste AppShell mit globalem Reducer-State und lokalem Mock-Flow fuer `login`, `home`, `session`, `result`, `dashboard` und `reward` umgesetzt; Root-`index.html` blieb unveraendert als Referenz.

2026-04-05 [U] Erstes produktiv genutztes Mascot-Asset in die neue App uebernommen: `app/public/mascot/fido-main-v1.png`.

2026-04-05 [U] Lokale Verifikation der neuen App abgeschlossen: `npm install` und `npm run build` in `app/` laufen erfolgreich.

2026-04-05 [D] Der naechste technische Block ist nicht mehr das Scaffold, sondern die Ueberfuehrung von `Einmaleins-Blitz` aus statischen Mock-Aufgaben in echte Generator-, Auswertungs- und spaetere Testlogik.

2026-04-05 [U] Reproduzierbaren Remote-Check fuer Supabase angelegt: `app/scripts/verify-supabase-flow.mjs` prueft jetzt `create_player`, `login_player`, `get_player_state`, `save_session_results` und die Rueck-Hydration von `times_fact_stats`.

2026-04-05 [U] Echten End-to-End-Flow gegen die konfigurierte Supabase-Instanz erfolgreich verifiziert: der Check legte einen frischen Test-Player an, speicherte eine Session und bestaetigte danach korrekte `times_fact_stats` fuer `6x7` und `7x8`.

2026-04-05 [D] Der naechste sinnvolle Block verschiebt sich damit von der Backend-Grundanbindung zu UX-Feinschliff, mobiler Pruefung und spaeterer Deploy-Validierung.

2026-04-06 [U] `Einmaleins-Blitz` in `app/src/modules/times/` von statischen Aufgaben auf echte Generatorlogik mit 8er-Runden, Stufenlogik und Aufgabenlabels fuer `Standardaufgabe`, `Fokusreihe`, `Gemischte Runde` und `Schluesselfakt` umgestellt.

2026-04-06 [U] Session-Flow der neuen App an modulbezogene Antwortbewertung angebunden; numerische Antworten werden jetzt vor der Bewertung normalisiert statt nur roh mit Strings verglichen.

2026-04-06 [U] Erste direkte Tests fuer die `Einmaleins-Blitz`-Kernlogik angelegt: Generatorverteilung, Stufenzuordnung und numerische Bewertungslogik sind lokal pruefbar.

2026-04-06 [D] Testdateien werden fuer die App absichtlich nicht in den produktiven TypeScript-Build einbezogen; `tsconfig.json` schliesst `src/**/*.test.ts` jetzt explizit aus.

2026-04-06 [U] Lokale Verlaufsspur fuer `Einmaleins`-Fakten eingefuehrt: pro Faktenpaar werden Versuche, richtige und falsche Antworten im App-State und `localStorage` mitgeschrieben.

2026-04-06 [D] Wiederholungsaufgaben fuer `Einmaleins-Blitz` basieren jetzt nicht mehr nur auf festen Schluesselfakten, sondern priorisieren bei vorhandener Historie tatsaechlich fehlerhafte Fakten.

2026-04-06 [U] Technische Verifikation der Session abgeschlossen: `node --test src/modules/times/times-engine.test.ts` und `npm run build` in `app/` laufen erfolgreich.

2026-04-06 [U] `Einmaleins`-Schwachstellen im UI sichtbar gemacht: Home und Dashboard lesen jetzt aus `timesFactStats` die wackligsten Fakten aus und zeigen sie als ruhige Uebungsempfehlung.

2026-04-06 [D] Die Home-Empfehlung fuer `Einmaleins-Blitz` nutzt jetzt nicht mehr nur den allgemeinen Modulstatus, sondern nennt bei vorhandener Historie den aktuell schwaechsten Fakt direkt im Text.

2026-04-06 [U] `Bruch-Match` von einem statischen Mock-Set auf eine eigene Session-Engine mit Stufe 1 bis 3, Aufgabenlabels und generierten 8er-Runden umgestellt.

2026-04-06 [U] Neues Frac-Testfile angelegt: `app/src/modules/frac/frac-engine.test.ts` prueft Rundenumfang, Stufenzuordnung, Positionsaufgabe in Stufe 3 und Antwortbewertung.

2026-04-06 [D] `Bruch-Match` ist damit technisch nicht mehr nur ein loses Auswahlset, sondern an dieselbe Session-Architektur wie `Einmaleins-Blitz` angeschlossen.

2026-04-06 [U] Session-Feedback fuer `Bruch-Match` erweitert: falsche Antworten koennen jetzt kurze, anschauliche Erklaerhinweise aus dem Task selbst anzeigen.

2026-04-06 [U] Wiederholte lokale Verifikation erfolgreich: `node --test src/modules/frac/frac-engine.test.ts`, `node --test src/modules/times/times-engine.test.ts` und `npm run build` in `app/` laufen erfolgreich.

2026-04-06 [U] Erste Supabase-Anbindung in der neuen App umgesetzt: `LoginScreen.tsx` nutzt jetzt optional die RPCs `login_player` und `get_player_state`, wenn `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` gesetzt sind.

2026-04-06 [U] Neues Backend-Mapping eingefuehrt: `app/src/lib/supabase/player-api.ts` und `player-mapper.ts` ueberfuehren den Supabase-Zustand in das bestehende lokale `AppSnapshot`-Modell, inklusive XP-, Streak- und Modulfortschritts-Hydration.

2026-04-06 [D] Die erste Backend-Integration bleibt bewusst lesend und optional: ohne Supabase-Konfiguration funktioniert der bisherige lokale Login weiter; mit Konfiguration wird der gespeicherte Remote-Stand geladen.

2026-04-06 [U] Zusaeztlicher direkter Test fuer das Backend-Mapping angelegt: `node --test src/lib/supabase/player-mapper.test.ts` laeuft lokal erfolgreich; `npm run build` in `app/` ebenfalls.

2026-04-06 [U] Erster schreibender Supabase-Persistenzpfad umgesetzt: abgeschlossene Sessions werden jetzt ausserhalb des Reducers als `pendingSessionSync` markiert und im App-Layer ueber `save_session_results` gespeichert.

2026-04-06 [U] Nach erfolgreichem Speichern wird der Remote-Stand erneut ueber `get_player_state` geladen und in den bestehenden App-State zurueckgemischt, ohne den aktuellen Screen-Flow zu verlassen.

2026-04-06 [D] Der Reducer bleibt netzwerkfrei; Remote-Sync laeuft bewusst als Hintergrundeffekt in `app/src/app/App.tsx`.

2026-04-06 [U] Neue direkte Tests fuer das Session-RPC-Mapping angelegt: `node --test src/lib/supabase/session-api.test.ts` laeuft lokal erfolgreich; `npm run build` in `app/` ebenfalls.

2026-04-06 [U] Das Supabase-Schema fuer V1 um eine neue Tabelle `times_fact_stats` erweitert, damit Einmaleins-Faktenpaare nicht mehr nur lokal, sondern backendseitig als Versuche, richtige und falsche Antworten gespeichert werden koennen.

2026-04-06 [U] `save_session_results` verarbeitet fuer `times` jetzt optional `factKey` im RPC-Payload und schreibt daraus aggregierte Fakt-Statistiken; `get_player_state` gibt diese als `times_fact_stats` zurueck.

2026-04-06 [U] Frontend-Mapping erweitert: `player-mapper.ts` hydratisiert `times_fact_stats` jetzt in das bestehende `timesFactStats`-Modell; `session-mapper.ts` liefert `factKey` fuer `times`-Antworten mit.

2026-04-06 [D] Die bestehende Home- und Dashboard-Logik fuer Einmaleins-Schwachstellen kann damit fachlich auf demselben Datenmodell weiterlaufen, egal ob die Historie lokal oder aus Supabase kommt.

2026-04-06 [U] Konkreten lokalen Testleitfaden angelegt: `12_Lokaler-Testleitfaden.md` enthaelt jetzt exakte Pfade, Befehle, Browser-Link, `.env.local`-Beispiel und SQL zum Anlegen eines Test-Players.

2026-04-06 [U] Login fuer schnellere Tests bereinigt: die Eingabefelder starten jetzt leer und zeigen nur noch neutrale Platzhalter statt sichtbarer Beispiel-Zugangsdaten.

2026-04-06 [U] Dashboard um einen lokalen `Score zurücksetzen`-Pfad erweitert.

2026-04-06 [D] Der Reset ist jetzt ueber einen separaten Schutz-PIN abgesichert, damit Leo den Fortschritt nicht versehentlich loescht. Der PIN kommt bevorzugt aus `VITE_RESET_GUARD_PIN`, aktuell mit Fallback `8642`.

2026-04-06 [U] Reset-Verhalten korrigiert: statt auf Demo-Startwerte zurueckzufallen setzt der Dashboard-Reset jetzt sichtbar auf echte Nullwerte fuer XP, Streak, Sterne, Modulfortschritt und `timesFactStats`.

2026-04-06 [U] Wiederholte technische Verifikation erfolgreich: `node --test src/lib/supabase/player-mapper.test.ts` und `npm run build` in `app/` liefen nach den Test- und Reset-Anpassungen erfolgreich.

2026-04-06 [U] UX-Feinschliff begonnen: Login zeigt jetzt klar lokalen Testmodus versus Supabase-Modus; Session ist per `Enter` und Auto-Fokus direkter bedienbar; Dashboard erlaubt Modulstarts jetzt auch direkt aus dem Fortschrittsblick.

2026-04-06 [U] Ergebnis- und Belohnungsscreen fuer kleinere Breiten und klarere naechste Schritte ueberarbeitet: Sync-Hinweise sind sichtbarer, Aktionen sind eindeutiger, und der Flow nach einer Runde ist kuerzer.

2026-04-06 [U] GitHub-Pages-Buildpfad der neuen App bereinigt: Vite schreibt jetzt nach `docs/` statt `app/dist`, nutzt `app-assets/` statt `assets/` und liefert `.nojekyll` mit, damit keine Kollision mit dem bestehenden Projektordner `assets/` entsteht.

2026-04-06 [D] Die neue App ist damit technisch fuer einen Pages-Deploy vorbereitet; offen ist jetzt nur noch der echte Live-Check des `docs/`-Builds auf GitHub Pages. Ein echter Remote-Reset existiert weiterhin noch nicht.
