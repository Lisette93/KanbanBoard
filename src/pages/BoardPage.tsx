import Modal from "../components/Modal";
import TaskEditor from "../components/TaskEditor";
import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task } from "../app/types";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import bgImage from "../assets/images/pexels-louisabettes-captures-695499372-18016650.jpg";

export default function BoardPage() {
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();

  // State for currently active task (for modal)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Build a light list of columns for the modal’s select
  const columnsLite = useMemo(
    () =>
      state.boards[state.ui.activeBoardId!].columnOrder
        .map((id) => state.columns[id])
        .filter(Boolean)
        .map((c) => ({ id: c.id, title: c.title })),
    [state]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  // Decide the default column (usually “todo”, or just the first in order)
  const defaultColumnId = columnsLite[0]?.id ?? "todo";

  function handleCreateTask(data: {
    title: string;
    columnId: string;
    description?: string;
  }) {
    const id = crypto.randomUUID?.() ?? Date.now().toString(); // simple id
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId: data.columnId,
        task: {
          id,
          title: data.title,
          description: data.description,
          createdAt: new Date().toISOString(),
        },
      },
    });
  }

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

  const activeTask = activeTaskId ? state.tasks[activeTaskId] : undefined;

  return (
    <main className="p-6">
      {/* Top bar with global Add button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{board.name}</h1>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-md bg-peachBlossom/60 px-4 py-2"
        >
          + Add New Task
        </button>
      </div>

      {/* DnD Context */}
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="mx-auto max-w-7xl px-6 mt-8">
          <div
            className=" relative mx-auto max-w-7xl p-6 px-6 mt-8 rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/40" />

            {/* Content */}
            <div className=" relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-stretch">
              {board.columnOrder.map((colId) => {
                const col = state.columns[colId];
                if (!col) return null;

                const tasks: Task[] = col.taskIds
                  .map((id) => state.tasks[id])
                  .filter((t): t is Task => Boolean(t));

                return (
                  <ColumnView
                    key={col.id}
                    columnId={col.id}
                    title={col.title}
                    tasks={tasks}
                    onTaskClick={(id) => setActiveTaskId(id)}
                    onDelete={(taskId) =>
                      dispatch({
                        type: "DELETE_TASK",
                        payload: { taskId, columnId: col.id },
                      })
                    }
                    onHeaderClick={() => navigate(`/column/${col.id}`)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>

      {/* Create task modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        columns={columnsLite}
        defaultColumnId={defaultColumnId}
        onCreate={handleCreateTask}
      />

      <Modal isOpen={!!activeTask} onClose={() => setActiveTaskId(null)}>
        {activeTask && (
          <TaskEditor
            task={activeTask}
            onSave={(changes) => {
              if (Object.keys(changes).length === 0) {
                setActiveTaskId(null);
                return;
              }
              dispatch({
                type: "UPDATE_TASK",
                payload: { taskId: activeTask.id, changes },
              });
              setActiveTaskId(null);
            }}
            onDelete={() => {
              const colId = getColumnIdByTaskId(activeTask.id);
              if (!colId) return;
              dispatch({
                type: "DELETE_TASK",
                payload: { taskId: activeTask.id, columnId: colId },
              });
              setActiveTaskId(null);
            }}
            onCancel={() => setActiveTaskId(null)}
          />
        )}
      </Modal>
    </main>
  );
}
