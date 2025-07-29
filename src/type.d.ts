interface FlowPostSchema {
  content: string;
}

interface WalkflowDetail {
  flowId: string;
  flowName: string;
  schema: FlowSchemaV1;
  postSchema: FlowPostSchema;
}

interface ExtensionSchemaV1 {
  screenRecordingUrl: string;
  clicks: {
    x: number;
    y: number;
    w: number;
    h: number;
    t: number;
    innerText: string;
    screenshotUrl: string;
  }[];
}

interface ChapterStep {
  uid: string;
  type: "chapter";
  name?: string;
  title?: string;
  subtitle?: string;
  align: "left" | "center" | "right";
  actions: ChapterButtonAction[];
}

interface NextDestinationAction {
  destination: string; // 目标步骤的 uid 包含 next next-by-url
  url?: string; // 如果是 NextStepKeyByUrl，则需要传入 url
}

type ChapterButtonAction = {
  type: "button";
  text: string;
} & NextDestinationAction;

type HotSpotStep = {
  uid: string;
  type: "hotspot";
  name?: string;
  title?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
  align: "left" | "center" | "right";
  screenshotUrl: string;
} & NextDestinationAction;

interface FlowSchemaV1 {
  version: "1.0";
  designer: {
    background?: string;
  };
  config: {
    screenRecordingUrl: string;
    steps: Array<ChapterStep | HotSpotStep>;
  };
}

type TourbitSteps = Array<ChapterStep | HotSpotStep>;

type TourbitStep = ChapterStep | HotSpotStep;
