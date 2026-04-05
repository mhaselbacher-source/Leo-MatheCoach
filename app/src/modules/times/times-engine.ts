import type {
  ModuleProgress,
  NumberTask,
  SessionEvaluation,
  SessionLevel,
  TimesFactStat,
} from "../../state/app-types";

type TimesTaskVariant = "standard" | "focus" | "mixed" | "review";

interface TimesFact {
  left: number;
  right: number;
}

export interface WeakTimesFact {
  key: string;
  left: number;
  right: number;
  attempts: number;
  correct: number;
  incorrect: number;
  accuracyPercent: number;
}

interface CreateTaskOptions {
  variant: TimesTaskVariant;
  level: SessionLevel;
  row?: number;
}

const ROUND_SIZE = 8;

const LEVEL_ONE_STANDARD: TimesFact[] = [
  { left: 2, right: 3 },
  { left: 2, right: 4 },
  { left: 2, right: 6 },
  { left: 3, right: 4 },
  { left: 3, right: 5 },
  { left: 3, right: 7 },
  { left: 4, right: 5 },
  { left: 4, right: 6 },
  { left: 4, right: 8 },
  { left: 5, right: 6 },
  { left: 5, right: 7 },
  { left: 5, right: 8 },
  { left: 6, right: 10 },
  { left: 7, right: 10 },
  { left: 8, right: 10 },
  { left: 9, right: 10 },
];

const LEVEL_TWO_STANDARD: TimesFact[] = [
  { left: 2, right: 7 },
  { left: 2, right: 8 },
  { left: 2, right: 9 },
  { left: 3, right: 6 },
  { left: 3, right: 7 },
  { left: 3, right: 8 },
  { left: 3, right: 9 },
  { left: 4, right: 6 },
  { left: 4, right: 7 },
  { left: 4, right: 8 },
  { left: 4, right: 9 },
  { left: 5, right: 7 },
  { left: 5, right: 8 },
  { left: 5, right: 9 },
  { left: 6, right: 6 },
  { left: 6, right: 7 },
  { left: 6, right: 8 },
  { left: 7, right: 7 },
];

const MIXED_FACTS: TimesFact[] = [
  { left: 2, right: 7 },
  { left: 2, right: 8 },
  { left: 2, right: 9 },
  { left: 3, right: 6 },
  { left: 3, right: 7 },
  { left: 3, right: 8 },
  { left: 3, right: 9 },
  { left: 4, right: 6 },
  { left: 4, right: 7 },
  { left: 4, right: 8 },
  { left: 4, right: 9 },
  { left: 5, right: 6 },
  { left: 5, right: 7 },
  { left: 5, right: 8 },
  { left: 5, right: 9 },
  { left: 6, right: 6 },
  { left: 6, right: 7 },
  { left: 6, right: 8 },
  { left: 6, right: 9 },
  { left: 7, right: 7 },
  { left: 7, right: 8 },
  { left: 7, right: 9 },
  { left: 8, right: 8 },
  { left: 8, right: 9 },
  { left: 9, right: 9 },
];

const KEY_FACTS: TimesFact[] = [
  { left: 6, right: 7 },
  { left: 6, right: 8 },
  { left: 6, right: 9 },
  { left: 7, right: 7 },
  { left: 7, right: 8 },
  { left: 7, right: 9 },
  { left: 8, right: 8 },
  { left: 8, right: 9 },
];

function factKey(fact: TimesFact) {
  const ordered = [fact.left, fact.right].sort((a, b) => a - b);
  return ordered.join("x");
}

function factFromKey(key: string): TimesFact | null {
  const [left, right] = key.split("x").map(Number);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return null;
  }

  return { left, right };
}

function answerForFact(fact: TimesFact) {
  return String(fact.left * fact.right);
}

function getLevel(progress: ModuleProgress): SessionLevel {
  if (progress.masteryPercent < 45 || progress.sessionsCompleted < 3) {
    return 1;
  }

  if (progress.masteryPercent < 75 || progress.accuracyPercent < 80) {
    return 2;
  }

  return 3;
}

function buildPrompt(fact: TimesFact) {
  return `${fact.left} × ${fact.right} = ?`;
}

function labelForVariant(variant: TimesTaskVariant, row?: number) {
  switch (variant) {
    case "focus":
      return row ? `Fokusreihe ${row}` : "Fokusreihe";
    case "mixed":
      return "Gemischte Runde";
    case "review":
      return "Schluesselfakt";
    default:
      return "Standardaufgabe";
  }
}

function helperForVariant(variant: TimesTaskVariant, row?: number) {
  switch (variant) {
    case "focus":
      return row
        ? `Bleib kurz in der ${row}er-Reihe und nutze Tauschaufgaben, wenn es hilft.`
        : "Bleib in einer Reihe und denke Schritt fuer Schritt.";
    case "mixed":
      return "Hier zaehlt der sichere Abruf, nicht das Reihenmuster.";
    case "review":
      return "Diese Fakten tauchen spaeter oft wieder auf. Ein sauberer Abruf lohnt sich.";
    default:
      return "Denk an die passende Reihe oder an eine Tauschaufgabe.";
  }
}

function pickFocusRow(level: SessionLevel) {
  const rowsByLevel: Record<SessionLevel, number[]> = {
    1: [4, 5, 6],
    2: [6, 7, 8],
    3: [6, 7, 8, 9],
  };

  const rows = rowsByLevel[level];
  return rows[Math.floor(Math.random() * rows.length)];
}

function buildFocusPool(row: number, level: SessionLevel): TimesFact[] {
  const partnersByLevel: Record<SessionLevel, number[]> = {
    1: [2, 3, 4, 5, 6, 7, 8],
    2: [2, 3, 4, 5, 6, 7, 8, 9],
    3: [2, 3, 4, 5, 6, 7, 8, 9],
  };

  return partnersByLevel[level]
    .filter((partner) => partner !== 1)
    .map((partner) => ({ left: row, right: partner }));
}

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }

  return copy;
}

function takeUniqueFacts(
  pool: TimesFact[],
  count: number,
  usedFacts: Set<string>,
): TimesFact[] {
  const result: TimesFact[] = [];

  for (const fact of shuffle(pool)) {
    const key = factKey(fact);

    if (usedFacts.has(key)) {
      continue;
    }

    usedFacts.add(key);
    result.push(fact);

    if (result.length === count) {
      break;
    }
  }

  return result;
}

function createTask(
  fact: TimesFact,
  index: number,
  options: CreateTaskOptions,
): NumberTask {
  const currentFactKey = factKey(fact);

  return {
    id: `times-${options.level}-${options.variant}-${index + 1}-${fact.left}x${fact.right}`,
    kind: "number",
    label: labelForVariant(options.variant, options.row),
    prompt: buildPrompt(fact),
    answer: answerForFact(fact),
    helper: helperForVariant(options.variant, options.row),
    factKey: currentFactKey,
  };
}

function buildReviewPool(
  factStats: Record<string, TimesFactStat>,
  fallbackPool: TimesFact[],
): TimesFact[] {
  const reviewedFacts = Object.entries(factStats)
    .filter(([, stat]) => stat.attempts >= 1 && stat.incorrect >= 1)
    .sort((left, right) => {
      const leftScore = left[1].incorrect * 4 + left[1].attempts - left[1].correct;
      const rightScore = right[1].incorrect * 4 + right[1].attempts - right[1].correct;
      return rightScore - leftScore;
    })
    .map(([key]) => factFromKey(key))
    .filter((fact): fact is TimesFact => fact !== null);

  return reviewedFacts.length > 0 ? reviewedFacts : fallbackPool;
}

export function createTimesTasks(
  progress: ModuleProgress,
  factStats: Record<string, TimesFactStat> = {},
): NumberTask[] {
  const level = getLevel(progress);
  const usedFacts = new Set<string>();
  const tasks: NumberTask[] = [];
  const pushTasks = (facts: TimesFact[], variant: TimesTaskVariant, row?: number) => {
    facts.forEach((fact) => {
      tasks.push(createTask(fact, tasks.length, { variant, level, row }));
    });
  };

  if (level === 1) {
    pushTasks(takeUniqueFacts(LEVEL_ONE_STANDARD, 6, usedFacts), "standard");

    const row = pickFocusRow(level);
    pushTasks(takeUniqueFacts(buildFocusPool(row, level), 2, usedFacts), "focus", row);
  } else if (level === 2) {
    pushTasks(takeUniqueFacts(LEVEL_TWO_STANDARD, 4, usedFacts), "standard");

    const row = pickFocusRow(level);
    pushTasks(takeUniqueFacts(buildFocusPool(row, level), 3, usedFacts), "focus", row);
    pushTasks(takeUniqueFacts(buildReviewPool(factStats, KEY_FACTS), 1, usedFacts), "mixed");
  } else {
    pushTasks(takeUniqueFacts(MIXED_FACTS, 5, usedFacts), "mixed");
    pushTasks(takeUniqueFacts(buildReviewPool(factStats, KEY_FACTS), 3, usedFacts), "review");
  }

  return tasks.slice(0, ROUND_SIZE);
}

export function getTimesSessionLevel(progress: ModuleProgress) {
  return getLevel(progress);
}

function normalizeNumberValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^\d+$/.test(trimmed)) {
    return String(Number(trimmed));
  }

  return trimmed;
}

export function evaluateTimesAnswer(
  task: NumberTask,
  value: string,
): SessionEvaluation {
  const submittedValue = normalizeNumberValue(value);

  return {
    submittedValue,
    isCorrect: submittedValue === task.answer,
  };
}

export function getTimesReviewFactKeys(factStats: Record<string, TimesFactStat>) {
  return buildReviewPool(factStats, KEY_FACTS).map((fact) => factKey(fact));
}

export function getWeakTimesFacts(
  factStats: Record<string, TimesFactStat>,
  limit = 3,
): WeakTimesFact[] {
  return Object.entries(factStats)
    .map(([key, stat]) => {
      const fact = factFromKey(key);

      if (!fact || stat.attempts < 1 || stat.incorrect < 1) {
        return null;
      }

      const accuracyPercent = Math.round((stat.correct / stat.attempts) * 100);
      const priorityScore =
        stat.incorrect * 100 + (100 - accuracyPercent) * 2 + stat.attempts;

      return {
        key,
        left: fact.left,
        right: fact.right,
        attempts: stat.attempts,
        correct: stat.correct,
        incorrect: stat.incorrect,
        accuracyPercent,
        priorityScore,
      };
    })
    .filter(
      (
        fact,
      ): fact is WeakTimesFact & {
        priorityScore: number;
      } => fact !== null,
    )
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, limit)
    .map(({ priorityScore: _priorityScore, ...fact }) => fact);
}
