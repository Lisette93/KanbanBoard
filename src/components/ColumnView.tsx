import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "./TaskCard";
import SortableItem from "./SortableItems";
import type { Task } from "../app/types";

type ColumnViewProps = {
  columnId: string;
  title: string;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onHeaderClick?: () => void;
};

/**
 * ColumnView
 * ----------
 * - Registers the column as a droppable area (so tasks can be dropped here).
 * - Renders each task as a draggable item (so tasks can be dragged between columns).
 * - Purely presentational beyond DnD wiring; actual reordering/moving is handled by the parent via reducer.
 */

export default function ColumnView({
  columnId,
  title,
  tasks,
  onTaskClick,
  onDelete,
  onHeaderClick,
}: ColumnViewProps) {
  const columnColors: Record<string, string> = {
    todo: "bg-skyBlue/70",
    doing: "bg-warmBeige/60",
    done: "bg-olive/60",
  };

  const columnTextColors: Record<string, string> = {
    todo: "text-plumPurple",
    doing: "text-brownSugar/80",
    done: "text-arcticDaisy",
  };

  const columnUnderlineColors: Record<string, string> = {
    todo: "bg-plumPurple",
    doing: "bg-brownSugar/80",
    done: "bg-arcticDaisy",
  };

  // Make the whole column droppable
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <section
      className={` w-full rounded-lg p-6 ${
        columnColors[columnId] ?? "bg-n"
      } min-h-[68dvh] md:min-h-[70dvh] lg:min-h-[72dvh]`}
    >
      {/* Header */}
      <header
        className="mb-4 text-center cursor-pointer"
        onClick={onHeaderClick}
      >
        <h2
          className={`font-semibold text-lg ${
            columnTextColors[columnId] ?? "text-neutral-800"
          }`}
        >
          {title}
        </h2>
        <div
          className={`mt-2 h-[2px] w-full rounded ${
            columnUnderlineColors[columnId] ?? "bg-neutral-400/40"
          }`}
        />
      </header>

      <div
        ref={setNodeRef}
        className="space-y-2 min-h-[12px]max-h-[calc(100%-1rem)] overflow-auto touch-pan-y"
      >
        <SortableContext
          id={columnId}
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((t) => (
            <SortableItem key={t.id} id={t.id}>
              <TaskCard
                task={t}
                onClick={() => onTaskClick?.(t.id)}
                onDelete={onDelete ? () => onDelete(t.id) : undefined}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </section>
  );
}
