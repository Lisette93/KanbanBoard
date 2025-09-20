import { useState } from "react";
import type { Task } from "../app/types";

type Props = {
  task: Task;
  onSave: (changes: Partial<Pick<Task, "title" | "description">>) => void;
  onDelete: () => void;
};

export default function TaskEditor({ task, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  // local editable fields (start from current task)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const changes: Partial<Pick<Task, "title" | "description">> = {};
    // Only include fields that actually changed
    if (title.trim() !== task.title) changes.title = title.trim();
    if (description !== (task.description ?? ""))
      changes.description = description;
    onSave(changes); // parent will dispatch UPDATE_TASK
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold">Edit task</h3>

      {/* Title (required) */}
      <div className="space-y-1">
        <label className="text-sm opacity-80">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-white px-3 py-2 outline-none"
          placeholder="Task title"
        />
      </div>

      {/* Description (free text) */}
      <div className="space-y-1">
        <label className="text-sm opacity-80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[120px] rounded-md bg-white px-3 py-2 outline-none"
          placeholder="Write something…"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md text-peachBlossom bg-plumPurple ring-1 ring-peachBlossom px-3 py-2"
        >
          Delete
        </button>

        <button
          type="submit"
          className="rounded-md text-arcticDaisy bg-olive/80 ring-1 ring-arcticDaisy px-3 py-2 disabled:opacity-50"
          disabled={!title.trim()}
        >
          Save
        </button>
      </div>
    </form>
  );
}
