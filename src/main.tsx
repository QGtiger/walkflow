import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initRoutes } from "./utils/pagerouter";

const basename = process.env.NODE_ENV === "development" ? "/" : "/walkflow";

const router = createBrowserRouter(initRoutes(), {
  basename,
});

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
