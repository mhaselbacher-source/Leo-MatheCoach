import type { AppSnapshot, AppState } from "../../state/app-types";

const STORAGE_KEY = "leo-mathecoach-v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadAppSnapshot(): AppSnapshot | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? (JSON.parse(rawValue) as AppSnapshot) : null;
  } catch {
    return null;
  }
}

export function saveAppSnapshot(state: AppState) {
  if (!isBrowser()) {
    return;
  }

  const snapshot: AppSnapshot = {
    knownDevice: state.knownDevice,
    player: state.player,
    moduleProgress: state.moduleProgress,
    unlockedModules: state.unlockedModules,
    timesFactStats: state.timesFactStats,
    lastResult: state.lastResult,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage errors for the scaffold phase.
  }
}
