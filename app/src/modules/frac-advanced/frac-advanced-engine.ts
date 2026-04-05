import type {
  ChoiceTask,
  ModuleProgress,
  SessionEvaluation,
  SessionLevel,
} from "../../state/app-types";

type AdvancedFractionVariant = "compare" | "equivalent" | "mixed_number" | "position";

interface AdvancedFractionTaskDefinition {
  prompt: string;
  answer: string;
  options: string[];
  variant: AdvancedFractionVariant;
  feedbackNote: string;
}

const ROUND_SIZE = 8;

const ADVANCED_COMPARE_TASKS: AdvancedFractionTaskDefinition[] = [
  {
    prompt: "Welcher Bruch ist groesser?",
    answer: "7/12",
    options: ["5/9", "7/12", "2/5"],
    variant: "compare",
    feedbackNote: "Sieben Zwoelftel liegt ueber einem Halb und damit ueber zwei Fuenfteln.",
  },
  {
    prompt: "Welcher Bruch liegt naeher bei 1?",
    answer: "11/12",
    options: ["5/6", "11/12", "7/9"],
    variant: "compare",
    feedbackNote: "Elf Zwoelftel fehlt nur ein kleines Zwoelftel bis zum Ganzen.",
  },
  {
    prompt: "Welcher Bruch ist kleiner?",
    answer: "5/8",
    options: ["5/8", "7/10", "3/4"],
    variant: "compare",
    feedbackNote: "Fuenf Achtel ist kleiner als sieben Zehntel und kleiner als drei Viertel.",
  },
];

const ADVANCED_EQUIVALENT_TASKS: AdvancedFractionTaskDefinition[] = [
  {
    prompt: "Welcher Bruch ist gleich viel wie 9/12?",
    answer: "3/4",
    options: ["2/3", "3/4", "4/5"],
    variant: "equivalent",
    feedbackNote: "Neun Zwoelftel lassen sich zu drei Vierteln kuerzen.",
  },
  {
    prompt: "Welcher Bruch ist gleich viel wie 6/8?",
    answer: "3/4",
    options: ["2/3", "3/4", "5/6"],
    variant: "equivalent",
    feedbackNote: "Sechs Achtel und drei Viertel meinen denselben Anteil.",
  },
  {
    prompt: "Welcher Bruch passt zu 4/10?",
    answer: "2/5",
    options: ["2/5", "1/2", "3/5"],
    variant: "equivalent",
    feedbackNote: "Vier Zehntel werden zu zwei Fuenfteln, wenn beide Zahlen halbiert werden.",
  },
];

const MIXED_NUMBER_TASKS: AdvancedFractionTaskDefinition[] = [
  {
    prompt: "Welche Auswahl passt zu 1 1/2?",
    answer: "ein Ganzes und ein Halb",
    options: [
      "ein Ganzes und ein Halb",
      "ein Ganzes und ein Viertel",
      "zwei Ganze",
    ],
    variant: "mixed_number",
    feedbackNote: "Eineinhalb ist ein Ganzes und noch ein halbes Ganzes dazu.",
  },
  {
    prompt: "Welche Auswahl ist groesser?",
    answer: "1 3/4",
    options: ["1 2/3", "1 3/4", "1 1/2"],
    variant: "mixed_number",
    feedbackNote: "Ein und drei Viertel liegt am weitesten rechts auf der Zahlengeraden.",
  },
  {
    prompt: "Was ist gleich viel wie 2 2/4?",
    answer: "2 1/2",
    options: ["2 1/3", "2 1/2", "2 3/4"],
    variant: "mixed_number",
    feedbackNote: "Zwei Viertel sind gleich viel wie ein Halb.",
  },
];

const POSITION_TASKS: AdvancedFractionTaskDefinition[] = [
  {
    prompt: "Wo liegt 5/4 auf der Zahlengeraden?",
    answer: "kurz nach 1",
    options: ["kurz nach 1", "genau bei 1/2", "kurz vor 1"],
    variant: "position",
    feedbackNote: "Fuenf Viertel ist ein Ganzes und noch ein Viertel dazu.",
  },
  {
    prompt: "Wo liegt 9/8 am besten?",
    answer: "etwas rechts von 1",
    options: ["etwas rechts von 1", "genau bei 1", "deutlich links von 1"],
    variant: "position",
    feedbackNote: "Neun Achtel ist ein Ganzes und noch ein Achtel dazu.",
  },
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

function takeTasks(pool: AdvancedFractionTaskDefinition[], count: number) {
  return shuffle(pool).slice(0, count);
}

function labelForVariant(variant: AdvancedFractionVariant) {
  switch (variant) {
    case "compare":
      return "Groesser vergleichen";
    case "equivalent":
      return "Kuerzen und erkennen";
    case "mixed_number":
      return "Gemischte Zahl";
    case "position":
      return "Ueber 1 hinaus";
  }
}

function helperForVariant(variant: AdvancedFractionVariant) {
  switch (variant) {
    case "compare":
      return "Vergleiche erst die Naehe zu 1 oder zu einem Halb.";
    case "equivalent":
      return "Suche nach gemeinsamen Teilungen oder einfachen bekannten Formen.";
    case "mixed_number":
      return "Denk zuerst an das Ganze und dann an den Restbruch.";
    case "position":
      return "Pruefe, ob der Bruch links von 1, bei 1 oder schon rechts davon liegt.";
  }
}

function createTask(
  task: AdvancedFractionTaskDefinition,
  index: number,
  level: SessionLevel,
): ChoiceTask {
  return {
    id: `frac-advanced-${level}-${task.variant}-${index + 1}`,
    kind: "choice",
    prompt: task.prompt,
    answer: task.answer,
    options: shuffle(task.options),
    helper: helperForVariant(task.variant),
    feedbackNote: task.feedbackNote,
    label: labelForVariant(task.variant),
  };
}

export function createAdvancedFractionTasks(progress: ModuleProgress): ChoiceTask[] {
  const level = getLevel(progress);
  const tasks: AdvancedFractionTaskDefinition[] = [];

  if (level === 1) {
    tasks.push(...takeTasks(ADVANCED_COMPARE_TASKS, 3));
    tasks.push(...takeTasks(ADVANCED_EQUIVALENT_TASKS, 3));
    tasks.push(...takeTasks(MIXED_NUMBER_TASKS, 2));
  } else {
    tasks.push(...takeTasks(ADVANCED_COMPARE_TASKS, 2));
    tasks.push(...takeTasks(ADVANCED_EQUIVALENT_TASKS, 2));
    tasks.push(...takeTasks(MIXED_NUMBER_TASKS, 2));
    tasks.push(...takeTasks(POSITION_TASKS, 2));
  }

  return tasks.slice(0, ROUND_SIZE).map((task, index) => createTask(task, index, level));
}

export function getAdvancedFractionSessionLevel(progress: ModuleProgress) {
  return getLevel(progress);
}

export function evaluateAdvancedFractionAnswer(
  task: ChoiceTask,
  value: string,
): SessionEvaluation {
  const submittedValue = value.trim();

  return {
    submittedValue,
    isCorrect: submittedValue === task.answer,
  };
}
