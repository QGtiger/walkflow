import { useCreation, useReactive, useSize } from "ahooks";
import classNames from "classnames";
import {
  PreviewCardModel,
  type PreviewCardProps,
  InteractionState,
} from "./model";
import Video from "./components/Video";
import Chapter from "./components/Chapter";
import HotSpot from "./components/HotSpot";
import ProcessBar from "./components/ProcessBar";

function PreviewCard() {
  const {
    schema,
    className,
    ratio,
    hasBg,
    targetStepInfo,
    state,
    jumpStepDestination,
    embed,
    loading,
  } = PreviewCardModel.useModel();
  const { version = "1.0", designer } = schema;
  const canvasSize = useSize(() => document.querySelector("#preview-wrapper"));
  const padding = embed ? 40 : 80;

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
  const processBarHeight = Math.min(100, height * 0.15);

  const showStep = state !== InteractionState.Playing;
  const cls = showStep ? "opacity-100" : "opacity-0 pointer-events-none";

  const hiddenProcess = useCreation(() => {
    if (targetStepInfo.type === "hotspot") {
      const r = height / targetStepInfo.h;
      const sy = targetStepInfo.y * r;
      return height - sy < processBarHeight;
    }
  }, [targetStepInfo, height]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        资源预加载中...
      </div>
    );
  }

  if (version !== "1.0") {
    return <div>不支持的版本</div>;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div id="preview-wrapper" className=" absolute inset-0"></div>
      <div
        className={classNames(
          "rounded-xl  flex items-center justify-center",
          hasBg ? "bg-cover bg-center" : "",
          className
        )}
        style={{
          backgroundImage: hasBg ? `url(${designer.background})` : "none",
          padding: `${padding / 2}px`,
        }}
      >
        <div
          id="preview-card"
          className="w-full  bg-white  relative  shadow-2xl rounded-md overflow-hidden"
          style={{
            height,
            width,
          }}
        >
          <Video />

          <div
            className={classNames(
              " absolute inset-0 transition-all ease-out duration-300",
              cls
            )}
          >
            {targetStepInfo.type === "hotspot" && (
              <HotSpot
                className={cls}
                stepInfo={targetStepInfo}
                jump={jumpStepDestination}
              />
            )}
            {targetStepInfo.type === "chapter" && (
              <Chapter
                className={cls}
                data={targetStepInfo}
                jump={jumpStepDestination}
              />
            )}
          </div>

          <div className={classNames(" absolute bottom-0 left-0 w-full")}>
            {!hiddenProcess && <ProcessBar height={processBarHeight} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default (props: PreviewCardProps) => {
  const v = useCreation(() => {
    return props;
  }, [JSON.stringify(props)]);

  return (
    <PreviewCardModel.Provider value={v}>
      <PreviewCard />
    </PreviewCardModel.Provider>
  );
};
