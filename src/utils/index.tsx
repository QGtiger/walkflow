import { v4 as uuidv4 } from "uuid";

export function generateUuid() {
  return uuidv4().replace(/-/g, "");
  const uuidBuffer = Buffer.from(uuidv4().replace(/-/g, ""), "hex");
  const base64Id = uuidBuffer.toString("base64").replace(/=/g, "");
  // .substring(0, 22);
  return base64Id;
}

const basename = "";

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function getShareUrl(flowId: string): string {
  return `${window.location.origin}${basename}/share/${flowId}`;
}

export function getSharePostUrl(flowId: string): string {
  return `${window.location.origin}${basename}/share/${flowId}/post`;
}

export function copy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export async function chatWithLLM(messages: any[], tools = []) {
  const response = await fetch(
    `https://test-console.yingdao.com/ai-infra-api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        tools,
      }),
    }
  );
  return response.json();
}

export async function uploadFile(config: {
  blob: Blob | File;
  name: string;
  uploadUrl: string;
}): Promise<string> {
  const { uploadUrl } = config;
  if (!uploadUrl) {
    throw new Error("未配置上传文件的 URL");
  }

  const formData = new FormData();
  formData.append("file", config.blob);
  formData.append("filename", config.name);

  return fetch(uploadUrl, {
    headers: {
      domain: "front-gw.yingdao.com",
      ContentType: "multipart/form-data",
    },
    method: "POST",
    body: formData,
  })
    .then((r) => r.json())
    .then((r) => r.data.readUrl);
}
