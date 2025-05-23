import { useMount, useSize, useUpdate } from "ahooks";
import { FlowDetailModel } from "../../model";
import { Button, Input } from "antd";
import FocusIndicator from "@/components/FocusIndicator";

export default function Main() {
  const {
    stepInfo,
    ratio,
    updateWalkflow,
    screenRecordingUrl,
    designerConfig,
  } = FlowDetailModel.useModel();
  const canvasSize = useSize(() => document.querySelector("#preview-wrapper"));

  const padding = 60;

  const { width: canvasWidth, height: canvasHeight } = canvasSize || {
    width: 0,
    height: 0,
  };

  let width = 0;
  let height = 0;
  if (canvasWidth && canvasHeight) {
    const maxHeight = canvasHeight - padding;

    width = canvasWidth - padding;
    height = Math.min(width / ratio, maxHeight);

    width = height * ratio;
  }

  if (!stepInfo) return "未知的步骤";

  let conent = null;
  if (stepInfo.type === "chapter") {
    const { title, subtitle, actions, align } = stepInfo;
    // TODO 先简单就是第一个
    conent = (
      <div className="w-full h-full relative">
        <video
          src={screenRecordingUrl}
          controls={false}
          className="w-full h-full"
        />
        <div className=" absolute inset-0 backdrop-blur-md bg-[#ffffffb3]">
          <div className="h-full  flex flex-col justify-center px-10 gap-2">
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
        </div>
      </div>
    );
  } else if (stepInfo.type === "hotspot") {
    if (canvasSize) {
      const { w, h, x, y, title, align } = stepInfo;
      const ratio = canvasSize.width / w;
      conent = (
        <div className="w-full h-full relative">
          <img
            src={stepInfo.screenshotUrl}
            alt=""
            className="w-full h-full object-cover select-none"
          />
          <FocusIndicator
            draggable
            content={title}
            contentStyle={{
              textAlign: align,
            }}
            x={ratio * x}
            y={ratio * y}
            maxX={ratio * w}
            maxY={ratio * h}
            size={30}
            color="#7f70f5"
            duration={1500}
            onPositionChange={(pos) => {
              stepInfo.x = pos.x / ratio;
              stepInfo.y = pos.y / ratio;
              updateWalkflow();
            }}
          />
        </div>
      );
    }
  }

  return (
    <div
      className="select-none h-full overflow-hidden relative flex items-center justify-center"
      style={{
        backgroundImage: `url(${designerConfig?.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: `${padding / 2}px`,
      }}
    >
      <div id="preview-wrapper" className=" absolute inset-0"></div>
      <div
        className="ring-1 ring-gray-300 rounded-md bg-white overflow-hidden"
        style={{
          height,
          width,
        }}
      >
        {conent}
      </div>
    </div>
  );
}
