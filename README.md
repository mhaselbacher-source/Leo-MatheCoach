# Leo-MatheCoach

Kindgerechte Mathe-Lern-App fuer Leo mit:

- Quiz und Uebungen
- XP, Sterne und Streak
- Cloud-Speicherung ueber Supabase
- Hosting ueber GitHub Pages

## Dateien

- `index.html`
  Die eigentliche App
- `supabase/001_leo_matheapp_init.sql`
  Initiales Supabase-Schema mit Tabellen und RPC-Funktionen

## Deployment

1. `index.html` ins Repo legen
2. Repo nach GitHub pushen
3. GitHub Pages fuer den Branch aktivieren
4. Den Pages-Link oeffnen

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
