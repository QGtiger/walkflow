import FocusIndicator from "@/components/FocusIndicator";
import { useRef } from "react";
import { useSize } from "ahooks";
import classNames from "classnames";

export default function HotSpot({
  stepInfo,
  jump,
  className,
  noPopoverTile = false,
  onClick,
}: {
  stepInfo: HotSpotStep;
  className?: string;
  jump?: (uid: string) => void;
  noPopoverTile?: boolean;
  onClick?: () => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useSize(() => canvasRef.current);
  const canvasWidth = canvasSize?.width || 0;

  const { w, h, x, y, title, align } = stepInfo;
  const ratio = canvasWidth / w;
  return (
    <div
      className={classNames(
        "w-full h-full relative flex justify-center",
        className
      )}
    >
      <div
        className="h-full inline-block relative"
        ref={canvasRef}
        onClick={onClick}
      >
        <img
          src={stepInfo.screenshotUrl}
          alt=""
          className="w-full h-full object-cover select-none"
        />

        <div className=" absolute top-0 left-0 w-full h-full">
          <FocusIndicator
            content={noPopoverTile ? "" : title || "请补充文案"}
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
            onClick={() => {
              jump?.(stepInfo.destination);
            }}
          />
        </div>
      </div>
    </div>
  );
}
