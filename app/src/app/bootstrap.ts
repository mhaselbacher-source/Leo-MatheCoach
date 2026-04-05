import { loadAppSnapshot } from "../lib/storage/app-storage";
import { getRecommendedModule } from "../modules/module-registry";
import {
  type AppState,
  type ModuleId,
  type ModuleProgress,
  type PlayerProfile,
} from "../state/app-types";

export const LOGIN_DEFAULT_NAME =
  (import.meta.env.VITE_DEFAULT_PLAYER_NAME ?? "Leo").trim() || "Leo";
export const LOGIN_DEFAULT_PIN =
  (import.meta.env.VITE_DEFAULT_PLAYER_PIN ?? "6280").trim() || "6280";

export const defaultModuleProgress = (): Record<ModuleId, ModuleProgress> => ({
  times: {
    sessionsCompleted: 4,
    masteryPercent: 64,
    accuracyPercent: 76,
    lastSummary: "Die 6er- und 7er-Reihe werden schon sicherer.",
  },
  frac: {
    sessionsCompleted: 2,
    masteryPercent: 38,
    accuracyPercent: 61,
    lastSummary: "Vergleiche klappen gut, gleichwertige Brüche brauchen noch Übung.",
  },
  "times-advanced": {
    sessionsCompleted: 0,
    masteryPercent: 0,
    accuracyPercent: 0,
    lastSummary: "Noch gesperrt. Erst das kleine 1x1 sicher festigen.",
  },
  "frac-advanced": {
    sessionsCompleted: 0,
    masteryPercent: 0,
    accuracyPercent: 0,
    lastSummary: "Noch gesperrt. Erst die Grundbrüche sicher festigen.",
  },
});

export const defaultUnlockedModules = (): Record<ModuleId, boolean> => ({
  times: true,
  frac: true,
  "times-advanced": false,
  "frac-advanced": false,
});

export function mergeModuleProgress(
  snapshotProgress?: Partial<Record<ModuleId, ModuleProgress>>,
): Record<ModuleId, ModuleProgress> {
  return {
    ...defaultModuleProgress(),
    ...snapshotProgress,
  };
}

export function mergeUnlockedModules(
  snapshotUnlocked?: Partial<Record<ModuleId, boolean>>,
): Record<ModuleId, boolean> {
  return {
    ...defaultUnlockedModules(),
    ...snapshotUnlocked,
    times: true,
    frac: true,
  };
}

export const defaultPlayer = (): PlayerProfile => ({
  name: LOGIN_DEFAULT_NAME,
  pin: LOGIN_DEFAULT_PIN,
  xp: 180,
  streak: 3,
  stars: 5,
  levelProgress: 72,
  lastSuccess: "Gestern 7 von 8 Aufgaben im Einmaleins-Blitz richtig gelöst.",
});

export function createInitialAppState(): AppState {
  const snapshot = loadAppSnapshot();
  const player = snapshot?.player ?? defaultPlayer();
  const moduleProgress = mergeModuleProgress(snapshot?.moduleProgress);
  const unlockedModules = mergeUnlockedModules(snapshot?.unlockedModules);
  const timesFactStats = snapshot?.timesFactStats ?? {};
  const recommendation = getRecommendedModule(
    moduleProgress,
    timesFactStats,
    unlockedModules,
  );

  return {
    screen: snapshot?.knownDevice && snapshot.player?.name ? "home" : "login",
    knownDevice: Boolean(snapshot?.knownDevice && snapshot.player?.name),
    player,
    moduleProgress,
    unlockedModules,
    timesFactStats,
    recommendation,
    activeSession: null,
    lastResult: snapshot?.lastResult ?? null,
    pendingSessionSync: null,
  };
}
