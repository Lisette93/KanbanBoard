import { useEffect, useReducer } from "react";
import { BoardContext } from "./BoardContext";
import { reducer, initialState } from "./reducer";
import type { AppState } from "./types";

export default function BoardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem("kanban-state");
      return raw ? (JSON.parse(raw) as AppState) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem("kanban-state", JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
