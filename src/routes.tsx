import { createBrowserRouter } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import ColumnPage from "./pages/ColumnPage";
import TaskPage from "./pages/TaskPage";

export const router = createBrowserRouter([
  { path: "/", element: <BoardPage /> },
  { path: "/column/:columnId", element: <ColumnPage /> },
  { path: "/task/:taskId", element: <TaskPage /> },
]);
