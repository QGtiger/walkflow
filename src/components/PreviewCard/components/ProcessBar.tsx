import { useBoolean, useCreation } from "ahooks";
import { PreviewCardModel } from "../model";
import { useEffect, useRef, useState } from "react";
import { theme } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";

const maxCount = Math.floor(window.innerWidth / 120);

function useProcess() {
  const { num: actionNum, steps } = PreviewCardModel.useModel();
  const total = steps.length;
  const current = actionNum % total;
  const totalPages = Math.ceil(total / maxCount);

  const [page, setPage] = useState(() => {
    return Math.floor(current / maxCount);
  });

  const next = () => {
    setPage((prevPage) => {
      const newPage = Math.min(totalPages - 1, prevPage + 1);
      return newPage;
    });
  };

  const prev = () => {
    setPage((prevPage) => {
      const newPage = Math.max(0, prevPage - 1);
      return newPage;
    });
  };

  let start = page * maxCount;
  let end = start + maxCount - 1;
  if (end >= total - 1) {
    end = total - 1;
    start = Math.max(0, end - maxCount + 1);
  }
  const renderNumList = Array.from(
    { length: end - start + 1 },
    (_, i) => i + start
  );

  // useEffect(() => {
  //   if (current < start) {
  //     jumpStepByNum(start);
  //   }
  //   if (current > end) {
  //     jumpStepByNum(end);
  //   }
  // }, [current, start, end]);

  return {
    start,
    end,
    total,
    current,
    next,
    prev,
    renderNumList,
  };
}

function BarItem({
  onClick,
  active,
  className,
  uid,
}: {
  onClick?: () => void;
  active?: boolean;
  className?: string;
  uid: string;
}) {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <div
      className="item w-1 flex-1  group h-3 flex items-center justify-center cursor-pointer relative"
      onClick={onClick}
    >
      <motion.div
        className={classNames(
          "rounded-full  h-1.5 group-hover:h-3 transition-all w-full",
          className
        )}
        style={{
          background: active ? colorPrimary : "#f3f4f6",
        }}
        data-component-uid={uid}
      ></motion.div>
    </div>
  );
}

export default function ProcessBar({ height }: { height: number }) {
  const { start, end, total, current, next, prev, renderNumList } =
    useProcess();
  const { jumpStepByNum, steps, getStep } = PreviewCardModel.useModel();

  const [isShowProcessBar, isShowProcessBarActon] = useBoolean(false);
  const [hoverUid, setHoverUid] = useState("");
  const stepItem = hoverUid && getStep(hoverUid).step;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      // 通过 e.nativeEvent.composedPath() 获取到鼠标悬停的元素 冒泡的元素列表
      const path = e.composedPath();

      for (const element of path) {
        const ele = element as HTMLElement;

        const componentId = ele.dataset?.componentUid;
        if (componentId) {
          setHoverUid(componentId);
          return;
        }
      }
      setHoverUid("");
    };
    ref.current?.addEventListener("mouseover", handleMouseOver);
    return () => {
      ref.current?.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const stepThumbnailWidth = 230; // Default width for the tooltip
  useCreation(() => {
    const hoverDom = ref.current?.querySelector(
      `[data-component-uid="${hoverUid}"]`
    );
    if (hoverDom) {
      const rect = hoverDom.getBoundingClientRect();
      const containerRect = ref.current?.getBoundingClientRect();
      if (containerRect && rect) {
        const offsetX =
          rect.left -
          containerRect.left -
          (stepThumbnailWidth - rect.width) / 2; // Center the tooltip
        let x = Math.max(20, offsetX);
        if (x + stepThumbnailWidth > containerRect.width) {
          x = containerRect.width - stepThumbnailWidth - 20; // Ensure it doesn't overflow the right edge
        }
        ref.current?.style.setProperty("--hover-offset-x", `${x}px`);
      }
    }
  }, [hoverUid]);

  return (
    <div
      className={classNames(" relative w-full transition-all duration-500", {
        " opacity-0": !isShowProcessBar,
      })}
      onMouseEnter={isShowProcessBarActon.setTrue}
      onMouseLeave={isShowProcessBarActon.setFalse}
      ref={ref}
    >
      <div
        className=" absolute h-[240px]  w-full bottom-0 pointer-events-none"
        style={{
          background:
            "rgba(0, 0, 0, 0) linear-gradient(rgba(255, 255, 255, 0), rgba(17, 24, 39, 0.1), rgba(17, 24, 39, 0.7)) repeat scroll 0% 0% / auto padding-box border-box",
        }}
      ></div>
      <div
        className=" relative  flex items-center justify-center"
        style={{ height: height }}
      >
        <div className=" relative w-full flex items-center justify-center h-full px-6">
          <div className="flex items-center gap-2 w-full">
            {start > 0 && (
              <div className="cursor-pointer flex gap-1 py-2" onClick={prev}>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
              </div>
            )}
            {renderNumList.map((num) => {
              return (
                <BarItem
                  key={num}
                  onClick={() => {
                    jumpStepByNum(num);
                  }}
                  active={current >= num}
                  uid={steps[num].uid}
                />
              );
            })}
            {end < total - 1 && (
              <div className="cursor-pointer flex gap-1 py-2" onClick={next}>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
                <div className="w-1 h-1 rounded-full bg-[#f3f4f6]"></div>
              </div>
            )}
          </div>
          {stepItem && (
            <>
              {stepItem.type === "hotspot" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className=" absolute  h-[150px] rounded-md shadow-md border border-gray-400 border-solid pointer-events-none"
                  style={{
                    backgroundImage: `url(${stepItem.screenshotUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    bottom: height / 2 + 25,
                    left: `calc(var(--hover-offset-x, 0px))`, // Center the tooltip
                    width: stepThumbnailWidth,
                  }}
                ></motion.div>
              )}
              {stepItem.type === "chapter" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className=" absolute text-xs text-white bg-black bg-opacity-70 p-2 rounded-md shadow-md leading-6 pointer-events-none"
                  style={{
                    bottom: height / 2 + 25,
                    left: `calc(var(--hover-offset-x, 0px))`, // Center the tooltip
                    width: stepThumbnailWidth,
                  }}
                >
                  <div>{stepItem.title}</div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
