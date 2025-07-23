import CustomHeader from "@/components/CustomHeader";
import {
  EllipsisOutlined,
  PartitionOutlined,
  PicLeftOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Popover, Segmented } from "antd";
import {
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import { FlowDetailModel } from "./model";
import { motion } from "framer-motion";
import ShareContent from "./ShareContent";

function DetailLayout() {
  const outlet = useOutlet();
  const { flowDetail } = FlowDetailModel.useModel();
  const { id } = useParams();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const v = pathname.split("/").at(-1) === "view" ? "view" : "edit";

  return (
    <div className="flex flex-col h-screen">
      <CustomHeader
        rightContent={
          <div className="flex gap-2">
            <Segmented
              value={v}
              options={[
                { label: "编辑", value: "edit", icon: <PicLeftOutlined /> },
                { label: "预览", value: "view", icon: <PartitionOutlined /> },
              ]}
              onChange={(value) => {
                nav(`/flow/${id}/${value}`, {
                  replace: true,
                });
              }}
            />
            <Popover
              placement="bottomRight"
              content={<ShareContent />}
              arrow={false}
              trigger="click"
            >
              <Button type="primary" icon={<ShareAltOutlined />}>
                Share
              </Button>
            </Popover>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "switchPost",
                    label: "切换到文章",
                    onClick() {
                      nav(`/post/${id}`);
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button type="default" icon={<EllipsisOutlined />}></Button>
            </Dropdown>
          </div>
        }
      />
      <main className="flex-1 overflow-auto bg-[#fbfbfb]">
        {flowDetail ? (
          outlet
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["3%", "3%", "50%", "50%", "3%"],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="w-24 h-24 bg-[#7f70f5]"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default () => {
  return (
    <FlowDetailModel.Provider>
      <DetailLayout />
    </FlowDetailModel.Provider>
  );
};
