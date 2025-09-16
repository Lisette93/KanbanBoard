import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task } from "../app/types";
import { closestCorners, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

export default function BoardPage() {
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();

  //Wich board is active
  const activeBoardId = state.ui.activeBoardId;
  if (!activeBoardId)
    return <p className="p-6 text-white">No board is active yet.</p>;

  //Get the active board
  const board = state.boards[activeBoardId];

  function getColumnIdByTaskId(taskId: string): string | undefined {
    return board.columnOrder.find((colId) =>
      state.columns[colId].taskIds.includes(taskId)
    );
  }

  // Handler for DnD end
  function handleDragEnd(e: DragEndEvent) {
    const activeId = String(e.active.id);
    const overId = e.over ? String(e.over.id) : undefined;
    if (!overId) return;

    const fromColumnId = getColumnIdByTaskId(activeId);
    if (!fromColumnId) return;

    // If `overId` is a task → use that task's column; if it's a column → drop into that column
    const targetColByTask = getColumnIdByTaskId(overId);
    const toColumnId = targetColByTask ?? overId;

    // Insert position in target column (before the task you're over, or at the end)
    let toIndex = state.columns[toColumnId].taskIds.length;
    if (targetColByTask) {
      const ids = state.columns[toColumnId].taskIds;
      const idx = ids.indexOf(overId);
      if (idx !== -1) toIndex = idx;
    }

    // No real move? bail
    if (fromColumnId === toColumnId && activeId === overId) return;

    dispatch({
      type: "MOVE_TASK",
      payload: { taskId: activeId, fromColumnId, toColumnId, toIndex },
    });
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-semibold">{board.name}</h1>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {board.columnOrder.map((colId) => {
            const col = state.columns[colId];
            const tasks: Task[] = col.taskIds
              .map((id) => state.tasks[id])
              .filter((t): t is Task => Boolean(t));

            return (
              <ColumnView
                key={col.id}
                columnId={col.id}
                title={col.title}
                tasks={tasks}
                onHeaderClick={() => navigate(`/column/${col.id}`)}
              />
            );
          })}
        </div>
      </DndContext>
    </main>
  );
}
