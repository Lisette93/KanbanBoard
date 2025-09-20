import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  // Wire this wrapper to @dnd-kit sortable
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  // Convert transform object to inline CSS for smooth dragging
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
