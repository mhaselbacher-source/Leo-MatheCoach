import type {
  ModuleProgress,
  NumberTask,
  SessionEvaluation,
  SessionLevel,
} from "../../state/app-types";

interface LargeTimesFact {
  left: number;
  right: number;
}

interface CreateLargeTaskOptions {
  level: SessionLevel;
  variant: "stretch" | "strategy" | "mix";
}

const ROUND_SIZE = 8;

const LEVEL_ONE_FACTS: LargeTimesFact[] = [
  { left: 11, right: 2 },
  { left: 11, right: 3 },
  { left: 12, right: 3 },
  { left: 12, right: 4 },
  { left: 13, right: 3 },
  { left: 14, right: 4 },
  { left: 15, right: 3 },
  { left: 16, right: 4 },
  { left: 17, right: 3 },
  { left: 18, right: 4 },
  { left: 19, right: 3 },
  { left: 20, right: 4 },
];

const LEVEL_TWO_FACTS: LargeTimesFact[] = [
  { left: 11, right: 6 },
  { left: 12, right: 7 },
  { left: 13, right: 6 },
  { left: 14, right: 7 },
  { left: 15, right: 8 },
  { left: 16, right: 7 },
  { left: 17, right: 6 },
  { left: 18, right: 7 },
  { left: 19, right: 6 },
  { left: 12, right: 8 },
  { left: 14, right: 8 },
  { left: 16, right: 8 },
];

const LEVEL_THREE_FACTS: LargeTimesFact[] = [
  { left: 11, right: 11 },
  { left: 12, right: 12 },
  { left: 12, right: 13 },
  { left: 13, right: 14 },
  { left: 14, right: 15 },
  { left: 15, right: 16 },
  { left: 16, right: 17 },
  { left: 17, right: 18 },
  { left: 18, right: 19 },
  { left: 19, right: 12 },
  { left: 14, right: 18 },
  { left: 13, right: 17 },
];

function getLevel(progress: ModuleProgress): SessionLevel {
  if (progress.masteryPercent < 30 || progress.sessionsCompleted < 2) {
    return 1;
  }

  if (progress.masteryPercent < 65 || progress.accuracyPercent < 75) {
    return 2;
  }

  return 3;
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

function answerForFact(fact: LargeTimesFact) {
  return String(fact.left * fact.right);
}

function buildPrompt(fact: LargeTimesFact) {
  return `${fact.left} × ${fact.right} = ?`;
}

function getHelper(options: CreateLargeTaskOptions) {
  if (options.variant === "strategy") {
    return "Nutze Zerlegen oder die Nähe zu 10 und 20, statt alles im Kopf roh zu multiplizieren.";
  }

  if (options.variant === "mix") {
    return "Hier hilft ruhiges Zerlegen: erst Zehner, dann den Rest.";
  }

  return "Denk in kleinen Schritten: 12 × 7 ist zum Beispiel 10 × 7 plus 2 × 7.";
}

function getLabel(options: CreateLargeTaskOptions) {
  if (options.variant === "strategy") {
    return "Strategieaufgabe";
  }

  if (options.variant === "mix") {
    return "Große Mischung";
  }

  return "Aufwärmaufgabe";
}

function createTask(
  fact: LargeTimesFact,
  index: number,
  options: CreateLargeTaskOptions,
): NumberTask {
  return {
    id: `times-advanced-${options.level}-${index + 1}-${fact.left}x${fact.right}`,
    kind: "number",
    label: getLabel(options),
    prompt: buildPrompt(fact),
    answer: answerForFact(fact),
    helper: getHelper(options),
    factKey: `${fact.left}x${fact.right}`,
  };
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

export function createLargeTimesTasks(progress: ModuleProgress): NumberTask[] {
  const level = getLevel(progress);

  if (level === 1) {
    return shuffle(LEVEL_ONE_FACTS)
      .slice(0, ROUND_SIZE)
      .map((fact, index) => createTask(fact, index, { level, variant: "stretch" }));
  }

  if (level === 2) {
    const facts = [
      ...shuffle(LEVEL_ONE_FACTS).slice(0, 3),
      ...shuffle(LEVEL_TWO_FACTS).slice(0, 5),
    ];

    return facts.map((fact, index) =>
      createTask(fact, index, {
        level,
        variant: index < 3 ? "stretch" : "strategy",
      }),
    );
  }

  const facts = [
    ...shuffle(LEVEL_TWO_FACTS).slice(0, 3),
    ...shuffle(LEVEL_THREE_FACTS).slice(0, 5),
  ];

  return facts.map((fact, index) =>
    createTask(fact, index, {
      level,
      variant: index < 3 ? "strategy" : "mix",
    }),
  );
}

export function evaluateLargeTimesAnswer(
  task: NumberTask,
  value: string,
): SessionEvaluation {
  const submittedValue = normalizeNumberValue(value);

  return {
    submittedValue,
    isCorrect: submittedValue === task.answer,
  };
}

export function getLargeTimesSessionLevel(progress: ModuleProgress) {
  return getLevel(progress);
}
