import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  // 第三个参数为空字符串表示加载所有环境变量（不限制前缀）
  // 这样 API_BOSS_URL 和 API_WALKFLOW_URL 也能被加载
  const env = loadEnv(mode, process.cwd(), "");
  
  // 合并系统环境变量（优先级更高）
  const mergedEnv = { ...env, ...process.env };

  const isLibBuild = mergedEnv.VITE_BUILD_MODE === "lib";

  if (isLibBuild) {
    return {
      plugins: [react()],
      define: {
        "process.env": mergedEnv,
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
      "process.env": mergedEnv,
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
