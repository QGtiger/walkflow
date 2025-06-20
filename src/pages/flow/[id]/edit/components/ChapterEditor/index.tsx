import { Dropdown, Input } from "antd";
import { FlowDetailModel } from "../../../model";
import ChapterButton from "./ChapterButton";
import { useRef } from "react";
import DestinationSelect from "./DestinationSelect";

export default function ChapterEditor({ stepInfo }: { stepInfo: ChapterStep }) {
  const ref = useRef<HTMLDivElement>(null);
  const { updateWalkflow } = FlowDetailModel.useModel();
  const { title, subtitle, actions, align } = stepInfo;

  return (
    <div
      className="h-full  flex flex-col justify-center gap-2 relative"
      key={stepInfo.uid}
      ref={ref}
    >
      <Input
        className="p-0 text-2xl font-semibold"
        defaultValue={title}
        placeholder="请输入主标题"
        variant="borderless"
        onBlur={(e) => {
          stepInfo.title = e.target.value;
          updateWalkflow();
        }}
        style={{
          textAlign: align,
        }}
      />
      <Input.TextArea
        className="p-0 scroll-content"
        autoSize
        defaultValue={subtitle}
        placeholder="请输入副标题"
        variant="borderless"
        onBlur={(e) => {
          stepInfo.subtitle = e.target.value;
          updateWalkflow();
        }}
        style={{
          textAlign: align,
        }}
      />

      <div
        className="flex gap-2"
        style={{
          justifyContent: align,
        }}
      >
        {actions.map((it, index) => {
          if (it.type === "button") {
            return (
              <Dropdown
                key={index}
                popupRender={() => {
                  return (
                    <div className="inline-flex items-center bg-white rounded-md border border-solid border-gray-400 p-1 shadow-lg">
                      <div className="">
                        <DestinationSelect
                          destination={it.destination}
                          onDestinationChange={(d) => {
                            it.destination = d;
                            updateWalkflow();
                          }}
                        />
                      </div>
                    </div>
                  );
                }}
                trigger={["click"]}
                placement="topCenter"
              >
                <div className="">
                  <ChapterButton
                    defaultValue={it.text}
                    onBlur={(v) => {
                      it.text = v;
                      updateWalkflow();
                    }}
                  />
                </div>
              </Dropdown>
            );
          }
          return "暂不支持类型:" + it.type;
        })}
      </div>
    </div>
  );
}
