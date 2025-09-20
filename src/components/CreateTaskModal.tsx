import { useState } from "react";
import Modal from "./Modal";

type ColumnLite = { id: string; title: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnLite[]; // columns to choose from
  defaultColumnId: string; // preselect column
  onCreate: (data: {
    title: string;
    columnId: string;
    description?: string;
  }) => void;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  columns,
  defaultColumnId,
  onCreate,
}: Props) {
  // Local controlled inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId);

  // Submit handler: validate, send data up, reset, close
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onCreate({
      title: t,
      columnId,
      description: description.trim() || undefined,
    });
    // Reset form after successful create
    setTitle("");
    setDescription("");
    setColumnId(defaultColumnId);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* role="dialog" is typically inside Modal; form is the content */}
      <form onSubmit={submit} className="space-y-3">
        <h3 className="text-lg font-semibold">Add new task</h3>

        {/* Title input (required) */}
        <div className="space-y-1">
          <label className="text-sm opacity-80">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 outline-none"
            placeholder="Task title"
          />
        </div>

        {/* Column selector */}
        <div className="space-y-1">
          <label className="text-sm opacity-80">Column</label>
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 outline-none"
          >
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Optional description */}
        <div className="space-y-1">
          <label className="text-sm opacity-80">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px] rounded-md bg-white px-3 py-2 outline-none"
            placeholder="Notes…"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-md text-arcticDaisy bg-olive/80 ring-1 ring-arcticDaisy px-3 py-2 disabled:opacity-50"
            disabled={!title.trim()}
          >
            Add task
          </button>
        </div>
      </form>
    </Modal>
  );
}
