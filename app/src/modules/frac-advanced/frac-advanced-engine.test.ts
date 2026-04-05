import test from "node:test";
import assert from "node:assert/strict";
import {
  createAdvancedFractionTasks,
  evaluateAdvancedFractionAnswer,
} from "./frac-advanced-engine.ts";

test("createAdvancedFractionTasks builds eight choice tasks for advanced fractions", () => {
  const tasks = createAdvancedFractionTasks({
    sessionsCompleted: 0,
    masteryPercent: 0,
    accuracyPercent: 0,
    lastSummary: "",
  });

  assert.equal(tasks.length, 8);
  assert.equal(tasks.every((task) => task.kind === "choice"), true);
  assert.equal(tasks.every((task) => task.options.length >= 3), true);
});

test("evaluateAdvancedFractionAnswer compares trimmed choice answers", () => {
  const [task] = createAdvancedFractionTasks({
    sessionsCompleted: 3,
    masteryPercent: 70,
    accuracyPercent: 80,
    lastSummary: "",
  });

  const result = evaluateAdvancedFractionAnswer(task, ` ${task.answer} `);
  assert.equal(result.isCorrect, true);
  assert.equal(result.submittedValue, task.answer);
});
