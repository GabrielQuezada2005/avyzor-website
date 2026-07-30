"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SERVICES } from "@/lib/constants";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

export function QuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceOptions = [
    { value: "", label: "Leistung wählen *" },
    ...SERVICES.map((s) => ({ value: s.title, label: s.title })),
  ];

  const budgetOptions = [
    { value: "", label: "Budget wählen" },
    { value: "5000-10000", label: "5.000 – 10.000 €" },
    { value: "10000-20000", label: "10.000 – 20.000 €" },
    { value: "20000+", label: "20.000 €+" },
  ];

  const timelineOptions = [
    { value: "", label: "Zeitrahmen wählen" },
    { value: "asap", label: "So schnell wie möglich" },
    { value: "1-3-months", label: "1–3 Monate" },
    { value: "3-6-months", label: "3–6 Monate" },
    { value: "flexible", label: "Flexibel" },
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

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        setErrorMessage(
          result.error ?? "Fehler beim Senden. Bitte versuchen Sie es erneut."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrorMessage("Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung.");
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
          label="Name *"
          required
          error={errors.name}
        />
        <Input
          id="quote-email"
          name="email"
          type="email"
          label="E-Mail *"
          required
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input id="quote-phone" name="phone" type="tel" label="Telefon" />
        <Input id="quote-company" name="company" label="Unternehmen" />
      </div>

      <Select
        id="quote-service"
        name="service"
        label="Leistung *"
        options={serviceOptions}
        required
        error={errors.service}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          id="quote-budget"
          name="budget"
          label="Budget"
          options={budgetOptions}
        />
        <Select
          id="quote-timeline"
          name="timeline"
          label="Zeitrahmen"
          options={timelineOptions}
        />
      </div>

      <Textarea
        id="quote-description"
        name="description"
        label="Projektbeschreibung"
        placeholder="Beschreiben Sie Ihr Projekt..."
      />

      <ConsentCheckbox id="quote-consent" error={errors.consent} />

      <div aria-live="polite" aria-atomic="true">
        {status === "success" && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-5">
            <CheckCircle size={18} aria-hidden="true" />
            Angebotsanfrage erhalten! Wir erstellen Ihr individuelles Angebot.
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
        Angebot anfordern
      </Button>
    </form>
  );
}
