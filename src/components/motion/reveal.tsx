import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const EASE = [0.22, 1, 0.36, 1] as const;

function getOffset(direction: Direction, distance: number) {
  switch (direction) {
    case "up": return { y: distance };
    case "down": return { y: -distance };
    case "left": return { x: distance };
    case "right": return { x: -distance };
    default: return {};
  }
}

export function Reveal({
  children,
  direction = "up",
  distance = 16,
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  amount = 0.15,
  as: Tag = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  as?: any;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? {} : getOffset(direction, distance);
  const MotionTag = motion(Tag);
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -5% 0px" }}
      transition={{ duration: reduce ? 0 : duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0,
  once = true,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -5% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = "up",
  distance = 14,
  duration = 0.5,
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? {} : getOffset(direction, distance);
  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: reduce ? 0 : duration, ease: EASE as any } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

export function FloatY({ children, className, amplitude = 6, duration = 8 }: { children: ReactNode; className?: string; amplitude?: number; duration?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}