import Modal from "../components/Modal";
import TaskEditor from "../components/TaskEditor";
import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task } from "../app/types";
import TaskCard from "../components/TaskCard";
import { useOutletContext } from "react-router-dom";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import bgImage from "../assets/images/pexels-louisabettes-captures-695499372-18016650.jpg";
import type { LayoutCtx } from "../app/types";

export default function BoardPage() {
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();

  //Read modal state from layout (Navbar button opens it)
  const { createOpen, onCloseCreate } = useOutletContext<LayoutCtx>();

  // Currently opened task in the editor modal
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  //Currently dragged task
  const [activeDragTaskId, setActiveDragTaskId] = useState<string | null>(null);
  const activeDragTask = activeDragTaskId
    ? state.tasks[activeDragTaskId]
    : undefined;

  // Column options for create modal
  const columnsLite = useMemo(
    () =>
      state.boards[state.ui.activeBoardId!].columnOrder
        .map((id) => state.columns[id])
        .filter(Boolean)
        .map((c) => ({ id: c.id, title: c.title })),
    [state]
  );

  // Make drag require a tiny movement to avoid click-eating
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  //Wich board is active
  const activeBoardId = state.ui.activeBoardId;
  if (!activeBoardId)
    return <p className="p-6 text-white">No board is active yet.</p>;

  //Current board
  const board = state.boards[activeBoardId];

  // Default column
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

  //find which column currently contains a task id
  function getColumnIdByTaskId(taskId: string): string | undefined {
    return board.columnOrder.find((colId) =>
      state.columns[colId].taskIds.includes(taskId)
    );
  }

  // Handler for DnD end
  function handleDragStart(e: DragStartEvent) {
    setActiveDragTaskId(String(e.active.id));
  }
  function handleDragEnd(e: DragEndEvent) {
    setActiveDragTaskId(null);
    const activeId = String(e.active.id);
    const overId = e.over ? String(e.over.id) : undefined;
    if (!overId) return;

    const fromColumnId = getColumnIdByTaskId(activeId);
    if (!fromColumnId) return;

    // If we are over a task, drop into that task's column; else treat overId as a column id.
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
      {/* DnD Context */}
      <DndContext
        sensors={sensors} // small distance to avoid accidental drags on click
        onDragStart={handleDragStart} // set dragging id
        onDragEnd={handleDragEnd} // move between columns, clear dragging id
        collisionDetection={closestCorners}
      >
        {/* Background wrapper */}
        <div className="w-screen -mx-6 px-0 mt-8 sm:max-w-7xl sm:mx-auto sm:px-6">
          <div
            className="relative p-6 pb-10 mt-8 rounded-2xl overflow-hidden 
            bg-cover md:bg-cover
            bg-[position:center_30%] md:bg-center min-h-[80vh] "
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            {/*side fade edges on mobile only*/}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white/70 to-transparent md:block lg:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white/70 to-transparent md:block lg:hidden" />

            {/* Pager-dots: mobil */}
            <div className="lg:hidden pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-2">
              {board.columnOrder.map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-white" />
              ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 -z-10" />
            <div className="absolute inset-0 bg-white/40 pointer-events-none" />

            {/* content layer */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
              {/*Responsiv layout 
              -mobile 
              -Ipad */}
              <div
                className="
            flex gap-4 overflow-x-auto snap-x snap-proximity pb-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            overscroll-x-contain

            md:flex md:overflow-x-auto md:snap-x md:snap-proximity md:pb-4
            md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden

            lg:grid lg:gap-6 lg:overflow-visible lg:pb-0
            lg:[grid-template-columns:repeat(3,minmax(360px,1fr))]
            w-full
            "
                style={{ WebkitOverflowScrolling: "touch" }}
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
                      className="
                      flex-none w-[92%] min-w-[320px] md:min-w-[360px]
                      snap-start [scroll-snap-stop:always]
                      md:w-auto"
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
        {/* Drag ghost: render the active task as a compact card during drag */}
        <DragOverlay>
          {activeDragTask ? (
            <div className="w-[280px] max-w-[90vw]">
              <TaskCard task={activeDragTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create task modal */}
      <CreateTaskModal
        isOpen={createOpen}
        onClose={onCloseCreate}
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
          />
        )}
      </Modal>
    </main>
  );
}
