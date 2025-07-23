import { Editor } from "@toast-ui/react-editor";
import { useEffect, useMemo, useRef } from "react";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import { uploadFile } from "@/utils";

// Step 1. Import prismjs
import Prism from "prismjs";

// Step 2. Import language files of prismjs that you need
import "prismjs/components/prism-clojure.js";
import { FlowPostDetailModel } from "../model";
import { useReactive, useRequest } from "ahooks";
import { HotSpotPlugin } from "@/components/CustomToastUIEditor/plugins/hotspotPlugin";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import { marked } from "marked";

export default function PostEdit() {
  const editorRef = useRef<Editor>(null);
  const { postSchema, updateWalkflow } = FlowPostDetailModel.useModel();
  const viewModel = useReactive({
    editContent: postSchema.content || "",
  });

  const { editContent } = viewModel;

  const { wordCount, lineCount, readingTime } = useMemo(() => {
    const html = marked.parse(editContent);

    const wordCount =
      typeof html === "string" ? html.replace(/<[^>]*>/g, "").length : 0;

    return {
      wordCount: wordCount,
      lineCount: editContent.split("\n").length,
      readingTime: Math.ceil(wordCount / 200), // Assuming average reading speed of 200 wpm
    };
  }, [editContent]);

  const coundSave = postSchema.content !== editContent;

  const { loading, run } = useRequest(
    () => {
      return updateWalkflow({
        content: viewModel.editContent,
      }).then(() => {
        postSchema.content = viewModel.editContent;
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    const editorEle = editorRef.current?.getRootElement();
    const editorIns = editorRef.current?.getInstance();
    if (!editorIns || !editorEle) return;

    const handleChange = () => {
      const markdownText = editorIns.getMarkdown();

      viewModel.editContent = markdownText;
    };

    // handleChange();

    editorIns.on("change", handleChange);

    return () => {
      editorIns.off("change");
    };
  }, []);

  return (
    <div className=" h-full bg-white flex w-full gap-10">
      <div className="custom-editor w-1 flex-1 p-10">
        <Editor
          ref={editorRef}
          previewStyle="vertical"
          height={`100%`}
          hideModeSwitch
          language="zh-CN"
          hooks={{
            addImageBlobHook: async (
              blob: Blob | File,
              callback: (url: string, text?: string) => void
            ) => {
              const readUrl = await uploadFile({
                blob,
                name: (blob as File).name,
                uploadUrl: "https://console.yingdao.com/gw-api/upload/file",
              });
              callback(readUrl, (blob as File).name);
            }, // handleImageUpload,
          }}
          placeholder={"请输入文章内容..."}
          initialValue={viewModel.editContent}
          plugins={[
            HotSpotPlugin,
            [codeSyntaxHighlight, { highlighter: Prism }],
          ]}
          autofocus
        />
      </div>
      <div className="r w-[300px] flex-grow-0 flex-shrink-0 border-0 border-l border-solid border-gray-200 p-6 flex flex-col gap-6">
        <Button
          icon={<SaveOutlined />}
          block
          type="primary"
          loading={loading}
          disabled={!coundSave}
          onClick={run}
        >
          保存
        </Button>
        <div className=" rounded-md border border-solid border-gray-200 p-4 flex flex-col gap-1">
          <p className=" font-semibold mb-1">统计信息</p>
          <div className="flex justify-between">
            <span className=" text-gray-500">字数</span>
            <span>{wordCount}</span>
          </div>
          <div className="flex justify-between">
            <span className=" text-gray-500">行数</span>
            <span>{lineCount}</span>
          </div>

          <div className="flex justify-between">
            <span className=" text-gray-500">推荐阅读时间</span>
            <span>{readingTime} 分钟</span>
          </div>
        </div>
      </div>
    </div>
  );
}
