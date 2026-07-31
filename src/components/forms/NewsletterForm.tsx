"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("forms.newsletter");
  const tCommon = useTranslations("forms.common");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrors({});
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      consent: formData.get("consent") === "true",
      website: formData.get("website") as string,
    };

    try {
      const res = await fetch("/api/newsletter", {
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
    <div>
      <form onSubmit={handleSubmit} className="space-y-3 relative">
        <HoneypotField />

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            label={t("email.label")}
            placeholder={t("email.placeholder")}
            required
            className="flex-1"
            error={errors.email}
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="shrink-0 sm:self-end"
          >
            <Mail size={18} />
            {t("submit")}
          </Button>
        </div>

        <ConsentCheckbox id="newsletter-consent" error={errors.consent} />
      </form>

      <div aria-live="polite" aria-atomic="true">
        {status === "success" && (
          <div className="flex items-center gap-2 mt-3 text-green-400 text-sm">
            <CheckCircle size={16} aria-hidden="true" />
            {t("success")}
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
            <AlertCircle size={16} aria-hidden="true" />
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
