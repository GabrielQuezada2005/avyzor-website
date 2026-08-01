"use client";

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminOverviewPage() {
  return (
    <AdminAuthGate>
      {({ onLogout }) => <AdminDashboard onLogout={onLogout} />}
    </AdminAuthGate>
  );
}
