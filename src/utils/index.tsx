export function generateUUID(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function getShareUrl(flowId: string): string {
  return `${window.location.origin}/share/${flowId}`;
}

export function copy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
