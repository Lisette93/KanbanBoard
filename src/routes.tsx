import { createBrowserRouter } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import ColumnPage from "./pages/ColumnPage";

export const router = createBrowserRouter([
  { path: "/", element: <BoardPage /> },
  { path: "/column/:columnId", element: <ColumnPage /> },
]);
