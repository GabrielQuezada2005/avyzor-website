"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginCrmAdmin } from "@/lib/crm/client-api";

interface CrmLoginProps {
  onSuccess: () => void;
}

export function CrmLogin({ onSuccess }: CrmLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginCrmAdmin(password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Anmeldung fehlgeschlagen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-dark-800/80 p-8 shadow-premium backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 border border-gold-500/20">
            <Lock className="h-6 w-6 text-gold-400" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-gradient-gold">
            AVYZOR Admin
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Zentraler Zugang für Verwaltung & CRM
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="crm-password"
            type="password"
            label="Admin-Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="CRM_ADMIN_SECRET"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Anmelden
          </Button>
        </form>
      </div>
    </div>
  );
}
