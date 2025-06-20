import { Button, Input } from "antd";
import { FlowDetailModel } from "../../../model";

export default function ChapterEditor({ stepInfo }: { stepInfo: ChapterStep }) {
  const { updateWalkflow } = FlowDetailModel.useModel();
  const { title, subtitle, actions, align } = stepInfo;

  return (
    <div
      className="h-full  flex flex-col justify-center px-10 gap-2"
      key={stepInfo.uid}
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
              <Button size="large" type="primary" key={index}>
                <Input
                  className="px-6 text-white text-center"
                  defaultValue={it.text}
                  placeholder="请输入按钮文案"
                  variant="borderless"
                  onBlur={(e) => {
                    it.text = e.target.value;
                    updateWalkflow();
                  }}
                />
              </Button>
            );
          }
          return "暂不支持类型:" + it.type;
        })}
      </div>
    </div>
  );
}
