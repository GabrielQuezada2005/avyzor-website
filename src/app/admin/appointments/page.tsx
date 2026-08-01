"use client";

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminAppointmentsView } from "@/components/admin/AdminAppointmentsView";

export default function AdminAppointmentsPage() {
  return (
    <AdminAuthGate>
      {({ onLogout }) => <AdminAppointmentsView onLogout={onLogout} />}
    </AdminAuthGate>
  );
}
