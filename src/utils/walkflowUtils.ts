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
