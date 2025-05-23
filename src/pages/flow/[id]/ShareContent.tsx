import { copy, getShareUrl } from "@/utils";
import { createModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";
import { CloudTwoTone, CopyOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useParams } from "react-router-dom";

function EmbedContent() {
  const { id } = useParams();
  const shareUrl = getShareUrl(id as string);

  return (
    <div className="flex gap-4">
      <div className="">
        <div className="">嵌入代码</div>
        <div className="text-xs text-gray-500">复制下面的代码到你的网页中</div>
      </div>
      <div className="preview rounded-md bg-gray-200 p-4 w-1 flex-1">
        <div className="p-4 h-full bg-white border border-gray-300 rounded-md border-solid">
          <div
            style={{
              height: "100%",
              minHeight: "340px",
            }}
          >
            <iframe
              src={shareUrl + "?embed=true"}
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
              width: 800,
              content: <EmbedContent />,
            });
          }}
        >
          获取code
        </Button>
      </div>
    </div>
  );
}
