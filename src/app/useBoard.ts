import { useContext } from "react";
import { BoardContext, type Ctx } from "./BoardContext";

export function useBoard(): Ctx {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error("useBoard must be used within a BoardProvider");
  return ctx;
}
