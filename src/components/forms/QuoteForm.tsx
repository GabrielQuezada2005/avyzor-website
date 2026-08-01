"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SERVICE_IDS } from "@/lib/i18n/structures";
import {
  createQuoteFormSchema,
  zodErrorsToFieldRecord,
} from "@/lib/i18n/form-schemas.client";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

const BUDGET_KEYS = ["5000-10000", "10000-20000", "20000+"] as const;
const TIMELINE_KEYS = ["asap", "1-3-months", "3-6-months", "flexible"] as const;

export function QuoteForm() {
  const t = useTranslations("forms.quote");
  const tCommon = useTranslations("forms.common");
  const tValidation = useTranslations("forms.validation");
  const tServices = useTranslations("services.items");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = useMemo(
    () =>
      createQuoteFormSchema({
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
  ];

  const budgetOptions = [
    { value: "", label: t("budget.placeholder") },
    ...BUDGET_KEYS.map((key) => ({
      value: key,
      label: t(`budget.options.${key}`),
    })),
  ];

  const timelineOptions = [
    { value: "", label: t("timeline.placeholder") },
    ...TIMELINE_KEYS.map((key) => ({
      value: key,
      label: t(`timeline.options.${key}`),
    })),
  ];

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
      const res = await fetch("/api/quote", {
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
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrorMessage(tCommon("networkError"));
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative">
      <HoneypotField />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="quote-name"
          name="name"
          label={t("name.label")}
          required
          error={errors.name}
        />
        <Input
          id="quote-email"
          name="email"
          type="email"
          label={t("email.label")}
          required
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input id="quote-phone" name="phone" type="tel" label={t("phone.label")} />
        <Input id="quote-company" name="company" label={t("company.label")} />
      </div>

      <Select
        id="quote-service"
        name="service"
        label={t("service.label")}
        options={serviceOptions}
        required
        error={errors.service}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          id="quote-budget"
          name="budget"
          label={t("budget.label")}
          options={budgetOptions}
        />
        <Select
          id="quote-timeline"
          name="timeline"
          label={t("timeline.label")}
          options={timelineOptions}
        />
      </div>

      <Textarea
        id="quote-description"
        name="description"
        label={t("description.label")}
        placeholder={t("description.placeholder")}
      />

      <ConsentCheckbox id="quote-consent" error={errors.consent} />

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
        <FileText size={18} />
        {t("submit")}
      </Button>
    </form>
  );
}
