import test from "node:test";
import assert from "node:assert/strict";
import { mapPendingSessionSyncToRpcResults } from "./session-mapper.ts";

test("mapPendingSessionSyncToRpcResults maps times sessions to save_session_results payload", () => {
  const results = mapPendingSessionSyncToRpcResults({
    id: "sync-1",
    moduleId: "times",
    status: "pending",
    tasks: [
      {
        id: "task-1",
        kind: "number",
        prompt: "6 x 7 = ?",
        answer: "42",
        factKey: "6x7",
      },
      {
        id: "task-2",
        kind: "number",
        prompt: "7 x 8 = ?",
        answer: "56",
        factKey: "7x8",
      },
    ],
    answers: [
      { taskId: "task-1", value: "42", isCorrect: true },
      { taskId: "task-2", value: "54", isCorrect: false },
    ],
  });

  assert.deepEqual(results, [
    { type: "times", correct: true, close: false, time: 0, factKey: "6x7" },
    { type: "times", correct: false, close: false, time: 0, factKey: "7x8" },
  ]);
});

test("mapPendingSessionSyncToRpcResults marks incorrect fraction answers as close", () => {
  const results = mapPendingSessionSyncToRpcResults({
    id: "sync-2",
    moduleId: "frac",
    status: "pending",
    tasks: [
      {
        id: "task-1",
        kind: "choice",
        prompt: "Welcher Bruch ist gleich gross?",
        answer: "2/4",
        options: ["1/3", "2/4", "3/5"],
      },
      {
        id: "task-2",
        kind: "choice",
        prompt: "Welcher Bruch ist groesser?",
        answer: "3/4",
        options: ["1/2", "2/3", "3/4"],
      },
    ],
    answers: [
      { taskId: "task-1", value: "1/3", isCorrect: false },
      { taskId: "task-2", value: "3/4", isCorrect: true },
    ],
  });

  assert.deepEqual(results, [
    { type: "frac", correct: false, close: true, time: 0, factKey: undefined },
    { type: "frac", correct: true, close: false, time: 0, factKey: undefined },
  ]);
});
