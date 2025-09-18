import type { Task } from "../app/types";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
};

export default function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  /**
   * Prevents drag events from starting when pressing the delete button.
   * dnd-kit listens on pointer events, so we need to stop propagation here.
   */
  const stopPointer = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
  };

  /**
   * Keyboard support: pressing Enter/Space while the card is focused
   * should trigger the onClick action (open details).
   */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="rounded-md bg-pink-200 px-3 py-2 flex items-center justify-between"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKey}
    >
      {/* Task title, truncated if too long */}
      <span className="truncate pr-2">{task.title}</span>

      {onDelete && (
        <button
          type="button"
          aria-label="Delete task"
          className="shrink-0 rounded px-2 py-1 hover:bg-neutral-700"
          // Prevent drag or parent click when pressing delete
          onPointerDown={stopPointer}
          onMouseDown={stopPointer}
          onTouchStart={stopPointer}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
