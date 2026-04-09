import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";

const badgeVariants: Variants = {
  initial: (direction: number) => ({
    y: direction > 0 ? 15 : -15,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -15 : 15,
    opacity: 0,
  }),
};

export function RollingBadge({ count }: { count: number }) {
  const prevCount = useRef(count);
  const direction = count > prevCount.current ? 1 : -1;

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  return (
    <span className="relative flex h-5 items-center overflow-hidden bg-slate-900 text-white px-1 py-0.5 rounded-full text-[13px] font-black">
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.span
          key={count}
          custom={direction}
          variants={badgeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
