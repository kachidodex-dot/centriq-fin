import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/zentriq-logo.jpeg";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Loader({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="zentriq-loader"
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#05060d] text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(12px)",
            transition: { duration: 0.9, ease: EASE },
          }}
        >
          {/* Ambient gradient lighting */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 50%, rgba(99,102,241,0.25), transparent 70%), radial-gradient(40% 35% at 20% 80%, rgba(56,189,248,0.18), transparent 70%), radial-gradient(40% 35% at 80% 20%, rgba(168,85,247,0.18), transparent 70%)",
            }}
            animate={!reduce ? { opacity: [0.7, 1, 0.7] } : undefined}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Floating particles */}
          {!reduce && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => {
                const left = (i * 53) % 100;
                const top = (i * 37) % 100;
                const delay = (i % 6) * 0.4;
                const dur = 6 + (i % 5);
                return (
                  <motion.span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    animate={{ y: [0, -20, 0], opacity: [0, 0.9, 0] }}
                    transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
                  />
                );
              })}
            </div>
          )}

          {/* Center stage */}
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <div className="relative flex flex-col items-center gap-10">
              {/* Logo cluster */}
              <motion.div
                className="relative flex h-[220px] w-[220px] items-center justify-center"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ scale: 1.08, filter: "blur(8px)", opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(99,102,241,0) 0deg, rgba(99,102,241,0.9) 90deg, rgba(56,189,248,0.7) 180deg, rgba(168,85,247,0) 270deg, rgba(99,102,241,0) 360deg)",
                    mask: "radial-gradient(circle, transparent 62%, black 63%, black 66%, transparent 67%)",
                    WebkitMask:
                      "radial-gradient(circle, transparent 62%, black 63%, black 66%, transparent 67%)",
                  }}
                  animate={!reduce ? { rotate: 360 } : undefined}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                {/* Counter-rotating thin ring */}
                <motion.div
                  className="absolute inset-3 rounded-full border border-white/15"
                  animate={!reduce ? { rotate: -360 } : undefined}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  style={{
                    boxShadow:
                      "inset 0 0 30px rgba(99,102,241,0.15), 0 0 30px rgba(56,189,248,0.08)",
                  }}
                />

                {/* Pulsing halo */}
                <motion.div
                  className="absolute inset-6 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(99,102,241,0.35), transparent 65%)",
                    filter: "blur(18px)",
                  }}
                  animate={!reduce ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] } : undefined}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Logo plate (glassmorphism) */}
                <motion.div
                  className="relative flex h-[128px] w-[128px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(56,189,248,0.18), inset 0 0 30px rgba(99,102,241,0.12)",
                  }}
                  animate={!reduce ? { y: [0, -4, 0] } : undefined}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={logo}
                    alt="Zentriq"
                    className="h-20 w-20 rounded-2xl object-cover"
                    draggable={false}
                  />

                  {/* Light sweep across logo */}
                  {!reduce && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
                      aria-hidden
                    >
                      <motion.div
                        className="absolute -inset-y-2 w-1/3"
                        style={{
                          background:
                            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                          filter: "blur(8px)",
                        }}
                        initial={{ x: "-130%" }}
                        animate={{ x: "230%" }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
                      />
                    </motion.div>
                  )}

                  {/* AI scan line */}
                  {!reduce && (
                    <motion.div
                      className="pointer-events-none absolute inset-x-2 h-px rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(125,211,252,0.95), transparent)",
                        boxShadow: "0 0 12px rgba(125,211,252,0.8)",
                      }}
                      initial={{ top: "10%", opacity: 0 }}
                      animate={{ top: ["10%", "90%", "10%"], opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>

                {/* Orbiting dot */}
                {!reduce && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]" />
                  </motion.div>
                )}
              </motion.div>

              {/* Wordmark + tagline */}
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.5em] text-white/50">
                  Zentriq
                </p>
                <p className="text-sm text-white/70">
                  Calibrating financial intelligence
                </p>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                className="relative h-[2px] w-64 overflow-hidden rounded-full bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(125,211,252,1), rgba(168,85,247,1), transparent)",
                    boxShadow: "0 0 12px rgba(125,211,252,0.8)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "300%" }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Self-managing initial app loader. Shows immediately on mount, then
 * gracefully fades out after the window 'load' event (or a min duration).
 */
export function InitialLoader({ minDuration = 1400 }: { minDuration?: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      timer = setTimeout(() => setVisible(false), remaining);
    };

    if (typeof window !== "undefined" && document.readyState === "complete") {
      finish();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", finish, { once: true });
      // Safety net
      timer = setTimeout(() => setVisible(false), minDuration + 2500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [minDuration]);

  return <Loader visible={visible} />;
}
