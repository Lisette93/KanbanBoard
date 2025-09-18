// src/components/TaskEditor.tsx
import { useState } from "react";
import type { Task } from "../app/types";

type Props = {
  task: Task;
  onSave: (changes: Partial<Pick<Task, "title" | "description">>) => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function TaskEditor({
  task,
  onSave,
  onDelete,
  onCancel,
}: Props) {
  // local editable fields (start from current task)
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const changes: Partial<Pick<Task, "title" | "description">> = {};
    if (title.trim() !== task.title) changes.title = title.trim();
    if (description !== (task.description ?? ""))
      changes.description = description;
    onSave(changes); // parent will dispatch UPDATE_TASK
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold">Edit task</h3>

      <div className="space-y-1">
        <label className="text-sm opacity-80">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-neutral-800 px-3 py-2 outline-none"
          placeholder="Task title"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm opacity-80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[120px] rounded-md bg-neutral-800 px-3 py-2 outline-none"
          placeholder="Write something…"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md bg-red-600 px-3 py-2"
        >
          Delete
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-neutral-700 px-3 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 disabled:opacity-50"
            disabled={!title.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
