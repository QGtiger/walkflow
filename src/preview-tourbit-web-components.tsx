import * as ReactDOM from "react-dom/client";
import { App, ConfigProvider } from "antd";
import { createCache, StyleProvider } from "@ant-design/cssinjs";
import zhCh from "antd/locale/zh_CN";
import PreviewCard from "./components/PreviewCard";

class PreviewTourbitElement extends HTMLElement {
  private root?: ReturnType<typeof ReactDOM.createRoot>;
  private readonly styleContainer: HTMLDivElement =
    document.createElement("div");

  private readonly modalContainer = document.createElement("div");

  get schema() {
    try {
      return JSON.parse(
        decodeURIComponent(this.getAttribute("schema") || "{}")
      );
    } catch {
      return {};
    }
  }

  get height() {
    const height = this.getAttribute("height");
    return height ? parseInt(height, 10) : 600;
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");

    shadowRoot.appendChild(mountPoint);
    shadowRoot.appendChild(this.styleContainer);
    shadowRoot.appendChild(this.modalContainer);

    console.log(mountPoint.querySelector(".focus-container"));

    // 1. 注入Tailwind样式
    const style = document.createElement("style");
    style.textContent = (window as any).__TAILWIND_SHADOW_STYLES__; // 从全局变量获取
    shadowRoot.appendChild(style);

    const cache = createCache();

    await new Promise<void>((r) => setTimeout(r, 50));

    // Vite 环境下使用现代 React 18 API
    this.root = ReactDOM.createRoot(mountPoint);
    this.root?.render(
      <ConfigProvider
        getPopupContainer={() => this.modalContainer}
        locale={zhCh}
      >
        <StyleProvider container={this.styleContainer} cache={cache}>
          <App>
            <div style={{ height: `${this.height}px` }}>
              <PreviewCard schema={this.schema} embed />
            </div>
          </App>
        </StyleProvider>
      </ConfigProvider>
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.styleContainer.innerHTML = "";
  }
}

customElements.define("preview-tourbit", PreviewTourbitElement);
