"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SERVICES } from "@/lib/constants";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceOptions = [
    { value: "", label: "Leistung wählen (optional)" },
    ...SERVICES.map((s) => ({ value: s.title, label: s.title })),
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrors({});
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      service: formData.get("service") as string,
      consent: formData.get("consent") === "true",
      website: formData.get("website") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) setErrors(result.errors);
        setErrorMessage(
          result.error ?? "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."
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
          id="name"
          name="name"
          label="Name *"
          placeholder="Ihr Name"
          required
          error={errors.name}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="E-Mail *"
          placeholder="ihre@email.de"
          required
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Telefon"
          placeholder="+49 ..."
        />
        <Input
          id="company"
          name="company"
          label="Unternehmen"
          placeholder="Ihre Firma"
        />
      </div>

      <Select
        id="service"
        name="service"
        label="Gewünschte Leistung"
        options={serviceOptions}
      />

      <Textarea
        id="message"
        name="message"
        label="Nachricht *"
        placeholder="Erzählen Sie uns von Ihrem Projekt..."
        required
        error={errors.message}
      />

      <ConsentCheckbox id="contact-consent" error={errors.consent} />

      <div aria-live="polite" aria-atomic="true">
        {status === "success" && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-5">
            <CheckCircle size={18} aria-hidden="true" />
            Vielen Dank! Wir melden uns innerhalb von 24 Stunden.
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
        <Send size={18} />
        Nachricht senden
      </Button>
    </form>
  );
}
