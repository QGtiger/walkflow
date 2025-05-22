import { Select, Skeleton } from "antd";
import EmptyWalkflow from "../EmptyWalkflow";

import "./index.css";
import ScrollContent from "@/components/ScrollContent";
import WalkflowCard from "./WalkflowCard";
import { DashboardModel } from "../../model";

export default function Main() {
  const { flowList, isFetching } = DashboardModel.useModel();

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-walkflow-gray flex justify-center ">
      <div className="w-[80%]">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between">
            <div className="left space-y-2">
              <div className="text-2xl font-bold">My Walkflows</div>
              <div className="text-sm text-gray-500">
                创建和管理您的 Walkflows
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="l">
              <Select
                defaultValue=""
                style={{ width: 240 }}
                options={[
                  { value: "", label: "全部 Walkflows" },
                  { value: "draft", label: "未发布 Walkflows" },
                  { value: "published", label: "已发布 Walkflows" },
                ]}
              />
            </div>
            <div className="r">
              <Select
                defaultValue=""
                style={{ width: 240 }}
                options={[
                  { value: "", label: "默认排序" },
                  { value: "1", label: "创建时间排序" },
                  { value: "2", label: "更新时间排序" },
                ]}
              />
            </div>
          </div>
          {isFetching ? (
            <Skeleton active paragraph={{ rows: 4 }} className="w-full" />
          ) : flowList?.length ? (
            <ScrollContent className="h-1 flex-1 mt-4 scroll-content">
              <div className="flex flex-wrap gap-4">
                {flowList?.map((it) => {
                  return <WalkflowCard key={it.flowId} data={it} />;
                })}
              </div>
            </ScrollContent>
          ) : (
            <EmptyWalkflow />
          )}
        </div>
      </div>
    </main>
  );
}
