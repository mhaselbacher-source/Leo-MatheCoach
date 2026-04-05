import test from "node:test";
import assert from "node:assert/strict";
import { mapSupabasePlayerStateToSnapshot } from "./player-mapper.ts";

test("mapSupabasePlayerStateToSnapshot maps remote stats onto the local app snapshot", () => {
  const snapshot = mapSupabasePlayerStateToSnapshot(
    {
      player: {
        id: "player-1",
        name: "Leo",
      },
      stats: {
        total_xp: 245,
        streak: 6,
      },
      skills: {
        times: {
          attempts: 24,
          correct: 18,
        },
        frac: {
          attempts: 8,
          correct: 5,
        },
      },
      times_fact_stats: {
        "6x7": {
          attempts: 5,
          correct: 2,
          incorrect: 3,
        },
        "7x8": {
          attempts: 4,
          correct: 3,
          incorrect: 1,
        },
      },
      recent_sessions: [
        {
          score: 7,
          total: 8,
        },
      ],
    },
    "1234",
    {
      knownDevice: false,
      player: {
        name: "",
        pin: "",
        xp: 180,
        streak: 3,
        stars: 5,
        levelProgress: 72,
        lastSuccess: "fallback",
      },
      moduleProgress: {
        times: {
          sessionsCompleted: 4,
          masteryPercent: 64,
          accuracyPercent: 76,
          lastSummary: "times fallback",
        },
        frac: {
          sessionsCompleted: 2,
          masteryPercent: 38,
          accuracyPercent: 61,
          lastSummary: "frac fallback",
        },
        "times-advanced": {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "advanced fallback",
        },
        "frac-advanced": {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "advanced frac fallback",
        },
      },
      unlockedModules: {
        times: true,
        frac: true,
        "times-advanced": false,
        "frac-advanced": false,
      },
      timesFactStats: {
        "6x7": { attempts: 3, correct: 1, incorrect: 2 },
      },
      lastResult: null,
    },
  );

  assert.equal(snapshot.knownDevice, true);
  assert.equal(snapshot.player.id, "player-1");
  assert.equal(snapshot.player.name, "Leo");
  assert.equal(snapshot.player.pin, "1234");
  assert.equal(snapshot.player.xp, 245);
  assert.equal(snapshot.player.streak, 6);
  assert.equal(snapshot.player.levelProgress, 45);
  assert.equal(snapshot.player.lastSuccess, "Zuletzt 7 von 8 Punkten in einer gespeicherten Runde erreicht.");
  assert.equal(snapshot.moduleProgress.times.sessionsCompleted, 3);
  assert.equal(snapshot.moduleProgress.times.accuracyPercent, 75);
  assert.equal(snapshot.moduleProgress.frac.sessionsCompleted, 1);
  assert.equal(snapshot.moduleProgress["times-advanced"].lastSummary, "advanced fallback");
  assert.equal(snapshot.moduleProgress["frac-advanced"].lastSummary, "advanced frac fallback");
  assert.equal(snapshot.unlockedModules["times-advanced"], false);
  assert.equal(snapshot.unlockedModules["frac-advanced"], false);
  assert.equal(snapshot.timesFactStats["6x7"]?.incorrect, 3);
  assert.equal(snapshot.timesFactStats["7x8"]?.correct, 3);
});

test("mapSupabasePlayerStateToSnapshot keeps local fallback data when remote skills are empty", () => {
  const snapshot = mapSupabasePlayerStateToSnapshot(
    {
      player: {
        id: "player-2",
        name: "Leo",
      },
      stats: {
        total_xp: 20,
        streak: 1,
      },
      skills: {},
      recent_sessions: [],
    },
    "9999",
    {
      knownDevice: false,
      player: {
        name: "Leo",
        pin: "",
        xp: 180,
        streak: 3,
        stars: 5,
        levelProgress: 72,
        lastSuccess: "fallback",
      },
      moduleProgress: {
        times: {
          sessionsCompleted: 4,
          masteryPercent: 64,
          accuracyPercent: 76,
          lastSummary: "times fallback",
        },
        frac: {
          sessionsCompleted: 2,
          masteryPercent: 38,
          accuracyPercent: 61,
          lastSummary: "frac fallback",
        },
        "times-advanced": {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "advanced fallback",
        },
        "frac-advanced": {
          sessionsCompleted: 0,
          masteryPercent: 0,
          accuracyPercent: 0,
          lastSummary: "advanced frac fallback",
        },
      },
      unlockedModules: {
        times: true,
        frac: true,
        "times-advanced": false,
        "frac-advanced": false,
      },
      timesFactStats: {},
      lastResult: null,
    },
  );

  assert.equal(snapshot.moduleProgress.times.lastSummary, "times fallback");
  assert.equal(snapshot.moduleProgress.frac.lastSummary, "frac fallback");
  assert.equal(snapshot.player.lastSuccess, "fallback");
  assert.equal(snapshot.player.levelProgress, 20);
});
