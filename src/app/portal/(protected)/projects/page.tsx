import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalProjectsPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Projektstatus</h2>
      <PortalDataView section="projects" />
    </div>
  );
}
