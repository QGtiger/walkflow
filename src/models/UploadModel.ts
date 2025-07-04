import { createCustomModel } from "@/common/createModel";
import { useCreation } from "ahooks";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";

class CountDown {
  private n = 0;
  private target = 0;
  private intervalId: NodeJS.Timeout | null = null;
  constructor(
    private readonly opts: {
      onChange?: (count: number) => void;
    }
  ) {}

  start(target: number) {
    if (target <= this.n) {
      return;
    }
    this.target = target;
    this.count();
  }

  private count() {
    clearInterval(this.intervalId!);
    this.intervalId = setInterval(() => {
      this.n++;
      this.opts.onChange?.(this.n);
      if (this.n >= this.target) {
        this.stop();
      }
    }, 50);
  }

  stop() {
    clearInterval(this.intervalId!);
    this.intervalId = null;
  }
}

export const UploadModel = createCustomModel(() => {
  const [countNum, setCountNum] = useState(0);
  const schemaRef = useRef<any>(null);

  const countDownIns = useCreation(() => {
    return new CountDown({
      onChange: (count) => {
        setCountNum(count);
      },
    });
  }, []);

  useEffect(() => {
    async function fn(ev: MessageEvent<any>) {
      if (ev.data.type === "FROM_EXTENSION") {
        const { data, type } = ev.data.payload;
        if (type === "uploadWalkFlowResource") {
          const { process, schema } = data;
          schemaRef.current = schema;

          const p = Math.min(Math.floor(process * 100), 100);
          countDownIns.start(p);
        } else if (type === "uploadWalkFlowResourceError") {
          message.error(data || "上传失败");
        }
      }
    }

    window.addEventListener("message", fn);
    return () => {
      window.removeEventListener("message", fn);
    };
  }, []);

  return {
    countNum,
    schema: schemaRef.current,
    isUploading: countNum < 100,
  };
});
