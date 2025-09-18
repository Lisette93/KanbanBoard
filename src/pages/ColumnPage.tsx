import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task } from "../app/types";

export default function ColumnPage() {
  // Read the URL param and global board state
  const { columnId } = useParams<{ columnId: string }>();
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();

  // Local input state for the "add task" form
  const [title, setTitle] = useState("");

  // Lookup the column; bail if it doesn't exist
  const column = columnId ? state.columns[columnId] : undefined;

  // Derive this column's task objects (id -> Task). Filter out any stale ids.
  const tasks: Task[] = useMemo(() => {
    const ids = column ? column.taskIds : [];
    return ids
      .map((id) => state.tasks[id])
      .filter((t): t is Task => Boolean(t));
  }, [column, state.tasks]);

  // Guard: no id supplied
  if (!columnId) {
    return <main className="p-6 text-white">No column given.</main>;
  }

  // Submit handler: create a new task in *this* column
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = crypto.randomUUID?.() ?? Date.now().toString();
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId: column.id, // use the validated column
        task: {
          id,
          title: trimmed,
          createdAt: new Date().toISOString(),
        },
      },
    });
    setTitle("");
  }

  // Open task details (for now, navigate; could be a modal later)
  function openTask(taskId: string) {
    navigate(`/task/${taskId}`);
  }

  // Delete a task from this column
  function deleteTask(taskId: string) {
    dispatch({
      type: "DELETE_TASK",
      payload: { taskId, columnId: column.id },
    });
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">{column.title}</h1>

      {/* Inline create form for this column */}
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

      {/* Reusable column presentation (no header click in ColumnPage) */}
      <ColumnView
        columnId={column.id}
        title={column.title}
        tasks={tasks}
        onTaskClick={openTask}
        onDelete={deleteTask}
      />

      <Link to="/" className="inline-block mt-4 underline">
        ← Back to board
      </Link>
    </main>
  );
}
