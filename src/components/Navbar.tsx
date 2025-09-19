// src/components/Navbar.tsx
import { Link } from "react-router-dom";

export default function Navbar({ onAddClick }: { onAddClick: () => void }) {
  return (
    <nav
      className="bg-white/60 backdrop-blur-md  rounded-b-2xl px-6 py-4 flex items-center justify-between shadow
    "
    >
      <Link
        to="/"
        className="text-2xl font-bold text-brownSugar font-Handlee hover:text-roseBlush transition"
      >
        Kanban Board
      </Link>

      <button
        type="button"
        onClick={onAddClick}
        className="rounded-md bg-peachBlossom/60 px-4 py-2 text-plumPurple hover:bg-peachBlossom/80 transition"
      >
        + Add New Task
      </button>
    </nav>
  );
}
