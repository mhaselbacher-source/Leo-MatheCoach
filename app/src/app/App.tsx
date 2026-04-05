import { useEffect } from "react";
import { AppProvider, useAppDispatch, useAppState } from "../state/app-context";
import { createInitialAppState } from "./bootstrap";
import { saveAppSnapshot } from "../lib/storage/app-storage";
import { AppShell } from "./AppShell";
import { hasSupabaseConfig } from "../lib/supabase/client";
import { saveRemoteSessionSnapshot } from "../lib/supabase/session-api";

function PersistedAppShell() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    saveAppSnapshot(state);
  }, [state]);

  useEffect(() => {
    const pendingSessionSync = state.pendingSessionSync;

    if (!pendingSessionSync || pendingSessionSync.status !== "pending") {
      return;
    }

    if (!hasSupabaseConfig() || !state.player.id || !state.player.pin) {
      dispatch({
        type: "clear_session_sync",
        payload: { id: pendingSessionSync.id },
      });
      return;
    }

    let cancelled = false;

    dispatch({
      type: "mark_session_sync_started",
      payload: { id: pendingSessionSync.id },
    });

    void saveRemoteSessionSnapshot(state.player.id, state.player.pin, pendingSessionSync, {
      knownDevice: state.knownDevice,
      player: state.player,
      moduleProgress: state.moduleProgress,
      timesFactStats: state.timesFactStats,
      lastResult: state.lastResult,
    })
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        dispatch({
          type: "merge_remote_snapshot",
          payload: snapshot,
        });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        dispatch({
          type: "mark_session_sync_failed",
          payload: {
            id: pendingSessionSync.id,
            errorMessage:
              error instanceof Error
                ? error.message
                : "save_session_failed",
          },
        });
      });

    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    state.knownDevice,
    state.lastResult,
    state.moduleProgress,
    state.pendingSessionSync,
    state.player,
    state.timesFactStats,
  ]);

  return <AppShell />;
}

export default function App() {
  return (
    <AppProvider initialState={createInitialAppState()}>
      <PersistedAppShell />
    </AppProvider>
  );
}
