import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalOffersPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Angebote</h2>
      <PortalDataView section="offers" />
    </div>
  );
}
