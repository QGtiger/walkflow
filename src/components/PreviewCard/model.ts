import { createCustomModel } from "@/common/createModel";
import { useEffect, useState } from "react";

export interface PreviewCardProps {
  schema: FlowSchemaV1;
  className?: string;

  targetUuid?: string;

  embed?: boolean;
}

// @ts-expect-error 交互状态枚举
export enum InteractionState {
  NotStarted, // 未开始
  Playing, // 正在播放
  Paused, // 暂停等待交互
  Completed, // 所有交互已完成
}

const NextStepKey = "next";

export const PreviewCardModel = createCustomModel((props: PreviewCardProps) => {
  const { schema, targetUuid } = props;
  const {
    version = "1.0",
    designer,
    config: { steps, screenRecordingUrl },
  } = schema;

  if (steps.length == 0) throw new Error("没有步骤");

  const [num, setNum] = useState(0);
  const targetStepInfo = steps[num % steps.length];

  const [state, setState] = useState<InteractionState>(
    InteractionState.NotStarted
  );

  useEffect(() => {
    if (targetUuid) {
      const index = steps.findIndex((it) => it.uid === targetUuid);
      if (index !== -1) {
        setNum(index);
        setState(InteractionState.Paused);
      } else {
        throw new Error("没有找到指定的步骤");
      }
    }
  }, [targetUuid]);

  if (version !== "1.0") {
    throw new Error("不支持的版本");
  }

  let ratio = 1;
  const firstHotSpot = steps.find((it) => it.type === "hotspot");
  if (firstHotSpot) {
    ratio = firstHotSpot.w / firstHotSpot.h;
  }

  const hasBg = designer.background && designer.background !== "";

  const jumpStepDestination = (uid: string) => {
    if (uid === NextStepKey) {
      const t = num + 1;
      setNum(t);
      if (t >= steps.length) {
        // 已经到最后一步了
        setState(InteractionState.Playing);
      } else {
        const s = steps[t];
        // 下一步 不是 hotspot 就直接暂停
        if (s.type !== "hotspot") {
          setState(InteractionState.Paused);
        } else {
          setState(InteractionState.Playing);
        }
      }
    } else {
      // 直接跳转到指定步骤
      const index = steps.findIndex((it) => it.uid === uid);
      if (index !== -1) {
        setNum(index);
        setState(InteractionState.Paused);
      } else {
        throw new Error("没有找到指定的步骤");
      }
    }
  };

  return {
    ...props,
    steps,
    state,
    setState,
    ratio,
    hasBg,
    recordingUrl: screenRecordingUrl,
    targetStepInfo,
    jumpStepDestination,
    hasMoreSteps: num <= steps.length - 1,
    reset() {
      setNum(0);
      setState(InteractionState.NotStarted);
    },
  };
});
