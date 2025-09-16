import { useBoard } from "../app/useBoard";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";

export default function ColumnPage() {
  //Hooks
  const { columnId } = useParams<{ columnId: string }>();
  const { state, dispatch } = useBoard();
  const [title, setTitle] = useState("");

  // Guard clauses
  if (!columnId) return <p>No column given.</p>;
  const column = state.columns[columnId];
  if (!column) return <p>Column with id {columnId} not found.</p>;

  // Submit handler (ADD_TASK)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = Date.now().toString();
    dispatch({
      type: "ADD_TASK",
      payload: {
        columnId,
        task: { id, title: trimmed, createdAt: new Date().toISOString() },
      },
    });
    setTitle("");
  }

  // Tasks to render
  const tasks = column.taskIds.map((id) => state.tasks[id]).filter(Boolean);

  return (
    <main className="p-6 text-white">
      <h1 className="text-xl font-semibold">{column.title}</h1>

      {/*form: create new task*/}
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

      {/* Lista tasks */}
      <section className="rounded-lg bg-neutral-900/80 p-4 min-h-[200px]">
        {tasks.length === 0 ? (
          <em className="opacity-70">Inga tasks ännu</em>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="rounded-md bg-neutral-800 px-3 py-2 flex items-center justify-between"
              >
                <span>{t.title}</span>
                <span className="text-xs opacity-60">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link to="/" className="inline-block mt-4 underline">
        ← Tillbaka till board
      </Link>
    </main>
  );
}
