import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { reducer, initialState } from "./reducer";
import type { Action } from "./reducer";
import type { AppState } from "./types";

type Ctx = {
  state: AppState;
  dispatch: Dispatch<Action>;
};

export const BoardContext = createContext<Ctx | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
