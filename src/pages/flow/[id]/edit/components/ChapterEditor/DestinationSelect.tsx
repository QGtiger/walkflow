import { DownOutlined } from "@ant-design/icons";
import { FlowDetailModel } from "../../../model";
import { NextStepKey } from "@/common/step";
import { getStepByUid, getStepName } from "@/utils/walkflowUtils";
import { useBoolean, useCreation } from "ahooks";
import { Dropdown } from "antd";
import { useRef } from "react";
import classNames from "classnames";

function getStepLabel(step: any, index: number) {
  return `${getStepName(step, index)}`;
}

export default function DestinationSelect({
  destination,
  onDestinationChange,
}: {
  destination: string;
  onDestinationChange?: (destination: string) => void;
}) {
  const { steps, stepUuid } = FlowDetailModel.useModel();
  const ref = useRef<HTMLDivElement>(null);
  const [active, activeAction] = useBoolean(false);

  const stepWithNext: {
    name?: string;
    uid: string;
  }[] = useCreation(() => {
    return [
      {
        name: "Next Step",
        uid: NextStepKey,
      },
    ].concat(steps as any[]);
  }, [steps]);

  const { nextUuid, label } = useCreation(() => {
    // @ts-expect-error 先这样吧 没想好怎么处理 类型问题
    const { step, index } = getStepByUid(destination, stepWithNext);
    if (step) {
      return {
        nextUuid: step.uid,
        label: getStepLabel(step, index),
      };
    }
    return {
      nextUuid: "",
      label: "未找到目标步骤",
    };
  }, [destination, stepWithNext]);

  return (
    <Dropdown
      trigger={["click"]}
      overlayClassName="w-64"
      onOpenChange={activeAction.set}
      getPopupContainer={() => ref.current || document.body}
      popupRender={() => {
        return (
          <div className="p-1 flex gap-1 flex-col bg-white shadow-md rounded-md border border-gray-100 border-solid mt-1 max-h-[400px] overflow-auto">
            {stepWithNext.map((step, index) => {
              const isCurrent = step.uid === stepUuid;
              return (
                <div
                  key={step.uid}
                  className={classNames(
                    "p-2 hover:bg-gray-200 cursor-pointer transition-all rounded-md flex items-center gap-1",
                    {
                      " bg-slate-200": step.uid === nextUuid,
                    }
                  )}
                  onClick={() => {
                    onDestinationChange?.(step.uid);
                  }}
                >
                  <div className="line-clamp-1">
                    {step.uid !== NextStepKey ? `${index}.  ` : ""}
                    {getStepLabel(step, index)}
                  </div>
                  {isCurrent && (
                    <div
                      className="text-xs"
                      style={{
                        wordBreak: "keep-all",
                      }}
                    >
                      (current)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }}
    >
      <div
        className={classNames(
          "flex gap-2 group hover:bg-gray-300 rounded-md p-1 cursor-pointer min-w-[80px] max-w-[200px] justify-between",
          {
            "bg-gray-300": active,
          }
        )}
        ref={ref}
      >
        <div className=" line-clamp-1">{label}</div>
        <div>
          <DownOutlined />
        </div>
      </div>
    </Dropdown>
  );
}
