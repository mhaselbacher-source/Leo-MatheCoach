import { type FormEvent, useState } from "react";
import { ScreenHeader } from "../../components/layout/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAppDispatch, useAppState } from "../../state/app-context";
import { loadRemotePlayerSnapshot } from "../../lib/supabase/player-api";
import { LOGIN_DEFAULT_NAME, LOGIN_DEFAULT_PIN } from "../../app/bootstrap";
import styles from "./LoginScreen.module.css";

export function LoginScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(state.player.name || LOGIN_DEFAULT_NAME);
  const [pin, setPin] = useState(state.player.pin || LOGIN_DEFAULT_PIN);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const knownDevice = state.knownDevice && Boolean(state.player.name);
  const usesSupabase =
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Bitte gib einen Namen mit mindestens 2 Zeichen ein.");
      return;
    }

    if (pin.trim().length < 4) {
      setError("Bitte gib eine PIN mit mindestens 4 Zeichen ein.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const snapshot = await loadRemotePlayerSnapshot(name, pin, {
          knownDevice: true,
          player: {
            ...state.player,
            name: name.trim(),
            pin: pin.trim(),
          },
          moduleProgress: state.moduleProgress,
          timesFactStats: state.timesFactStats,
          lastResult: state.lastResult,
        });

        dispatch({
          type: "hydrate_snapshot",
          payload: snapshot,
        });

        return;
      }

      dispatch({
        type: "login",
        payload: {
          name,
          pin,
        },
      });
    } catch (submissionError) {
      const message =
        submissionError instanceof Error ? submissionError.message : "unknown_error";

      setError(
        message === "invalid_login"
          ? "Login nicht gefunden oder PIN stimmt nicht."
          : "Supabase konnte gerade nicht gelesen werden. Bitte Konfiguration und RPCs prüfen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Card className={styles.panel} tone="accent">
        <ScreenHeader
          eyebrow={knownDevice ? "Wiedereinstieg" : "Login"}
          title={knownDevice ? `Schön, dass du wieder da bist, ${state.player.name}.` : "Bereit für deine nächste Mathe-Runde?"}
          text="Der Einstieg bleibt bewusst kurz: Name, PIN und dann direkt in die nächste ruhige Lerneinheit."
        />

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Name</span>
            <input
              className={styles.input}
              autoComplete="username"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Leo"
            />
          </label>

          <label className={styles.field}>
            <span>PIN</span>
            <input
              className={styles.input}
              autoComplete="current-password"
              inputMode="numeric"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="1234"
            />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}
          <p className={styles.modeHint}>
            {usesSupabase
              ? "Verbunden mit Supabase. Name und PIN laden den gespeicherten Lernstand."
              : "Lokaler Testmodus. Ohne Supabase bleibt der Lernstand nur auf diesem Geraet."}
          </p>

          <Button fullWidth type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Pruefe Login..." : "Weiter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
