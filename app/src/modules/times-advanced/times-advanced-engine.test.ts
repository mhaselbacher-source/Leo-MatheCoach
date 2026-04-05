import test from "node:test";
import assert from "node:assert/strict";
import {
  createLargeTimesTasks,
  evaluateLargeTimesAnswer,
} from "./times-advanced-engine.ts";

test("createLargeTimesTasks builds eight numeric tasks for the locked advanced module", () => {
  const tasks = createLargeTimesTasks({
    sessionsCompleted: 0,
    masteryPercent: 0,
    accuracyPercent: 0,
    lastSummary: "",
  });

  assert.equal(tasks.length, 8);
  assert.equal(tasks.every((task) => task.kind === "number"), true);
  assert.equal(tasks.every((task) => /^\d+x\d+$/.test(task.factKey ?? "")), true);
});

test("evaluateLargeTimesAnswer normalizes integer answers", () => {
  const [task] = createLargeTimesTasks({
    sessionsCompleted: 4,
    masteryPercent: 70,
    accuracyPercent: 80,
    lastSummary: "",
  });

  const result = evaluateLargeTimesAnswer(task, ` 00${task.answer} `);
  assert.equal(result.isCorrect, true);
  assert.equal(result.submittedValue, task.answer);
});
