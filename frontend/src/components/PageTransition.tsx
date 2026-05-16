import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.main
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
  >
    {children}
  </motion.main>
);
