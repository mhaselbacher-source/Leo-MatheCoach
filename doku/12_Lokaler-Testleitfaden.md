---
typ: testleitfaden
projekt: "Leo MatheCoach"
erstellt: 2026-04-05
aktualisiert: 2026-04-05
status: aktiv
---

# Leo MatheCoach: Lokaler Testleitfaden

Dieser Leitfaden ist der schnellste Weg, die neue App lokal zu pruefen.

Er deckt zwei Faelle ab:

- lokaler Flow ohne Supabase
- echter Persistenztest mit Supabase

---

## 1. Wichtige Pfade

- Projektroot: [10_projects/Leo-MatheCoach](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach)
- App-Codebasis: [app/](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app)
- Supabase-Schema: [001_leo_matheapp_init.sql](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/supabase/001_leo_matheapp_init.sql)

---

## 2. Schnellstart ohne Supabase

Dieser Test braucht keine Cloud-Daten und keine echten Login-Daten.

### Terminal

Arbeitsordner:

```bash
cd /Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app
```

Dev-Server starten:

```bash
npm run dev
```

Vite laeuft danach normalerweise unter:

- `http://localhost:5173`

Falls der Port belegt ist, zeigt Vite im Terminal einen anderen lokalen Link an.

### Login-Daten fuer den lokalen Test

Ohne Supabase kannst du einfach frei waehlen:

- Name: `Leo`
- PIN: `1234`

Das sind keine fest hinterlegten Zugangsdaten. Die App akzeptiert lokal einfach jeden Namen mit mindestens 2 Zeichen und jede PIN mit mindestens 4 Zeichen.

### Was du testen sollst

1. `http://localhost:5173` oeffnen
2. mit `Leo` / `1234` einloggen
3. `Einmaleins-Blitz` starten
4. absichtlich 1 bis 2 Aufgaben falsch beantworten
5. Session abschliessen
6. Home pruefen:
   `Einmaleins-Fokus` sollte jetzt schwache Fakten zeigen
7. Dashboard pruefen:
   dort sollten dieselben schwachen Fakten als Fehler-/Versuchsstatistik sichtbar sein
8. Browser neu laden
9. pruefen, ob Login-Status, XP, Sterne und Einmaleins-Historie erhalten bleiben

### Erwartetes Ergebnis

- Login klappt sofort
- Session-Flow laeuft ohne Fehler durch
- Ergebnis- oder Reward-Screen erscheint
- Home und Dashboard zeigen nach Fehlern schwache Einmaleins-Fakten
- Reload behaelt den Stand ueber `localStorage`

---

## 3. Vorab-Checks im Terminal

Wenn du vor dem manuellen Test erst die technischen Checks laufen lassen willst:

```bash
cd /Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app
node --test src/lib/supabase/player-mapper.test.ts
node --test src/lib/supabase/session-api.test.ts
node --test src/modules/times/times-engine.test.ts
node --test src/modules/frac/frac-engine.test.ts
npm run build
```

Fuer einen direkten technischen Remote-Check gegen die konfigurierte Supabase-Instanz gibt es jetzt zusaetzlich:

```bash
npm run verify:supabase
```

Dieser Check:

- legt einen frischen Test-Player an
- prueft `create_player`, `login_player`, `get_player_state` und `save_session_results`
- validiert danach die Rueck-Hydration inklusive `times_fact_stats`

---

## 4. Echten Supabase-Test vorbereiten

Hier geht es darum, ob Login, Session-Speicherung und Rueck-Hydration gegen die echte Datenbank funktionieren.

### Schritt 1: SQL in Supabase ausfuehren

In Supabase:

1. Projekt oeffnen
2. SQL Editor oeffnen
3. den Inhalt von [001_leo_matheapp_init.sql](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/supabase/001_leo_matheapp_init.sql) einfuegen
4. ausfuehren

Wichtig:

- Diese Datei enthaelt jetzt auch `times_fact_stats`
- wenn du das SQL schon frueher einmal ausgefuehrt hast, sollte die aktuelle Version trotzdem nochmals geprueft und ausgefuehrt werden, damit die neuen Teile enthalten sind

### Schritt 2: `.env.local` anlegen

Datei:

- `app/.env.local`

Inhalt:

```bash
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=DEIN_SUPABASE_PUBLISHABLE_KEY
```

Hinweis:

- niemals `service_role` eintragen
- nur die normale Publishable / Anon Key verwenden
- Login-Felder sind bewusst nicht mit Beispiel-Zugangsdaten vorausgefuellt; die Testdaten werden manuell eingegeben

### Schritt 3: Test-Player anlegen

Ich kenne keine bestehenden echten Login-Daten aus deinem Repo.
Am schnellsten legst du dir deshalb einen klaren Test-Player direkt in Supabase an.

Im SQL Editor ausfuehren:

```sql
select *
from public.create_player('Leo Test', '1234');
```

Wenn der Name schon existiert, nimm stattdessen zum Beispiel:

```sql
select *
from public.create_player('Leo Test 2', '1234');
```

### Konkrete Test-Login-Daten fuer Supabase

Wenn du den obigen SQL-Befehl verwendest, nimm in der App:

- Name: `Leo Test`
- PIN: `1234`

oder alternativ:

- Name: `Leo Test 2`
- PIN: `1234`

---

## 5. Echten Supabase-Test durchfuehren

### Terminal

```bash
cd /Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app
npm run dev
```

### Browser

- `http://localhost:5173`

### Testablauf

1. mit `Leo Test` / `1234` einloggen
2. pruefen, ob der Login klappt und kein Fehlertext stehen bleibt
3. `Einmaleins-Blitz` starten
4. eine Runde spielen und bewusst 2 bis 3 Aufgaben falsch beantworten
5. Session abschliessen
6. im Ergebnis pruefen:
   kurz kann ein Sync-Hinweis erscheinen
7. zurueck auf Home
8. Home und Dashboard pruefen:
   die Einmaleins-Schwachstellen sollten sichtbar sein
9. Browser neu laden
10. erneut mit `Leo Test` / `1234` einloggen
11. pruefen, ob XP, Fortschritt und schwache Fakten wiederkommen

### Erwartetes Ergebnis

- Login laedt den Remote-Stand
- Session wird gespeichert
- danach wird der Stand erneut geladen
- schwache Einmaleins-Fakten bleiben nach Reload erhalten, nicht nur lokal

---

## 6. Wenn etwas schiefgeht

### Login klappt lokal, aber nicht mit Supabase

Pruefen:

- ist `app/.env.local` vorhanden
- stimmen `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`
- wurde das SQL wirklich in Supabase ausgefuehrt
- existiert der Test-Player wirklich

### Session wird lokal abgeschlossen, aber nicht remote gespeichert

Im UI wuerde dann typischerweise ein Hinweis stehen, dass die Runde lokal gespeichert wurde, aber nicht an Supabase gesendet werden konnte.

Dann pruefen:

- ist `save_session_results` in Supabase vorhanden
- ist das aktuelle SQL mit `times_fact_stats` eingespielt
- wurde wirklich mit einem Supabase-Player eingeloggt und nicht nur lokal

### Schwache Einmaleins-Fakten fehlen nach Reload

Dann pruefen:

- wurde wirklich eine `times`-Runde gespielt
- wurden Fehler gemacht
- ist das aktuelle SQL mit `times_fact_stats` aktiv
- wurde nach der Session der Sync erfolgreich abgeschlossen

---

## 7. Empfohlene Minimalroute

Wenn du es moeglichst schnell testen willst:

1. lokal ohne Supabase:
   `Leo` / `1234`
2. danach mit Supabase:
   SQL ausfuehren, `.env.local` anlegen, `Leo Test` / `1234` anlegen
3. dann denselben Flow noch einmal mit echter Persistenz durchspielen

---

## 8. Naechster sinnvoller Schritt nach dem Test

Wenn der echte Supabase-Test klappt, ist der naechste Block:

- End-to-End lokal als erfolgreich markieren
- UX-Brueche sammeln
- mobile Darstellung pruefen
