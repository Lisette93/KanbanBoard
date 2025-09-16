import { useReducer, type ReactNode } from "react";
import { reducer, initialState } from "./reducer";

import { BoardContext } from "./BoardContext";

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
