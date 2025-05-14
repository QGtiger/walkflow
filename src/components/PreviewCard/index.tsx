import { useCreation, useSize } from "ahooks";
import classNames from "classnames";
import {
  PreviewCardModel,
  type PreviewCardProps,
  InteractionState,
} from "./model";
import Video from "./components/Video";
import Chapter from "./components/Chapter";
import HotSpot from "./components/HotSpot";

function PreviewCard() {
  const {
    schema,
    className,
    ratio,
    hasBg,
    targetStepInfo,
    state,
    jumpStepDestination,
  } = PreviewCardModel.useModel();
  const { version = "1.0", designer, config } = schema;
  const canvasSize = useSize(() => document.querySelector("#preview-card"));

  if (version !== "1.0") {
    return <div>不支持的版本</div>;
  }
  const height = canvasSize ? `${canvasSize.width / ratio}px` : "0px";

  const showStep = state !== InteractionState.Playing;
  const cls = showStep ? "opacity-100" : "opacity-0 pointer-events-none";

  return (
    <div
      className={classNames(
        "w-full  rounded-xl  flex items-center justify-center",
        hasBg ? "bg-cover bg-center py-[40px] px-[34px]" : "",
        className
      )}
      style={{
        backgroundImage: hasBg ? `url(${designer.background})` : "none",
      }}
    >
      <div
        id="preview-card"
        className="w-full  bg-white  relative  shadow-2xl rounded-md overflow-hidden"
        style={{
          height,
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
