import type { AppSnapshot, PendingSessionSync } from "../../state/app-types";
import { getSupabaseClient } from "./client";
import {
  mapSupabasePlayerStateToSnapshot,
  type SupabasePlayerStatePayload,
} from "./player-mapper";
import { mapPendingSessionSyncToRpcResults } from "./session-mapper";

export async function saveRemoteSessionSnapshot(
  playerId: string,
  pin: string,
  pendingSessionSync: PendingSessionSync,
  fallback: AppSnapshot,
) {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error("supabase_not_configured");
  }

  const saveResponse = await client.rpc("save_session_results", {
    p_player_id: playerId,
    p_pin: pin,
    p_week: null,
    p_day: null,
    p_results: mapPendingSessionSyncToRpcResults(pendingSessionSync),
  });

  if (saveResponse.error) {
    throw new Error(saveResponse.error.message || "save_session_failed");
  }

  const stateResponse = await client.rpc("get_player_state", {
    p_player_id: playerId,
    p_pin: pin,
  });

  if (stateResponse.error) {
    throw new Error(stateResponse.error.message || "refresh_player_state_failed");
  }

  return mapSupabasePlayerStateToSnapshot(
    stateResponse.data as SupabasePlayerStatePayload,
    pin,
    fallback,
  );
}
