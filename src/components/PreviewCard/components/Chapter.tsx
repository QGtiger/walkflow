import { Button } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";

export default function Chapter(props: {
  data: ChapterStep;
  className?: string;
  onActionClick?: (action: ChapterButtonAction) => void;
}) {
  const { title, align, subtitle, actions } = props.data;
  const { className, onActionClick } = props;
  return (
    <div
      className={classNames(
        " relative backdrop-blur-md bg-[#ffffffb3] w-full h-full rounded-md overflow-hidden",
        className
      )}
    >
      <div className="h-full  flex flex-col justify-center px-10 gap-2">
        <motion.div
          className="p-0 text-2xl font-semibold"
          style={{
            textAlign: align,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {title}
        </motion.div>
        <motion.div
          className="p-0 whitespace-break-spaces text-sm mb-1"
          style={{
            textAlign: align,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
        >
          {subtitle}
        </motion.div>

        <motion.div
          className={classNames("flex gap-2 ", {
            "flex-col items-center": align === "center",
          })}
          style={{
            justifyContent: align,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
        >
          {actions.map((it, index) => {
            if (it.type === "button") {
              return (
                <Button
                  size="large"
                  type="primary"
                  key={index}
                  onClick={() => {
                    onActionClick?.(it);
                  }}
                >
                  <div className="px-6 text-white text-center">{it.text}</div>
                </Button>
              );
            }
            return "暂不支持类型:" + it.type;
          })}
        </motion.div>
      </div>
    </div>
  );
}
