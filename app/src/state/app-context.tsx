import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { appReducer } from "./app-reducer";
import type { AppAction, AppState } from "./app-types";

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<AppAction> | null>(null);

export function AppProvider({
  children,
  initialState,
}: PropsWithChildren<{ initialState: AppState }>) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const stateValue = useMemo(() => state, [state]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppProvider.");
  }

  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);

  if (!context) {
    throw new Error("useAppDispatch must be used within AppProvider.");
  }

  return context;
}
