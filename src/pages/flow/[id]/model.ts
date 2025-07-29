import { walkflowRequest } from "@/api/walkflowApi";
import { createCustomModel } from "@/common/createModel";
import { generateDefaultChapterStep } from "@/common/step";
import { deepClone } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { useReactive, useRequest } from "ahooks";
import { App } from "antd";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

export const FlowDetailModel = createCustomModel(() => {
  const { id } = useParams();
  const [stepUuid, setStepUuid] = useState("");
  const { message } = App.useApp();

  // 用响应式数据
  const viewModel = useReactive({
    flowDetail: undefined as WalkflowDetail | undefined,
    // 屏幕宽高比 TODO 先默认当前屏幕的宽高比
    ratio: window.innerWidth / window.innerHeight,
  });

  const { flowDetail, ratio } = viewModel;
  const latestWalkflowDetailRef = useRef<WalkflowDetail | undefined>(undefined);
  const steps = flowDetail?.schema.config.steps || [];

  useQuery({
    queryKey: ["flowEdit", id],
    queryFn: async () => {
      const { data } = await walkflowRequest<WalkflowDetail>({
        url: `detail/${id}`,
      });
      // .then(async (res) => {
      //   if (res.data) {
      //     res.data.schema = await preloadSchemaResources(res.data.schema);
      //   }
      //   return res;
      // });

      if (data) {
        // 兼容老数据 补全designer
        data.schema.designer = data.schema.designer || {};

        viewModel.flowDetail = data;
        latestWalkflowDetailRef.current = deepClone(data);

        const item = data.schema.config.steps.at(0);
        if (!item) return;
        const i = item.uid;
        i && setStepUuid(i);

        const firstHotSpot = data.schema.config.steps.find(
          (it) => it.type === "hotspot"
        );
        if (firstHotSpot) {
          viewModel.ratio = firstHotSpot.w / firstHotSpot.h;
        }
      }

      return data;
    },
  });

  const { runAsync: updateWalkflow } = useRequest(
    async () => {
      if (!flowDetail) return;
      if (
        JSON.stringify(flowDetail) ===
        JSON.stringify(latestWalkflowDetailRef.current)
      )
        return;
      await walkflowRequest({
        url: "/update",
        method: "POST",
        data: {
          name: flowDetail.flowName,
          schema: flowDetail.schema,
          flowId: id,
        },
      });
      latestWalkflowDetailRef.current = deepClone(flowDetail);
    },
    {
      manual: true,
      debounceWait: 600,
    }
  );

  const removeStep = (uid: string) => {
    if (steps.length <= 1) {
      message.error(
        "别删了，我滴活爹！至少保留一个步骤。 要不左上角退出去，删除这条 tourbit吧"
      );
      return;
    }
    if (steps.filter((it) => it.type === "hotspot").length <= 1) {
      message.error(
        "别删了，我滴活爹！至少保留一个HotSpot。 要不左上角退出去，删除这条 tourbit吧"
      );
      return;
    }
    let index = steps.findIndex((it) => it.uid === uid);
    if (index !== -1) {
      steps.splice(index, 1);
      if (index > steps.length - 1) {
        index = steps.length - 1; // 确保索引不越界
      }
      setStepUuid(steps[index].uid);
      updateWalkflow();
    }
  };

  const addChapterStep = (i: number) => {
    if (!flowDetail) return;
    const newStep = generateDefaultChapterStep();
    steps.splice(i, 0, newStep);
    setStepUuid(newStep.uid);
    updateWalkflow();
  };

  return {
    // 这里配合 layout 进行数据断言
    flowDetail: flowDetail!,
    ratio,
    steps,
    stepUuid,
    setStepUuid,
    stepInfo: steps.find((it) => it.uid === stepUuid),

    screenRecordingUrl: flowDetail?.schema.config.screenRecordingUrl,
    schema: flowDetail?.schema!,

    updateWalkflow,
    designerConfig: flowDetail?.schema.designer,
    removeStep,
    addChapterStep,
  };
});
