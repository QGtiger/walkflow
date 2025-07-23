import { useEffect, useRef, type PropsWithChildren } from "react";
import { useReactive } from "ahooks";
import { Image } from "antd";

export default function PreviewWarp(
  props: PropsWithChildren<{
    classNames?: string;
  }>
) {
  const viewModel = useReactive({
    previewVisible: false,
    previewSrc: "",
  });
  const warpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const warpEle = warpRef.current;
    if (!warpEle) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
        viewModel.previewSrc = (target as any).src;
        viewModel.previewVisible = true;
      }
    };

    warpEle.addEventListener("click", handleClick);

    return () => {
      warpEle.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={props.classNames} ref={warpRef}>
      {props.children}
      <Image
        style={{ display: "none" }}
        preview={{
          visible: viewModel.previewVisible,
          src: viewModel.previewSrc,
          onVisibleChange: (value) => {
            viewModel.previewVisible = value;
          },
        }}
      />
    </div>
  );
}
