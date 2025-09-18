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
  // Make the whole column droppable so you can drop into empty columns.
  // The droppable id is the column id.
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <section className="rounded-lg bg-neutral-700/40 p-3">
      <header
        className="mb-2 flex items-center justify-between cursor-pointer"
        onClick={onHeaderClick}
      >
        <h2 className="font-semibold">{title}</h2>
      </header>

      <div ref={setNodeRef} className="space-y-2 min-h-[12px]">
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
