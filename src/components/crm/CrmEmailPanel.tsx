"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  CRM_EMAIL_STATUS_LABELS,
  CRM_EMAIL_TEMPLATE_OPTIONS,
  type CrmEmailLog,
  type CrmEmailTemplateId,
} from "@/lib/crm/emails";
import {
  fetchCrmEmailLogs,
  formatCrmDate,
  sendCrmLeadEmail,
} from "@/lib/crm/client-api";
import type { CrmLead } from "@/lib/crm/types";

interface CrmEmailPanelProps {
  lead: CrmLead;
}

export function CrmEmailPanel({ lead }: CrmEmailPanelProps) {
  const [templateId, setTemplateId] = useState<CrmEmailTemplateId>("erstkontakt");
  const [logs, setLogs] = useState<CrmEmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCrmEmailLogs(lead.id);
      setLogs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "E-Mail-Protokoll konnte nicht geladen werden."
      );
    } finally {
      setLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  async function handleSend() {
    if (!lead.email?.trim()) {
      setError("Dieser Lead hat keine E-Mail-Adresse.");
      return;
    }

    setSending(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await sendCrmLeadEmail(lead.id, templateId);
      setFeedback(result.message);
      setLogs((current) => [result.log, ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "E-Mail konnte nicht gesendet werden.");
    } finally {
      setSending(false);
    }
  }

  const selectedTemplate = CRM_EMAIL_TEMPLATE_OPTIONS.find(
    (item) => item.id === templateId
  );

  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-400/80">
        E-Mail
      </h3>

      {!lead.email?.trim() ? (
        <p className="text-sm text-white/50">
          Keine E-Mail-Adresse hinterlegt – Versand nicht möglich.
        </p>
      ) : (
        <div className="space-y-3 rounded-xl border border-white/10 bg-dark-900/50 p-4">
          <div className="flex items-center gap-2 text-xs text-white/45">
            <Mail className="h-3.5 w-3.5" />
            <span>An: {lead.email}</span>
          </div>

          <Select
            id={`email-template-${lead.id}`}
            label="Vorlage"
            value={templateId}
            disabled={sending}
            onChange={(e) => setTemplateId(e.target.value as CrmEmailTemplateId)}
            options={CRM_EMAIL_TEMPLATE_OPTIONS.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
          />

          {selectedTemplate?.id === "angebot" && (
            <p className="text-xs text-white/45">
              Sendet das Angebot als PDF-Anhang (sofern vorhanden).
            </p>
          )}

          <Button
            className="w-full"
            onClick={() => void handleSend()}
            isLoading={sending}
            disabled={sending}
          >
            <Send className="h-4 w-4" />
            E-Mail senden
          </Button>

          {feedback && (
            <p className="text-xs text-emerald-400" role="status">
              {feedback}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-wider text-white/40">
          Protokoll
        </p>

        {loading && logs.length === 0 ? (
          <p className="text-sm text-white/45">Protokoll wird geladen…</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-white/45">Noch keine E-Mails gesendet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="rounded-lg border border-white/10 bg-dark-900/40 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-white/80">{log.subject}</span>
                  <span className="text-white/40">
                    {CRM_EMAIL_STATUS_LABELS[log.status] ?? log.status}
                  </span>
                </div>
                <div className="mt-1 text-white/45">
                  {formatCrmDate(log.createdAt)}
                  {log.hasAttachment && log.attachmentName
                    ? ` · Anhang: ${log.attachmentName}`
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
