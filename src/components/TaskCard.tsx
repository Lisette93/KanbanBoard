import type { Task } from "../app/types";

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onDelete?: () => void;
};

export default function TaskCard({
  task,
  onClick,
  onMoveLeft,
  onMoveRight,
  onDelete,
}: TaskCardProps) {
  return (
    <div
      className="rounded-md bg-neutral-800 px-3 py-2 flex items-center justify-between"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span>{task.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveLeft?.();
        }}
      >
        ←
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveRight?.();
        }}
      >
        →
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      >
        ✕
      </button>
    </div>
  );
}
