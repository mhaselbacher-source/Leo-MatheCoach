import {
  createSessionForModule,
  getRecommendedModule,
  isModuleLocked,
} from "../modules/module-registry";
import {
  defaultPlayer,
  mergeModuleProgress,
  mergeUnlockedModules,
} from "../app/bootstrap";
import type {
  AppAction,
  AppState,
  ModuleId,
  PendingSessionSync,
  SessionResult,
  SessionAnswer,
  SessionTask,
  TimesFactStat,
} from "./app-types";

function getResultFeedback(moduleId: ModuleId, correctAnswers: number) {
  if (moduleId === "times-advanced") {
    if (correctAnswers >= 7) {
      return "Starke Runde. Die grossen Aufgaben wirken schon deutlich ruhiger.";
    }

    if (correctAnswers >= 5) {
      return "Solide Runde. Die Rechenwege fuer das grosse 1x1 werden klarer.";
    }

    return "Heute war es gemischt. Beim grossen 1x1 hilft ruhiges Zerlegen besonders.";
  }

  if (moduleId === "frac-advanced") {
    if (correctAnswers >= 7) {
      return "Starke Runde. Die grossen Brüche wirken schon deutlich sicherer.";
    }

    if (correctAnswers >= 5) {
      return "Solide Runde. Die schwierigeren Brüche werden klarer.";
    }

    return "Heute war es gemischt. Bei grossen Brüchen hilft ruhiges Vergleichen besonders.";
  }

  if (correctAnswers >= 7) {
    return moduleId === "times"
      ? "Starke Runde. Die Fakten kommen schon sehr sicher."
      : "Sehr gut. Die Brüche hast du heute ruhig und klar sortiert.";
  }

  if (correctAnswers >= 5) {
    return moduleId === "times"
      ? "Solide Runde. Die schwierigeren Reihen nehmen Form an."
      : "Gute Basis. Ein paar Vergleiche können wir noch schärfen.";
  }

  return moduleId === "times"
    ? "Heute war es gemischt. Die nächste kurze Runde hilft direkt weiter."
    : "Heute war es gemischt. Mit einer kurzen Wiederholung wird es klarer.";
}

function getXpGained(correctAnswers: number) {
  if (correctAnswers >= 7) {
    return 40;
  }

  if (correctAnswers >= 5) {
    return 24;
  }

  return 12;
}

function buildSessionResult(state: AppState, value: string, isCorrect: boolean) {
  const activeSession = state.activeSession;

  if (!activeSession) {
    return null;
  }

  const answers = [
    ...activeSession.answers,
    {
      taskId: activeSession.tasks[activeSession.currentIndex].id,
      value,
      isCorrect,
    },
  ];
  const correctAnswers = answers.filter((entry) => entry.isCorrect).length;
  const xpGained = getXpGained(correctAnswers);
  const earnedStar = correctAnswers >= 7;
  const result: SessionResult = {
    moduleId: activeSession.moduleId,
    title: activeSession.title,
    correctAnswers,
    totalTasks: activeSession.tasks.length,
    xpGained,
    earnedStar,
    feedback: getResultFeedback(activeSession.moduleId, correctAnswers),
  };

  return { answers, result };
}

function updateTimesFactStats(
  previousStats: Record<string, TimesFactStat>,
  tasks: SessionTask[],
  answers: SessionAnswer[],
) {
  const nextStats = { ...previousStats };

  answers.forEach((answer) => {
    const task = tasks.find((entry) => entry.id === answer.taskId);

    if (!task || task.kind !== "number" || !task.factKey) {
      return;
    }

    const current = nextStats[task.factKey] ?? {
      attempts: 0,
      correct: 0,
      incorrect: 0,
    };

    nextStats[task.factKey] = {
      attempts: current.attempts + 1,
      correct: current.correct + (answer.isCorrect ? 1 : 0),
      incorrect: current.incorrect + (answer.isCorrect ? 0 : 1),
    };
  });

  return nextStats;
}

function createPendingSessionSync(
  state: AppState,
  answers: SessionAnswer[],
): PendingSessionSync | null {
  const activeSession = state.activeSession;

  if (
    !activeSession ||
    !state.player.id ||
    activeSession.moduleId === "times-advanced" ||
    activeSession.moduleId === "frac-advanced"
  ) {
    return null;
  }

  return {
    id: `${Date.now()}-${activeSession.moduleId}`,
    moduleId: activeSession.moduleId,
    tasks: activeSession.tasks,
    answers,
    status: "pending",
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "login": {
      const player = {
        ...state.player,
        id: action.payload.playerId ?? state.player.id,
        name: action.payload.name.trim(),
        pin: action.payload.pin.trim(),
      };

      return {
        ...state,
        screen: "home",
        knownDevice: true,
        player,
      };
    }

    case "hydrate_snapshot": {
      return {
        ...state,
        screen: action.payload.knownDevice && action.payload.player.name ? "home" : "login",
        knownDevice: action.payload.knownDevice,
        player: action.payload.player,
        moduleProgress: mergeModuleProgress(action.payload.moduleProgress),
        unlockedModules: mergeUnlockedModules(action.payload.unlockedModules),
        timesFactStats: action.payload.timesFactStats,
        lastResult: action.payload.lastResult,
        recommendation: getRecommendedModule(
          mergeModuleProgress(action.payload.moduleProgress),
          action.payload.timesFactStats,
          mergeUnlockedModules(action.payload.unlockedModules),
        ),
        activeSession: null,
        pendingSessionSync: null,
      };
    }

    case "merge_remote_snapshot": {
      return {
        ...state,
        knownDevice: action.payload.knownDevice,
        player: action.payload.player,
        moduleProgress: mergeModuleProgress(action.payload.moduleProgress),
        unlockedModules: mergeUnlockedModules(action.payload.unlockedModules),
        timesFactStats: action.payload.timesFactStats,
        recommendation: getRecommendedModule(
          mergeModuleProgress(action.payload.moduleProgress),
          action.payload.timesFactStats,
          mergeUnlockedModules(action.payload.unlockedModules),
        ),
        pendingSessionSync: null,
      };
    }

    case "logout": {
      return {
        ...state,
        screen: "login",
        knownDevice: false,
        activeSession: null,
        pendingSessionSync: null,
      };
    }

    case "reset_progress": {
      const resetPlayerDefaults = defaultPlayer();
      const nextPlayer = {
        ...state.player,
        xp: 0,
        streak: 0,
        stars: 0,
        levelProgress: 0,
        lastSuccess: "Noch kein neuer Fortschritt gespeichert.",
      };
      const nextModuleProgress = {
        times: {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "Noch keine Einmaleins-Runden gespeichert.",
        },
        frac: {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "Noch keine Bruch-Runden gespeichert.",
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
      };
      const nextTimesFactStats = {};

      return {
        ...state,
        screen: "dashboard",
        player: nextPlayer,
        moduleProgress: nextModuleProgress,
        unlockedModules: mergeUnlockedModules(),
        timesFactStats: nextTimesFactStats,
        lastResult: null,
        activeSession: null,
        pendingSessionSync: null,
        recommendation: getRecommendedModule(
          nextModuleProgress,
          nextTimesFactStats,
          mergeUnlockedModules(),
        ),
      };
    }

    case "go_home": {
      return {
        ...state,
        screen: "home",
      };
    }

    case "open_dashboard": {
      return {
        ...state,
        screen: "dashboard",
      };
    }

    case "start_session": {
      if (isModuleLocked(action.payload.moduleId, state.unlockedModules)) {
        return state;
      }

      const session = createSessionForModule(
        action.payload.moduleId,
        state.moduleProgress[action.payload.moduleId],
        state.timesFactStats,
      );

      return {
        ...state,
        screen: "session",
        activeSession: session,
      };
    }

    case "unlock_module": {
      if (state.unlockedModules[action.payload.moduleId]) {
        return state;
      }

      return {
        ...state,
        unlockedModules: {
          ...state.unlockedModules,
          "times-advanced": true,
          "frac-advanced": true,
        },
      };
    }

    case "submit_session_answer": {
      const activeSession = state.activeSession;

      if (!activeSession) {
        return state;
      }

      const isLastTask = activeSession.currentIndex === activeSession.tasks.length - 1;

      if (!isLastTask) {
        return {
          ...state,
          activeSession: {
            ...activeSession,
            currentIndex: activeSession.currentIndex + 1,
            answers: [
              ...activeSession.answers,
              {
                taskId: activeSession.tasks[activeSession.currentIndex].id,
                value: action.payload.value,
                isCorrect: action.payload.isCorrect,
              },
            ],
          },
        };
      }

      const payload = buildSessionResult(
        state,
        action.payload.value,
        action.payload.isCorrect,
      );

      if (!payload) {
        return state;
      }

      const { result } = payload;
      const nextXp = state.player.xp + result.xpGained;
      const nextStars = state.player.stars + (result.earnedStar ? 1 : 0);
      const nextTimesFactStats =
        (result.moduleId === "times" || result.moduleId === "times-advanced") &&
        state.activeSession
          ? updateTimesFactStats(
              state.timesFactStats,
              state.activeSession.tasks,
              payload.answers,
            )
          : state.timesFactStats;
      const nextModuleProgress = {
        ...state.moduleProgress,
        [result.moduleId]: {
          ...state.moduleProgress[result.moduleId],
          sessionsCompleted: state.moduleProgress[result.moduleId].sessionsCompleted + 1,
          accuracyPercent: Math.min(
            100,
            Math.round((result.correctAnswers / result.totalTasks) * 100),
          ),
          masteryPercent: Math.min(
            100,
            state.moduleProgress[result.moduleId].masteryPercent +
              (result.earnedStar ? 8 : 4),
          ),
          lastSummary: result.feedback,
        },
      };

      return {
        ...state,
        screen: result.earnedStar ? "reward" : "result",
        activeSession: null,
        lastResult: result,
        pendingSessionSync: createPendingSessionSync(state, payload.answers),
        timesFactStats: nextTimesFactStats,
        player: {
          ...state.player,
          xp: nextXp,
          stars: nextStars,
          streak: state.player.streak + 1,
          levelProgress: nextXp % 100,
          lastSuccess: result.feedback,
        },
        moduleProgress: nextModuleProgress,
        recommendation: getRecommendedModule(
          nextModuleProgress,
          nextTimesFactStats,
          state.unlockedModules,
        ),
      };
    }

    case "mark_session_sync_started": {
      if (
        !state.pendingSessionSync ||
        state.pendingSessionSync.id !== action.payload.id
      ) {
        return state;
      }

      return {
        ...state,
        pendingSessionSync: {
          ...state.pendingSessionSync,
          status: "saving",
          errorMessage: undefined,
        },
      };
    }

    case "mark_session_sync_failed": {
      if (
        !state.pendingSessionSync ||
        state.pendingSessionSync.id !== action.payload.id
      ) {
        return state;
      }

      return {
        ...state,
        pendingSessionSync: {
          ...state.pendingSessionSync,
          status: "error",
          errorMessage: action.payload.errorMessage,
        },
      };
    }

    case "clear_session_sync": {
      if (
        !state.pendingSessionSync ||
        state.pendingSessionSync.id !== action.payload.id
      ) {
        return state;
      }

      return {
        ...state,
        pendingSessionSync: null,
      };
    }

    case "close_reward": {
      return {
        ...state,
        screen: "result",
      };
    }

    default: {
      return state;
    }
  }
}
