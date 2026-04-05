import { MascotHero } from "../../components/mascot/MascotHero";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import {
  isModuleLocked,
  moduleCatalog,
  type ModuleDefinition,
} from "../../modules/module-registry";
import { getWeakTimesFacts } from "../../modules/times/times-engine";
import { useAppDispatch, useAppState } from "../../state/app-context";
import type { ModuleId } from "../../state/app-types";
import styles from "./HomeScreen.module.css";

export function HomeScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const recommendation = moduleCatalog[state.recommendation.moduleId];
  const weakTimesFacts = getWeakTimesFacts(state.timesFactStats, 3);
  const topWeakFact = weakTimesFacts[0];
  const isLocked = (moduleId: ModuleId) => isModuleLocked(moduleId, state.unlockedModules);

  const handleStart = (moduleId: ModuleId) => {
    dispatch({ type: "start_session", payload: { moduleId } });
  };

  return (
    <div className={styles.layout}>
      <Card className={styles.heroCard} tone="accent">
        <div className={styles.heroHeader}>
          <ScreenHeader
            eyebrow="Home"
            title={`Hallo ${state.player.name || "Leo"}.`}
            text="Heute starten wir ruhig und klar: eine Empfehlung, vier Module und ein kompakter Fortschrittsblick."
          />

          <div className={styles.recommendation}>
            <p className={styles.recommendationLabel}>Empfohlene Einheit</p>
            <h3 className={styles.recommendationTitle}>{recommendation.title}</h3>
            <p className={styles.recommendationText}>{state.recommendation.reason}</p>
            <Button onClick={() => handleStart(state.recommendation.moduleId)}>
              Jetzt starten
            </Button>
          </div>
        </div>

        <MascotHero
          title="Fido hält den Einstieg freundlich und ruhig."
          subtitle="Fortschritt bleibt sichtbar, aber die nächste klare Handlung steht immer im Vordergrund."
        />
      </Card>

      <section className={styles.progressStrip}>
        <Card className={styles.progressCard} tone="soft">
          <span className={styles.metricLabel}>Streak</span>
          <strong className={styles.metricValue}>{state.player.streak} Tage</strong>
        </Card>
        <Card className={styles.progressCard} tone="soft">
          <span className={styles.metricLabel}>XP</span>
          <strong className={styles.metricValue}>{state.player.xp}</strong>
        </Card>
        <Card className={styles.progressCard} tone="soft">
          <span className={styles.metricLabel}>Sterne</span>
          <strong className={styles.metricValue}>{state.player.stars}</strong>
        </Card>
      </section>

      <Card className={styles.focusCard} tone="soft">
        <div className={styles.focusCopy}>
          <p className={styles.statusLabel}>Einmaleins-Fokus</p>
          {topWeakFact ? (
            <>
              <h3 className={styles.focusTitle}>
                {topWeakFact.left} × {topWeakFact.right} noch einmal ruhig festigen
              </h3>
              <p className={styles.statusText}>
                Diese Aufgabe war zuletzt am wackligsten. Eine kurze Blitz-Runde hilft,
                genau diesen Fakt wieder sicher abzurufen.
              </p>
              <div className={styles.factChips}>
                {weakTimesFacts.map((fact) => (
                  <span key={fact.key} className={styles.factChip}>
                    {fact.left} × {fact.right}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.focusTitle}>Noch keine wackligen Fakten gespeichert</h3>
              <p className={styles.statusText}>
                Starte eine erste Einmaleins-Runde. Danach zeigen wir hier die Fakten,
                die sich fuer die naechste kurze Wiederholung lohnen.
              </p>
            </>
          )}
        </div>

        <Button variant="secondary" onClick={() => handleStart("times")}>
          Einmaleins oeffnen
        </Button>
      </Card>

      <section className={styles.moduleGrid}>
        {(Object.entries(moduleCatalog) as Array<[ModuleId, ModuleDefinition]>).map(
          ([moduleId, module]) => (
          <Card key={moduleId} className={styles.moduleCard}>
            <div className={styles.moduleCopy}>
              <p className={styles.moduleKicker}>Modul</p>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.moduleText}>{module.summary}</p>
              {isLocked(moduleId) ? (
                <p className={styles.moduleLock}>{module.unlockHint}</p>
              ) : null}
            </div>

            <div className={styles.moduleMeta}>
              <span>
                {isLocked(moduleId)
                  ? "Noch gesperrt"
                  : `${state.moduleProgress[moduleId].accuracyPercent}% richtig`}
              </span>
              <span>
                {isLocked(moduleId)
                  ? "Freischaltung folgt"
                  : `${state.moduleProgress[moduleId].sessionsCompleted} Runden`}
              </span>
            </div>

            <Button
              variant={moduleId === state.recommendation.moduleId ? "primary" : "secondary"}
              onClick={() => handleStart(moduleId)}
              disabled={isLocked(moduleId)}
            >
              {isLocked(moduleId) ? "Noch gesperrt" : "Runde öffnen"}
            </Button>
          </Card>
          ),
        )}
      </section>

      <Card className={styles.statusCard}>
        <div>
          <p className={styles.statusLabel}>Letzter Erfolg</p>
          <p className={styles.statusText}>{state.player.lastSuccess}</p>
        </div>

        <Button variant="ghost" onClick={() => dispatch({ type: "open_dashboard" })}>
          Zum Dashboard
        </Button>
      </Card>
    </div>
  );
}
