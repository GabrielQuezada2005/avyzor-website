"use client";

import { cn } from "@/lib/utils";
import { CRM_LEAD_STATUS_LABELS } from "@/lib/crm/constants";
import type { CrmLeadStatus } from "@/lib/crm/types";

const STATUS_STYLES: Record<CrmLeadStatus, string> = {
  neu: "bg-gold-500/15 text-gold-300 border-gold-500/30",
  in_bearbeitung: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  angebot_gesendet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  kunde: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  abgelehnt: "bg-white/5 text-white/50 border-white/10",
};

interface CrmStatusBadgeProps {
  status: CrmLeadStatus;
  className?: string;
}

export function CrmStatusBadge({ status, className }: CrmStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {CRM_LEAD_STATUS_LABELS[status]}
    </span>
  );
}
