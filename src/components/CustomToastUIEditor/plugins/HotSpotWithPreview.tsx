import HotSpot from "@/components/PreviewCard/components/HotSpot";
import { useBoolean } from "ahooks";
import { Image } from "antd";

export default function HotSpotWithPreview({
  hotSpotData,
}: {
  hotSpotData: HotSpotStep;
}) {
  const [visible, visibleAction] = useBoolean(false);

  return (
    <div>
      <HotSpot
        stepInfo={hotSpotData}
        noPopoverTile
        onClick={visibleAction.setTrue}
      />

      <Image
        style={{ display: "none" }}
        preview={{
          destroyOnHidden: true,
          visible,
          // src: viewModel.previewSrc,
          onVisibleChange: visibleAction.set,
          imageRender: () => {
            return (
              <div className=" max-w-[90vw]">
                <HotSpot stepInfo={hotSpotData} noPopoverTile />
              </div>
            );
          },
          toolbarRender: () => null,
        }}
      />
    </div>
  );
}
