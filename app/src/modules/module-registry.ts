import {
  createFractionSession,
  evaluateFractionAnswer,
  fractionModule,
} from "./frac/frac-module";
import {
  advancedFractionModule,
  createAdvancedFractionSession,
  evaluateAdvancedFractionAnswer,
} from "./frac-advanced/frac-advanced-module";
import {
  createTimesAdvancedSession,
  evaluateLargeTimesAnswer,
  timesAdvancedModule,
} from "./times-advanced/times-advanced-module";
import {
  createTimesSession,
  evaluateTimesAnswer,
  timesModule,
} from "./times/times-module";
import { getWeakTimesFacts } from "./times/times-engine";
import type {
  ActiveSession,
  ModuleId,
  ModuleProgress,
  Recommendation,
  SessionEvaluation,
  SessionTask,
  TimesFactStat,
} from "../state/app-types";

export interface ModuleDefinition {
  id: ModuleId;
  title: string;
  subtitle: string;
  summary: string;
  locked?: boolean;
  unlockHint?: string;
}

export function isModuleLocked(
  moduleId: ModuleId,
  unlockedModules: Record<ModuleId, boolean>,
) {
  if (moduleId === "times" || moduleId === "frac") {
    return false;
  }

  if (moduleId === "times-advanced" || moduleId === "frac-advanced") {
    return !unlockedModules[moduleId];
  }

  return false;
}

const moduleRegistry = {
  times: timesModule,
  frac: fractionModule,
  "times-advanced": timesAdvancedModule,
  "frac-advanced": advancedFractionModule,
} satisfies Record<ModuleId, ModuleDefinition>;

export function getModuleById(moduleId: ModuleId) {
  return moduleRegistry[moduleId];
}

export function createSessionForModule(
  moduleId: ModuleId,
  progress: ModuleProgress,
  timesFactStats: Record<string, TimesFactStat> = {},
): ActiveSession {
  return moduleId === "times"
    ? createTimesSession(progress, timesFactStats)
    : moduleId === "frac"
      ? createFractionSession(progress)
      : moduleId === "times-advanced"
        ? createTimesAdvancedSession(progress)
        : createAdvancedFractionSession(progress);
}

export function evaluateTaskAnswer(
  moduleId: ModuleId,
  task: SessionTask,
  value: string,
): SessionEvaluation {
  if (moduleId === "times" && task.kind === "number") {
    return evaluateTimesAnswer(task, value);
  }

  if (moduleId === "frac" && task.kind === "choice") {
    return evaluateFractionAnswer(task, value);
  }

  if (moduleId === "times-advanced" && task.kind === "number") {
    return evaluateLargeTimesAnswer(task, value);
  }

  if (moduleId === "frac-advanced" && task.kind === "choice") {
    return evaluateAdvancedFractionAnswer(task, value);
  }

  const submittedValue = value.trim();

  return {
    submittedValue,
    isCorrect: submittedValue === task.answer,
  };
}

export function getRecommendedModule(
  progress: Record<ModuleId, ModuleProgress>,
  timesFactStats: Record<string, TimesFactStat> = {},
  unlockedModules?: Record<ModuleId, boolean>,
): Recommendation {
  const recommendedId =
    progress.times.masteryPercent <= progress.frac.masteryPercent ? "times" : "frac";
  const module = getModuleById(recommendedId);
  const weakestTimesFact = getWeakTimesFacts(timesFactStats, 1)[0];

  return {
    moduleId: recommendedId,
    title: module.title,
    reason:
      recommendedId === "times"
        ? weakestTimesFact
          ? `Heute lohnt sich eine kurze Blitz-Runde. ${weakestTimesFact.left} × ${weakestTimesFact.right} braucht gerade noch etwas Ruhe.`
          : "Heute lohnt sich eine kurze Blitz-Runde für sichere Reihen."
        : "Heute passt eine ruhige Bruch-Runde mit klaren Vergleichen.",
  };
}

export const moduleCatalog: Record<ModuleId, ModuleDefinition> = moduleRegistry;
