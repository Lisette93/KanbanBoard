// src/app/reducer.ts
import type { AppState, Task } from "./types";

/** --- Action types (grow this union as you add features) --- */
export type Action = {
  type: "ADD_TASK";
  payload: {
    columnId: string;
    task: Task; // { id, title, createdAt, ... }
  };
};
// | { type: "MOVE_TASK"; payload: { ... } }
// | { type: "UPDATE_TASK"; payload: { ... } }
// | { type: "DELETE_TASK"; payload: { ... } }

/** --- Minimal initial state so the app can render three empty columns --- */
export const initialState: AppState = {
  boards: {
    "board-1": {
      id: "board-1",
      name: "The Board App",
      columnOrder: ["todo", "doing", "done"],
    },
  },
  columns: {
    todo: { id: "todo", title: "Todo", taskIds: [] },
    doing: { id: "doing", title: "Doing", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  tasks: {},
  ui: { activeBoardId: "board-1" },
};

/** --- Pure reducer: (state, action) -> newState --- */
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TASK": {
      const { columnId, task } = action.payload;

      // Safety: unknown column or duplicate task id -> no-op
      const col = state.columns[columnId];
      if (!col) return state;
      if (state.tasks[task.id]) return state;

      // 1) New tasks map with the new task
      const newTasks = {
        ...state.tasks,
        [task.id]: task,
      };

      // 2) Updated column with new ordering (task id appended)
      const newColumn = {
        ...col,
        taskIds: [...col.taskIds, task.id],
      };

      // 3) New columns map with the updated column
      const newColumns = {
        ...state.columns,
        [columnId]: newColumn,
      };

      // 4) Return the brand new state object (no mutations)
      return {
        ...state,
        tasks: newTasks,
        columns: newColumns,
      };
    }

    default:
      return state;
  }
}
