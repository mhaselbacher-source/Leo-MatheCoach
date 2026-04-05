export type AppScreen =
  | "boot"
  | "login"
  | "home"
  | "session"
  | "result"
  | "dashboard"
  | "reward";

export type ModuleId = "times" | "frac" | "times-advanced" | "frac-advanced";
export type SessionLevel = 1 | 2 | 3;

export interface PlayerProfile {
  id?: string;
  name: string;
  pin: string;
  xp: number;
  streak: number;
  stars: number;
  levelProgress: number;
  lastSuccess: string;
}

export interface ModuleProgress {
  sessionsCompleted: number;
  masteryPercent: number;
  accuracyPercent: number;
  lastSummary: string;
}

export interface TimesFactStat {
  attempts: number;
  correct: number;
  incorrect: number;
}

export interface Recommendation {
  moduleId: ModuleId;
  title: string;
  reason: string;
}

export interface NumberTask {
  id: string;
  kind: "number";
  prompt: string;
  answer: string;
  helper?: string;
  feedbackNote?: string;
  label?: string;
  factKey?: string;
}

export interface ChoiceTask {
  id: string;
  kind: "choice";
  prompt: string;
  answer: string;
  options: string[];
  helper?: string;
  feedbackNote?: string;
  label?: string;
}

export type SessionTask = NumberTask | ChoiceTask;

export interface SessionAnswer {
  taskId: string;
  value: string;
  isCorrect: boolean;
}

export interface SessionEvaluation {
  submittedValue: string;
  isCorrect: boolean;
}

export interface ActiveSession {
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  level?: SessionLevel;
  tasks: SessionTask[];
  currentIndex: number;
  answers: SessionAnswer[];
}

export interface SessionResult {
  moduleId: ModuleId;
  title: string;
  correctAnswers: number;
  totalTasks: number;
  xpGained: number;
  earnedStar: boolean;
  feedback: string;
}

export interface PendingSessionSync {
  id: string;
  moduleId: ModuleId;
  tasks: SessionTask[];
  answers: SessionAnswer[];
  status: "pending" | "saving" | "error";
  errorMessage?: string;
}

export interface AppState {
  screen: AppScreen;
  knownDevice: boolean;
  player: PlayerProfile;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  unlockedModules: Record<ModuleId, boolean>;
  timesFactStats: Record<string, TimesFactStat>;
  recommendation: Recommendation;
  activeSession: ActiveSession | null;
  lastResult: SessionResult | null;
  pendingSessionSync: PendingSessionSync | null;
}

export type AppAction =
  | { type: "login"; payload: { name: string; pin: string; playerId?: string } }
  | { type: "hydrate_snapshot"; payload: AppSnapshot }
  | { type: "merge_remote_snapshot"; payload: AppSnapshot }
  | { type: "reset_progress" }
  | { type: "logout" }
  | { type: "go_home" }
  | { type: "open_dashboard" }
  | { type: "start_session"; payload: { moduleId: ModuleId } }
  | { type: "submit_session_answer"; payload: { value: string; isCorrect: boolean } }
  | { type: "mark_session_sync_started"; payload: { id: string } }
  | { type: "mark_session_sync_failed"; payload: { id: string; errorMessage: string } }
  | { type: "clear_session_sync"; payload: { id: string } }
  | { type: "unlock_module"; payload: { moduleId: ModuleId } }
  | { type: "close_reward" };

export interface AppSnapshot {
  knownDevice: boolean;
  player: PlayerProfile;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  unlockedModules?: Partial<Record<ModuleId, boolean>>;
  timesFactStats: Record<string, TimesFactStat>;
  lastResult: SessionResult | null;
}
