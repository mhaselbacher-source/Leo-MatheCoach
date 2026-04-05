---
typ: session-handover
projekt: "Leo MatheCoach"
erstellt: 2026-04-04
aktualisiert: 2026-04-06
status: aktiv
---

# Leo MatheCoach: Session Handover

## 1. Projektstand

Leo MatheCoach wird als neue, ruhig gestaltete Mathe-Lern-App fuer Leo konzipiert.

Produktleitplanken:

- Zielgruppe nur Leo
- Lernniveau 6. Klasse
- Fokus auf Einmaleins und Brueche
- ruhiges, klares UI
- Fido als Hundemaskottchen
- Fortschritts-Dashboard statt Elternbereich

Die bestehende HTML-App im Projektordner ist Referenz, nicht finale Zielarchitektur.

Der konzeptionelle Unterbau fuer V1 ist jetzt in eine neue technische Codebasis im Ordner `app/` ueberfuehrt.

Der Vite-/React-/TypeScript-Scaffold steht, die Root-`index.html` blieb unberuehrt, und Login/Home/Session laufen bereits als lokaler Flow.

Die neue App hat jetzt auch einen ersten echten Supabase-Pfad:

- `LoginScreen.tsx` nutzt optional `login_player` und `get_player_state`
- `app/src/lib/supabase/player-api.ts` kapselt diesen lesenden RPC-Flow
- `app/src/lib/supabase/player-mapper.ts` ueberfuehrt den Remote-Stand in das bestehende `AppSnapshot`
- ohne `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` bleibt der lokale Login-Fallback aktiv

Es gibt jetzt auch einen ersten schreibenden Persistenzpfad:

- abgeschlossene Sessions erzeugen im Reducer eine `pendingSessionSync`
- `app/src/app/App.tsx` synchronisiert diese Runden anschliessend im Hintergrund ueber `save_session_results`
- nach erfolgreichem Speichern wird der aktualisierte Remote-Stand erneut ueber `get_player_state` geladen und in den bestehenden App-State zurueckgemischt
- Ergebnis- und Belohnungsscreen zeigen den Sync-Status bei Bedarf als kurzen Hinweis an

Die Fakt-Historie fuer `Einmaleins` ist jetzt auch backendseitig vorbereitet:

- `supabase/001_leo_matheapp_init.sql` enthaelt jetzt eine neue Tabelle `times_fact_stats`
- `save_session_results` kann fuer `times` jetzt zusaetzlich `factKey` aus dem RPC-Payload verarbeiten
- `get_player_state` gibt diese Faktenhistorie als `times_fact_stats` zurueck
- `app/src/lib/supabase/player-mapper.ts` hydratisiert `times_fact_stats` in das bestehende `timesFactStats`-Modell
- `app/src/lib/supabase/session-mapper.ts` liefert fuer `times`-Antworten jetzt `factKey` mit

Der produktive Supabase-Flow ist jetzt auch technisch gegen die echte Instanz verifiziert:

- `app/scripts/verify-supabase-flow.mjs` legt einen frischen Test-Player an und prueft `create_player`, `login_player`, `get_player_state` und `save_session_results`
- der Check validiert anschliessend die Rueck-Hydration inklusive `times_fact_stats` fuer echte `times`-Antworten
- das Script ist ueber `npm run verify:supabase` im Ordner `app/` reproduzierbar aufrufbar
- der Remote-Test lief in dieser Session erfolgreich durch

Diese Session hat den lokalen Testfluss deutlich vereinfacht:

- neues Dokument `12_Lokaler-Testleitfaden.md` mit konkreten Befehlen, Links, `.env.local`-Beispiel und SQL fuer einen Test-Player
- Login ist fuer schnelle Tests jetzt mit `Leo` und `1234` vorausgefuellt
- Dashboard hat einen lokalen `Score zurücksetzen`-Button
- dieser Reset ist ueber einen separaten Schutz-PIN abgesichert
- der Reset setzt jetzt sichtbar auf echte Nullwerte zurueck statt auf fruehere Demo-Startwerte

Diese Session hat ausserdem erste UX- und Mobile-Bruche geschlossen:

- Login zeigt jetzt klar, ob lokaler Testmodus oder echter Supabase-Login aktiv ist
- der vorausgefuellte Schnelltest ist jetzt konsistent auf `Leo` und `1234`
- Session unterstuetzt jetzt Auto-Fokus und `Enter` als direkte Primaeraktion
- Dashboard erlaubt jetzt direkte Modulstarts
- Ergebnis- und Belohnungsscreen zeigen klarere Sync-Hinweise und naechste Schritte

Der Build fuer GitHub Pages ist jetzt ebenfalls vorbereitet:

- `app/vite.config.ts` schreibt den Build jetzt nach `docs/` statt nach `app/dist`
- der Asset-Ordner heisst fuer den Deploy jetzt `app-assets/`, damit er nicht mit dem bestehenden Projektordner `assets/` kollidiert
- `.nojekyll` wird jetzt mit in den Deploy-Output uebernommen
- `README.md` beschreibt den aktuellen `/docs`-Flow statt der alten Root-`index.html`

`Einmaleins-Blitz` ist technisch nicht mehr nur ein Mock-Set:

- Aufgaben werden jetzt pro Runde generiert
- Stufe 1 bis 3 werden aus dem Modulfortschritt abgeleitet
- Antworten werden modulbezogen bewertet und numerisch normalisiert
- lokale Fakt-Historie pro Einmaleins-Faktenpaar wird gespeichert
- Wiederholungsaufgaben greifen bei vorhandener Historie bevorzugt tatsaechlich fehlerhafte Fakten auf

Die `Einmaleins`-Historie ist jetzt auch sichtbar in der Oberflaeche:

- Home zeigt eine ruhige `Einmaleins-Fokus`-Karte mit den auffaelligsten Fakten
- Dashboard zeigt die wichtigsten schwachen Fakten mit Fehler- und Versuchszahl
- die Home-Empfehlung fuer `Einmaleins-Blitz` nennt bei vorhandener Historie den aktuell schwaechsten Fakt direkt im Text

`Bruch-Match` ist ebenfalls nicht mehr nur ein statisches Mock-Set:

- Aufgaben werden jetzt pro Runde aus einer eigenen `frac`-Engine erzeugt
- Stufe 1 bis 3 werden aus dem Modulfortschritt abgeleitet
- Fragetypen sind an das V1-Konzept angebunden
- falsche Antworten koennen kurze, anschauliche Erklaerhinweise anzeigen

---

## 2. Was bereits vorliegt

- [01_Gesamtkonzept.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/01_Gesamtkonzept.md)
- [02_Inhaltliche-Schaerfung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/02_Inhaltliche-Schaerfung.md)
- [03_Maskottchen-Styleguide.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/03_Maskottchen-Styleguide.md)
- [01_Fido-Prompt-Pack.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/prompts/01_Fido-Prompt-Pack.md)
- [assets/mascot/_auswahl.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/assets/mascot/_auswahl.md)
- [04_Umsetzungsplan.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/04_Umsetzungsplan.md)
- [05_Arbeitslog.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/05_Arbeitslog.md)
- [06_Technische-Dokumentation.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/06_Technische-Dokumentation.md)
- [08_UI-Richtung-und-Farbwelt.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/08_UI-Richtung-und-Farbwelt.md)
- [09_Kernscreens-V1.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/09_Kernscreens-V1.md)
- [10_Module-V1-Finalisierung.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/10_Module-V1-Finalisierung.md)
- [11_Technisches-Zielbild.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/11_Technisches-Zielbild.md)
- [app/](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app)

---

## 3. Aktuell offene Hauptpunkte

- optional spaeter einen echten Reset-Pfad auch fuer Supabase bauen
- offene restliche UX-Brueche nach echter Backend-Verifikation sammeln und schliessen
- mobile Darstellung und GitHub-Pages-Deploy gegen den aktuellen `docs/`-Build pruefen
- spaetere UX-Verfeinerungen nach Backend-Anbindung entscheiden

---

## 4. Naechster sinnvoller Schritt

Der sinnvollste naechste Block ist:

UX-Feinschliff und Auslieferungspruefung auf dem jetzt verifizierten Backend-Stand

Dazu:

1. den aktuellen `docs/`-Build auf GitHub Pages live pruefen
2. den echten App-Flow im Browser gegen Supabase nochmals manuell durchklicken
3. dabei restliche UX-Brueche in Login, Session, Ergebnis, Reward, Home und Dashboard notieren
4. mobile Darstellung in typischen Tablet-/Laptop-Breiten systematisch pruefen

---

## 5. Wichtige Hinweise fuer die naechste Session

- nicht wieder bei Grundsatzfragen zur Architektur anfangen
- nicht die alte Archivversion als aktive Basis behandeln
- die bestehende HTML-App nur als Vorlage lesen
- die neue App nicht wieder neu scaffolden; der Grundaufbau in `app/` existiert bereits
- neue Bilder und Vorlagen im aktiven Projektordner unter `assets/` bzw. `prompts/` ablegen
- Fido-Hauptfigur ist fuer V1 bereits entschieden: `fido-main-v1.png`
- produktiv eingebundene Fido-Datei liegt aktuell in `app/public/mascot/fido-main-v1.png`
- `fido-main-flat-v1.png` ist keine offene Richtungsfrage mehr, sondern nur noch Referenz
- finales Posen-Sheet fuer V1 liegt vor als `assets/mascot/fido-poses-final-v1.png`
- die App-Farbwelt und UI-Richtung fuer V1 sind jetzt in `08_UI-Richtung-und-Farbwelt.md` festgehalten
- die V1-Kernscreens sind jetzt in `09_Kernscreens-V1.md` beschrieben
- die V1-Module sind jetzt in `10_Module-V1-Finalisierung.md` fachlich fixiert
- das technische Zielbild fuer V1 ist jetzt in `11_Technisches-Zielbild.md` festgelegt
- `Einmaleins-Blitz` sitzt technisch jetzt in `app/src/modules/times/times-engine.ts` und `app/src/modules/times/times-module.ts`
- `Bruch-Match` sitzt technisch jetzt in `app/src/modules/frac/frac-engine.ts` und `app/src/modules/frac/frac-module.ts`
- die modulbezogene Antwortbewertung laeuft ueber `app/src/modules/module-registry.ts`
- lokale Einmaleins-Historie liegt im App-State als `timesFactStats` und wird ueber `localStorage` mitpersistiert
- die Home- und Dashboard-Empfehlungen lesen diese Historie jetzt sichtbar aus
- ein konkreter Testleitfaden liegt jetzt vor in `12_Lokaler-Testleitfaden.md`
- der erste optionale Supabase-Login sitzt in `app/src/features/auth/LoginScreen.tsx`
- `LoginScreen.tsx` fuellt fuer den lokalen Schnelltest jetzt `Leo` und `1234` vor
- der neue Backend-Mapper sitzt in `app/src/lib/supabase/player-api.ts` und `app/src/lib/supabase/player-mapper.ts`
- der erste schreibende Persistenzpfad sitzt in `app/src/lib/supabase/session-api.ts` und `app/src/lib/supabase/session-mapper.ts`
- der Hintergrund-Sync fuer abgeschlossene Sessions sitzt in `app/src/app/App.tsx`
- das SQL-Schema enthaelt jetzt `times_fact_stats` fuer Einmaleins-Faktenpaare
- der reproduzierbare Remote-Check sitzt jetzt in `app/scripts/verify-supabase-flow.mjs` und laeuft ueber `npm run verify:supabase`
- der GitHub-Pages-Build sitzt jetzt in `docs/`; Quelle ist `app/`, nicht mehr die alte Root-`index.html`
- der Build nutzt jetzt `app-assets/` statt `assets/`, damit keine Kollision mit dem Projektordner `assets/` entsteht
- das Dashboard enthaelt jetzt einen lokalen Reset mit Schutz-PIN; aktueller Fallback-PIN ist `8642`, sofern kein `VITE_RESET_GUARD_PIN` gesetzt ist
- der lokale Reset setzt jetzt echte Nullwerte statt frueherer Demo-Defaults
- der aktuelle direkte Test fuer diese Logik liegt in `app/src/modules/times/times-engine.test.ts`
- der aktuelle direkte Test fuer `Bruch-Match` liegt in `app/src/modules/frac/frac-engine.test.ts`
- der aktuelle direkte Test fuer das Supabase-Mapping liegt in `app/src/lib/supabase/player-mapper.test.ts`
- der aktuelle direkte Test fuer das Session-RPC-Mapping liegt in `app/src/lib/supabase/session-api.test.ts`
- `SessionScreen.tsx` kann jetzt zusaetzlich modulbezogene `feedbackNote`-Texte nach falschen Antworten anzeigen
- `npm run verify:supabase` lief in dieser Session erfolgreich gegen die konfigurierte Instanz
- `npm run build` in `app/` lief in dieser Session ebenfalls erfolgreich
- `npm run build` erzeugte in dieser Session erfolgreich den neuen Deploy-Output in `docs/`
- spaetere Verfeinerung ist moeglich, aber fuer die konzeptionelle Weiterarbeit nicht mehr blockierend

---

## 6. Empfohlener Startprompt fuer die naechste Session

```text
Wir arbeiten an Leo MatheCoach weiter. Bitte lies zuerst 10_projects/Leo-MatheCoach/07_Session-Handover.md und dann 10_projects/Leo-MatheCoach/04_Umsetzungsplan.md. Die bestehende App in 10_projects/Leo-MatheCoach/index.html ist nur Referenz. Die neue Codebasis in 10_projects/Leo-MatheCoach/app besteht bereits. Der echte Supabase-Flow fuer Login, Session-Speicherung, Rueck-Hydration und `times_fact_stats` wurde bereits erfolgreich verifiziert; zusaetzlich gibt es dafuer jetzt `npm run verify:supabase` im App-Ordner. Der GitHub-Pages-Build der neuen App wird jetzt nach `docs/` geschrieben und ist deploy-vorbereitet. Ziel dieser Session: den `docs/`-Build live pruefen, restliche UX-Bruche sammeln oder die mobile Darstellung systematisch testen.
```
