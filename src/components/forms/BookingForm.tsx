"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SERVICE_IDS } from "@/lib/i18n/structures";
import { SITE_CONFIG } from "@/lib/constants";
import {
  createBookingFormSchema,
  zodErrorsToFieldRecord,
} from "@/lib/i18n/form-schemas.client";
import { Calendar, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

export function BookingForm() {
  const t = useTranslations("forms.booking");
  const tCommon = useTranslations("forms.common");
  const tValidation = useTranslations("forms.validation");
  const tServices = useTranslations("services.items");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [minDate, setMinDate] = useState("");

  const schema = useMemo(
    () =>
      createBookingFormSchema({
        nameMin: tValidation("nameMin"),
        emailInvalid: tValidation("emailInvalid"),
        messageMin: tValidation("messageMin"),
        serviceRequired: tValidation("serviceRequired"),
        dateRequired: tValidation("dateRequired"),
        timeRequired: tValidation("timeRequired"),
        consentRequired: tValidation("consentRequired"),
      }),
    [tValidation]
  );

  const serviceOptions = [
    { value: "", label: t("service.placeholder") },
    ...SERVICE_IDS.map((id) => ({
      value: tServices(`${id}.title`),
      label: tServices(`${id}.title`),
    })),
    { value: t("service.freeConsultation"), label: t("service.freeConsultation") },
  ];

  const timeSuffix = t("time.suffix");
  const timeOptions = [
    { value: "", label: t("time.placeholder") },
    ...availableSlots.map((slot) => ({
      value: slot,
      label: timeSuffix ? `${slot} ${timeSuffix}` : slot,
    })),
  ];

  useEffect(() => {
    async function loadBounds() {
      try {
        const res = await fetch("/api/booking/availability");
        const data = (await res.json()) as {
          bounds?: { minDate: string };
        };
        if (data.bounds?.minDate) {
          setMinDate(data.bounds.minDate);
        }
      } catch {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setMinDate(tomorrow.toISOString().split("T")[0]);
      }
    }

    void loadBounds();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    async function loadSlots() {
      setSlotsLoading(true);
      try {
        const res = await fetch(
          `/api/booking/availability?date=${encodeURIComponent(selectedDate)}`
        );
        const data = (await res.json()) as { slots?: string[] };
        setAvailableSlots(data.slots ?? []);
      } catch {
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }

    void loadSlots();
  }, [selectedDate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrors({});
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      consent: formData.get("consent") === "true",
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setErrors(zodErrorsToFieldRecord(parsed.error.issues));
      setStatus("error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        setErrorMessage(result.error ?? t("error"));
        setStatus("error");
        return;
      }

      setStatus("success");
      setSelectedDate("");
      setAvailableSlots([]);
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrorMessage(tCommon("networkError"));
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
        <p className="text-sm text-white/70 mb-3">{t("calendlyHint")}</p>
        <a
          href={SITE_CONFIG.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
        >
          <Calendar size={16} aria-hidden="true" />
          {t("calendlyLink")}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      <details className="group">
        <summary className="text-sm text-white/50 cursor-pointer hover:text-white/70 transition-colors list-none flex items-center gap-2">
          <span className="group-open:hidden">{t("formToggleClosed")}</span>
          <span className="hidden group-open:inline">{t("formToggleOpen")}</span>
        </summary>

        <form onSubmit={handleSubmit} className="space-y-5 relative mt-5">
          <HoneypotField />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              id="booking-name"
              name="name"
              label={t("name.label")}
              required
              error={errors.name}
            />
            <Input
              id="booking-email"
              name="email"
              type="email"
              label={t("email.label")}
              required
              error={errors.email}
            />
          </div>

          <Input id="booking-phone" name="phone" type="tel" label={t("phone.label")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              id="booking-date"
              name="date"
              type="date"
              label={t("date.label")}
              min={minDate || undefined}
              required
              error={errors.date}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Select
              id="booking-time"
              name="time"
              label={t("time.label")}
              options={timeOptions}
              required
              disabled={!selectedDate || slotsLoading || availableSlots.length === 0}
              error={errors.time}
            />
            {selectedDate && !slotsLoading && availableSlots.length === 0 && (
              <p className="text-sm text-white/50 -mt-3">{t("time.noSlots")}</p>
            )}
          </div>

          <Select
            id="booking-service"
            name="service"
            label={t("service.label")}
            options={serviceOptions}
          />

          <Textarea
            id="booking-notes"
            name="notes"
            label={t("notes.label")}
            placeholder={t("notes.placeholder")}
          />

          <ConsentCheckbox id="booking-consent" error={errors.consent} />

          <div aria-live="polite" aria-atomic="true">
            {status === "success" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-5">
                <CheckCircle size={18} aria-hidden="true" />
                {t("success")}
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
                <AlertCircle size={18} aria-hidden="true" />
                {errorMessage}
              </div>
            )}
          </div>

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
            <Calendar size={18} />
            {t("submit")}
          </Button>
        </form>
      </details>
    </div>
  );
}
