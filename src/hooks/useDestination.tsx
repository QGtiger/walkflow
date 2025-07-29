import { NextStepKey, NextStepKeyByUrl } from "@/common/step";
import { getStepByUid, getStepName } from "@/utils/walkflowUtils";
import { useCreation } from "ahooks";

function getStepLabel(step: any, index: number) {
  return `${getStepName(step, index)}`;
}

export function useDestination(config: {
  steps: TourbitSteps;
  destinationAction: NextDestinationAction;
}) {
  const { steps, destinationAction } = config;
  const { destination } = destinationAction;
  const detinationList: {
    name?: string;
    uid: string;
  }[] = useCreation(() => {
    return [
      {
        name: "Next Step by URL",
        uid: NextStepKeyByUrl,
      },
      {
        name: "Next Step",
        uid: NextStepKey,
      },
    ].concat(
      steps.map((it, index) => {
        return {
          name: `${index + 1}. ${getStepLabel(it, index + 1)}`,
          uid: it.uid,
        };
      })
    );
  }, [steps]);

  const { targetUuid, targetLabel } = useCreation(() => {
    // @ts-expect-error 先这样吧 没想好怎么处理 类型问题
    const { step, index } = getStepByUid(destination, detinationList);
    if (step) {
      return {
        targetUuid: step.uid,
        targetLabel: getStepLabel(step, index),
      };
    }
    return {
      targetUuid: "",
      targetLabel: "未找到目标步骤",
    };
  }, [destination, detinationList]);

  return {
    targetUuid,
    targetLabel,
    detinationList,
  };
}
