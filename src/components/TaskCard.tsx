import { useRef, useEffect } from "react";
import type { Task } from "../app/types";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
  isDragging?: boolean; // får du från SortableItem
};

export default function TaskCard({
  task,
  onClick,
  onDelete,
  isDragging,
}: TaskCardProps) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const cancelClickRef = useRef(false);
  const THRESHOLD = 6; // px

  useEffect(() => {
    if (isDragging) {
      cancelClickRef.current = true;
    } else if (cancelClickRef.current) {
      const t = setTimeout(() => (cancelClickRef.current = false), 120);
      return () => clearTimeout(t);
    }
  }, [isDragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dx = Math.abs(e.clientX - startRef.current.x);
    const dy = Math.abs(e.clientY - startRef.current.y);
    if (dx > THRESHOLD || dy > THRESHOLD) movedRef.current = true;
  };

  const onPointerUp = () => {
    if (movedRef.current || cancelClickRef.current || isDragging) return;
    onClick?.();
  };

  const stopPointer = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="group cursor-pointer rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg focus:outline-none"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-peachBlossom/60 px-2 py-0.5 text-xs font-semibold text-plumPurple">
          Task
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label="Delete task"
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onTouchStart={stopPointer}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-70 transition hover:opacity-100 text-brownSugar hover:text-peachBlossom"
          >
            ✕
          </button>
        )}
      </div>

      <h3 className="truncate font-semibold text-plumPurple">{task.title}</h3>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-brownSugar/80">
          {task.description}
        </p>
      )}
      <div className="mt-3 text-xs text-brownSugar/70">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
