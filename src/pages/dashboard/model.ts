import { walkflowRequest } from "@/api/walkflowApi";
import { createCustomModel } from "@/common/createModel";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "ahooks";

export const DashboardModel = createCustomModel(() => {
  const {
    data: flowList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["walkflows"],
    queryFn: async () => {
      const { data } = await walkflowRequest<WalkflowDashboardItem[]>({
        url: "/list",
      });
      return data;
    },
    staleTime: 1000 * 60, // 缓存 1 minute
  });

  const { run: delWorkflow } = useRequest(
    (flowId: string) => {
      return walkflowRequest({
        url: "/delete",
        method: "POST",
        data: {
          flowId,
        },
      }).then(() => refetch());
    },
    {
      manual: true,
    }
  );

  return {
    isFetching,
    flowList,
    delWorkflow,
  };
});
