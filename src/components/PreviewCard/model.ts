import { createCustomModel } from "@/common/createModel";
import { useEffect, useState } from "react";
import { preloadSchemaResources } from "./utils";
import { useRequest } from "ahooks";
import { NextStepKey } from "@/common/step";

export interface PreviewCardProps {
  schema: FlowSchemaV1;
  className?: string;

  targetUuid?: string;

  embed?: boolean;
}

export enum InteractionState {
  NotStarted, // 未开始
  Playing, // 正在播放
  Paused, // 暂停等待交互
  Completed, // 所有交互已完成
}

export const PreviewCardModel = createCustomModel((props: PreviewCardProps) => {
  const { schema, targetUuid } = props;

  const {
    loading,
    runAsync,
    data: renderSchema,
  } = useRequest(
    () => {
      return preloadSchemaResources(schema);
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    runAsync();
  }, [JSON.stringify(schema)]);

  const {
    version = "1.0",
    designer,
    config: { steps, screenRecordingUrl },
  } = renderSchema || schema;

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

  const getStep = (uid: string) => {
    const stepIndex = steps.findIndex((it) => it.uid === uid);
    if (stepIndex === -1) {
      throw new Error(`没有找到指定的步骤: ${uid}`);
    }
    return {
      step: steps[stepIndex],
      index: stepIndex,
    };
  };

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
      const { index } = getStep(uid);
      setNum(index);
      setState(InteractionState.Paused);
    }
  };

  const jumpStepByNum = (n: number) => {
    const uid = steps[n % steps.length].uid;
    jumpStepDestination(uid);
  };

  // 获取前一个 hotspot step
  // 如果当前 step 是 hotspot，则返回当前 step
  const getPrevHotspotStepTimeStamp = (uid: string): number => {
    const { index, step } = getStep(uid);
    if (step.type === "hotspot") {
      return step.t;
    }
    let i = index - 1;
    while (true) {
      if (i < 0) {
        return 0; // 没有找到前一个 hotspot step
      }
      const s = steps[i];
      if (s.type === "hotspot") {
        return s.t;
      }
      i--;
    }
  };

  return {
    ...props,
    loading,
    num,
    steps,
    state,
    setState,
    ratio,
    hasBg,
    recordingUrl: screenRecordingUrl,
    targetStepInfo,
    getStep,
    jumpStepDestination,
    jumpStepByNum,
    hasMoreSteps: num <= steps.length - 1,
    getPrevHotspotStepTimeStamp,
    reset() {
      setNum(0);
      setState(InteractionState.NotStarted);
    },
  };
});
