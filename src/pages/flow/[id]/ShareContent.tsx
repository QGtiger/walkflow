import { copy, getShareUrl } from "@/utils";
import { createModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";
import { CloudTwoTone, CopyOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FlowDetailModel } from "./model";

function getEmbedCode(title: string, src: string, type: "html" | "react") {
  if (type === "html") {
    return `<div style="height: 100%; width: 100%;">
  <iframe 
    src="${src}"
    title="${title}"
    frameBorder="0"
    allowFullScreen
    webkitallowfullscreen
    mozallowfullscreen
    allow="clipboard-write"
    style="width: 100%; height: 100%;min-height: 300px;"
  />
</div>`;
  } else {
    return `<div
  style={{
    width: "100%",
    height: "100%",
  }}
>
  <iframe
    src="${src}"
    title="${title}"
    frameBorder="0"
    allowFullScreen
    allow="clipboard-write"
    style={{
      width: "100%",
      height: "100%",
      minHeight: "300px",
    }}
  />
</div>`;
  }
}

function EmbedContent({ title }: { title: string }) {
  const { id } = useParams();
  const shareUrl = getShareUrl(id as string) + "?embed=true";
  const [embedType, setEmbedType] = useState<"html" | "react">("html");

  const code = getEmbedCode(title, shareUrl, embedType);

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-1">
        <div className="">嵌入代码</div>
        <div className="text-xs text-gray-500">复制下面的代码到你的网页中</div>
        <div className="h-[300px] mt-4 w-[280px] rounded-sm bg-gray-100  whitespace-break-spaces  break-all p-4 text-gray-500 text-xs pt-10 relative ">
          <div className="h-full overflow-auto">{code}</div>
          <div className=" absolute left-2 top-2">
            <div className="flex gap-2">
              <div
                className={classNames(
                  "p-2 py-1 cursor-pointer rounded-[4px]  hover:text-gray-600 border border-solid border-transparent",
                  {
                    "bg-white text-gray-600  !border-gray-500  ":
                      embedType === "html",
                  }
                )}
                onClick={() => {
                  setEmbedType("html");
                }}
              >
                HTML
              </div>
              <div
                className={classNames(
                  "p-2 py-1 cursor-pointer rounded-[4px] hover:text-gray-600 border border-solid border-transparent",
                  {
                    "bg-white text-gray-500   !border-gray-500 ":
                      embedType !== "html",
                  }
                )}
                onClick={() => {
                  setEmbedType("react");
                }}
              >
                React
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <Button
              size="small"
              onClick={() => {
                copy(code);
                createNotification({
                  type: "success",
                  message: "复制成功",
                  description: "已复制到剪贴板",
                });
              }}
            >
              <CopyOutlined className="text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
      <div className="preview rounded-md bg-gray-200 p-4 w-1 flex-1">
        <div className="p-4 h-full bg-white border border-gray-300 rounded-md border-solid ">
          <div
            style={{
              height: "100%",
              minHeight: "300px",
            }}
          >
            <iframe
              src={shareUrl}
              title="walkflow"
              frameBorder="0"
              allowFullScreen
              allow="clipboard-write"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareContent() {
  const { id } = useParams();
  const shareUrl = getShareUrl(id as string);
  const {
    flowDetail: { flowName },
  } = FlowDetailModel.useModel();

  return (
    <div className="flex flex-col gap-6 px-4 py-2">
      <div className="flex flex-col gap-2">
        <div className=" font-semibold">分享地址</div>
        <Input
          className="w-[340px]"
          value={shareUrl}
          variant="filled"
          suffix={
            <Button
              size="small"
              onClick={() => {
                copy(shareUrl);
                createNotification({
                  type: "success",
                  message: "复制成功",
                  description: "已复制到剪贴板",
                });
              }}
            >
              <CopyOutlined />
            </Button>
          }
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <CloudTwoTone className=" text-2xl" />
          网站嵌入
        </div>
        <Button
          className="px-2 text-xs h-[26px]"
          onClick={() => {
            createModal({
              title: "网站嵌入",
              icon: null,
              centered: true,
              width: 960,
              content: <EmbedContent title={flowName} />,
            });
          }}
        >
          获取code
        </Button>
      </div>
    </div>
  );
}
