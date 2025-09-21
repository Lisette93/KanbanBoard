import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import BoardPage from "./pages/BoardPage";
import ColumnPage from "./pages/ColumnPage";

const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <BoardPage /> },
        { path: "/column/:columnId", element: <ColumnPage /> },
      ],
    },
  ],
  { basename }
);
