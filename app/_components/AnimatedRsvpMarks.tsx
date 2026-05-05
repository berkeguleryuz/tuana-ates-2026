"use client";

import { motion } from "framer-motion";

export function AnimatedCheckMark({ active }: { active: boolean }) {
  return (
    <motion.svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      animate={{ scale: active ? 1.06 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle
        cx="16"
        cy="16"
        r="13"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={false}
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
      />
      <motion.path
        d="M10 16.5 l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{
          duration: 0.4,
          delay: active ? 0.1 : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </motion.svg>
  );
}

export function AnimatedCrossMark({ active }: { active: boolean }) {
  return (
    <motion.svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      animate={{ scale: active ? 1.06 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.circle
        cx="16"
        cy="16"
        r="13"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        initial={false}
        animate={{ opacity: active ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
      />
      <motion.path
        d="M11 11 L21 21"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: active ? 0.1 : 0 }}
      />
      <motion.path
        d="M21 11 L11 21"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.3, delay: active ? 0.25 : 0 }}
      />
    </motion.svg>
  );
}
