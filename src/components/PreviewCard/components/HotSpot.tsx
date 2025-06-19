import FocusIndicator from "@/components/FocusIndicator";
import { useRef } from "react";
import { useSize } from "ahooks";
import classNames from "classnames";

export default function HotSpot({
  stepInfo,
  jump,
  className,
}: {
  stepInfo: HotSpotStep;
  className?: string;
  jump?: (uid: string) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useSize(() => canvasRef.current);
  const canvasWidth = canvasSize?.width || 0;

  const { w, h, x, y, title, align } = stepInfo;
  const ratio = canvasWidth / w;
  return (
    <div
      className={classNames("w-full h-full relative ", className)}
      ref={canvasRef}
    >
      <img
        src={stepInfo.screenshotUrl}
        alt=""
        className="w-full h-full object-cover select-none"
      />
      <div className=" absolute top-0 left-0 w-full h-full">
        <FocusIndicator
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
          onClick={() => {
            jump?.(stepInfo.destination);
          }}
        />
      </div>
    </div>
  );
}
