import type { ActiveSession, ModuleProgress } from "../../state/app-types";
import {
  createAdvancedFractionTasks,
  evaluateAdvancedFractionAnswer,
  getAdvancedFractionSessionLevel,
} from "./frac-advanced-engine";

export const advancedFractionModule = {
  id: "frac-advanced" as const,
  title: "Grosse Brüche",
  subtitle: "Schwieriger vergleichen, kürzen und über 1 hinaus denken",
  summary:
    "Anspruchsvollere Bruchaufgaben mit gemischten Zahlen, Kürzen und Positionen über 1.",
  locked: true,
  unlockHint: "Wird zusammen mit dem grossen 1x1 freigeschaltet.",
};

const defaultAdvancedFractionProgress: ModuleProgress = {
  sessionsCompleted: 0,
  masteryPercent: 0,
  accuracyPercent: 0,
  lastSummary: "Noch gesperrt. Erst die Grundbrüche sicher festigen.",
};

export function createAdvancedFractionSession(
  progress: ModuleProgress = defaultAdvancedFractionProgress,
): ActiveSession {
  const level = getAdvancedFractionSessionLevel(progress);

  return {
    moduleId: "frac-advanced",
    title: advancedFractionModule.title,
    subtitle: `${advancedFractionModule.subtitle} · Stufe ${level}`,
    level,
    currentIndex: 0,
    answers: [],
    tasks: createAdvancedFractionTasks(progress),
  };
}

export { evaluateAdvancedFractionAnswer };
