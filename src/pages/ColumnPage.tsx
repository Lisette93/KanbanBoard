import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBoard } from "../app/useBoard";
import ColumnView from "../components/ColumnView";
import type { Task, Column } from "../app/types";

export default function ColumnPage() {
  const { columnId } = useParams<{ columnId: string }>();
  const { state, dispatch } = useBoard();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  // Guard 1: no column id in URL
  if (!columnId) {
    return <main className="p-6 text-white">No column given.</main>;
  }

  // Look up the column by id
  const col: Column | undefined = state.columns[columnId];

  // Guard 2: invalid id
  if (!col) {
    return (
      <main className="p-6 text-white">
        Unknown column: <code>{columnId}</code>
        <div className="mt-4">
          <Link to="/" className="underline">
            ← Back to board
          </Link>
        </div>
      </main>
    );
  }

  // Safe alias after guards
  const column = col;

  // Get all tasks for this column
  const tasks: Task[] = column.taskIds
    .map((id) => state.tasks[id])
    .filter((t): t is Task => Boolean(t));

  // Handle form submit, add a new task to this column
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = crypto.randomUUID?.() ?? Date.now().toString();
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId: column.id,
        task: { id, title: trimmed, createdAt: new Date().toISOString() },
      },
    });
    setTitle("");
  }

  // Open a task (navigate to its page)
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
    <main className="p-6 text-plumPurple">
      {/* Column title */}
      <h1 className="text-xl font-semibold mb-4">{column.title}</h1>

      {/* Inline form to create a new task */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 rounded-md bg-white px-3 py-2 outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-peachBlossom/60 px-4 py-2 disabled:opacity-50"
          disabled={!title.trim()}
        >
          Add Task
        </button>
      </form>

      {/* Reuse ColumnView but without header click */}
      <ColumnView
        columnId={column.id}
        title={column.title}
        tasks={tasks}
        onTaskClick={openTask}
        onDelete={deleteTask}
      />

      {/* Link back to board page */}
      <Link to="/" className="inline-block mt-4 underline">
        ← Back to board
      </Link>
    </main>
  );
}
