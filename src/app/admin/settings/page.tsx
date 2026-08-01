"use client";

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminSettingsView } from "@/components/admin/AdminSettingsView";

export default function AdminSettingsPage() {
  return (
    <AdminAuthGate>
      {({ onLogout }) => <AdminSettingsView onLogout={onLogout} />}
    </AdminAuthGate>
  );
}
