"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export function AssistantButton({
  isOpen,
  onClick,
  unreadCount = 0,
}: AssistantButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Chat schließen" : "AVYZOR Assistant öffnen"}
      aria-expanded={isOpen}
      className={cn(
        "fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-shadow group",
        isOpen
          ? "bg-dark-700 border border-gold-500/40 shadow-gold"
          : "bg-gold-gradient shadow-gold hover:shadow-gold-lg"
      )}
    >
      <motion.div
        animate={isOpen ? { rotate: 0 } : { rotate: [0, 0] }}
        className="relative"
      >
        <Sparkles
          size={26}
          className={cn(
            isOpen ? "text-gold-400" : "text-dark-900"
          )}
        />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold-200 rounded-full animate-pulse-gold" />
        )}
      </motion.div>

      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gold-500 text-dark-900 text-xs font-bold rounded-full">
          {unreadCount}
        </span>
      )}

      <span className="absolute right-full mr-3 px-3 py-1.5 bg-dark-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gold-500/20">
        KI-Berater
      </span>
    </motion.button>
  );
}
