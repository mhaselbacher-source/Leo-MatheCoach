# Leo-MatheCoach

Kindgerechte Mathe-Lern-App fuer Leo mit:

- Quiz und Uebungen
- XP, Sterne und Streak
- Cloud-Speicherung ueber Supabase
- Hosting ueber GitHub Pages

## Dateien

- `index.html`
  Alte Referenz-App als historische Einzeldatei
- `app/`
  Aktive Vite-/React-/TypeScript-Codebasis
- `docs/`
  Generierter GitHub-Pages-Build der neuen App
- `supabase/001_leo_matheapp_init.sql`
  Initiales Supabase-Schema mit Tabellen und RPC-Funktionen

## Deployment

1. Im Ordner `app/` den aktuellen Build erzeugen:

```bash
cd /Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/app
npm run build
```

2. Dadurch wird der auslieferbare Stand der neuen App nach `docs/` geschrieben.
3. Im GitHub-Repo unter Pages als Source `Deploy from a branch` aktivieren.
4. Als Branch `main` und als Folder `/docs` waehlen.
5. Danach Commit + Push ausfuehren und den Pages-Link oeffnen.

Wichtig:

- `app/vite.config.ts` baut absichtlich mit relativem `base: "./"` fuer GitHub Pages
- die aktive Pages-App kommt jetzt aus `docs/`, nicht mehr aus der alten Root-`index.html`
- die alte Root-`index.html` bleibt nur Referenz und sollte nicht mehr als Deploy-Ziel behandelt werden

## Supabase

Die App erwartet ein bereits eingerichtetes Supabase-Projekt.

Wichtig:

- `publishable key` darf im Frontend stehen
- `service_role` darf niemals im Frontend oder Repo stehen

## Hinweis

Der lokale `gh`-Login war beim letzten Stand ungueltig. Falls du das Repo direkt per CLI anlegen willst:

```bash
gh auth login
```
