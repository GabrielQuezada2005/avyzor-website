import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalAppointmentsPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Termine</h2>
      <PortalDataView section="appointments" />
    </div>
  );
}
