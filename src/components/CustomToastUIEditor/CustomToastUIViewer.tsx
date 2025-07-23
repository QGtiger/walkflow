import Editor from "@toast-ui/editor";
import { useEffect, useRef } from "react";

import "@toast-ui/editor/toastui-editor.css";

import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";

// Step 1. Import prismjs
import Prism from "prismjs";

// Step 2. Import language files of prismjs that you need
import "prismjs/components/prism-clojure.js";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import ScrollContent from "@/components/ScrollContent";
import { HotSpotPlugin } from "./plugins/hotspotPlugin";

export default function CustomToastUIViewer({ content }: { content: string }) {
  const editorInsRef = useRef<any>(null);

  useEffect(() => {
    if (!editorInsRef.current) {
      editorInsRef.current = Editor.factory({
        el: document.querySelector("#viewer")!,
        viewer: true,
        initialValue: content,
        plugins: [HotSpotPlugin, [codeSyntaxHighlight, { highlighter: Prism }]],
      });
    }

    editorInsRef.current.setMarkdown(content);
  }, [content]);

  return (
    <ScrollContent className="h-full w-full">
      <div className=" bg-[#f2f3f5]  py-4 ">
        <div className="max-w-[1000px] mx-auto">
          <div
            id="viewer"
            className="custom-editor px-8 py-4 bg-white rounded-md shadow-md"
          ></div>
        </div>
      </div>
    </ScrollContent>
  );
}
