import test from "node:test";
import assert from "node:assert/strict";
import {
  createFractionTasks,
  evaluateFractionAnswer,
  getFractionSessionLevel,
} from "./frac-engine.ts";

test("createFractionTasks builds an eight-task level-one round", () => {
  const tasks = createFractionTasks({
    sessionsCompleted: 1,
    masteryPercent: 20,
    accuracyPercent: 55,
    lastSummary: "",
  });

  assert.equal(tasks.length, 8);
  assert.equal(tasks.filter((task) => task.label === "Vergleichen").length, 2);
  assert.equal(tasks.filter((task) => task.label === "Gleichwertig").length, 2);
});

test("getFractionSessionLevel promotes stronger progress to higher stages", () => {
  assert.equal(
    getFractionSessionLevel({
      sessionsCompleted: 1,
      masteryPercent: 20,
      accuracyPercent: 60,
      lastSummary: "",
    }),
    1,
  );

  assert.equal(
    getFractionSessionLevel({
      sessionsCompleted: 4,
      masteryPercent: 60,
      accuracyPercent: 74,
      lastSummary: "",
    }),
    2,
  );

  assert.equal(
    getFractionSessionLevel({
      sessionsCompleted: 6,
      masteryPercent: 82,
      accuracyPercent: 88,
      lastSummary: "",
    }),
    3,
  );
});

test("level-three fraction rounds include a position task", () => {
  const tasks = createFractionTasks({
    sessionsCompleted: 7,
    masteryPercent: 84,
    accuracyPercent: 89,
    lastSummary: "",
  });

  assert.equal(tasks.length, 8);
  assert.ok(tasks.some((task) => task.label === "Position"));
});

test("evaluateFractionAnswer trims submitted values", () => {
  const evaluation = evaluateFractionAnswer(
    {
      id: "frac-test",
      kind: "choice",
      prompt: "Welcher Bruch ist gleich viel wie 1/2?",
      answer: "2/4",
      options: ["1/3", "2/4", "3/5"],
    },
    " 2/4 ",
  );

  assert.deepEqual(evaluation, {
    submittedValue: "2/4",
    isCorrect: true,
  });
});
