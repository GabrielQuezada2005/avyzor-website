import { PortalDataView } from "@/components/portal/PortalDataView";

export default function PortalInvoicesPage() {
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold text-white">Rechnungen</h2>
      <PortalDataView section="invoices" />
    </div>
  );
}
