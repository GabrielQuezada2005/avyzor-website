"use client";

/**
 * Voice Mode – Aufnahme-Feedback
 *
 * Zeigt Zwischen-Transkript und Status während der Spracherkennung.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";
import { useTranslations } from "next-intl";
import { useVoice } from "./VoiceContext";

export function VoiceRecordingIndicator() {
  const t = useTranslations("voice");
  const { recordingState, interimTranscript, isVoiceInputActive } = useVoice();

  const isVisible =
    isVoiceInputActive &&
    (recordingState === "recording" || recordingState === "processing");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="overflow-hidden"
        >
          <div className="flex items-start gap-2 px-3 py-2 mb-2 rounded-xl bg-gold-500/10 border border-gold-500/20">
            <motion.span
              animate={recordingState === "recording" ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-0.5 text-gold-400"
            >
              <Mic size={14} aria-hidden="true" />
            </motion.span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gold-400/80 font-medium mb-0.5">
                {recordingState === "processing"
                  ? t("recording.processing")
                  : t("recording.listening")}
              </p>
              {interimTranscript && (
                <p className="text-xs text-white/70 truncate">
                  {interimTranscript}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
