import type { PluginInfo } from "@toast-ui/editor";
import { createRoot, type Root } from "react-dom/client";
import HotSpotWithPreview from "./HotSpotWithPreview";

const hotspotMap: Record<string, Root> = {};

// let timer: NodeJS.Timeout | null = null;

function generateId() {
  return `hotspot-${Math.random().toString(36).substr(2, 10)}`;
}

// function clearTimer() {
//   if (timer) {
//     clearTimeout(timer);
//     timer = null;
//   }
// }

function destroyHotSpotMap() {
  Object.keys(hotspotMap).forEach((id) => {
    const container = document.querySelector<HTMLElement>(
      `[data-hotspot-id=${id}]`
    );

    if (!container) {
      hotspotMap[id].unmount();

      delete hotspotMap[id];
    }
  });
}

function renderHotSpot(id: string, content: string) {
  const spotData = JSON.parse(content);
  const ele = document.querySelector(`[data-hotspot-id="${id}"]`);
  if (!ele) return;
  destroyHotSpotMap();
  const root = createRoot(ele);
  root.render(<HotSpotWithPreview hotSpotData={spotData} />);
  // console.log("renderHotSpot", id, spotData, ele, root);
  hotspotMap[id] = root;
}

export function HotSpotPlugin(): PluginInfo {
  return {
    toHTMLRenderers: {
      hotspot: (node) => {
        const id = generateId();

        setTimeout(() => {
          renderHotSpot(id, node.literal!);
        }, 0);

        // clearTimer();
        return [
          {
            type: "openTag",
            tagName: "div",
            outerNewLine: true,
            attributes: { "data-hotspot-id": id },
          },
          { type: "closeTag", tagName: "div", outerNewLine: true },
        ];
      },
    },
  };
}
