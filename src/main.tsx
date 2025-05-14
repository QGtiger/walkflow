import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initRoutes } from "./utils/pagerouter";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";

const basename = process.env.NODE_ENV === "development" ? "/" : "/walkflow";

const router = createBrowserRouter(initRoutes(), {
  basename,
});

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
);
