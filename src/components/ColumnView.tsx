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

export default function ColumnView({
  columnId,
  title,
  tasks,
  onTaskClick,
  onDelete,
  onHeaderClick,
}: ColumnViewProps) {
  // Define background colors for each column based on its ID.
  const columnColors: Record<string, string> = {
    todo: "bg-skyBlue/70",
    doing: "bg-warmBeige/60",
    done: "bg-olive/60",
  };

  // Define text colors for each column based on its ID.
  const columnTextColors: Record<string, string> = {
    todo: "text-plumPurple",
    doing: "text-BrownSugar/60",
    done: "text-arcticDaisy",
  };

  const columnUnderlineColors: Record<string, string> = {
    todo: "bg-plumPurple",
    doing: "bg-brownSugar/60",
    done: "bg-arcticDaisy",
  };

  // Make the whole column droppable so you can drop into empty columns.
  // The droppable id is the column id.
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <section
      className={` rounded-lg p-6 m-4 ${
        columnColors[columnId] ?? "bg-n"
      } min-h-[80vh]`}
    >
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

      <div ref={setNodeRef} className="space-y-2 min-h-[12px] overflow-auto">
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
