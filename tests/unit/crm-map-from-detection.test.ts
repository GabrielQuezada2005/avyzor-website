import { describe, expect, it } from "vitest";
import {
  mapLeadDetectionToCrmInput,
  mergeCrmLeadFields,
  shouldPersistCrmLead,
} from "@/lib/crm/map-from-detection";
import type { LeadDetectionRecord } from "@/lib/assistant/lead-detection";
import type { CrmLeadRow } from "@/lib/crm/types";

const sampleRecord: LeadDetectionRecord = {
  sessionId: "session-12345678",
  profile: {
    name: "Max Mustermann",
    company: "Beispiel GmbH",
    email: "max@example.com",
    phone: "+49 170 1234567",
    desiredService: "Premium-Website",
    budget: "5.000 €",
    timeline: "Nächster Monat",
  },
  hasServiceInterest: true,
  serviceInterestLevel: "interested",
  detectedServices: ["Premium-Website"],
  completenessScore: 85,
  messageCount: 2,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-01T10:05:00.000Z",
};

describe("CRM Lead-Mapping", () => {
  it("erkennt CRM-relevante Leads", () => {
    expect(shouldPersistCrmLead(sampleRecord)).toBe(true);
    expect(
      shouldPersistCrmLead({
        ...sampleRecord,
        hasServiceInterest: false,
        profile: {
          name: null,
          company: null,
          email: null,
          phone: null,
          desiredService: null,
          budget: null,
          timeline: null,
        },
      })
    ).toBe(false);
  });

  it("ignoriert reine Preisanfragen ohne Kontaktdaten", () => {
    expect(
      shouldPersistCrmLead({
        ...sampleRecord,
        hasServiceInterest: true,
        serviceInterestLevel: "curious",
        profile: {
          name: null,
          company: null,
          email: null,
          phone: null,
          desiredService: null,
          budget: null,
          timeline: null,
        },
        detectedServices: ["Premium-Website"],
      })
    ).toBe(false);
  });

  it("mappt Lead-Erkennung auf CRM-Eingabedaten", () => {
    const input = mapLeadDetectionToCrmInput(sampleRecord);
    expect(input.sessionId).toBe("session-12345678");
    expect(input.email).toBe("max@example.com");
    expect(input.interestLevel).toBe("interested");
    expect(input.detectedServices).toContain("Premium-Website");
  });

  it("führt bestehende CRM-Felder mit neuen Werten zusammen", () => {
    const existing: CrmLeadRow = {
      id: "lead-1",
      session_id: "session-12345678",
      name: "Alt Name",
      company: null,
      email: "alt@example.com",
      phone: null,
      service: null,
      budget: null,
      timeline: null,
      status: "new",
      source: "assistant",
      interest_level: "curious",
      completeness_score: 20,
      detected_services: [],
      created_at: "2026-08-01T09:00:00.000Z",
      updated_at: "2026-08-01T09:00:00.000Z",
    };

    const merged = mergeCrmLeadFields(
      existing,
      mapLeadDetectionToCrmInput(sampleRecord)
    );

    expect(merged.name).toBe("Max Mustermann");
    expect(merged.email).toBe("max@example.com");
    expect(merged.interest_level).toBe("interested");
  });
});
