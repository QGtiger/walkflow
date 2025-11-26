# WalkFlow Front

> 一个基于 React + TypeScript 的交互式产品演示和教程平台

## 📖 项目简介

WalkFlow 是一个创新的交互式产品演示平台，通过录屏视频与热点交互相结合的方式，为用户提供沉浸式的产品体验。支持创建、编辑和分享交互式演示流程，可作为产品演示、用户引导、教程制作等场景的解决方案。

### ✨ 核心功能

- 🎬 **视频录制集成** - 集成屏幕录制功能，自动同步操作时间点
- 🎯 **热点交互** - 在视频特定时间点添加可点击的热点区域
- 📑 **章节管理** - 支持将演示流程划分为多个章节
- ✍️ **富文本编辑** - 基于 Toast UI Editor 的 Markdown 内容编辑
- 🔗 **分享功能** - 生成可分享的演示链接，支持嵌入模式
- 📦 **Web Components** - 可导出为独立的 Web Component，方便集成到其他应用
- 🎨 **自定义主题** - 支持自定义背景、布局等视觉元素

## 🛠 技术栈

### 核心技术

- **React 19.1** - UI 框架
- **TypeScript** - 类型安全
- **Vite 6** - 构建工具
- **React Router** - 路由管理
- **Tailwind CSS** - 样式方案

### UI & 组件库

- **Ant Design 5.25** - UI 组件库
- **Framer Motion** - 动画库
- **Toast UI Editor** - Markdown 编辑器
- **Prism.js** - 代码高亮

### 状态管理 & 数据请求

- **@tanstack/react-query** - 服务端状态管理
- **ahooks** - React Hooks 工具库
- **Axios** - HTTP 客户端

### 其他工具

- **JSEncrypt** - RSA 加密
- **Marked** - Markdown 解析
- **UUID** - 唯一标识生成

## 📁 项目结构

```
src/
├── api/                    # API 接口定义
│   ├── walkflowApi.ts     # WalkFlow API
│   └── request.ts         # 请求封装
├── components/            # 公共组件
│   ├── PreviewCard/       # 预览卡片（核心组件）
│   │   ├── components/    # 子组件
│   │   │   ├── Video.tsx  # 视频播放控制
│   │   │   ├── HotSpot.tsx # 热点显示
│   │   │   ├── Chapter.tsx # 章节显示
│   │   │   └── ProcessBar.tsx # 进度条
│   │   └── model.ts       # 状态管理
│   ├── CustomToastUIEditor/ # Markdown 编辑器
│   │   └── plugins/       # 编辑器插件
│   ├── DestinationSteps/  # 目标步骤选择器
│   └── ...
├── pages/                 # 页面
│   ├── dashboard/         # 控制台
│   ├── flow/[id]/         # 演示流程
│   │   ├── edit/          # 编辑页面
│   │   └── view/          # 预览页面
│   ├── post/[id]/         # 文章详情
│   ├── share/[id]/        # 分享页面
│   └── login/             # 登录页面
├── utils/                 # 工具函数
│   ├── walkflowUtils.ts   # WalkFlow 工具
│   ├── pagerouter/        # 文件路由系统
│   └── ...
└── models/                # 全局模型
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18
- **pnpm** (推荐) / npm / yarn

### 本地开发

1. **克隆项目**

```bash
git clone <repository-url>
cd walkflow-front
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

创建 `.env` 文件：

```env
API_BOSS_URL="https://boss-api.shadow-rpa.net"
API_WALKFLOW_URL="https://console.yingdao.com/ai-chatbot/walkflow"
```

4. **启动开发服务器**

```bash
pnpm dev
```

访问 `http://localhost:5173`

### 构建

```bash
# 生产构建
pnpm build

# 预览构建产物
pnpm preview

# 构建 Web Component 库
pnpm build:lib
```

## 🐳 Docker 部署

### 使用 Docker Compose（推荐）

1. **启动服务**

```bash
docker compose up -d
```

2. **访问应用**

访问 `http://localhost:8080`

3. **查看日志**

```bash
docker compose logs -f
```

4. **停止服务**

```bash
docker compose down
```

5. **重新构建并启动**

```bash
docker compose build
docker compose up -d
```

### 单独使用 Docker

```bash
# 构建镜像
docker build -t walkflow-front .

# 运行容器
docker run -d -p 8080:80 --name walkflow-front walkflow-front
```

### 生产环境部署

在生产环境（如 ECS）上部署时，确保：

1. **端口映射**：容器内部使用 80 端口，外部映射到 8080（或其他端口）
2. **Nginx 配置**：已配置为支持 SPA 路由，所有请求会回退到 `index.html`
3. **静态资源**：构建产物直接放在 nginx 根目录，无需子路径

访问示例：`http://your-server-ip:8080`

## 📦 Web Component 使用

项目支持导出为独立的 Web Component，可以集成到任何 HTML 页面中：

```html
<!-- 引入打包后的 JS 文件 -->
<script src="preview-tourbit-bundle.umd.js"></script>

<!-- 使用组件 -->
<preview-tourbit
  schema='{"version":"1.0","config":{...}}'
  height="600"
></preview-tourbit>
```

## 🔧 核心概念

### Schema 结构

WalkFlow 使用 JSON Schema 来定义演示流程：

```typescript
interface FlowSchemaV1 {
  version: "1.0";
  designer: {
    background?: string; // 背景图片
  };
  config: {
    screenRecordingUrl: string; // 录屏视频 URL
    steps: Array<ChapterStep | HotSpotStep>; // 步骤列表
  };
}
```

### 步骤类型

- **Chapter（章节）** - 文本说明步骤，可包含标题、副标题和操作按钮
- **HotSpot（热点）** - 视频时间点的交互区域，可点击跳转

### 交互状态

- **NotStarted** - 未开始
- **Playing** - 正在播放
- **Paused** - 暂停等待交互
- **Completed** - 已完成

## 📝 开发说明

### 路由系统

项目使用基于文件系统的路由，路由规则：

- `src/pages/index.tsx` → `/`
- `src/pages/login/index.tsx` → `/login`
- `src/pages/dashboard/index.tsx` → `/dashboard`
- `src/pages/flow/[id]/index.tsx` → `/flow/:id`

### 环境变量

- `API_BOSS_URL` - Boss API 地址
- `API_WALKFLOW_URL` - WalkFlow API 地址
- `VITE_BUILD_MODE` - 构建模式（`lib` 用于构建 Web Component）

### 构建模式

- **默认模式**：构建完整的 SPA 应用
- **lib 模式**：构建 Web Component 库（`pnpm build:lib`）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)
