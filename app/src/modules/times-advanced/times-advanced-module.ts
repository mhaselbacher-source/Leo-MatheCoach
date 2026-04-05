import type { ActiveSession, ModuleProgress } from "../../state/app-types";
import {
  createLargeTimesTasks,
  evaluateLargeTimesAnswer,
  getLargeTimesSessionLevel,
} from "./times-advanced-engine";

export const timesAdvancedModule = {
  id: "times-advanced" as const,
  title: "Grosses 1x1",
  subtitle: "Groessere Aufgaben mit klugen Rechenwegen",
  summary:
    "Zweistellige Faktoren und ruhige Strategien zum Zerlegen, Ergänzen und sicheren Rechnen.",
  locked: true,
  unlockHint: "Kommt als Freischaltung dazu, sobald das kleine 1x1 stabil sitzt.",
};

const defaultLargeTimesProgress: ModuleProgress = {
  sessionsCompleted: 0,
  masteryPercent: 0,
  accuracyPercent: 0,
  lastSummary: "Noch gesperrt. Erst das kleine 1x1 sicher festigen.",
};

export function createTimesAdvancedSession(
  progress: ModuleProgress = defaultLargeTimesProgress,
): ActiveSession {
  const level = getLargeTimesSessionLevel(progress);

  return {
    moduleId: "times-advanced",
    title: timesAdvancedModule.title,
    subtitle: `${timesAdvancedModule.subtitle} · Stufe ${level}`,
    level,
    currentIndex: 0,
    answers: [],
    tasks: createLargeTimesTasks(progress),
  };
}

export { evaluateLargeTimesAnswer };
