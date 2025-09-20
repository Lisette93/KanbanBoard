import { useContext } from "react";
import { BoardContext, type Ctx } from "./BoardContext";

// Custom hook that returns the board context (state + dispatch).
//Ensures the context is only used inside <BoardProvider>.

export function useBoard(): Ctx {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within a BoardProvider");
  return ctx;
}
