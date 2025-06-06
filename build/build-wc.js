import * as fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from "url";

import tailwindConfig from "../tailwind.config.js";

// 处理ES模块的__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 生成Tailwind样式
postcss([tailwindcss(tailwindConfig), autoprefixer])
  .process(
    fs.readFileSync(path.resolve(__dirname, "../src/pages/layout.css"), "utf8"),
    {
      from: undefined,
    }
  )
  .then((result) => {
    console.log("Tailwind样式生成成功");
    console.log(path.resolve("./dist"));
    // 2. 将样式注入到JS全局变量
    const js = `window.__TAILWIND_SHADOW_STYLES__ = ${JSON.stringify(
      result.css
    )};`;

    // 3. 生成临时入口文件
    fs.writeFileSync(path.resolve("./dist/style.js"), js);
  });
