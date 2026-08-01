import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalDashboardPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Übersicht</h2>
      <PortalDataView section="overview" />
    </div>
  );
}
