import styles from "./AppShell.module.css";
import { Button } from "../components/ui/Button";
import { useAppDispatch, useAppState } from "../state/app-context";
import { LoginScreen } from "../features/auth/LoginScreen";
import { HomeScreen } from "../features/home/HomeScreen";
import { SessionScreen } from "../features/session/SessionScreen";
import { ResultScreen } from "../features/result/ResultScreen";
import { DashboardScreen } from "../features/dashboard/DashboardScreen";
import { RewardScreen } from "../features/reward/RewardScreen";

export function AppShell() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const isLoggedIn = Boolean(state.player.name);
  const showPrimaryNavigation =
    isLoggedIn && state.screen !== "login" && state.screen !== "session";

  return (
    <div className={styles.page}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <main className={styles.shell}>
        <header className={styles.brandBar}>
          <div>
            <p className={styles.kicker}>Leo MatheCoach</p>
            <h1 className={styles.brandTitle}>Ruhig lernen, klar vorankommen.</h1>
          </div>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: "logout" })}
            >
              Abmelden
            </Button>
          ) : null}
        </header>

        <section className={styles.screenArea}>
          {state.screen === "login" ? <LoginScreen /> : null}
          {state.screen === "home" ? <HomeScreen /> : null}
          {state.screen === "session" ? <SessionScreen /> : null}
          {state.screen === "result" ? <ResultScreen /> : null}
          {state.screen === "dashboard" ? <DashboardScreen /> : null}
          {state.screen === "reward" ? <RewardScreen /> : null}
        </section>

        {showPrimaryNavigation ? (
          <nav className={styles.bottomNav} aria-label="Hauptnavigation">
            <Button
              variant={state.screen === "home" ? "secondary" : "ghost"}
              onClick={() => dispatch({ type: "go_home" })}
            >
              Home
            </Button>
            <Button
              variant={state.screen === "dashboard" ? "secondary" : "ghost"}
              onClick={() => dispatch({ type: "open_dashboard" })}
            >
              Dashboard
            </Button>
          </nav>
        ) : null}
      </main>
    </div>
  );
}
