import { createContext, type Dispatch } from "react";
import type { AppState } from "./types";
import type { Action } from "./reducer";

// The shape of the context object.
//Contains global state and a dispatch function to send actions to the reducer.

export type Ctx = {
  state: AppState;
  dispatch: Dispatch<Action>;
};

// Global context for the board.
// Provided by <BoardProvider> and consumed via useBoard().

export const BoardContext = createContext<Ctx | undefined>(undefined);
