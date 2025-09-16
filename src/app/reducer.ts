import type { AppState, Task } from "./types";

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

export type Action = AddTaskAction | MoveTaskAction;

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // ...ADD_TASK...
    case "ADD_TASK": {
      const { columnId, task } = action.payload;

      // safety guards
      const col = state.columns[columnId];
      if (!col) return state; // unknown column
      if (state.tasks[task.id]) return state; // avoid duplicates

      // 1) add task object
      const nextTasks = { ...state.tasks, [task.id]: task };

      // 2) append task id to the column
      const nextColumn = { ...col, taskIds: [...col.taskIds, task.id] };

      // 3) return new state (immutable)
      return {
        ...state,
        tasks: nextTasks,
        columns: { ...state.columns, [columnId]: nextColumn },
      };
    }

    // ...MOVE_TASK...
    case "MOVE_TASK": {
      const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;
      const from = state.columns[fromColumnId];
      const to = state.columns[toColumnId];
      if (!from || !to) return state;

      // 1) remove from source
      const nextFromIds = from.taskIds.filter((id) => id !== taskId);

      // 2) insert in target (prevent duplicates)
      const nextToIds = [...to.taskIds];
      const existing = nextToIds.indexOf(taskId);
      if (existing !== -1) nextToIds.splice(existing, 1);
      const insertAt = Math.min(Math.max(toIndex, 0), nextToIds.length);
      nextToIds.splice(insertAt, 0, taskId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [fromColumnId]: { ...from, taskIds: nextFromIds },
          [toColumnId]: { ...to, taskIds: nextToIds },
        },
      };
    }
    default:
      return state;
  }
}
