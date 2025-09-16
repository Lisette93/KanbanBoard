import { createContext, type Dispatch } from "react";
import type { AppState } from "./types";
import type { Action } from "./reducer";

export type Ctx = {
  state: AppState;
  dispatch: Dispatch<Action>;
};

export const BoardContext = createContext<Ctx | undefined>(undefined);
