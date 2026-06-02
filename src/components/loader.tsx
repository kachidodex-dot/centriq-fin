import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/ryport-logo";

const EASE = [0.22, 1, 0.36, 1] as const;

const logoVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: [1, 1.04, 1],
    transition: { duration: 2, ease: EASE, repeat: Infinity, repeatType: "mirror" as const },
  },
};

export function Loader({ visible: visibleProp }: { visible?: boolean } = {}) {
  const [internalVisible, setInternalVisible] = useState(true);
  useEffect(() => {
    if (visibleProp !== undefined) return;
    const t = setTimeout(() => setInternalVisible(false), 650);
    return () => clearTimeout(t);
  }, [visibleProp]);
  const visible = visibleProp ?? internalVisible;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: EASE } }}
        >
          <motion.div
            className="relative flex items-center justify-center"
            variants={logoVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="absolute inset-0 -m-8 rounded-full bg-primary/20 blur-2xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src={logo} alt="Ryport" className="relative h-20 w-20 object-contain" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
