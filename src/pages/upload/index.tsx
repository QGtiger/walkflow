import { walkflowRequest } from '@/api/walkflowApi';
import CustomHeader from '@/components/CustomHeader';
import { AuthLoginLayout } from '@/Layouts/AuthLogin';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

class CountDown {
  private n = 0;
  private target = 0;
  private intervalId: NodeJS.Timeout | null = null;
  constructor(
    private readonly opts: {
      onChange?: (count: number) => void;
    },
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

export default function Upload() {
  const [countNum, setCountNum] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    // 引用
    const ref = {
      flowId: '',
    };

    const countDownIns = new CountDown({
      onChange: (count) => {
        setCountNum(count);
        if (count >= 100) {
          ref.flowId &&
            nav(`/flow/${ref.flowId}`, {
              replace: true,
            });
        }
      },
    });

    async function fn(ev: MessageEvent<any>) {
      if (ev.data.type === 'FROM_EXTENSION') {
        const { data, type } = ev.data.payload;
        if (type === 'uploadWalkFlowResource') {
          const { process, schema } = data;
          console.log('process', schema, process);

          let max = 90;
          const p = Math.min(Math.floor(process * 100), max);
          countDownIns.start(p);

          if (p >= max) {
            const { data } = await walkflowRequest<{
              flowId: string;
            }>({
              url: '/create',
              method: 'POST',
              data: {
                schema,
              },
            });
            if (data) {
              ref.flowId = data.flowId;
              countDownIns.start(100);
            }
          }
        }
      }
    }

    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);

  return (
    <AuthLoginLayout>
      <div className="flex flex-col h-screen">
        <CustomHeader />
        <main className="flex-1 flex justify-center items-center bg-walkflow-gray">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ['3%', '3%', '50%', '50%', '3%'],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="w-24 h-24 bg-[#7f70f5]"
            />
            <div className="mt-24 space-y-2 text text-gray-500">
              <div className="text text-gray-500">Wating for upload data...</div>
              <div className=" text-center">{countNum}%</div>
            </div>
          </div>
        </main>
      </div>
    </AuthLoginLayout>
  );
}
