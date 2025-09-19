import "./index.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import BoardPage from "./pages/BoardPage";
import { Outlet } from "react-router-dom";

export default function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-arcticDaisy">
      <Navbar onAddClick={() => setIsCreateOpen(true)} />
      <main className="p-6">
        {/* Skicka state till barn-sidor via Outlet context */}
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
