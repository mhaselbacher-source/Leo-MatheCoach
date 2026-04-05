import type {
  ActiveSession,
  ModuleProgress,
  TimesFactStat,
} from "../../state/app-types";
import {
  createTimesTasks,
  evaluateTimesAnswer,
  getTimesSessionLevel,
} from "./times-engine";

export const timesModule = {
  id: "times" as const,
  title: "Einmaleins-Blitz",
  subtitle: "Kurze Runden für schnelle Fakten",
  summary: "Acht klare Aufgaben mit Fokus auf sichere Reihen und Wiederholung.",
};

const defaultTimesProgress: ModuleProgress = {
  sessionsCompleted: 0,
  masteryPercent: 0,
  accuracyPercent: 0,
  lastSummary: "",
};

export function createTimesSession(
  progress: ModuleProgress = defaultTimesProgress,
  factStats: Record<string, TimesFactStat> = {},
): ActiveSession {
  const level = getTimesSessionLevel(progress);

  return {
    moduleId: "times",
    title: timesModule.title,
    subtitle: `${timesModule.subtitle} · Stufe ${level}`,
    level,
    currentIndex: 0,
    answers: [],
    tasks: createTimesTasks(progress, factStats),
  };
}

export { evaluateTimesAnswer };
