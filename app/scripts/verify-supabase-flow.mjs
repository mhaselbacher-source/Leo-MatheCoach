import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const content = readFileSync(filePath, "utf8");
  const entries = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        return [line, ""];
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      const value =
        rawValue.startsWith('"') && rawValue.endsWith('"')
          ? rawValue.slice(1, -1)
          : rawValue.startsWith("'") && rawValue.endsWith("'")
            ? rawValue.slice(1, -1)
            : rawValue;

      return [key, value];
    });

  return Object.fromEntries(entries);
}

function loadRuntimeEnv() {
  const appRoot = resolve(process.cwd());
  const fileEnv = {
    ...parseEnvFile(resolve(appRoot, ".env")),
    ...parseEnvFile(resolve(appRoot, ".env.local")),
  };

  return {
    ...fileEnv,
    ...process.env,
  };
}

function getSingleRow(data) {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data ?? null;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function callRpc(client, fn, params) {
  const response = await client.rpc(fn, params);

  if (response.error) {
    throw new Error(`${fn} failed: ${response.error.message}`);
  }

  return response.data;
}

async function main() {
  const env = loadRuntimeEnv();
  const url = (env.VITE_SUPABASE_URL ?? "").trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY ?? "").trim();

  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in app/.env.local");
  }

  const pin = (env.VITE_E2E_PLAYER_PIN ?? env.VITE_DEFAULT_PLAYER_PIN ?? "1234").trim();
  const uniqueSuffix = randomUUID().slice(0, 8);
  const playerName = `Leo E2E ${uniqueSuffix}`;

  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  console.log(`Creating player ${playerName}`);

  const created = getSingleRow(
    await callRpc(client, "create_player", {
      p_name: playerName,
      p_pin: pin,
    }),
  );

  assert(created?.player_id, "create_player returned no player_id");

  const loggedIn = getSingleRow(
    await callRpc(client, "login_player", {
      p_name: playerName,
      p_pin: pin,
    }),
  );

  assert(loggedIn?.player_id === created.player_id, "login_player returned unexpected player_id");

  const initialState = await callRpc(client, "get_player_state", {
    p_player_id: created.player_id,
    p_pin: pin,
  });

  assert(initialState?.player?.name === playerName, "get_player_state returned wrong player name");
  assert(
    initialState?.times_fact_stats && Object.keys(initialState.times_fact_stats).length === 0,
    "new player should not have times_fact_stats yet",
  );

  const sessionResults = [
    { type: "times", correct: false, close: false, time: 0, factKey: "6x7" },
    { type: "times", correct: true, close: false, time: 0, factKey: "6x7" },
    { type: "times", correct: false, close: false, time: 0, factKey: "7x8" },
    { type: "frac", correct: false, close: true, time: 0 },
  ];

  const saved = await callRpc(client, "save_session_results", {
    p_player_id: created.player_id,
    p_pin: pin,
    p_week: null,
    p_day: null,
    p_results: sessionResults,
  });

  assert(saved?.session_id, "save_session_results returned no session_id");
  assert(saved?.total === sessionResults.length, "save_session_results returned wrong total");

  const refreshedState = await callRpc(client, "get_player_state", {
    p_player_id: created.player_id,
    p_pin: pin,
  });

  const fact67 = refreshedState?.times_fact_stats?.["6x7"];
  const fact78 = refreshedState?.times_fact_stats?.["7x8"];
  const timesSkill = refreshedState?.skills?.times;
  const fracSkill = refreshedState?.skills?.frac;
  const recentSession = refreshedState?.recent_sessions?.[0];

  assert(fact67?.attempts === 2, "times_fact_stats for 6x7 should have 2 attempts");
  assert(fact67?.correct === 1, "times_fact_stats for 6x7 should have 1 correct");
  assert(fact67?.incorrect === 1, "times_fact_stats for 6x7 should have 1 incorrect");
  assert(fact78?.attempts === 1, "times_fact_stats for 7x8 should have 1 attempt");
  assert(timesSkill?.attempts >= 3, "times skill attempts should include saved answers");
  assert(fracSkill?.attempts >= 1, "frac skill attempts should include saved answers");
  assert(Array.isArray(refreshedState?.recent_sessions), "recent_sessions should be an array");
  assert(recentSession?.total === sessionResults.length, "recent session total should match payload");

  console.log("Supabase flow verified");
  console.log(
    JSON.stringify(
      {
        playerId: created.player_id,
        playerName,
        sessionId: saved.session_id,
        earnedXp: saved.earned_xp,
        timesFactStats: {
          "6x7": fact67,
          "7x8": fact78,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
