import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppDispatch, useAppState } from "../../state/app-context";
import { isModuleLocked, moduleCatalog } from "../../modules/module-registry";
import { getWeakTimesFacts } from "../../modules/times/times-engine";
import type { ModuleId } from "../../state/app-types";
import styles from "./DashboardScreen.module.css";

const RESET_GUARD_PIN = (import.meta.env.VITE_RESET_GUARD_PIN ?? "8642").trim();

export function DashboardScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const weakTimesFacts = getWeakTimesFacts(state.timesFactStats, 3);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [resetPin, setResetPin] = useState("");
  const [unlockPin, setUnlockPin] = useState("");
  const [resetError, setResetError] = useState("");
  const [unlockError, setUnlockError] = useState("");

  const isLocked = (moduleId: ModuleId) => isModuleLocked(moduleId, state.unlockedModules);

  const handleResetRequest = () => {
    setShowResetPrompt(true);
    setResetPin("");
    setResetError("");
  };

  const handleResetCancel = () => {
    setShowResetPrompt(false);
    setResetPin("");
    setResetError("");
  };

  const handleUnlockRequest = () => {
    setShowUnlockPrompt(true);
    setUnlockPin("");
    setUnlockError("");
  };

  const handleUnlockCancel = () => {
    setShowUnlockPrompt(false);
    setUnlockPin("");
    setUnlockError("");
  };

  const handleUnlockConfirm = () => {
    if (unlockPin.trim() !== RESET_GUARD_PIN) {
      setUnlockError("Der Freischalt-Code stimmt nicht.");
      return;
    }

    dispatch({
      type: "unlock_module",
      payload: { moduleId: "times-advanced" },
    });
    setShowUnlockPrompt(false);
    setUnlockPin("");
    setUnlockError("");
  };

  const handleStart = (moduleId: ModuleId) => {
    dispatch({
      type: "start_session",
      payload: { moduleId },
    });
  };

  const handleResetConfirm = () => {
    if (resetPin.trim() !== RESET_GUARD_PIN) {
      setResetError("Der Reset-PIN stimmt nicht.");
      return;
    }

    dispatch({ type: "reset_progress" });
    setShowResetPrompt(false);
    setResetPin("");
    setResetError("");
  };

  return (
    <div className={styles.layout}>
      <Card className={styles.hero} tone="accent">
        <p className={styles.eyebrow}>Dashboard</p>
        <h2 className={styles.title}>Du kommst sichtbar voran.</h2>
        <p className={styles.text}>
          XP, Streak und Modulfokus bleiben kompakt. Das Dashboard soll motivieren,
          nicht kontrollieren.
        </p>
      </Card>

      <section className={styles.metrics}>
        <Card className={styles.metric} tone="soft">
          <span className={styles.label}>XP</span>
          <strong>{state.player.xp}</strong>
        </Card>
        <Card className={styles.metric} tone="soft">
          <span className={styles.label}>Streak</span>
          <strong>{state.player.streak} Tage</strong>
        </Card>
        <Card className={styles.metric} tone="soft">
          <span className={styles.label}>Sterne</span>
          <strong>{state.player.stars}</strong>
        </Card>
      </section>

      <Card className={styles.focusCard} tone="soft">
        <p className={styles.label}>Einmaleins-Check</p>
        {weakTimesFacts.length > 0 ? (
          <>
            <h3 className={styles.moduleTitle}>Diese Fakten brauchen gerade etwas Ruhe</h3>
            <p className={styles.text}>
              Die Liste basiert auf bisherigen Fehlern und zeigt, wo eine kurze
              Wiederholung jetzt am meisten bringt.
            </p>
            <div className={styles.factList}>
              {weakTimesFacts.map((fact) => (
                <div key={fact.key} className={styles.factItem}>
                  <strong>
                    {fact.left} × {fact.right}
                  </strong>
                  <span>
                    {fact.incorrect} Fehler bei {fact.attempts} Versuchen
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className={styles.moduleTitle}>Noch keine Einmaleins-Schwachstellen sichtbar</h3>
            <p className={styles.text}>
              Sobald ein paar Einmaleins-Runden gelaufen sind, erscheint hier ein
              kompakter Uebungsfokus.
            </p>
          </>
        )}
      </Card>

      <section className={styles.moduleGrid}>
        {(Object.keys(moduleCatalog) as ModuleId[]).map((moduleId) => {
          const module = moduleCatalog[moduleId];

          return (
          <Card key={moduleId} className={styles.moduleCard}>
            <h3 className={styles.moduleTitle}>{module.title}</h3>
            <p className={styles.moduleText}>
              {state.moduleProgress[moduleId].lastSummary}
            </p>
            {isLocked(moduleId) ? (
              <p className={styles.moduleText}>{module.unlockHint}</p>
            ) : null}

            <div className={styles.moduleMeta}>
              <span>
                Fortschritt:{" "}
                {isLocked(moduleId)
                  ? "gesperrt"
                  : `${state.moduleProgress[moduleId].masteryPercent}%`}
              </span>
              <span>
                Trefferquote:{" "}
                {isLocked(moduleId)
                  ? "noch offen"
                  : `${state.moduleProgress[moduleId].accuracyPercent}%`}
              </span>
            </div>

            {moduleId === "times-advanced" && isLocked(moduleId) ? (
              <Button variant="secondary" onClick={handleUnlockRequest}>
                Grosses 1x1 und Brüche freischalten
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => handleStart(moduleId)}>
                Runde starten
              </Button>
            )}
          </Card>
          );
        })}
      </section>

      <Card className={styles.footer}>
        <p className={styles.text}>{state.player.lastSuccess}</p>
        {showResetPrompt ? (
          <div className={styles.resetPrompt}>
            <p className={styles.resetTitle}>Reset nur mit Schutz-PIN</p>
            <input
              className={styles.resetInput}
              inputMode="numeric"
              type="password"
              autoComplete="new-password"
              name="reset-guard-code"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={resetPin}
              onChange={(event) => setResetPin(event.target.value)}
              placeholder="Reset-PIN"
            />
            {resetError ? <p className={styles.resetError}>{resetError}</p> : null}
            <div className={styles.resetActions}>
              <Button variant="secondary" onClick={handleResetConfirm}>
                Reset bestätigen
              </Button>
              <Button variant="ghost" onClick={handleResetCancel}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : null}
        {showUnlockPrompt ? (
          <div className={styles.resetPrompt}>
            <p className={styles.resetTitle}>Grosses 1x1 und Brüche mit Code freischalten</p>
            <input
              className={styles.resetInput}
              inputMode="numeric"
              type="password"
              autoComplete="new-password"
              name="module-unlock-code"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={unlockPin}
              onChange={(event) => setUnlockPin(event.target.value)}
              placeholder="Freischalt-Code"
            />
            {unlockError ? <p className={styles.resetError}>{unlockError}</p> : null}
            <div className={styles.resetActions}>
              <Button variant="secondary" onClick={handleUnlockConfirm}>
                Modul freischalten
              </Button>
              <Button variant="ghost" onClick={handleUnlockCancel}>
                Abbrechen
              </Button>
            </div>
          </div>
        ) : null}
        <div className={styles.footerActions}>
          <Button variant="ghost" onClick={() => dispatch({ type: "go_home" })}>
            Zurück nach Home
          </Button>
          <Button variant="secondary" onClick={handleResetRequest}>
            Score zurücksetzen
          </Button>
        </div>
      </Card>
    </div>
  );
}
