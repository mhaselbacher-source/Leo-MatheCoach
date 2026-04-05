import type { ActiveSession, ModuleProgress } from "../../state/app-types";
import {
  createFractionTasks,
  evaluateFractionAnswer,
  getFractionSessionLevel,
} from "./frac-engine";

export const fractionModule = {
  id: "frac" as const,
  title: "Bruch-Match",
  subtitle: "Ruhig vergleichen und sicher zuordnen",
  summary: "Acht anschauliche Aufgaben mit Auswahlfeldern statt freier Eingabe.",
};

const defaultFractionProgress: ModuleProgress = {
  sessionsCompleted: 0,
  masteryPercent: 0,
  accuracyPercent: 0,
  lastSummary: "",
};

export function createFractionSession(
  progress: ModuleProgress = defaultFractionProgress,
): ActiveSession {
  const level = getFractionSessionLevel(progress);

  return {
    moduleId: "frac",
    title: fractionModule.title,
    subtitle: `${fractionModule.subtitle} · Stufe ${level}`,
    level,
    currentIndex: 0,
    answers: [],
    tasks: createFractionTasks(progress),
  };
}

export { evaluateFractionAnswer };
