import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/zentriq-logo.jpeg";

const EASE = [0.22, 1, 0.36, 1] as const;

const ringVariant: Variants = {
  hidden: { opacity: 0, scale: 0.68 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
};

const logoVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: [1, 1.02, 1],
    transition: { duration: 1.8, ease: EASE, repeat: Infinity, repeatType: "mirror" as const },
  },
};

const dotVariant: Variants = {
  hidden: { opacity: 0.2, y: 0 },
  visible: (index: number) => ({
    opacity: [0.2, 1, 0.2],
    y: [0, -10, 0],
    transition: {
      duration: 1.4,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay: index * 0.15,
    },
  }),
};

export function Loader({ visible: visibleProp }: { visible?: boolean } = {}) {
  const reduceMotion = useReducedMotion();
  const [internalVisible, setInternalVisible] = useState(true);
  useEffect(() => {
    if (visibleProp !== undefined) return;
    const t = setTimeout(() => setInternalVisible(false), 1400);
    return () => clearTimeout(t);
  }, [visibleProp]);
  const visible = visibleProp ?? internalVisible;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/95 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          transition={{ duration: 0.35 }}
        >
          <div className="relative flex min-h-[calc(100vh-2rem)] w-full max-w-4xl items-center justify-center px-6 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.14),_transparent_25%),radial-gradient(circle_at_70%_70%,_rgba(56,189,248,0.16),_transparent_32%)]" />
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_50px_120px_rgba(15,23,42,0.35)]" />
            <div className="relative flex w-full max-w-2xl flex-col items-center gap-8 rounded-[2.5rem] border border-white/10 bg-slate-950/80 p-10 shadow-[0_40px_90px_rgba(15,23,42,0.35)] backdrop-blur-3xl">
              <motion.div
                className="relative flex h-[180px] w-[180px] items-center justify-center"
                variants={ringVariant}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-400/20 shadow-[0_0_80px_rgba(56,189,248,0.22)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-400/10 via-sky-500/10 to-transparent blur-2xl"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="relative flex h-[124px] w-[124px] items-center justify-center rounded-[2rem] bg-slate-950/90 shadow-[0_20px_90px_rgba(56,189,248,0.18)] ring-1 ring-cyan-400/20"
                  variants={logoVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <img src={logo} alt="Zentriq" className="h-16 w-16 rounded-3xl object-contain" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/10"
                  animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <div className="relative z-10 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Loading Zentriq</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">Preparing your financial dashboard</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={dotVariant}
                    initial="hidden"
                    animate="visible"
                    className="h-2.5 w-2.5 rounded-full bg-sky-300"
                  />
                ))}
              </div>
              <motion.div
                className="absolute inset-x-0 bottom-8 mx-auto h-1.5 w-64 rounded-full bg-white/10 blur-sm"
                animate={!reduceMotion ? { scaleX: [0.7, 1, 0.7] } : undefined}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
