import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppDispatch, useAppState } from "../../state/app-context";
import styles from "./RewardScreen.module.css";

export function RewardScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const result = state.lastResult;
  const pendingSessionSync = state.pendingSessionSync;

  if (!result) {
    return null;
  }

  return (
    <Card className={styles.card} tone="soft">
      <p className={styles.badge}>Belohnung</p>
      <h2 className={styles.title}>Neuer Stern für eine starke Runde.</h2>
      <p className={styles.text}>
        {state.player.name || "Leo"} hat {result.correctAnswers} von{" "}
        {result.totalTasks} Aufgaben richtig gelöst und dabei {result.xpGained} XP
        gesammelt.
      </p>
      {pendingSessionSync?.status === "saving" ? (
        <p className={styles.syncInfo}>Die Runde wird gerade im Hintergrund gespeichert.</p>
      ) : null}
      {pendingSessionSync?.status === "error" ? (
        <p className={styles.syncWarning}>
          Lokal ist alles gesichert. Die Supabase-Synchronisierung hat noch nicht geklappt.
        </p>
      ) : null}

      <div className={styles.starRow} aria-hidden="true">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>

      <Button fullWidth onClick={() => dispatch({ type: "close_reward" })}>
        Weiter zum Ergebnis
      </Button>
    </Card>
  );
}
