import {
  type CSSProperties,
  type MouseEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Popover } from "antd";

interface FocusIndicatorProps {
  x: number; // X坐标（单位px）
  y: number; // Y坐标（单位px）
  size?: number; // 指示器大小（直径）
  color?: string; // 光圈颜色
  duration?: number; // 动画周期（毫秒）
  style?: CSSProperties; // 自定义样式

  content: React.ReactNode;
  draggable?: boolean; // 是否可拖拽
  maxX?: number;
  maxY?: number;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  contentStyle?: CSSProperties;
  onClick?: () => void; // 点击事件
}

function getN(n: number, a: [number, number]) {
  if (n < a[0]) {
    return a[0];
  }
  if (n > a[1]) return a[1];
  return n;
}

const FocusIndicator = ({
  x,
  y,
  size = 100,
  color = "rgba(255, 200, 0, 0.8)",
  duration = 1200,
  style,
  content,
  draggable,
  onPositionChange,
  maxX = Infinity,
  maxY = Infinity,
  contentStyle,
  onClick,
}: FocusIndicatorProps) => {
  const focusContainerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  // 防止闪烁
  useLayoutEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  const s = size / 2;

  const onMouseDown: MouseEventHandler = (downEv) => {
    if (!draggable) return;
    const startPosition = position;

    const downPostion = {
      x: downEv.clientX,
      y: downEv.clientY,
    };
    let latestPosition = position;

    function mouseMove(mouseEv: MouseEvent) {
      const offsetPostion = {
        x: mouseEv.clientX - downPostion.x,
        y: mouseEv.clientY - downPostion.y,
      };

      latestPosition = {
        x: getN(startPosition.x + offsetPostion.x, [s, maxX - s]),
        y: getN(startPosition.y + offsetPostion.y, [s, maxY - s]),
      };

      setPosition(latestPosition);
    }

    window.addEventListener("mousemove", mouseMove);

    window.addEventListener(
      "mouseup",
      () => {
        onPositionChange?.(latestPosition);
        window.removeEventListener("mousemove", mouseMove);
      },
      {
        once: true,
      }
    );
  };

  const containerStyle: CSSProperties = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2,
    ...style,
  };

  const pulseStyle = {
    "--pulse-color": color,
    "--animation-duration": `${duration}ms`,
    "--antd-arrow-background-color": color,
  } as CSSProperties;

  return (
    <Popover
      open={!!content}
      content={
        content ? (
          <div style={contentStyle}>
            <span className="text-white whitespace-break-spaces ">
              {content}
            </span>
          </div>
        ) : null
      }
      styles={{
        body: {
          background: "var(--pulse-color)",
        },
        root: pulseStyle,
      }}
      getPopupContainer={() => {
        return focusContainerRef.current || document.body;
      }}
      // placement="bottom"
    >
      <div
        style={{
          ...containerStyle,
          ...pulseStyle,
        }}
        onMouseDown={onMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <div ref={focusContainerRef} className="focus-container cursor-pointer">
          <div className="pulse-ring" style={pulseStyle} />
          <div className="pulse-core" style={pulseStyle} />
        </div>
      </div>
    </Popover>
  );
};

export default FocusIndicator;
