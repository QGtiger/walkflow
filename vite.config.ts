import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env =
    mode === "development" ? loadEnv(mode, process.cwd(), "") : process.env;

  const isLibBuild = env.VITE_BUILD_MODE === "lib";

  if (isLibBuild) {
    return {
      plugins: [react()],
      define: {
        "process.env": env,
      },
      resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      },
      build: {
        lib: {
          entry: "src/preview-tourbit-web-components.tsx", // 自定义入口文件
          name: "PreviewTourbit",
          formats: ["umd"],
          fileName: "preview-tourbit-bundle",
        },
      },
    };
  }

  return {
    base: "/",
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    define: {
      "process.env": env,
    },

    // 不做代理，否则我页面也会被代理
    // server: {
    //   port: 8009,
    //   host: "0.0.0.0",
    //   proxy: {
    //     // 将本地开发服务器的/api代理到http://localhost:5000
    //     "/boss": {
    //       target: "https://test-boss-api.shadow-rpa.net",
    //       changeOrigin: true, // 改变原始主机头为目标主机头
    //       rewrite: (path) => path.replace(/^\/boss/, "/boss"), // 可选：重写路径
    //     },
    //     "/walkflow": {
    //       target: "http://localhost:3000",
    //       changeOrigin: true, // 改变原始主机头为目标主机头
    //       rewrite: (path) => path.replace(/^\/walkflow/, "/walkflow"), // 可选：重写路径
    //     },
    //   },
    // },
  };
});
