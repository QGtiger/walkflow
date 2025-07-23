import CustomHeader from "@/components/CustomHeader";
import CustomLoading from "@/components/CustomLoading";
import {
  PartitionOutlined,
  PicLeftOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Segmented, Typography } from "antd";
import {
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import { FlowPostDetailModel } from "./model";
import { createNotification } from "@/utils/customNotification";
import { copy, getSharePostUrl } from "@/utils";

function PostLayout() {
  const outlet = useOutlet();
  const { id } = useParams();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { loadingText, postSchema } = FlowPostDetailModel.useModel();

  const v = pathname.split("/").at(-1) === "view" ? "view" : "edit";

  return (
    <div className="flex flex-col h-screen">
      <CustomHeader
        leftContent={
          <h1 className="text-xl font-semibold text-walkflow-darktext">
            Walkflows Post
          </h1>
        }
        rightContent={
          <div className="flex gap-2">
            <Segmented
              value={v}
              options={[
                { label: "编辑", value: "edit", icon: <PicLeftOutlined /> },
                { label: "预览", value: "view", icon: <PartitionOutlined /> },
              ]}
              onChange={(value) => {
                nav(`/post/${id}/${value}`);
              }}
            />
            {/* <Popover
              placement="bottomRight"
              content={<ShareContent />}
              arrow={false}
              trigger="click"
            >
              <Button type="primary" icon={<ShareAltOutlined />}>
                Share
              </Button>
            </Popover>
            <Button type="default" icon={<EllipsisOutlined />}></Button> */}
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              onClick={() => {
                const shareUrl = getSharePostUrl(id as string);
                copy(shareUrl);
                createNotification({
                  type: "success",
                  message: "复制成功",
                  description: (
                    <div>
                      已复制到剪贴板{" "}
                      <Typography.Link href={shareUrl} target="_blank">
                        {shareUrl}
                      </Typography.Link>
                    </div>
                  ),
                });
              }}
            >
              Share
            </Button>
          </div>
        }
      />
      <main className="flex-1 overflow-auto bg-[#fbfbfb]">
        {postSchema ? (
          outlet
        ) : (
          <div className="flex items-center justify-center h-full flex-col">
            <CustomLoading scale={1.5} />
            <span className=" mt-[50px] text-gray-500">{loadingText}</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PostLayoutWithModel() {
  return (
    <FlowPostDetailModel.Provider>
      <PostLayout />
    </FlowPostDetailModel.Provider>
  );
}
