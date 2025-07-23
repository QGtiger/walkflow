import { motion } from "framer-motion";

export default function CustomLoading({ scale = 2 }: { scale?: number }) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, scale, 1, 1],
        rotate: [0, 0, 180, 180, 0],
        borderRadius: ["3%", "3%", "50%", "50%", "3%"],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      }}
      className="w-24 h-24 bg-[#7f70f5]"
    />
  );
}
