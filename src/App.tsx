import "./index.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

/*
 - Renders a global Navbar at the top.
  - Provides "create task" modal state via Outlet context so pages can open/close it.
  - Wraps children routes inside a main area.
 */

export default function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-arcticDaisy">
      <Navbar onAddClick={() => setIsCreateOpen(true)} />
      <main className="">
        <Outlet
          context={{
            createOpen: isCreateOpen,
            onCloseCreate: () => setIsCreateOpen(false),
          }}
        />
      </main>
    </div>
  );
}
