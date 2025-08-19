import { deepClone } from "@/utils";

const objectURLCacheList: string[] = [];
function createCustomObjectURL(blob: Blob): string {
  // 如果不存在，创建新的 Blob URL 并存入缓存
  const blobUrl = URL.createObjectURL(blob);
  objectURLCacheList.push(blobUrl);
  return blobUrl;
}

function clearObjectURLs() {
  // 清理所有 Blob URL
  objectURLCacheList.forEach((url) => URL.revokeObjectURL(url));
  objectURLCacheList.length = 0; // 清空缓存列表
}

export function getStepByUid(
  uid: string,
  steps: TourbitSteps
): {
  index: number;
  step: TourbitStep | undefined;
} {
  const index = steps.findIndex((s) => s.uid === uid);
  if (index === -1) {
    return { index: -1, step: undefined };
  }
  return { index, step: steps[index] };
}

export function getStepName(step: any, index: number) {
  return `${step.name || step.title || `步骤${index}`}`;
}

export const getHotspotStepNearBy = (
  uid: string,
  steps: TourbitSteps
): HotSpotStep | undefined => {
  const index = steps.findIndex((s) => s.uid === uid);
  if (index == -1) return;
  const item = steps[index];
  if (item.type === "hotspot") {
    return item;
  }
  let i = index - 1;
  let direction = -1; // 向前查找
  while (true) {
    if (i < 0) {
      direction = 1; // 如果到头了，向后查找
      i = index + 1;
    }
    if (i >= steps.length) {
      return undefined; // 如果到尾了，返回 undefined
    }
    const s = steps[i];
    if (s.type === "hotspot") {
      return s;
    }
    i += direction; // 向前或向后查找
  }
};

function fetchResourceWithBlobUrl(
  url: string,
  options?: RequestInit
): Promise<{ blobUrl: string; response: Response }> {
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      console.log("Fetched resource:", url);
      const blobUrl = createCustomObjectURL(blob);
      return { blobUrl, response: new Response(blob) };
    });
}

export async function preloadSchemaResources(
  schema: FlowSchemaV1
): Promise<FlowSchemaV1> {
  clearObjectURLs(); // 清理之前的 Blob URL 缓存
  const cloneSchema = deepClone(schema);
  const { designer, config } = cloneSchema;

  await Promise.all([
    designer.background
      ? fetchResourceWithBlobUrl(designer.background).then(({ blobUrl }) => {
          designer.background = blobUrl;
        })
      : Promise.resolve(),
    config.screenRecordingUrl
      ? fetchResourceWithBlobUrl(config.screenRecordingUrl).then(
          ({ blobUrl }) => {
            config.screenRecordingUrl = blobUrl;
          }
        )
      : Promise.resolve(),
    ...config.steps.reduce((promises, step) => {
      if (step.type === "hotspot" && step.screenshotUrl) {
        promises.push(
          fetchResourceWithBlobUrl(step.screenshotUrl).then(({ blobUrl }) => {
            step.screenshotUrl = blobUrl;
          })
        );
      }
      return promises;
    }, [] as Promise<void>[]), // Assuming steps may have resources to preload
  ]);

  return cloneSchema;
}
