import type {
  ChoiceTask,
  ModuleProgress,
  SessionEvaluation,
  SessionLevel,
} from "../../state/app-types";

type FractionTaskVariant =
  | "visual_to_fraction"
  | "fraction_to_visual"
  | "compare"
  | "equivalent"
  | "position";

interface FractionTaskDefinition {
  prompt: string;
  answer: string;
  options: string[];
  variant: FractionTaskVariant;
  feedbackNote: string;
}

const ROUND_SIZE = 8;

const VISUAL_TO_FRACTION_TASKS: FractionTaskDefinition[] = [
  {
    prompt: "Welche Auswahl passt zu drei von vier Teilen?",
    answer: "3/4",
    options: ["1/4", "2/3", "3/4"],
    variant: "visual_to_fraction",
    feedbackNote: "Drei von vier gleich grossen Teilen ergeben drei Viertel.",
  },
  {
    prompt: "Welche Auswahl zeigt einen halben Kuchen?",
    answer: "1/2",
    options: ["1/4", "1/2", "3/4"],
    variant: "visual_to_fraction",
    feedbackNote: "Ein halber Kuchen bedeutet ein von zwei gleich grossen Teilen.",
  },
  {
    prompt: "Welche Auswahl passt zu zwei von drei Teilen?",
    answer: "2/3",
    options: ["2/3", "2/5", "3/4"],
    variant: "visual_to_fraction",
    feedbackNote: "Zwei gefuellte Teile bei insgesamt drei Teilen sind zwei Drittel.",
  },
  {
    prompt: "Welche Auswahl passt zu vier von fünf Teilen?",
    answer: "4/5",
    options: ["3/5", "4/5", "4/6"],
    variant: "visual_to_fraction",
    feedbackNote: "Vier von fuenf gleich grossen Teilen ergeben vier Fuenftel.",
  },
];

const FRACTION_TO_VISUAL_TASKS: FractionTaskDefinition[] = [
  {
    prompt: "Zu welchem Anteil passt 3/6 am besten?",
    answer: "ein halber Anteil",
    options: ["ein halber Anteil", "ein Drittel", "drei Viertel"],
    variant: "fraction_to_visual",
    feedbackNote: "Drei von sechs Teilen ist gleich viel wie ein Halb.",
  },
  {
    prompt: "Welche Auswahl passt zu 2/4?",
    answer: "gleich viel wie 1/2",
    options: ["gleich viel wie 1/2", "gleich viel wie 1/4", "gleich viel wie 3/4"],
    variant: "fraction_to_visual",
    feedbackNote: "Zwei von vier Teilen decken genau die Haelfte des Ganzen ab.",
  },
  {
    prompt: "Welche Auswahl passt zu 5/8?",
    answer: "mehr als 1/2, aber weniger als 3/4",
    options: [
      "genau 1/2",
      "mehr als 1/2, aber weniger als 3/4",
      "genau 3/4",
    ],
    variant: "fraction_to_visual",
    feedbackNote: "Fuenf Achtel ist etwas mehr als die Haelfte, aber noch nicht drei Viertel.",
  },
  {
    prompt: "Welche Auswahl passt zu 1/3?",
    answer: "ein von drei gleich grossen Teilen",
    options: [
      "ein von drei gleich grossen Teilen",
      "zwei von drei gleich grossen Teilen",
      "ein von vier gleich grossen Teilen",
    ],
    variant: "fraction_to_visual",
    feedbackNote: "Ein Drittel bedeutet ein von drei gleich grossen Teilen.",
  },
];

const COMPARE_TASKS: FractionTaskDefinition[] = [
  {
    prompt: "Welcher Bruch ist groesser?",
    answer: "2/3",
    options: ["1/2", "2/3", "3/8"],
    variant: "compare",
    feedbackNote: "Zwei Drittel ist groesser als ein Halb und deutlich groesser als drei Achtel.",
  },
  {
    prompt: "Welcher Bruch ist kleiner?",
    answer: "3/5",
    options: ["4/5", "3/5", "5/6"],
    variant: "compare",
    feedbackNote: "Drei Fuenftel liegt unter vier Fuenfteln und auch unter fuenf Sechsteln.",
  },
  {
    prompt: "Was ist groesser?",
    answer: "5/8",
    options: ["1/2", "5/8", "2/5"],
    variant: "compare",
    feedbackNote: "Fuenf Achtel ist groesser als ein Halb und groesser als zwei Fuenftel.",
  },
  {
    prompt: "Welcher Bruch liegt weiter rechts auf der Zahlengeraden?",
    answer: "3/4",
    options: ["2/3", "3/4", "5/8"],
    variant: "compare",
    feedbackNote: "Drei Viertel liegt naeher bei 1 als zwei Drittel oder fuenf Achtel.",
  },
  {
    prompt: "Welcher Bruch ist am naechsten bei 1?",
    answer: "7/8",
    options: ["5/8", "3/4", "7/8"],
    variant: "compare",
    feedbackNote: "Sieben Achtel fehlt nur ein kleines Achtel bis zum Ganzen.",
  },
];

const EQUIVALENT_TASKS: FractionTaskDefinition[] = [
  {
    prompt: "Welcher Bruch ist gleich viel wie 1/2?",
    answer: "2/4",
    options: ["1/3", "2/4", "3/5"],
    variant: "equivalent",
    feedbackNote: "Zwei Viertel und ein Halb beschreiben den gleichen Anteil.",
  },
  {
    prompt: "Welcher Bruch ist gleich viel wie 3/6?",
    answer: "1/2",
    options: ["1/3", "1/2", "2/5"],
    variant: "equivalent",
    feedbackNote: "Drei von sechs Teilen ist genau die Haelfte.",
  },
  {
    prompt: "Welcher Bruch ist gleich viel wie 2/3?",
    answer: "4/6",
    options: ["3/6", "4/6", "5/8"],
    variant: "equivalent",
    feedbackNote: "Wenn beide Zahlen verdoppelt werden, bleibt der Anteil gleich: 2/3 = 4/6.",
  },
  {
    prompt: "Welcher Bruch ist gleich viel wie 3/4?",
    answer: "6/8",
    options: ["4/8", "5/8", "6/8"],
    variant: "equivalent",
    feedbackNote: "Drei Viertel und sechs Achtel meinen denselben Anteil am Ganzen.",
  },
];

const POSITION_TASKS: FractionTaskDefinition[] = [
  {
    prompt: "Welche Markierung passt am besten zu 3/4 auf der Zahlengeraden?",
    answer: "kurz vor 1",
    options: ["bei 1/4", "in der Mitte", "kurz vor 1"],
    variant: "position",
    feedbackNote: "Drei Viertel liegt deutlich nach der Mitte und kurz vor dem Ganzen.",
  },
  {
    prompt: "Welche Markierung passt am besten zu 1/3?",
    answer: "etwas nach dem Anfang",
    options: ["etwas nach dem Anfang", "genau in der Mitte", "kurz vor 1"],
    variant: "position",
    feedbackNote: "Ein Drittel liegt frueh auf der Strecke, aber noch klar vor der Mitte.",
  },
];

function getLevel(progress: ModuleProgress): SessionLevel {
  if (progress.masteryPercent < 45 || progress.sessionsCompleted < 3) {
    return 1;
  }

  if (progress.masteryPercent < 75 || progress.accuracyPercent < 80) {
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

function takeTasks(pool: FractionTaskDefinition[], count: number) {
  return shuffle(pool).slice(0, count);
}

function labelForVariant(variant: FractionTaskVariant) {
  switch (variant) {
    case "visual_to_fraction":
      return "Darstellung zu Bruch";
    case "fraction_to_visual":
      return "Bruch zu Darstellung";
    case "compare":
      return "Vergleichen";
    case "equivalent":
      return "Gleichwertig";
    case "position":
      return "Position";
  }
}

function helperForVariant(variant: FractionTaskVariant) {
  switch (variant) {
    case "visual_to_fraction":
      return "Zaehle die gefaerbten Teile ruhig und vergleiche den Anteil.";
    case "fraction_to_visual":
      return "Denke an den Anteil des Ganzen, nicht nur an die Zahlen.";
    case "compare":
      return "Vergleiche die Groesse der Anteile in Ruhe.";
    case "equivalent":
      return "Suche nach einem Bruch, der gleich viel vom Ganzen meint.";
    case "position":
      return "Denk daran, wo der Anteil zwischen 0 und 1 liegen wuerde.";
  }
}

function createTask(task: FractionTaskDefinition, index: number, level: SessionLevel): ChoiceTask {
  return {
    id: `frac-${level}-${task.variant}-${index + 1}`,
    kind: "choice",
    prompt: task.prompt,
    answer: task.answer,
    options: shuffle(task.options),
    helper: helperForVariant(task.variant),
    feedbackNote: task.feedbackNote,
    label: labelForVariant(task.variant),
  };
}

export function createFractionTasks(progress: ModuleProgress): ChoiceTask[] {
  const level = getLevel(progress);
  const tasks: FractionTaskDefinition[] = [];

  if (level === 1) {
    tasks.push(...takeTasks(VISUAL_TO_FRACTION_TASKS, 2));
    tasks.push(...takeTasks(FRACTION_TO_VISUAL_TASKS, 2));
    tasks.push(...takeTasks(COMPARE_TASKS, 2));
    tasks.push(...takeTasks(EQUIVALENT_TASKS, 2));
  } else if (level === 2) {
    tasks.push(...takeTasks(VISUAL_TO_FRACTION_TASKS, 2));
    tasks.push(...takeTasks(FRACTION_TO_VISUAL_TASKS, 1));
    tasks.push(...takeTasks(COMPARE_TASKS, 3));
    tasks.push(...takeTasks(EQUIVALENT_TASKS, 2));
  } else {
    tasks.push(...takeTasks(VISUAL_TO_FRACTION_TASKS, 1));
    tasks.push(...takeTasks(FRACTION_TO_VISUAL_TASKS, 1));
    tasks.push(...takeTasks(COMPARE_TASKS, 3));
    tasks.push(...takeTasks(EQUIVALENT_TASKS, 2));
    tasks.push(...takeTasks(POSITION_TASKS, 1));
  }

  return tasks.slice(0, ROUND_SIZE).map((task, index) => createTask(task, index, level));
}

export function getFractionSessionLevel(progress: ModuleProgress) {
  return getLevel(progress);
}

export function evaluateFractionAnswer(
  task: ChoiceTask,
  value: string,
): SessionEvaluation {
  const submittedValue = value.trim();

  return {
    submittedValue,
    isCorrect: submittedValue === task.answer,
  };
}
