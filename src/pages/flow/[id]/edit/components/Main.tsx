import { useSize } from "ahooks";
import { FlowDetailModel } from "../../model";
import FocusIndicator from "@/components/FocusIndicator";
import ChapterEditor from "./ChapterEditor";
import { getHotspotStepNearBy } from "@/utils/walkflowUtils";

export default function Main() {
  const {
    stepInfo,
    ratio,
    updateWalkflow,
    screenRecordingUrl,
    designerConfig,
    steps,
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
    const nearHotSpotInfo = getHotspotStepNearBy(stepInfo.uid, steps);
    conent = (
      <div className="w-full h-full relative" key={stepInfo.uid}>
        {nearHotSpotInfo ? (
          <img
            key={stepInfo.uid}
            src={nearHotSpotInfo.screenshotUrl}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        ) : (
          <video
            src={screenRecordingUrl}
            controls={false}
            className="w-full h-full"
          />
        )}
        <div className=" absolute inset-0 backdrop-blur-md bg-[#ffffffb3] px-10">
          <ChapterEditor key={stepInfo.uid} stepInfo={stepInfo} />
        </div>
      </div>
    );
  } else if (stepInfo.type === "hotspot") {
    if (width) {
      const { w, h, x, y, title, align } = stepInfo;
      const ratio = width / w;
      conent = (
        <div className="w-full h-full relative">
          <img
            src={stepInfo.screenshotUrl}
            alt=""
            className="w-full h-full object-cover select-none pointer-events-none"
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
