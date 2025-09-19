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

  // Make drag require a tiny movement → clicks won't be eaten by DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  //Wich board is active
  const activeBoardId = state.ui.activeBoardId;
  if (!activeBoardId)
    return <p className="p-6 text-white">No board is active yet.</p>;

  //Get the active board
  const board = state.boards[activeBoardId];

  // Decide the default column (usually “todo”, or just the first in order)
  const defaultColumnId = columnsLite[0]?.id ?? "todo";

  // Create a new task (from global + button)
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

  // Utility: find which column currently contains a task id
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
          className="rounded-md  bg-peachBlossom/60 px-4 py-2"
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
        <div className="w-screen -mx-6 px-0 mt-8 sm:max-w-7xl sm:mx-auto sm:px-6">
          <div
            className="relative p-6 mt-8 rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

            {/* content layer */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
              <div
                className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0
            lg:grid-cols-3
            w-full
          "
              >
                {board.columnOrder.map((colId) => {
                  const col = state.columns[colId];
                  if (!col) return null;

                  const tasks: Task[] = col.taskIds
                    .map((id) => state.tasks[id])
                    .filter((t): t is Task => Boolean(t));

                  return (
                    <div
                      key={col.id}
                      className="flex-shrink-0 min-w-full snap-center sm:min-w-0"
                    >
                      <ColumnView
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
                    </div>
                  );
                })}
              </div>
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

      {/* Task details / edit modal */}
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
