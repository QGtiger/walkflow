import { generateUuid } from "@/utils";

export const NextStepKey = "next";

export function generateDefaultChapterStep(): ChapterStep {
  return {
    uid: generateUuid(),
    type: "chapter",
    name: "新章节",
    title: "新章节标题",
    subtitle: "新章节副标题",
    align: "left",
    actions: [
      {
        type: "button",
        text: "按钮",
        destination: NextStepKey,
      },
    ],
  };
}
