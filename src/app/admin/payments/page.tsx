"use client";

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminPaymentsView } from "@/components/admin/AdminPaymentsView";

export default function AdminPaymentsPage() {
  return (
    <AdminAuthGate>
      {({ onLogout }) => <AdminPaymentsView onLogout={onLogout} />}
    </AdminAuthGate>
  );
}
