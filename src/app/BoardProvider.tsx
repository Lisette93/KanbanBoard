import { useEffect, useReducer } from "react";
import { BoardContext } from "./BoardContext";
import { reducer, initialState } from "./reducer";
import type { AppState } from "./types";

export default function BoardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // UseReducer initializes global state for the board
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      // Try to load state from localStorage
      const raw = localStorage.getItem("kanban-state");
      return raw ? (JSON.parse(raw) as AppState) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem("kanban-state", JSON.stringify(state));
  }, [state]);

  // Provide state + dispatch to the rest of the app via Context
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
