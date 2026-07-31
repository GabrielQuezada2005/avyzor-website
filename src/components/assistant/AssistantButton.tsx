"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AssistantButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function AssistantButton({ isOpen, onClick }: AssistantButtonProps) {
  const t = useTranslations("assistant");

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isOpen ? t("buttons.close") : t("buttons.open")}
      aria-expanded={isOpen}
      className={cn(
        "fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full transition-shadow duration-300 group",
        isOpen
          ? "bg-dark-800 border border-gold-500/40 shadow-gold"
          : "bg-gold-gradient shadow-gold hover:shadow-gold-lg animate-pulse-gold"
      )}
    >
      <span className="absolute inset-0 rounded-full bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {isOpen ? (
          <X size={24} className="text-gold-400" />
        ) : (
          <MessageCircle size={26} className="text-dark-900" strokeWidth={2.25} />
        )}
      </motion.div>

      {!isOpen && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-200 rounded-full ring-2 ring-dark-900" />
      )}

      <span className="absolute right-full mr-3 px-3 py-1.5 bg-dark-800/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gold-500/20 backdrop-blur-sm">
        {t("buttons.tooltip")}
      </span>
    </motion.button>
  );
}
