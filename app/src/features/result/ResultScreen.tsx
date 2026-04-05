import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppDispatch, useAppState } from "../../state/app-context";
import styles from "./ResultScreen.module.css";

export function ResultScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const result = state.lastResult;
  const pendingSessionSync = state.pendingSessionSync;

  if (!result) {
    return null;
  }

  return (
    <Card className={styles.card} tone="soft">
      <p className={styles.eyebrow}>Ergebnis</p>
      <h2 className={styles.title}>{result.title} ist abgeschlossen.</h2>
      <p className={styles.text}>{result.feedback}</p>
      {pendingSessionSync?.status === "saving" ? (
        <p className={styles.syncInfo}>Der Lernstand wird gerade mit Supabase synchronisiert.</p>
      ) : null}
      {pendingSessionSync?.status === "error" ? (
        <p className={styles.syncWarning}>
          Die Runde wurde lokal gespeichert, aber noch nicht an Supabase gesendet.
        </p>
      ) : null}

      <div className={styles.stats}>
        <div>
          <span className={styles.label}>Richtig</span>
          <strong>
            {result.correctAnswers} / {result.totalTasks}
          </strong>
        </div>
        <div>
          <span className={styles.label}>XP</span>
          <strong>+{result.xpGained}</strong>
        </div>
        <div>
          <span className={styles.label}>Sterne</span>
          <strong>{state.player.stars}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <Button fullWidth
          onClick={() =>
            dispatch({
              type: "start_session",
              payload: { moduleId: result.moduleId },
            })
          }
        >
          Noch eine Runde
        </Button>
        <Button fullWidth variant="secondary" onClick={() => dispatch({ type: "go_home" })}>
          Zurück nach Home
        </Button>
        <Button fullWidth variant="ghost" onClick={() => dispatch({ type: "open_dashboard" })}>
          Fortschritt ansehen
        </Button>
      </div>
    </Card>
  );
}
