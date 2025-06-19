import r2wc from "@r2wc/react-to-web-component";
import { Button } from "antd";

import "./pages/layout.css";

function App({ name }: { name: string }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hello, {name}!</h1>
      <p className="text-gray-700">
        This is a simple web component built with React.
      </p>
      <p className="text-gray-500">
        You can customize the name by passing a prop.
      </p>
      <Button>22</Button>
    </div>
  );
}

const HelloWC = r2wc(App, {
  props: { name: "string" },
});

customElements.define("hello-wc", HelloWC);
