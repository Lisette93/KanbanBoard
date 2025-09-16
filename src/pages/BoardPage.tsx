import { useBoard } from "../app/useBoard";
import { Link } from "react-router-dom";

export default function BoardPage() {
  const { state } = useBoard();

  //Wich board is active
  const activeBoardId = state.ui.activeBoardId;
  if (!activeBoardId)
    return <p className="p-6 text-white">No board is active yet.</p>;

  //Get the active board
  const board = state.boards[activeBoardId];

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-semibold">{board.name}</h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {board.columnOrder.map((colId: string) => {
          const col = state.columns[colId];
          if (!col) return null;

          return (
            <section
              key={colId}
              className="rounded-lg bg-neutral-900/80 p-4 min-h-[200px]"
            >
              <Link
                to={`/column/${colId}`}
                className="inline-block font-medium hover:underline"
              >
                {col.title}
              </Link>

              {/* liten placeholder-info, bra för att se att det funkar */}
              <div className="text-sm opacity-70 mt-1">
                {col.taskIds.length} tasks
              </div>

              {/* här kommer listan med TaskCards senare */}
            </section>
          );
        })}
      </div>
    </main>
  );
}
