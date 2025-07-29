import { DownOutlined } from "@ant-design/icons";
import { FlowDetailModel } from "../../../model";
import { useBoolean } from "ahooks";
import { Dropdown } from "antd";
import { useRef } from "react";
import classNames from "classnames";
import DestinationSteps from "@/components/DestinationSteps";
import { useDestination } from "@/hooks/useDestination";

export default function DestinationSelect({
  btnAction,
  onChange,
}: {
  btnAction: ChapterButtonAction;
  onChange?: (opt: {
    destination?: string;
    url?: string; // 如果是 NextStepKeyByUrl，则需要传入 url
  }) => void;
}) {
  const { steps, stepUuid } = FlowDetailModel.useModel();
  const ref = useRef<HTMLDivElement>(null);
  const [active, activeAction] = useBoolean(false);

  const { targetLabel } = useDestination({
    steps,
    destinationAction: btnAction,
  });

  return (
    <Dropdown
      trigger={["click"]}
      // overlayClassName="w-64"
      onOpenChange={activeAction.set}
      getPopupContainer={() => ref.current || document.body}
      popupRender={() => {
        return (
          <DestinationSteps
            currStepUuid={stepUuid}
            steps={steps}
            onChange={onChange}
            destinationAction={btnAction}
            className="w-64 flex-shrink-0 p-1 flex gap-1 flex-col bg-white shadow-md rounded-md border border-gray-100 border-solid max-h-[400px] overflow-auto"
          />
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
        <div className=" line-clamp-1">{targetLabel}</div>
        <div>
          <DownOutlined />
        </div>
      </div>
    </Dropdown>
  );
}
