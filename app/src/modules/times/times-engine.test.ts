import test from "node:test";
import assert from "node:assert/strict";
import {
  createTimesTasks,
  evaluateTimesAnswer,
  getWeakTimesFacts,
  getTimesSessionLevel,
  getTimesReviewFactKeys,
} from "./times-engine.ts";

test("createTimesTasks builds an eight-task level-one round", () => {
  const tasks = createTimesTasks({
    sessionsCompleted: 1,
    masteryPercent: 20,
    accuracyPercent: 55,
    lastSummary: "",
  });

  assert.equal(tasks.length, 8);
  assert.equal(tasks.filter((task) => task.label === "Standardaufgabe").length, 6);
  assert.equal(tasks.filter((task) => task.label?.startsWith("Fokusreihe")).length, 2);
});

test("getTimesSessionLevel promotes stronger progress to higher stages", () => {
  assert.equal(
    getTimesSessionLevel({
      sessionsCompleted: 1,
      masteryPercent: 20,
      accuracyPercent: 60,
      lastSummary: "",
    }),
    1,
  );

  assert.equal(
    getTimesSessionLevel({
      sessionsCompleted: 4,
      masteryPercent: 60,
      accuracyPercent: 74,
      lastSummary: "",
    }),
    2,
  );

  assert.equal(
    getTimesSessionLevel({
      sessionsCompleted: 6,
      masteryPercent: 82,
      accuracyPercent: 88,
      lastSummary: "",
    }),
    3,
  );
});

test("evaluateTimesAnswer normalizes leading zeros before checking correctness", () => {
  const evaluation = evaluateTimesAnswer(
    {
      id: "times-test",
      kind: "number",
      prompt: "7 × 8 = ?",
      answer: "56",
    },
    "056",
  );

  assert.deepEqual(evaluation, {
    submittedValue: "56",
    isCorrect: true,
  });
});

test("review pool prioritizes facts with incorrect history", () => {
  const reviewKeys = getTimesReviewFactKeys({
    "6x7": { attempts: 3, correct: 1, incorrect: 2 },
    "7x8": { attempts: 4, correct: 4, incorrect: 0 },
    "8x9": { attempts: 2, correct: 0, incorrect: 2 },
  });

  assert.equal(reviewKeys[0], "6x7");
  assert.equal(reviewKeys[1], "8x9");
  assert.ok(!reviewKeys.includes("7x8"));
});

test("weak fact list prioritizes repeated misses and ignores fully correct facts", () => {
  const weakFacts = getWeakTimesFacts({
    "6x7": { attempts: 4, correct: 2, incorrect: 2 },
    "7x8": { attempts: 5, correct: 4, incorrect: 1 },
    "8x9": { attempts: 3, correct: 0, incorrect: 3 },
    "3x4": { attempts: 2, correct: 2, incorrect: 0 },
  });

  assert.deepEqual(
    weakFacts.map((fact) => fact.key),
    ["8x9", "6x7", "7x8"],
  );
  assert.equal(weakFacts[0].accuracyPercent, 0);
  assert.equal(weakFacts.length, 3);
});
