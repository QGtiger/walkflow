import { walkflowRequest } from '@/api/walkflowApi';
import { createCustomModel } from '@/common/createModel';
import { deepClone } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useReactive, useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

interface WalkflowDetail {
  flowId: string;
  flowName: string;
  schema: FlowSchemaV1;
}

export const FlowDetailModel = createCustomModel(() => {
  const { id } = useParams();
  const [stepUuid, setStepUuid] = useState('');

  // 用响应式数据
  const viewModel = useReactive({
    flowDetail: undefined as WalkflowDetail | undefined,
    // 屏幕宽高比 TODO 先默认当前屏幕的宽高比
    ratio: window.innerWidth / window.innerHeight,
  });

  const { flowDetail, ratio } = viewModel;
  const latestSchemaRef = useRef<FlowSchemaV1 | undefined>(undefined);

  useQuery({
    queryKey: ['flowEdit', id],
    queryFn: async () => {
      const { data } = await walkflowRequest<WalkflowDetail>({
        url: `detail/${id}`,
      });

      if (data) {
        // 兼容老数据 补全designer
        data.schema.designer = data.schema.designer || {};

        viewModel.flowDetail = data;
        latestSchemaRef.current = deepClone(data.schema);

        const item = data.schema.config.steps.at(0);
        if (!item) return;
        const i = item.uid;
        i && setStepUuid(i);

        const firstHotSpot = data.schema.config.steps.find((it) => it.type === 'hotspot');
        if (firstHotSpot) {
          viewModel.ratio = firstHotSpot.w / firstHotSpot.h;
        }
      }

      return data;
    },
  });

  const { runAsync: updateWalkflow } = useRequest(
    async (opt?: { name?: string }) => {
      if (!flowDetail) return;
      const updatedSchema = flowDetail.schema;
      if (JSON.stringify(updatedSchema) === JSON.stringify(latestSchemaRef.current)) return;
      await walkflowRequest({
        url: '/update',
        method: 'POST',
        data: {
          ...opt,
          schema: updatedSchema,
          flowId: id,
        },
      });
      latestSchemaRef.current = deepClone(updatedSchema);
    },
    {
      manual: true,
      debounceWait: 600,
    },
  );

  return {
    // 这里配合 layout 进行数据断言
    flowDetail: flowDetail!,
    ratio,
    stepUuid,
    setStepUuid,
    stepInfo: flowDetail?.schema.config.steps.find((it) => it.uid === stepUuid),

    screenRecordingUrl: flowDetail?.schema.config.screenRecordingUrl,
    schema: flowDetail?.schema!,

    updateWalkflow,
    designerConfig: flowDetail?.schema.designer,
  };
});
