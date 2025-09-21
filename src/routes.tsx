import { createHashRouter } from "react-router-dom";
import App from "./App";
import BoardPage from "./pages/BoardPage";
import ColumnPage from "./pages/ColumnPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <BoardPage /> },
      { path: "/column/:columnId", element: <ColumnPage /> },
    ],
  },
]);
