"use client";

import { useEffect, useState } from "react";
import { CrmLogin } from "@/components/crm/CrmLogin";
import { getAdminToken } from "@/lib/admin/client-api";

interface AdminAuthGateProps {
  children: (props: { authenticated: boolean; onLogout: () => void }) => React.ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(getAdminToken()));
    setChecked(true);
  }, []);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-900 text-white/50">
        Wird geladen…
      </div>
    );
  }

  if (!authenticated) {
    return <CrmLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <>
      {children({
        authenticated,
        onLogout: () => setAuthenticated(false),
      })}
    </>
  );
}
