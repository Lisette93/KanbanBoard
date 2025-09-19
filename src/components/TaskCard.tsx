import type { Task } from "../app/types";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
};

export default function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  /**
   * Stop dnd-kit from starting a drag when interacting with the delete button.
   * We stop propagation on *pointer*, *mouse* and *touch* events to be safe.
   */
  const stopPointer = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
  };

  /**
   * Keyboard accessibility: activate the card with Enter/Space
   * when it has focus (opens details).
   */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKey}
      className="
        group cursor-pointer rounded-xl bg-white p-4 shadow-md
        transition hover:shadow-lg focus:outline-none
      "
    >
      {/* Header row: small colored chip + delete button */}
      <div className="mb-2 flex items-center justify-between">
        {/* Soft chip that matches your palette */}
        <span
          className="
            rounded-full bg-peachBlossom/60 px-2 py-0.5
            text-xs font-semibold text-plumPurple
          "
        >
          Task
        </span>

        {onDelete && (
          <button
            type="button"
            aria-label="Delete task"
            // Prevent drag + parent click when pressing the delete button
            onPointerDown={stopPointer}
            onMouseDown={stopPointer}
            onTouchStart={stopPointer}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              opacity-70 transition hover:opacity-100
              text-brownSugar hover:text-peachBlossom
            "
          >
            ✕
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="truncate font-semibold text-plumPurple">{task.title}</h3>

      {/* Optional description (subtle tone from your palette) */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-sm text-brownSugar/80">
          {task.description}
        </p>
      )}

      {/* Footer: created date, kept subtle */}
      <div className="mt-3 text-xs text-brownSugar/70">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
