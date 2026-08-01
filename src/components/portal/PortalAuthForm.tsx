"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginPortal, registerPortal } from "@/lib/portal/client-api";

interface PortalAuthFormProps {
  mode: "login" | "register";
}

export function PortalAuthForm({ mode }: PortalAuthFormProps) {
  const isRegister = mode === "register";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    try {
      if (isRegister) {
        await registerPortal(payload);
      } else {
        await loginPortal({ email: payload.email, password: payload.password });
      }
      window.location.href = "/portal/dashboard";
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("{")) {
        setFieldErrors(JSON.parse(err.message) as Record<string, string>);
      } else {
        setError(err instanceof Error ? err.message : "Anfrage fehlgeschlagen.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-dark-800/80 p-8 shadow-premium backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 border border-gold-500/20">
            {isRegister ? (
              <UserPlus className="h-6 w-6 text-gold-400" />
            ) : (
              <Lock className="h-6 w-6 text-gold-400" />
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold text-gradient-gold">
            AVYZOR Kundenportal
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {isRegister
              ? "Konto erstellen für Angebote, Termine und Projektstatus"
              : "Sicher anmelden und Ihre Daten einsehen"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <Input
                id="portal-name"
                name="name"
                label="Name"
                required
                error={fieldErrors.name}
              />
              <Input
                id="portal-company"
                name="company"
                label="Firma (optional)"
                error={fieldErrors.company}
              />
            </>
          )}

          <Input
            id="portal-email"
            name="email"
            type="email"
            label="E-Mail"
            autoComplete="email"
            required
            error={fieldErrors.email}
          />

          <Input
            id="portal-password"
            name="password"
            type="password"
            label="Passwort"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            error={fieldErrors.password}
          />

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            {isRegister ? "Konto erstellen" : "Anmelden"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          {isRegister ? (
            <>
              Bereits registriert?{" "}
              <Link href="/portal/login" className="text-gold-400 hover:text-gold-300">
                Anmelden
              </Link>
            </>
          ) : (
            <>
              Noch kein Konto?{" "}
              <Link href="/portal/register" className="text-gold-400 hover:text-gold-300">
                Registrieren
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
