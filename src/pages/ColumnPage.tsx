import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task } from "../app/types";

export default function ColumnPage() {
  // Hooks
  const { columnId } = useParams<{ columnId: string }>();
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  // Guards
  if (!columnId)
    return <main className="p-6 text-white">No column given.</main>;
  const column = state.columns[columnId];
  if (!column)
    return (
      <main className="p-6 text-white">
        Column with id {columnId} not found.
      </main>
    );

  // Build tasks ONCE (rename if you prefer)
  const tasks: Task[] = column.taskIds
    .map((id) => state.tasks[id])
    .filter((t): t is Task => Boolean(t));

  // Create task
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = Date.now().toString();
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId: column.id,
        task: { id, title: trimmed, createdAt: new Date().toISOString() },
      },
    });
    setTitle("");
  }

  // Callbacks (use or leave for later)
  function openTask(taskId: string) {
    navigate(`/task/${taskId}`); // funkar även som placeholder
  }

  function moveTask(taskId: string, dir: "left" | "right") {
    const activeBoardId = state.ui.activeBoardId;
    if (!activeBoardId) return;
    const board = state.boards[activeBoardId];

    const fromColumnId = column.id;
    const idx = board.columnOrder.indexOf(fromColumnId);
    const toColumnId =
      dir === "left" ? board.columnOrder[idx - 1] : board.columnOrder[idx + 1];
    if (!toColumnId) return;

    // Avkommentera när du har reducer-case:
    // dispatch({
    //   type: "MOVE_TASK",
    //   payload: { taskId, fromColumnId, toColumnId, toIndex: state.columns[toColumnId].taskIds.length },
    // });
  }

  function deleteTask(taskId: string) {
    // Avkommentera när du har reducer-case:
    // dispatch({ type: "DELETE_TASK", payload: { taskId, columnId: column.id } });
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">{column.title}</h1>

      {/* Create new task */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 rounded-md bg-neutral-800 px-3 py-2 outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 disabled:opacity-50"
          disabled={!title.trim()}
        >
          Add Task
        </button>
      </form>

      {/* Reusable column UI */}
      <ColumnView
        columnId={column.id}
        title={column.title}
        tasks={tasks}
        onTaskClick={openTask}
        onMoveLeft={(id) => moveTask(id, "left")}
        onMoveRight={(id) => moveTask(id, "right")}
        onDelete={deleteTask}
      />

      <Link to="/" className="inline-block mt-4 underline">
        ← Tillbaka till board
      </Link>
    </main>
  );
}
