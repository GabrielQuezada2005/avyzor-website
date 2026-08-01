import "server-only";

import { CRM_LEAD_STATUS_LABELS } from "@/lib/crm/constants";
import { getCrmLeadById } from "@/lib/crm/repository.server";
import { listCrmEmailLogsByLeadId } from "@/lib/crm/emails/log-repository.server";
import { getCrmQuoteByLeadId } from "@/lib/crm/quotes/repository.server";
import { getAppointmentsByLeadId } from "@/lib/booking/repository.server";
import type {
  PortalAppointmentView,
  PortalDashboardData,
  PortalInvoiceView,
  PortalMessageView,
  PortalOfferView,
  PortalProjectView,
  PortalSession,
} from "./types";

function buildPlaceholderInvoices(): PortalInvoiceView[] {
  return [
    {
      id: "placeholder-1",
      invoiceNumber: "RE-2026-0001",
      amount: 0,
      currency: "EUR",
      status: "draft",
      dueDate: null,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getPortalDataForSession(
  session: PortalSession
): Promise<PortalDashboardData> {
  const leadId = session.leadId;

  let offers: PortalOfferView[] = [];
  let appointments: PortalAppointmentView[] = [];
  let project: PortalProjectView | null = null;
  let messages: PortalMessageView[] = [];

  if (leadId) {
    const quote = await getCrmQuoteByLeadId(leadId);
    if (quote) {
      offers = [
        {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          serviceTitle: quote.draft.serviceTitle,
          priceAmount: quote.draft.priceAmount,
          priceCurrency: quote.draft.priceCurrency,
          validUntil: quote.draft.validUntil,
          status: quote.status,
          createdAt: quote.createdAt,
        },
      ];
    }

    const appts = await getAppointmentsByLeadId(leadId);
    appointments = appts.map((item) => ({
      id: item.id,
      scheduledDate: item.scheduledDate,
      scheduledTime: item.scheduledTime,
      service: item.service,
      status: item.status,
      timezone: item.timezone,
    }));

    const lead = await getCrmLeadById(leadId);
    if (lead) {
      project = {
        leadId: lead.id,
        status: lead.status,
        statusLabel: CRM_LEAD_STATUS_LABELS[lead.status],
        service: lead.service,
        completenessScore: lead.completenessScore,
        timeline: lead.timeline,
        updatedAt: lead.updatedAt,
      };
    }

    const logs = await listCrmEmailLogsByLeadId(leadId);
    messages = logs.map((log) => ({
      id: log.id,
      subject: log.subject,
      templateId: log.templateId,
      status: log.status,
      createdAt: log.createdAt,
      preview: log.bodyPreview,
    }));
  }

  return {
    user: session,
    offers,
    appointments,
    invoices: buildPlaceholderInvoices(),
    project,
    messages,
  };
}
