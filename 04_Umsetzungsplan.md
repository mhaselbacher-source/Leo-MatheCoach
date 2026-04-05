---
typ: umsetzungsplan
projekt: "Leo MatheCoach"
erstellt: 2026-04-04
aktualisiert: 2026-04-06
status: aktiv
baut-auf:
  - "/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/01_Gesamtkonzept.md"
  - "/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/02_Inhaltliche-Schaerfung.md"
  - "/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/03_Maskottchen-Styleguide.md"
---

# Leo MatheCoach: Umsetzungsplan

## 1. Ziel dieses Dokuments

Dieses Dokument ist die aktive Arbeits- und Checkliste fuer die Umsetzung.

Es beantwortet:

- Was ist als Naechstes zu tun
- Was ist bereits entschieden
- Welche Bausteine sind offen
- In welcher Reihenfolge soll gearbeitet werden

---

## 2. Arbeitsmodus fuer mehrere Chat-Sessions

Regel:

- dieses Dokument ist die zentrale Checkliste
- erledigte Punkte werden abgehakt
- neue Aufgaben werden nur hier oder im Arbeitslog nachgefuehrt
- die Session-Handover-Datei verweist immer auf den naechsten sinnvollen Block

---

## 3. Projektphasen

### Phase 1: Produktgrundlage

- [x] Gesamtkonzept erstellt
- [x] Inhaltliche Schaerfung V1 erstellt
- [x] Maskottchen-Styleguide erstellt
- [x] Umsetzungsplan, Arbeitslog, technische Doku und Handover aufgesetzt

### Phase 2: Maskottchen und Designrichtung

- [x] Stilrichtungen fuer Fido definieren und vergleichen
- [x] erste Bildgenerationen mit ChatGPT oder Gemini erzeugen
- [x] eine Hauptstilrichtung auswaehlen
- [x] Asset-Ablage fuer Maskottchen und UI-Vorlagen konsistent nutzen
- [x] Farbwelt der App an Fido ausrichten
- [x] grundlegende UI-Richtung festlegen

### Phase 3: Produktstruktur und Screens

- [x] Kernscreens fuer V1 festlegen
- [x] Home-Screen inhaltlich definieren
- [x] Session-Screen definieren
- [x] Ergebnis-Screen definieren
- [x] Fortschritts-Dashboard definieren
- [x] Belohnungsansicht definieren

### Phase 4: Lernlogik und Aufgabenmodelle

- [x] Einmaleins-Blitz fachlich ausdefinieren
- [x] Bruch-Match fachlich ausdefinieren
- [x] erste Schwierigkeitslogik festlegen
- [x] Belohnungslogik konkretisieren
- [x] Fortschrittskennzahlen festlegen

### Phase 5: Technisches Zielbild

- [x] Zielstruktur der neuen App definieren
- [x] Entscheidung zu Stack und Ordnerstruktur dokumentieren
- [x] Datenmodell und API-Nutzung beschreiben
- [x] Umgang mit bestehender Referenz-App klaeren
- [x] Neuaufbau gegen Referenz abgrenzen

### Phase 6: Umsetzung V1

- [x] Projektstruktur fuer neue App anlegen
- [x] Basislayout und Navigation bauen
- [x] lokalen Mock-State fuer Login, Home und Session bereitstellen
- [x] `Einmaleins-Blitz` technisch aus dem Mock-Set in Generator-, Bewertungs- und Session-Logik ueberfuehren
- [x] erste lokale Tests fuer `Einmaleins-Blitz`-Kernlogik anlegen
- [x] Login/Wiedereinstieg bauen
- [x] Home-Screen bauen
- [x] `Einmaleins-Blitz`-Historie im UI sichtbar machen
- [x] Bruch-Match an die Session-Architektur anschliessen
- [x] Ergebnis-Screen implementieren
- [x] Dashboard implementieren
- [x] Belohnungslogik einbauen
- [ ] Supabase-Anbindung integrieren

### Phase 7: Stabilisierung

- [x] lokalen Testleitfaden erstellen und lokalen Flow pruefen
- [ ] offene UX-Brueche schliessen
- [ ] mobile Darstellung pruefen
- [ ] GitHub Pages Deploy pruefen
- [x] technische Doku finalisieren
- [x] Session-Handover aktualisieren

---

## 4. Aktuelle Prioritaet

Der konzeptionelle Vorbau fuer V1 ist abgeschlossen.

Der technische Scaffold fuer V1 ist jetzt vorhanden.

Der aktuelle Fokus liegt jetzt auf dem Uebergang von lokal stabiler V1-Logik zu echter Persistenz.

Naechste sinnvolle Reihenfolge:

1. offene UX-Verfeinerungen auf dem verifizierten Backend-Stand abschliessen
2. mobile Darstellung in realistischen Tablet- und Laptop-Breiten pruefen
3. GitHub Pages mit dem aktuellen `docs/`-Build pruefen
4. erst danach groessere Datenmodell-Erweiterungen angehen

---

## 5. Naechste konkrete Aufgaben

### Block A: Fido

- [x] 3 Stilrichtungen per Bild-KI erzeugen
- [x] Favorit auswaehlen
- [x] Hauptpose definieren
- [x] 3 bis 5 Standardposen definieren
- [x] Bilder unter `assets/mascot/` ablegen
- [x] verwendete Prompts unter `prompts/` sichern

### Block B: UI

- [x] kleine Farbpalette aus den finalen Fido-Assets ableiten
- [x] Liste der V1-Screens finalisieren
- [x] Home-Screen genauer beschreiben
- [x] Session-Flow als Mini-Wireframe beschreiben
- [x] Dashboard-Inhalte konkretisieren

### Block C: Lerninhalt

- [x] Einmaleins-Fragetypen festlegen
- [x] Bruch-Fragetypen festlegen
- [x] XP- und Sternelogik konkretisieren
- [x] Kriterien fuer Fortschritt definieren

### Block D: Implementierungsreihenfolge

- [x] neue App lokal ohne Backend lauffaehig machen
- [x] Login, Home und Session lokal mit Mock-State pruefen
- [x] `Einmaleins-Blitz` auf echte Generator- und Bewertungslogik umstellen
- [x] lokale Fakt-Historie fuer spaetere Wiederholungsaufgaben anlegen
- [x] schwache Fakten als konkrete Uebungsempfehlung im UI anzeigen
- [x] Empfehlungstexte an die `Einmaleins`-Historie koppeln
- [x] `Bruch-Match` an dieselbe Session-Architektur anschliessen
- [x] kurze erklaerende Feedback-Hinweise fuer falsche `Bruch-Match`-Antworten einbauen
- [x] ersten lesenden Supabase-Login mit Remote-State-Hydration anbinden
- [x] danach schreibenden Supabase-Persistenzpfad fuer Sessions anbinden
- [x] danach Datenmodell fuer Fakt-Historie und Remote-Fortschritt sauber zusammenziehen
- [x] konkreten lokalen Testleitfaden fuer App- und Supabase-Test anlegen
- [x] schnellen Testmodus mit vorausgefuelltem Login und lokalem Score-Reset absichern
- [x] erweitertes Supabase-Schema produktiv anwenden und End-to-End pruefen
- [x] reproduzierbaren technischen Supabase-Verifikationstest im App-Projekt anlegen
- [x] Pages-Build auf konfliktfreien `docs/`-Output umstellen
- [ ] GitHub Pages gegen den aktuellen `docs/`-Build live pruefen

---

## 6. Definition von "V1 bereit fuer Umsetzung"

V1 ist konzeptionell bereit fuer Umsetzung, wenn diese Punkte geklaert sind:

- [x] Fido-Stilrichtung entschieden
- [x] App-Farbwelt grob entschieden
- [x] 3 bis 5 Kernscreens beschrieben
- [x] Einmaleins-Blitz fachlich definiert
- [x] Bruch-Match fachlich definiert
- [x] Session-Ablauf fixiert
- [x] Dashboard-Kennzahlen fixiert
- [x] technisches Zielbild dokumentiert

---

## 7. Hinweise fuer spaetere Sessions

Wenn eine neue Session startet:

1. zuerst [07_Session-Handover.md](/Users/markushaselbacher/Documents/Obsidian/SB/10_projects/Leo-MatheCoach/07_Session-Handover.md) lesen
2. dann dieses Dokument pruefen
3. nur einen klar abgegrenzten Block gleichzeitig bearbeiten
4. nach Abschluss Haken setzen und Handover aktualisieren
