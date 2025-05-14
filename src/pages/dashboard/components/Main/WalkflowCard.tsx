import { EllipsisOutlined } from "@ant-design/icons";
import {
  Card,
  Skeleton,
  Image,
  Dropdown,
  Button,
  Typography,
  type MenuProps,
} from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardModel } from "../../model";
import { copy, getShareUrl } from "@/utils";
import { createNotification } from "@/utils/customNotification";
import { createModal } from "@/utils/customModal";

export default function WalkflowCard({
  data: { flowId, thumbnail, flowName, createdAt },
}: {
  data: WalkflowDashboardItem;
}) {
  const nav = useNavigate();

  const ref = useRef<HTMLDivElement>(null);
  const { delWorkflow } = DashboardModel.useModel();

  const items: MenuProps["items"] = [
    {
      key: "delete",
      label: "删除Walkflow",
      onClick() {
        createModal({
          title: "删除Walkflow",
          content: "确定要删除该Walkflow吗？",
          onOk: () => {
            return delWorkflow(flowId);
          },
        });
      },
    },
  ];

  return (
    <Card
      key={flowId}
      size="small"
      className="w-[300px] hover:shadow-lg hover:border-[blue] transition-shadow duration-200 cursor-pointer"
      onClick={() => {
        nav(`/flow/${flowId}`);
      }}
      cover={
        <div className="relative overflow-hidden group">
          <Image
            src={thumbnail}
            rootClassName="h-[200px]"
            className="!h-full object-cover"
            placeholder={
              <Skeleton.Image active className="!h-[200px] !w-full" />
            }
            preview={false}
          />
          <div className="pointer-events-none bg-gradient-to-b from-transparent to-gray-900/10 h-10 w-full absolute bottom-0"></div>

          <div onClick={(e) => e.stopPropagation()} ref={ref}>
            <Dropdown
              menu={{ items: items }}
              getPopupContainer={() => ref.current as HTMLElement}
            >
              <Button
                className=" absolute right-3 top-3 group-hover:opacity-100 opacity-0 transition-opacity duration-200"
                size="small"
              >
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
      }
      rootClassName="custom-card"
    >
      <Card.Meta
        title={flowName}
        description={
          <div className="flex justify-between">
            <Typography.Text type="secondary">
              {new Date(createdAt).toLocaleString()}
            </Typography.Text>
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                const shareUrl = getShareUrl(flowId);
                copy(shareUrl);

                createNotification({
                  type: "success",
                  message: "复制成功",
                  description: "已复制到剪贴板",
                });
              }}
            >
              分享
            </Button>
          </div>
        }
      />
    </Card>
  );
}
