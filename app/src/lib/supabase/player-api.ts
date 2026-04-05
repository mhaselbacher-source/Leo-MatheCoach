import type { AppSnapshot } from "../../state/app-types";
import { getSupabaseClient } from "./client";
import {
  mapSupabasePlayerStateToSnapshot,
  type SupabasePlayerStatePayload,
} from "./player-mapper";

interface LoginPlayerRow {
  player_id: string;
  player_name: string;
}

function getErrorCode(error: { message?: string } | null) {
  const message = error?.message ?? "";

  if (message.includes("invalid_login")) {
    return "invalid_login";
  }

  return "unknown_error";
}

function getSingleRow<T>(data: T | T[] | null): T | null {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data ?? null;
}

export async function loadRemotePlayerSnapshot(
  name: string,
  pin: string,
  fallback: AppSnapshot,
) {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error("supabase_not_configured");
  }

  const loginResponse = await client.rpc("login_player", {
    p_name: name.trim(),
    p_pin: pin.trim(),
  });

  if (loginResponse.error) {
    throw new Error(getErrorCode(loginResponse.error));
  }

  const loginRow = getSingleRow(loginResponse.data as LoginPlayerRow[] | LoginPlayerRow | null);

  if (!loginRow?.player_id) {
    throw new Error("invalid_login");
  }

  const stateResponse = await client.rpc("get_player_state", {
    p_player_id: loginRow.player_id,
    p_pin: pin.trim(),
  });

  if (stateResponse.error) {
    throw new Error(getErrorCode(stateResponse.error));
  }

  return mapSupabasePlayerStateToSnapshot(
    stateResponse.data as SupabasePlayerStatePayload,
    pin.trim(),
    {
      ...fallback,
      player: {
        ...fallback.player,
        id: loginRow.player_id,
        name: loginRow.player_name?.trim() || name.trim(),
      },
    },
  );
}
