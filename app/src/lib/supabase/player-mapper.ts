import type {
  AppSnapshot,
  ModuleId,
  ModuleProgress,
  PlayerProfile,
  TimesFactStat,
} from "../../state/app-types";

interface SupabaseSkillStat {
  attempts?: number;
  correct?: number;
  totalTime?: number;
}

interface SupabaseRecentSession {
  date?: string;
  score?: number;
  total?: number;
}

export interface SupabasePlayerStatePayload {
  player?: {
    id?: string;
    name?: string;
    created_at?: string;
  };
  stats?: {
    total_xp?: number;
    streak?: number;
    current_week?: number;
    current_day?: number;
    last_session_on?: string | null;
    total_sessions?: number;
  };
  skills?: Partial<Record<string, SupabaseSkillStat>>;
  times_fact_stats?: Record<string, TimesFactStat | undefined>;
  recent_sessions?: SupabaseRecentSession[];
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildModuleSummary(
  moduleId: ModuleId,
  attempts: number,
  accuracyPercent: number,
  fallbackSummary: string,
) {
  if (attempts === 0) {
    return fallbackSummary;
  }

  if (moduleId === "times") {
    if (accuracyPercent >= 80) {
      return "Die Fakten sitzen schon stabil. Jetzt lohnt sich gemischte Sicherheit.";
    }

    if (accuracyPercent >= 60) {
      return "Das Einmaleins wird klarer. Einzelne Reihen brauchen noch etwas Ruhe.";
    }

    return "Die Grundreihen bauen sich auf. Kurze Wiederholungen helfen jetzt am meisten.";
  }

  if (moduleId === "times-advanced") {
    if (accuracyPercent >= 80) {
      return "Die grossen Aufgaben sitzen schon gut. Jetzt lohnt sich mehr Tempo mit Struktur.";
    }

    if (accuracyPercent >= 60) {
      return "Das grosse 1x1 wird klarer. Zerlegen und Ergänzen tragen schon gut.";
    }

    return "Die grossen Aufgaben brauchen noch Ruhe. Kurze Strategierunden helfen am meisten.";
  }

  if (moduleId === "frac-advanced") {
    if (accuracyPercent >= 80) {
      return "Die grossen Brüche sitzen schon gut. Jetzt lohnt sich mehr Feingefühl über 1 hinaus.";
    }

    if (accuracyPercent >= 60) {
      return "Die grossen Brüche werden klarer. Kürzen und Vergleichen tragen schon gut.";
    }

    return "Die grossen Brüche brauchen noch Ruhe. Kurze Wiederholungen helfen am meisten.";
  }

  if (accuracyPercent >= 80) {
    return "Die Bruchideen sitzen schon recht sicher. Jetzt lohnt sich mehr Feingefühl.";
  }

  if (accuracyPercent >= 60) {
    return "Vergleiche klappen schon gut. Einzelne Darstellungen brauchen noch etwas Ruhe.";
  }

  return "Die Bruchgrundlagen wachsen. Klare, kurze Runden helfen beim Sortieren.";
}

function buildModuleProgress(
  moduleId: ModuleId,
  skill: SupabaseSkillStat | undefined,
  fallback: ModuleProgress,
): ModuleProgress {
  const attempts = Math.max(0, skill?.attempts ?? 0);
  const correct = Math.max(0, Number(skill?.correct ?? 0));

  if (attempts === 0) {
    return fallback;
  }

  const accuracyPercent = clampPercent((correct / attempts) * 100);
  const sessionsCompleted = Math.max(1, Math.round(attempts / 8));
  const masteryPercent = clampPercent(
    accuracyPercent * 0.7 + Math.min(30, sessionsCompleted * 4),
  );

  return {
    sessionsCompleted,
    accuracyPercent,
    masteryPercent,
    lastSummary: buildModuleSummary(
      moduleId,
      attempts,
      accuracyPercent,
      fallback.lastSummary,
    ),
  };
}

function buildLastSuccess(
  recentSessions: SupabaseRecentSession[] | undefined,
  fallback: string,
) {
  const latestSession = recentSessions?.[0];

  if (!latestSession || typeof latestSession.total !== "number") {
    return fallback;
  }

  const roundedScore = Math.round(Number(latestSession.score ?? 0) * 10) / 10;
  return `Zuletzt ${roundedScore} von ${latestSession.total} Punkten in einer gespeicherten Runde erreicht.`;
}

function buildTimesFactStats(
  remoteStats: SupabasePlayerStatePayload["times_fact_stats"],
  fallback: AppSnapshot["timesFactStats"],
) {
  if (!remoteStats) {
    return fallback;
  }

  const entries = Object.entries(remoteStats)
    .map(([key, value]) => {
      const attempts = Math.max(0, value?.attempts ?? 0);
      const correct = Math.max(0, value?.correct ?? 0);
      const incorrect = Math.max(0, value?.incorrect ?? 0);

      if (!key || attempts === 0) {
        return null;
      }

      return [
        key,
        {
          attempts,
          correct,
          incorrect,
        },
      ] as const;
    })
    .filter(
      (
        entry,
      ): entry is readonly [
        string,
        {
          attempts: number;
          correct: number;
          incorrect: number;
        },
      ] => entry !== null,
    );

  if (entries.length === 0) {
    return fallback;
  }

  return Object.fromEntries(entries);
}

export function mapSupabasePlayerStateToSnapshot(
  payload: SupabasePlayerStatePayload,
  pin: string,
  fallback: AppSnapshot,
): AppSnapshot {
  const totalXp = Math.max(0, payload.stats?.total_xp ?? fallback.player.xp);
  const player: PlayerProfile = {
    ...fallback.player,
    id: payload.player?.id ?? fallback.player.id,
    name: payload.player?.name?.trim() || fallback.player.name,
    pin,
    xp: totalXp,
    streak: Math.max(0, payload.stats?.streak ?? fallback.player.streak),
    levelProgress: totalXp % 100,
    lastSuccess: buildLastSuccess(payload.recent_sessions, fallback.player.lastSuccess),
  };

  return {
    knownDevice: true,
    player,
    moduleProgress: {
      times: buildModuleProgress(
        "times",
        payload.skills?.times,
        fallback.moduleProgress.times,
      ),
      frac: buildModuleProgress(
        "frac",
        payload.skills?.frac,
        fallback.moduleProgress.frac,
      ),
      "times-advanced": fallback.moduleProgress["times-advanced"],
      "frac-advanced": fallback.moduleProgress["frac-advanced"],
    },
    timesFactStats: buildTimesFactStats(
      payload.times_fact_stats,
      fallback.timesFactStats,
    ),
    unlockedModules: fallback.unlockedModules,
    lastResult: fallback.lastResult,
  };
}
