import type { AppState, Task } from "./types";

// --- Initial global state ---
export const initialState: AppState = {
  boards: {
    "board-1": {
      id: "board-1",
      name: "Kanban Board",
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

// --- Action types ---
export type AddTaskAction = {
  type: "ADD_TASK";
  payload: {
    columnId: string;
    task: Task;
  };
};

type MoveTaskAction = {
  type: "MOVE_TASK";
  payload: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  };
};

type UpdateTaskAction = {
  type: "UPDATE_TASK";
  payload: {
    taskId: string;
    changes: Partial<Pick<Task, "title" | "description">>;
  };
};

type DeleteTaskAction = {
  type: "DELETE_TASK";
  payload: { taskId: string; columnId: string };
};

// All possible actions
export type Action =
  | AddTaskAction
  | MoveTaskAction
  | UpdateTaskAction
  | DeleteTaskAction;

// --- Immutable array helpers ---
function removeAt<T>(arr: T[], index: number) {
  const copy = arr.slice();
  copy.splice(index, 1);
  return copy;
}
function insertAt<T>(arr: T[], index: number, item: T) {
  const copy = arr.slice();
  copy.splice(index, 0, item);
  return copy;
}

// --- Reducer function ---
// Handles state transitions based on dispatched actions
export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TASK": {
      const { columnId, task } = action.payload;
      const col = state.columns[columnId];
      if (!col) return state;

      return {
        ...state,
        tasks: { ...state.tasks, [task.id]: task },
        columns: {
          ...state.columns,
          [columnId]: { ...col, taskIds: [task.id, ...col.taskIds] },
        },
      };
    }

    case "MOVE_TASK": {
      const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;
      const from = state.columns[fromColumnId];
      const to = state.columns[toColumnId];
      if (!from || !to) return state;

      // remove from source column
      const fromIdx = from.taskIds.indexOf(taskId);
      if (fromIdx === -1) return state;

      const newFromIds = removeAt(from.taskIds, fromIdx);

      // If same column and task moved downward,
      // adjust target index to account for removal
      let targetIndex = toIndex;
      if (fromColumnId === toColumnId && fromIdx < toIndex) {
        targetIndex = Math.max(0, toIndex - 1);
      }

      // clamp för säkerhets skull
      targetIndex = Math.max(0, Math.min(targetIndex, to.taskIds.length));

      // build new target array
      const baseToIds =
        fromColumnId === toColumnId ? newFromIds : to.taskIds.slice();

      const newToIds = insertAt(baseToIds, targetIndex, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumnId]: { ...from, taskIds: newFromIds },
          [toColumnId]: { ...to, taskIds: newToIds },
        },
      };
    }

    case "UPDATE_TASK": {
      const { taskId, changes } = action.payload;
      const existing = state.tasks[taskId];
      if (!existing) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...existing,
            ...changes,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    case "DELETE_TASK": {
      const { taskId, columnId } = action.payload;
      const col = state.columns[columnId];
      if (!col || !state.tasks[taskId]) return state;

      //remove task from tasks object
      const { [taskId]: _, ...restTasks } = state.tasks;

      return {
        ...state,
        tasks: restTasks,
        columns: {
          ...state.columns,
          [columnId]: {
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          },
        },
      };
    }

    default:
      return state;
  }
}
