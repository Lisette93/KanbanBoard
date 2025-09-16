import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import SortableItem from "./SortableItems";
import type { Task } from "../app/types";

/**
 * Pure presentational column. It renders a title and a sortable list of tasks.
 * - No hooks from router/context here → easier to reuse on multiple pages.
 * - DnD: the whole column is a droppable target; each task is a sortable item.
 */
type ColumnViewProps = {
  columnId: string;
  title: string;
  tasks: Task[]; // already resolved tasks for this column (not just ids)

  // Optional UI callbacks. The container/page decides what they do.
  onTaskClick?: (id: string) => void;
  onMoveLeft?: (id: string) => void;
  onMoveRight?: (id: string) => void;
  onDelete?: (id: string) => void;
  onHeaderClick?: () => void;
};

export default function ColumnView({
  columnId,
  title,
  tasks,
  onTaskClick,
  onMoveLeft,
  onMoveRight,
  onDelete,
  onHeaderClick,
}: ColumnViewProps) {
  // Make the whole column droppable so you can drop into empty columns.
  // The droppable id is the column id.
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  // Small visual hint when an item is hovered over this column.
  const highlight = isOver
    ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-neutral-900"
    : "";

  return (
    <section
      ref={setNodeRef}
      className={`rounded-lg bg-neutral-900/80 p-4 min-h-[240px] ${highlight}`}
    >
      <header className="mb-2">
        {onHeaderClick ? (
          <button
            type="button"
            onClick={onHeaderClick}
            className="font-medium hover:underline text-left"
          >
            {title}
          </button>
        ) : (
          <h2 className="font-medium">{title}</h2>
        )}
        <div className="text-sm opacity-70">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </div>
      </header>

      {/* SortableContext must receive the exact list of item ids you render */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.length === 0 ? (
          // Shown when the column has no tasks yet.
          <div className="text-sm opacity-60 italic select-none">
            Drop tasks here
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id}>
                {/* Each task becomes draggable/sortable via SortableItem */}
                <SortableItem id={t.id}>
                  <TaskCard
                    task={t}
                    // Pass through callbacks only if provided
                    onClick={onTaskClick ? () => onTaskClick(t.id) : undefined}
                    onMoveLeft={onMoveLeft ? () => onMoveLeft(t.id) : undefined}
                    onMoveRight={
                      onMoveRight ? () => onMoveRight(t.id) : undefined
                    }
                    onDelete={onDelete ? () => onDelete(t.id) : undefined}
                  />
                </SortableItem>
              </li>
            ))}
          </ul>
        )}
      </SortableContext>
    </section>
  );
}
